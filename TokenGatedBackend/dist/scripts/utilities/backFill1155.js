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
exports.BackFill1155HyperMint = void 0;
const entity_1 = require("../../entity");
const manager_1 = require("../manager");
const hypermint_1 = require("./hypermint");
const moralis_1 = require("./moralis");
const tokens1155Manager_1 = require("../manager/tokens1155Manager");
const BackFill1155HyperMint = (contractId) => __awaiter(void 0, void 0, void 0, function* () {
    const { MORALIS_API } = process.env;
    try {
        let contracts = [];
        if (contractId) {
            const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
            contracts.push(contract);
        }
        else {
            contracts = yield (0, manager_1.getAllByContractType)('ERC1155');
        }
        if (!contracts.length)
            return new Error('No contract found');
        console.log('Found contract ', contracts.length);
        for (const contract of contracts) {
            if (!isContractValid(contract))
                continue;
            let tokens1155HM = (yield (0, hypermint_1.HMgetTokens)({
                contractId: contract.partnerContractId,
            }));
            if (!tokens1155HM)
                continue;
            let tokens1155 = tokens1155HM.map((token) => __awaiter(void 0, void 0, void 0, function* () {
                let tokenMetadata = yield (0, hypermint_1.HMgetTokenHostedMetadata)(contract.partnerContractId, token.id.toString());
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
            }));
            let insertTokens1155 = yield (0, tokens1155Manager_1.addTokens1155)(tokens1155);
            if (!insertTokens1155)
                continue;
            let newAssets = (yield (0, moralis_1.getNftOwnersByContract)(contract.address));
            if (!newAssets)
                continue;
            let naKeys = Object.keys(newAssets);
            for (const key of naKeys) {
                yield (0, manager_1.add)(entity_1.Asset1155Entity, newAssets[key]);
            }
        }
        return { success: true, message: 'Success' };
    }
    catch (error) {
        console.log(error);
        return { success: false, message: error };
    }
});
exports.BackFill1155HyperMint = BackFill1155HyperMint;
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
        contract.type === 'ERC1155');
};
const getContractLogs = (contract, contractErc1155, provider) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Getting logs for contract ', contract.address + ' with chain Id ' + contract.chainId);
    console.log('Starting block number is ', contract.deployedBlock, ' current block number is ', yield provider.getBlockNumber());
    const logs = [];
    let increment = (yield provider.getBlockNumber()) - 10000 < 0
        ? 0
        : (yield provider.getBlockNumber()) - 10000;
    for (let i = parseInt(contract.deployedBlock); i < (yield provider.getBlockNumber()) - increment; i += 10000) {
        const filteredLogs = yield contractErc1155.queryFilter(contractErc1155.filters.Transfer(null, null, null), i, i + 10000);
        console.log('Got logs for block range ', i, ' to ', i + 10000, ' total logs ', filteredLogs.length);
        logs.push(...filteredLogs);
    }
    return logs;
});
const getOwnersAndCounts = (eventAbi, logs, ERC721_contract) => {
    const owners = {};
    const counts = {};
    for (const log of logs) {
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
