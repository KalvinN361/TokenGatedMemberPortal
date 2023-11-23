import {
    add,
    archive,
    getAllByContractType,
    getAssetsByContracts,
    getOne,
    getOwnerByWalletAddress,
    remove,
    update,
    updateAssets,
    updateAttributes,
} from '../manager';
import console from 'console';
import { Contract, ethers, InterfaceAbi } from 'ethers';
import {
    AssetEntity,
    AttributeEntity,
    ContractEntity,
    OwnerEntity,
} from '../../entity';
import chalk from 'chalk';
import axios from 'axios';
import { dataSource } from './database';
import { delay, getAlchemyProvider } from './util';

export const integrityCheckerForAll = async (
    contractId?: string,
    startIndex?: number,
    endIndex?: number
) => {
    let contracts = await getAllByContractType('ERC721');
    console.log(
        `PV::${new Date().toISOString()}:: Found contracts ${contracts.length}`
    );
    console.log(startIndex);
    if (contractId) contracts = contracts.filter((c) => c.id === contractId);
    for (const contract of contracts) {
        //if (contract.id !== '45a65ea1-e349-4003-8647-2025b905980d') continue;
        console.log(
            `PV::${new Date().toISOString()}::Checking contract ${
                contract.description
            } at ${contract.address}`
        );
        if (checkContract(contract)) {
            console.log(
                chalk.red(
                    `PV::${new Date().toISOString()}::Contract ${
                        contract.description
                    } at ${contract.address} is not valid`
                )
            );
            continue;
        }
        const provider = getAlchemyProvider(contract.chainId as number);
        /*const provider = ethers.getDefaultProvider(
            contract.chainURL + contract.chainAPIKey
        );*/
        const Erc721Contract = new Contract(
            contract.address,
            contract.abi,
            provider
        );

        let minted = 0;
        if (contract.minter === 'hypermint')
            minted = parseInt(await Erc721Contract.supply());
        else if (contract.minter === 'opensea')
            minted = parseInt(await Erc721Contract.totalSupply());
        else minted = parseInt(await Erc721Contract.getMintCount());

        let starting1contracts = ['hypermint', 'opensea'];

        let startingIndex = starting1contracts.includes(contract.minter)
            ? 1
            : 0;
        if (startIndex) startingIndex = startIndex;
        let endingIndex = starting1contracts.includes(contract.minter)
            ? minted + 1
            : minted;
        if (endIndex) endingIndex = endIndex;

        let assets = (await getAssetsByContracts([
            contract.id,
        ])) as Array<AssetEntity>;

        for (let i = startingIndex; i < endingIndex; i++) {
            let token = assets.find(
                (a) => a.tokenId === i.toString()
            ) as AssetEntity;
            if (token !== undefined && token.status === 'burned') {
                console.log(
                    chalk.yellow(
                        `PV::${new Date().toISOString()}:: Asset ${i.toString()} was burned`
                    )
                );
                continue;
            }
            let dbAsset = (await processAsset(
                contract,
                assets,
                i.toString(),
                Erc721Contract
            )) as AssetEntity;
            if (!dbAsset) continue;
            let { dbOwner } = await processOwner(i.toString(), Erc721Contract);
            let { attributes: omitted, ...assetOnly } = dbAsset;
            if (dbAsset.ownerId === dbOwner.id) {
                console.log(
                    chalk.green(
                        `PV::${new Date().toISOString()}:: Asset ${i.toString()} has correct owner`
                    )
                );
                continue;
            }
            if (dbAsset.ownerId !== dbOwner.id) {
                console.log(
                    chalk.red(
                        `PV::${new Date().toISOString()}:: Asset ${i.toString()} currently has owner ${
                            dbAsset.ownerId
                        } but should be ${dbOwner.id}`
                    )
                );
                assetOnly.ownerId = dbOwner.id;
                assetOnly.updatedDate = new Date();
                await updateAssets(assetOnly);
                //updateAssetValues.push(assetOnly);
                console.log(
                    chalk.yellow(
                        `PV::${new Date().toISOString()}:: Asset ${i.toString()} has been updated with new owner ${
                            dbOwner.id
                        }`
                    )
                );
            }
        }
    }
};

