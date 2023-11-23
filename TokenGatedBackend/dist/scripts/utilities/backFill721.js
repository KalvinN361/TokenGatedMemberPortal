"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackFill721 = void 0;
const ethers_1 = require("ethers");
const entity_1 = require("../../entity");
const util_1 = require("./util");
const BackFill721 = (contractAddress, database, dataSource) => __awaiter(void 0, void 0, void 0, function* () {
    /*try {
        if (!dataSource.isInitialized) await dataSource.initialize();
        let contracts =
            (await dataSource
                .createQueryBuilder(ContractEntity, 'c')
                .where(
                    'c.archived = :archived AND c.address = :address AND c.type = :type',
                    {
                        archived: false,
                        address: contractAddress,
                        type: 'ERC721',
                    }
                )
                .getMany()) || [];

        if (!contracts.length) throw new Error('No contract found');
        console.log('Found contract ', contracts.length);
        for (const contract of contracts) {
            if (!isContractValid(contract)) continue;
            if (!checkAbiForTransfer(contract)) {
                console.log(
                    'Transfer event not defined in ABI for contract',
                    contract.address
                );
                continue;
            }
            const provider = getAlchemyProvider(contract.chainId);
            const ERC721_contract = new Contract(
                contract.address,
                contract.abi,
                provider
            );
            let logs = await getContractLogs(contract);

            console.log('Finished getting logs');
            const eventAbi = ERC721_contract.interface.getEvent('Transfer');

            if (eventAbi === null) continue;
            let { owners, counts } = getOwnersAndCounts(
                eventAbi,
                logs,
                ERC721_contract
            );

            //filter out zero address from owners
            for (const ownerAddress in owners) {
                if (
                    ownerAddress ===
                    '0x0000000000000000000000000000000000000000'
                ) {
                    delete owners[ownerAddress];
                }
            }

            console.log(
                'Found owners ',
                Object.keys(owners).length,
                ' and counts ',
                Object.keys(counts).length
            );

            //const ownerEntityRepository = dataSource.getRepository(OwnerEntity);
            checkOwners(owners);

            for (const ownerAddress in owners) {
                //let newOwner;
                try {
                    console.log('Checking owner', ownerAddress);
                    let existingOwner =
                        (await dataSource
                            .createQueryBuilder(OwnerEntity, 'o')
                            .where(
                                'o.archived=:archived AND o.walletAddress=:walletAddress',
                                {
                                    archived: false,
                                    walletAddress: ownerAddress,
                                }
                            )
                            .getCount()) > 0;
                    if (existingOwner) continue;
                    let owner = await dataSource
                        .createQueryBuilder(OwnerEntity, 'o')
                        .insert()
                        .into(OwnerEntity)
                        .values({
                            walletAddress: ownerAddress,
                        })
                        .execute()
                        .then((res) => {
                            return res.identifiers[0] as OwnerEntity;
                        });*/
    /*newOwner = await ownerEntityRepository.findOne({
                        where: {
                            walletAddress: ownerAddress,
                            chainId: contract.chainId,
                        },
                    });
                    if (newOwner !== null && newOwner !== undefined) continue;
                    await dataSource
                        .createQueryBuilder(OwnerEntity, 'o')
                        .insert()
                        .into(OwnerEntity)
                        .values({
                            walletAddress: ownerAddress,
                            createdDate: new Date(),
                            updatedDate: new Date(),
                        })
                        .orUpdate(
                            ['walletAddress', 'updatedDate'],
                            ['walletAddress'],
                            {
                                skipUpdateIfNoValuesChanged: true,
                            }
                        )
                        .execute();
                    console.log(
                        "Couldn't find owner, created new owner",
                        ownerAddress
                    );

                    newOwner = await ownerEntityRepository.findOne({
                        where: {
                            walletAddress: ownerAddress,
                            //chainId: contract.chainId,
                        },
                    });*/
    /*} catch (e) {
                    console.log(e);
                }
                if (!newOwner || !newOwner.id) continue;
                const assetEntityRepository =
                    dataSource.getRepository(AssetEntity);

                for (const tokenId of owners[ownerAddress]) {
                    try {
                        let tokenUri = await ERC721_contract.tokenURI(tokenId);

                        const regex = /(\/ipfs\/|ipfs:\/\/)([^/]+)(\/.*)?/;
                        if (tokenUri.includes('ipfs')) {
                            tokenUri =
                                'https://nftstorage.link/ipfs/' +
                                tokenUri.match(regex)[2] +
                                (tokenUri.match(regex)[3] || '');
                        }

                        const metadata = await axios
                            .get(tokenUri)
                            .then((res) => {
                                return res.data;
                            });
                        if (!metadata) continue;
                        await assetEntityRepository
                            .createQueryBuilder()
                            .insert()
                            .into(AssetEntity)
                            .values({
                                contractId: contract.id,
                                tokenId: tokenId.toString(),
                                ownerId: newOwner.id,
                                name: metadata.name,
                                description: metadata.description, //?.substring(0, 509) + metadata.description?.length > 509 ? "..." : "",
                                image: metadata.image,
                                animation: metadata.animation_url,
                                attributes: metadata.attributes,
                                createdDate: new Date(),
                                updatedDate: new Date(),
                            })
                            .orUpdate(
                                ['ownerId', 'updatedDate'],
                                ['tokenId', 'contractId']
                            )
                            .execute();

                        // Find asset ID
                        const asset = await dataSource
                            .createQueryBuilder(AssetEntity, 'a')
                            .where(
                                'a.archived = :archived AND a.contractId = :contractId AND a.tokenId = :tokenId AND a.ownerId = :ownerId',
                                {
                                    archived: false,
                                    contractId: contract.id,
                                    tokenId: tokenId.toString(),
                                    ownerId: newOwner.id,
                                }
                            )
                            .getOne();

                        if (asset) {
                            console.log(
                                'Found asset',
                                asset.id,
                                'for contract',
                                contract.address,
                                'with owner',
                                ownerAddress
                            );
                        }

                        // For each attribute in metadata update/add to attribute table

                        const attributeRepository =
                            dataSource.getRepository(AttributeEntity);
                        const attributes: Attribute[] =
                            metadata.attributes || [];
                        if (!attributes.length || !asset) continue;
                        for (const attribute of attributes) {
                            await insertAttributes(
                                asset.id,
                                attribute,
                                attributeRepository
                            );
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }*/
});
exports.BackFill721 = BackFill721;
const checkAbiForTransfer = (contract) => {
    return contract.abi.some((item) => {
        return item.type === 'event' && item.name === 'Transfer';
    });
};
const isContractValid = (contract) => {
    return (contract &&
        contract.address &&
        contract.chainId &&
        contract.id &&
        contract.abi &&
        contract.chainURL &&
        contract.chainAPIKey &&
        contract.deployedBlock &&
        contract.type === 'ERC721');
};
const getContractLogs = (contract
//provider: AbstractProvider
) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = (0, util_1.getAlchemyProvider)(contract.chainId);
    const currentBlock = yield provider.getBlockNumber();
    const ERC721_contract = new ethers_1.Contract(contract.address, contract.abi, provider);
    console.log('Getting logs for contract ', contract.address + ' with chain Id ' + contract.chainId);
    console.log('Starting block number is ', contract.deployedBlock, ' current block number is ', currentBlock);
    const logs = [];
    let blocks = currentBlock - parseInt(contract.deployedBlock);
    console.log('Blocks to filter:', blocks);
    let indexBlock = parseInt(contract.deployedBlock);
    let increment = blocks > 1000 ? 1000 : blocks;
    console.log('Increment:', increment);
    while (blocks > 0) {
        console.log('Getting logs for block range ', indexBlock, ' to ', indexBlock + increment);
        const filteredLogs = yield ERC721_contract.queryFilter(ERC721_contract.filters.Transfer(null, null, null), indexBlock, indexBlock + increment);
        console.log('Got logs for block range ', indexBlock, ' to ', indexBlock + increment, ' total logs ', filteredLogs.length);
        logs.push(...filteredLogs);
        indexBlock += increment;
        blocks -= increment;
    }
    return logs;
});
const getOwnersAndCounts = (eventAbi, logs, ERC721_contract) => {
    console.log(`PV::${new Date().toISOString()}::getOwnersAndCounts`);
    const owners = {};
    const counts = {};
    for (const log of logs) {
        console.log('Parsing', log.blockNumber);
        const parsedLog = ERC721_contract.interface.decodeEventLog(eventAbi, log.data, log.topics);
        if (parsedLog.from !== parsedLog.to) {
            counts[parsedLog.tokenId] = (counts[parsedLog.tokenId] || 0) + 1;
            if (!owners[parsedLog.from]) {
                owners[parsedLog.from] = [];
            }
            const index = owners[parsedLog.from].indexOf(parsedLog.tokenId);
            if (index > -1) {
                owners[parsedLog.from].splice(index, 1);
            }
        }
        else {
            counts[parsedLog.tokenId] = counts[parsedLog.tokenId] || 0; //if user transfer token to himself donot increase the count
        }
        if (!owners[parsedLog.to]) {
            owners[parsedLog.to] = [];
        }
        owners[parsedLog.to].push(parsedLog.tokenId);
    }
    return { owners, counts };
};
const insertAttributes = (assetId, attribute, repository) => __awaiter(void 0, void 0, void 0, function* () {
    yield repository
        .createQueryBuilder('Attributes')
        .insert()
        .into(entity_1.AttributeEntity)
        .values({
        traitType: attribute.trait_type,
        value: attribute.value,
        assetId: assetId,
        createdDate: new Date(),
        updatedDate: new Date(),
    })
        .orUpdate(['value', 'updatedDate'], ['assetId', 'traitType'], {
        skipUpdateIfNoValuesChanged: true,
    })
        .execute();
    console.log('Updated attribute', attribute.trait_type, 'with value', attribute.value, 'for asset id', assetId);
});
const checkOwners = (owners) => { };
