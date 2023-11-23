import { NextFunction, Request, Response, Router } from 'express';
import {
    BackFill1155HyperMint,
    BackFill721,
    getAlchemyProvider,
} from '../../../scripts/utilities';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import {
    AssetEntity,
    AttributeEntity,
    ContractEntity,
    OwnerEntity,
} from '../../../entity';
import {
    getAll,
    getAssetOne,
    getAssetsByWalletAddress,
    getAssetsCountByOwner,
    getOne,
    getOwnerByWalletAddress,
} from '../../../scripts/manager';
import { Contract, ethers, getAddress, isAddress } from 'ethers';
import chalk from 'chalk';

export const databaseRoute = Router();

databaseRoute.post(
    '/Database/BackFillByContract721',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { address, database } = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            await BackFill721(address, database, dataSource).then();
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json({
                status: 'success',
                code: 204,
                message: `Owners, Assets, and Attributes are done for contract ${address}`,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

databaseRoute.post(
    '/Database/BackFill1155HyperMint',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId }: { contractId?: string } = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let message;
            if (contractId) {
                console.log('contractId', contractId);
                message = await BackFill1155HyperMint(contractId).then(
                    (res) => {
                        return res;
                    }
                );
            } else {
                console.log('no contractId');
                message = await BackFill1155HyperMint().then((res) => {
                    {
                        return res;
                    }
                });
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json({
                status: 'success',
                code: 204,
                message: message,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

databaseRoute.get(
    '/Database/BackFillAttributes/Contract/:contractId/StartIndex/:startIndex',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId, startIndex } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let assets = await dataSource
                .createQueryBuilder(AssetEntity, 'a')
                .where(
                    'a.archived = (:archived) AND a.contractId = (:contractId) AND a.tokenId :: integer > :tokenId',
                    {
                        archived: false,
                        contractId: contractId,
                        tokenId: startIndex,
                    }
                )
                .orderBy('a.tokenId :: integer', 'ASC')
                .getMany()
                .then(async (res) => {
                    return res;
                });

            for (let asset of assets) {
                console.log(
                    `PV::${new Date().toISOString()}::Inserting attributes for ${
                        asset.tokenId
                    } - ${asset.id}`
                );
                let insertValues = [
                    { traitType: 'Color', value: 'Blue', assetId: asset.id },
                    { traitType: 'OBs', value: 'No', assetId: asset.id },
                    {
                        traitType: 'Destinations',
                        value: 'No',
                        assetId: asset.id,
                    },
                ];
                await dataSource
                    .createQueryBuilder(AttributeEntity, 'a')
                    .insert()
                    .into(AttributeEntity)
                    .values(insertValues)
                    .orUpdate(['value'], ['traitType', 'assetId'], {
                        skipUpdateIfNoValuesChanged: true,
                    })
                    .execute()
                    .then(async (res) => {
                        return res;
                    });
            }
            if (dataSource.isInitialized) await dataSource.destroy();

            res.status(204).json({
                status: 'success',
                code: 204,
                message: `Attributes are done for contract ${contractId}`,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

databaseRoute.get(
    '/Database/FillMissingAssets/Contract/:contractId/StartIndex/:startIndex',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId, startIndex } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            console.log(
                `PV::${new Date().toISOString()}::Got data for contract ${contractId}`
            );
            const { chainId, address, abi } = contract;
            let provider = getAlchemyProvider(chainId);
            let blockchainContract = new Contract(address, abi, provider);
            let totalSupply = await blockchainContract.totalSupply();
            let initialAsset = (await getOne(
                AssetEntity,
                '19d2d026-39cc-458a-8247-c0dfeaf0a6f0'
            )) as AssetEntity;
            const { description, image } = initialAsset;

            for (let i = parseInt(startIndex); i <= totalSupply; i++) {
                console.log(chalk.blue(`Checking token ${i}`));
                await dataSource
                    .createQueryBuilder(AssetEntity, 'a')
                    .insert()
                    .into(AssetEntity)
                    .values({
                        contractId: contract.id,
                        tokenId: i.toString(),
                        name: `Open Edition Membership #${i.toString()}`,
                        description: description,
                        image: image,
                        updatedDate: new Date(),
                    })
                    .orUpdate(['updatedDate'], ['contractId', 'tokenId'], {
                        skipUpdateIfNoValuesChanged: true,
                    })
                    .execute()
                    .then(async (res) => {
                        if (res.identifiers.length > 0) {
                            console.log(
                                `PV::${new Date().toISOString()}::Inserted asset ${
                                    res.identifiers[0].id
                                } for Token ${i}`
                            );
                        }
                        return res;
                    });
            }
            await dataSource.destroy();
            res.status(204).json({
                status: 'success',
                code: 204,
                message: `Assets are done for contract ${contractId}`,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

databaseRoute.get(
    '/Database/AddressChecksum',
    setDataSource,
    async (_: Request, res: Response, next: NextFunction) => {
        if (!dataSource.isInitialized) await dataSource.initialize();
        let owners = await getAll(OwnerEntity);
        for (let owner of owners) {
            let workingAddress = owner.walletAddress;

            try {
                console.log(chalk.blue(`Checking address ${workingAddress}`));
                if (isAddress(workingAddress)) {
                    console.log(
                        chalk.green(`Address ${workingAddress} is valid`)
                    );
                    continue;
                }
                console.log(chalk.red(`Address ${workingAddress} is invalid`));
                let checksumAddress = getAddress(workingAddress);
                console.log(
                    chalk.green(`Checksum address is ${checksumAddress}`)
                );
                await dataSource
                    .createQueryBuilder(OwnerEntity, 'o')
                    .update(OwnerEntity)
                    .set({
                        walletAddress: checksumAddress,
                        updatedDate: new Date(),
                    })
                    .where('o.id = (:id)', {
                        id: owner.id,
                    })
                    .execute();
            } catch (error: any) {
                console.log(chalk.red(`Error: ${error.message}`));
            }
        }
        await dataSource.destroy();
        res.status(204).json({
            status: 'success',
            code: 204,
            message: `Address checksums are done`,
        });
    }
);

databaseRoute.get(
    '/Database/DuplicateChecksum',
    setDataSource,
    async (_: Request, res: Response, next: NextFunction) => {
        if (!dataSource.isInitialized) await dataSource.initialize();
        let owners = await dataSource
            .createQueryBuilder(OwnerEntity, 'o')
            .orderBy('o.walletAddress', 'ASC')
            .getMany();

        for (let owner of owners) {
            if (owner.walletAddress === getAddress(owner.walletAddress))
                console.log(
                    chalk.green(`Address ${owner.walletAddress} is valid`)
                );
            else {
                let assetCount = await getAssetsCountByOwner(owner.id);
                if (!assetCount) {
                    await dataSource
                        .createQueryBuilder()
                        .delete()
                        .from(OwnerEntity)
                        .where('id = (:id)', {
                            id: owner.id,
                        })
                        .execute();
                    console.log(
                        `Deleted ${owner.walletAddress} with ${assetCount} assets`
                    );
                } else {
                    let assets = (await getAssetsByWalletAddress(
                        owner.walletAddress
                    )) as Array<AssetEntity>;
                    let correctOwner = (await getOwnerByWalletAddress(
                        getAddress(owner.walletAddress)
                    )) as OwnerEntity;
                    if (correctOwner) {
                        for (let asset of assets) {
                            await dataSource
                                .createQueryBuilder()
                                .update(AssetEntity)
                                .set({
                                    ownerId: correctOwner.id,
                                    updatedDate: new Date(),
                                })
                                .where('id = (:id)', {
                                    id: asset.id,
                                })
                                .execute();
                        }
                        console.log(
                            chalk.yellow(
                                `Updated assets for ${owner.walletAddress} to ${correctOwner.walletAddress} with ${assetCount} assets`
                            )
                        );
                    } else {
                        await dataSource
                            .createQueryBuilder()
                            .update(OwnerEntity)
                            .set({
                                walletAddress: getAddress(owner.walletAddress),
                            })
                            .where('id = (:id)', {
                                id: owner.id,
                            })
                            .execute();
                        console.log(
                            chalk.blue(
                                `Updated ${owner.walletAddress} to ${getAddress(
                                    owner.walletAddress
                                )} with ${assetCount} assets`
                            )
                        );
                    }
                    console.log(
                        chalk.red(
                            `Address ${
                                owner.walletAddress
                            } is incorrect with ${assetCount} assets. ${getAddress(
                                owner.walletAddress
                            )} is the correct checksum`
                        )
                    );
                }
            }
        }
        res.status(204).json({
            status: 'success',
            code: 204,
            message: `Address checksums are done`,
        });
    }
);