const checkContract = (contract: ContractEntity) => {
    return (
        !contract ||
        !contract.chainURL ||
        !contract.chainId ||
        !contract.address
    );
};

const processAsset = async (
    contract: ContractEntity,
    assets: Array<AssetEntity>,
    tokenId: string,
    Erc721Contract: Contract
) => {
    console.log(
        `PV::${new Date().toISOString()}:: Checking DB for token ${tokenId}`
    );
    let dbAsset = assets.find((a) => a.tokenId === tokenId) as AssetEntity;
    let tokenMetadata, tokenMetadataResult;
    try {
        let tokenUri = await Erc721Contract.getFunction('tokenURI')(
            tokenId.toString()
        );
        if (tokenUri.startsWith('ipfs://'))
            tokenUri = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
        console.log(
            `PV::${new Date().toISOString()}:: Getting tokenURI ${tokenUri}`
        );
        let tries = 0;
        while (tries < 10) {
            await delay(200);
            tokenMetadataResult = await axios.get(tokenUri);
            tokenMetadata = tokenMetadataResult.data;
            tries++;
            if (tokenMetadata) break;
        }
        if (tokenMetadata.image && tokenMetadata.image.startsWith('ipfs://')) {
            tokenMetadata.image = tokenMetadata.image.replace(
                'ipfs://',
                'https://ipfs.io/ipfs/'
            );
        }
    } catch (err: any) {
        console.log(
            chalk.red(
                `PV::${new Date().toISOString()}:: Error getting tokenURI for ${tokenId.toString()}`
            )
        );
        if (err.code === 'ETIMEDOUT') {
            console.log('Timeout error, skipping...');
        }
        tokenMetadata = null;
    }
    if (!dbAsset && tokenMetadata) {
        console.log(
            chalk.red(
                `PV::${new Date().toISOString()}:: Asset ${tokenId.toString()} does not exist in DB, adding...`
            )
        );

        let newDbAsset = {
            tokenId: tokenId.toString(),
            contractId: contract.id,
            name: tokenMetadata.name,
            description: tokenMetadata.description,
            image: tokenMetadata.image,
            animation: tokenMetadata.animation_url,
        };
        console.log(
            chalk.yellow(
                `PV::${new Date().toISOString()}:: Adding asset ${tokenId.toString()}`
            )
        );
        dbAsset = ((await updateAssets(newDbAsset)) as Array<AssetEntity>)[0];
        let insertAttributes = [];
        const attributes: Array<any> = tokenMetadata.attributes as Array<any>;
        if (!attributes) return;
        for (let attr of attributes as Array<any>) {
            console.log({ attr });
            if (attr.value === null || attr.value === undefined) continue;
            insertAttributes.push({
                assetId: dbAsset.id,
                traitType: attr.trait_type,
                value: attr.value,
            });
        }
        console.log(
            chalk.green(
                `PV::${new Date().toISOString()}:: Finished adding asset ${tokenId.toString()}`
            )
        );
        console.log(
            chalk.yellow(
                `PV::${new Date().toISOString()}:: Adding attributes for asset ${tokenId.toString()}`
            )
        );
        if (insertAttributes.length) await updateAttributes(insertAttributes);
        console.log(
            chalk.green(
                `PV::${new Date().toISOString()}:: Finished adding attributes for asset ${tokenId.toString()}`
            )
        );
    } else if (dbAsset && tokenMetadata) {
        console.log(
            `PV::${new Date().toISOString()}:: Asset ${tokenId.toString()} exists in DB, checking for updates...`
        );
        let { attributes: omitted, ...assetOnly } = dbAsset;
        let isUpdate = false;
        if (
            dbAsset.name !== tokenMetadata.name &&
            tokenMetadata.name !== undefined
        ) {
            console.log(
                chalk.yellow(
                    `Name has changed for ${tokenId} from ${dbAsset.name} to ${tokenMetadata.name}`
                )
            );
            assetOnly.name = tokenMetadata.name;
            isUpdate = true;
        }
        if (
            dbAsset.description !== tokenMetadata.description &&
            tokenMetadata.description !== undefined
        ) {
            console.log(chalk.yellow(`Description has changed for ${tokenId}`));
            assetOnly.description = tokenMetadata.description;
            isUpdate = true;
        }
        if (
            dbAsset.image !== tokenMetadata.image &&
            tokenMetadata.image !== undefined
        ) {
            console.log(
                chalk.yellow(
                    `Image has changed for ${tokenId} from ${dbAsset.image} to ${tokenMetadata.image}`
                )
            );
            assetOnly.image = tokenMetadata.image;
            isUpdate = true;
        }
        if (
            dbAsset.animation !== tokenMetadata.animation_url &&
            tokenMetadata.animation_url !== undefined
        ) {
            console.log(
                chalk.yellow(
                    `Animation has changed for ${tokenId} from ${dbAsset.animation} to ${tokenMetadata.animation_url}`
                )
            );
            assetOnly.animation = tokenMetadata.animation_url;
            isUpdate = true;
        }
        if (isUpdate) {
            console.log(
                chalk.red(
                    `PV::${new Date().toISOString()}:: Asset ${tokenId.toString()} has updates, updating...`
                )
            );
            assetOnly.updatedDate = new Date();
            dbAsset = (
                (await updateAssets(assetOnly)) as Array<AssetEntity>
            )[0];
        } else {
            console.log(
                chalk.green(
                    `PV::${new Date().toISOString()}:: Asset ${tokenId.toString()} has no updates`
                )
            );
        }
        await checkAndUpdateTraits(dbAsset, tokenMetadata);
    } else if (dbAsset && !tokenMetadata) {
        console.log(
            chalk.red(
                `PV::${new Date().toISOString()}:: Asset ${tokenId.toString()} exists in DB but not on blockchain, marking as burned...`
            )
        );
        let burnedAsset = dbAsset;
        burnedAsset.status = 'burned';
        burnedAsset.updatedDate = new Date();

        await dataSource
            .createQueryBuilder()
            .insert()
            .into('AssetEntity')
            .values(burnedAsset)
            .orUpdate(['status', 'updatedDate'], ['tokenId', 'contractId'], {
                skipUpdateIfNoValuesChanged: true,
            })
            .execute();
        await dataSource.destroy();
    }

    return dbAsset;
};

