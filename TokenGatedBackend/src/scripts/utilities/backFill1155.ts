import { ethers, JsonRpcProvider } from 'ethers';
import { Asset1155Entity, AttributeEntity, ContractEntity } from '../../entity';
import { Repository } from 'typeorm';
import { add, getAllByContractType, getOne } from '../manager';
import { HMgetTokenHostedMetadata, HMgetTokens } from './hypermint';
import { HMContractToken } from '../../definitions';
import { getNftOwnersByContract } from './moralis';
import { addTokens1155 } from '../manager/tokens1155Manager';

export const BackFill1155HyperMint = async (contractId?: string) => {
    const { MORALIS_API } = process.env;
    try {
        let contracts: Array<ContractEntity> = [];
        if (contractId) {
            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            contracts.push(contract);
        } else {
            contracts = await getAllByContractType('ERC1155');
        }
        if (!contracts.length) return new Error('No contract found');
        console.log('Found contract ', contracts.length);

        for (const contract of contracts) {
            if (!isContractValid(contract)) continue;
            let tokens1155HM = (await HMgetTokens({
                contractId: contract.partnerContractId as string,
            })) as Array<HMContractToken>;
            if (!tokens1155HM) continue;
            let tokens1155 = tokens1155HM.map(async (token) => {
                let tokenMetadata = await HMgetTokenHostedMetadata(
                    contract.partnerContractId as string,
                    token.id.toString()
                );
                return {
                    tokenId: token.id,
                    name: tokenMetadata.name,
                    description: tokenMetadata.description,
                    image: tokenMetadata.image,
                    animation: tokenMetadata.animation_url,
                    supply: token.supply,
                    maxSupply: token.totalSupply,
                    contractId: contract.id,
                };
            });
            let insertTokens1155 = await addTokens1155(tokens1155);
            if (!insertTokens1155) continue;
            let newAssets: any = (await getNftOwnersByContract(
                contract.address
            )) as any;
            if (!newAssets) continue;
            let naKeys = Object.keys(newAssets);
            for (const key of naKeys) {
                await add(Asset1155Entity, newAssets[key]);
            }
        }
        return { success: true, message: 'Success' };
    } catch (error) {
        console.log(error);
        return { success: false, message: error };
    }
};

interface Owners {
    [key: string]: number[];
}

interface Counts {
    [key: string]: number;
}

interface Attribute {
    trait_type: string;
    value: string;
}

const checkAbiForTransfer = (contract: ContractEntity) => {
    return (
        contract.abi as unknown as Array<{
            type: string;
            name: string;
        }>
    ).some((item) => {
        return item.type === 'event' && item.name === 'Transfer';
    });
};

const isContractValid = (contract: ContractEntity) => {
    return (
        contract &&
        contract.address &&
        contract.chainId &&
        contract.id &&
        contract.abi &&
        contract.chainURL &&
        contract.chainAPIKey &&
        contract.deployedBlock &&
        contract.type === 'ERC1155'
    );
};

const getContractLogs = async (
    contract: ContractEntity,
    contractErc1155: ethers.Contract,
    provider: JsonRpcProvider
) => {
    console.log(
        'Getting logs for contract ',
        contract.address + ' with chain Id ' + contract.chainId
    );
    console.log(
        'Starting block number is ',
        contract.deployedBlock,
        ' current block number is ',
        await provider.getBlockNumber()
    );
    const logs = [];
    let increment =
        (await provider.getBlockNumber()) - 10000 < 0
            ? 0
            : (await provider.getBlockNumber()) - 10000;
    for (
        let i = parseInt(contract.deployedBlock);
        i < (await provider.getBlockNumber()) - increment;
        i += 10000
    ) {
        const filteredLogs = await contractErc1155.queryFilter(
            contractErc1155.filters.Transfer(null, null, null),
            i,
            i + 10000
        );
        console.log(
            'Got logs for block range ',
            i,
            ' to ',
            i + 10000,
            ' total logs ',
            filteredLogs.length
        );
        logs.push(...filteredLogs);
    }
    return logs;
};

const getOwnersAndCounts = (
    eventAbi: ethers.EventFragment,
    logs: ethers.Log[],
    ERC721_contract: ethers.Contract
) => {
    const owners: Owners = {};
    const counts: Counts = {};
    for (const log of logs) {
        const parsedLog = ERC721_contract.interface.decodeEventLog(
            eventAbi,
            log.data,
            log.topics
        );
        if (parsedLog.from !== parsedLog.to) {
            counts[parsedLog.tokenId] = (counts[parsedLog.tokenId] || 0) + 1;
            if (!owners[parsedLog.from]) {
                owners[parsedLog.from] = [];
            }
            const index = owners[parsedLog.from].indexOf(parsedLog.tokenId);
            if (index > -1) {
                owners[parsedLog.from].splice(index, 1);
            }
        } else {
            counts[parsedLog.tokenId] = counts[parsedLog.tokenId] || 0; //if user transfer token to himself donot increase the count
        }
        if (!owners[parsedLog.to]) {
            owners[parsedLog.to] = [];
        }
        owners[parsedLog.to].push(parsedLog.tokenId);
    }
    return { owners, counts };
};

const insertAttributes = async (
    assetId: string,
    attribute: Attribute,
    repository: Repository<AttributeEntity>
) => {
    await repository
        .createQueryBuilder('Attributes')
        .insert()
        .into(AttributeEntity)
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

    console.log(
        'Updated attribute',
        attribute.trait_type,
        'with value',
        attribute.value,
        'for asset id',
        assetId
    );
};