const processOwner = async (tokenId: string, Erc721Contract: Contract) => {
    let blockchainOwnerAddress;
    try {
        blockchainOwnerAddress = await Erc721Contract.getFunction('ownerOf')(
            tokenId
        );
    } catch (err) {
        console.log(
            chalk.red(
                `PV::${new Date().toISOString()}:: Error getting ownerOf for ${tokenId.toString()}`
            )
        );
        blockchainOwnerAddress = '0x000000000000000000000000000000000000dEaD';
    }
    let dbOwner = (await getOwnerByWalletAddress(
        blockchainOwnerAddress
    )) as OwnerEntity;
    if (!dbOwner) {
        dbOwner = (
            await add(OwnerEntity, {
                walletAddress: blockchainOwnerAddress,
            })
        )[0] as OwnerEntity;
    }
    return { dbOwner };
};

const checkAndUpdateOwner = async (
    erc721contract: Contract,
    asset: AssetEntity
) => {
    let blockchainOwner = await erc721contract.ownerOf(asset.tokenId);
    let owner = (await getOne(OwnerEntity, asset.ownerId)) as OwnerEntity;
    if (!owner)
        owner = (
            await add(OwnerEntity, {
                walletAddress: blockchainOwner,
            })
        )[0] as OwnerEntity;
    let ownerId = owner ? owner.id : null;
    if (blockchainOwner.toLowerCase() !== asset.ownerId.toLowerCase()) {
        console.log(
            chalk.red(
                `Owner of asset in db for tokenId ${asset.tokenId} is ${owner.walletAddress} but on chain is ${blockchainOwner}`
            )
        );
        let { attributes: omitted, ...assetOnly } = asset;
        let updatedAsset = { ...assetOnly, ownerId: ownerId };
        await update(AssetEntity, updatedAsset);
        return {
            id: asset.id,
            incorrectOwner: asset.ownerId,
            correctOwner: blockchainOwner,
            corrected: true,
        };
    }
    console.log(
        chalk.green(`Finished checking asset tokenId ${asset.tokenId}`)
    );
    return null;
};

const checkAndUpdateTraits = async (asset: AssetEntity, metadata: any) => {
    let dbas = asset.attributes as Array<AttributeEntity>;
    let blockchainAttributes = metadata.attributes as Array<any>;
    //let insertAttributes = [];
    let updateAttributesValues = [];
    if (!blockchainAttributes) return;

    for (let bca of blockchainAttributes) {
        let dba: AttributeEntity | null = null;
        if (dbas !== undefined) {
            dba = dbas.find((dba: AttributeEntity) => {
                return dba.traitType === bca.trait_type;
            }) as AttributeEntity;
        }
        if (!dba && bca.value !== null && bca.value !== undefined) {
            console.log(
                chalk.red(
                    `PV::${new Date().toISOString()}:: Attribute ${
                        bca.trait_type
                    } does not exist for asset ${asset.tokenId}, adding...`
                )
            );
            updateAttributesValues.push({
                assetId: asset.id,
                traitType: bca.trait_type,
                value: bca.value,
            });
        } else if (dba!.value !== bca.value) {
            console.log(
                chalk.red(
                    `PV::${new Date().toISOString()}:: Attribute ${
                        bca.trait_type
                    } has changed for asset ${
                        asset.tokenId
                    } on blockchain, updating...`
                )
            );
            dba!.value = bca.value;
            updateAttributesValues.push(dba);
        } else if (dba!.value === null && bca.value !== null) {
            console.log(
                chalk.red(
                    `PV::${new Date().toISOString()}:: Attribute ${
                        bca.trait_type
                    } is null for asset ${
                        asset.tokenId
                    } on blockchain, removing...`
                )
            );
            await remove(AttributeEntity, dba!.id);
        }
    }
    /*if (insertAttributes.length > 0) {
        await updateAttributes(insertAttributes);
    }*/
    if (updateAttributesValues.length > 0) {
        await updateAttributes(updateAttributesValues);
    }

    /*    while (bcas.length > 0) {
        let tempbca = bcas.shift();
        let tempdba = dbas.filter((dba: AttributeEntity, i: number) => {
            if (dba.traitType === tempbca.trait_type) {
                return dbas.splice(i, 1);
            }
            return false;
        });
        if (!tempdba) {
            await add(AttributeEntity, {
                assetId: asset.id,
                traitType: tempbca.trait_type,
                value: tempbca.value,
            });
        } else if (tempdba[0].value !== tempbca.value) {
            let tempAttr = tempdba[0];
            tempAttr.value = tempbca.value;
            await update(AttributeEntity, {
                ...tempAttr,
            });
        }
    }
    if (dbas.length > 0) {
        for (let attr of dbas) {
            await remove(AttributeEntity, attr.id);
        }
    }*/
};

export const isTransferEventDefinedInABI = async (abi: InterfaceAbi) => {
    return (abi as unknown as Array<{ type: string; name: string }>).some(
        (item: any) => {
            return item.type === 'event' && item.name === 'Transfer';
        }
    );
};
