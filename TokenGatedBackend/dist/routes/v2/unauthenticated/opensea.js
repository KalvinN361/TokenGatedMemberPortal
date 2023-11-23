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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openSeaRoute = void 0;
const express_1 = require("express");
const database_1 = require("../../../scripts/utilities/database");
const manager_1 = require("../../../scripts/manager");
const entity_1 = require("../../../entity");
const utilities_1 = require("../../../scripts/utilities");
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const abi_1 = require("../../../abi");
const fs_1 = __importDefault(require("fs"));
const openseaManager_1 = require("../../../scripts/manager/openseaManager");
const delay_1 = __importDefault(require("delay"));
exports.openSeaRoute = (0, express_1.Router)();
const OpenSeaApi = `https://api.opensea.io/v2/`;
const OpenSeaApiTest = `https://testnets-api.opensea.io/v2/`;
exports.openSeaRoute.post('/OpenSea/MintSeaDrop/Contract/:contractId/WalletAddress/:walletAddress/Amount/:amount', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, amount } = req.params;
    const tx = yield (0, openseaManager_1.mintPublicSeaDrop)(contractId, parseInt(amount));
    res.status(200).json({ tx });
}));
exports.openSeaRoute.get('/OpenSea/RefreshMetadata/Contract/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        const { address, chainId } = contract;
        const chain = (0, utilities_1.getOpenSeaChain)(chainId);
        const provider = (0, utilities_1.getAlchemyProvider)(chainId);
        const bcContract = new ethers_1.Contract(address, contract.abi, provider);
        const totalSupply = Number(yield bcContract.getFunction('totalSupply')());
        let url = chain === 'goerli' || chain === 'mumbai'
            ? OpenSeaApiTest
            : OpenSeaApi;
        for (let i = 1; i < totalSupply + 1; i++) {
            let headers = {
                accept: 'application/json',
            };
            if (chain === 'ethereum' || chain === 'matic')
                headers['X-API-KEY'] = process.env
                    .OPENSEA_API_KEY;
            console.log(`Refreshing ${address} ${i}`);
            yield axios_1.default.post(`${url}chain/${chain}/contract/${address}/nfts/${i}/refresh`, {}, { headers: headers });
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            message: `Items for contract ${address} has been queue for refresh`,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.openSeaRoute.get('/OpenSea/RefreshMetadata/Contract/:contractId/Token/:tokenId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        const { address, chainId } = contract;
        const chain = (0, utilities_1.getOpenSeaChain)(chainId);
        let url = chain === 'goerli' || chain === 'mumbai'
            ? OpenSeaApiTest
            : OpenSeaApi;
        let headers = {
            accept: 'application/json',
        };
        if (chain === 'ethereum' || chain === 'matic')
            headers['X-API-KEY'] = process.env.OPENSEA_API_KEY;
        console.log(`Refreshing ${address} ${tokenId}`);
        yield axios_1.default.post(`${url}chain/${chain}/contract/${address}/nfts/${tokenId}/refresh`, {}, { headers: headers });
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            message: `token ${tokenId} for contract ${address} has been queue for refresh`,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.openSeaRoute.post('/OpenSea/SetBaseURI/Contract/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    const { baseURI } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        const { address, chainId, abi } = contract;
        const provider = (0, utilities_1.getAlchemyProvider)(chainId);
        const key = (0, utilities_1.getWalletKey)(contract.symbol);
        const wallet = new ethers_1.Wallet(key, provider);
        const signedContract = new ethers_1.Contract(address, abi, provider).connect(wallet);
        const tx = yield signedContract.getFunction('setBaseURI')(baseURI);
        yield database_1.dataSource.destroy();
        res.status(200).json({ tx });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.openSeaRoute.post('/OpenSea/CreateJSON/Contract/:contractId/ImageFolderHash/:hash', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, hash } = req.params;
    const { jsonData } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const tempDir = `${process.cwd()}/temp`;
        if (!fs_1.default.existsSync(tempDir))
            fs_1.default.mkdirSync(tempDir);
        if (!fs_1.default.existsSync(`${tempDir}/metadata`))
            fs_1.default.mkdirSync(`${tempDir}/metadata`);
        const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        const provider = (0, utilities_1.getAlchemyProvider)(contract.chainId);
        const blockChainContract = new ethers_1.Contract(contract.address, contract.abi, provider);
        /*const totalSupply =
            Number(await blockChainContract.getFunction('totalSupply')()) *
            2;*/
        const totalSupply = 750000;
        for (let i = 1; i < totalSupply + 1; i++) {
            let random = Math.floor(Math.random() * 17 + 1);
            let tmp = (0, openseaManager_1.replaceImageHash)(jsonData, hash);
            tmp.name = `${tmp.name} #${i}`;
            /*tmp.attributes.find(
                (attribute: { trait_type: string; value: string }) =>
                    attribute.trait_type === 'Hue'
            ).value = random.toString();*/
            fs_1.default.writeFileSync(`${tempDir}/metadata/${i}`, JSON.stringify(tmp, null, 4));
        }
        yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'done',
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.openSeaRoute.get('/OpenSea/GetTokenURI/Contract/:contractAddress/Token/:tokenId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractAddress, tokenId } = req.params;
    try {
        yield database_1.dataSource.initialize();
        const provider = (0, utilities_1.getAlchemyProvider)(80001);
        const contract = new ethers_1.Contract(contractAddress, abi_1.OpenSeaAbi, provider);
        const tokenURI = yield contract.getFunction('tokenURI')(tokenId);
        yield database_1.dataSource.destroy();
        res.status(200).json({ tokenURI });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.openSeaRoute.get('/OpenSea/GetTokenURI/Contract/:contractAddress/changePublicStart/:time', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractAddress, time } = req.params;
    try {
        yield database_1.dataSource.initialize();
        const provider = (0, utilities_1.getAlchemyProvider)(80001);
        const contract = new ethers_1.Contract(contractAddress, abi_1.OpenSeaAbi, provider);
        const tx = yield contract.getFunction('multiConfigure')(200000000, // maxSupply
        '', // baseURI
        '', // contractURI
        '0x00005EA00Ac477B1030CE78506496e8C2dE24bf5' // SeaDrop Contract
        );
        yield database_1.dataSource.destroy();
        res.status(200).json({ tx });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.openSeaRoute.post('/OpenSea/SafeTransferFromBMOE/Contract/:contractAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractAddress } = req.params;
    const { toAddresses } = req.body;
    const receipts = [];
    try {
        yield database_1.dataSource.initialize();
        const dbContract = (yield (0, manager_1.getContractByAddress)(contractAddress));
        const { symbol, chainId, abi, id, address } = dbContract;
        const provider = (0, utilities_1.getAlchemyProvider)(chainId);
        const feeData = yield provider.getFeeData();
        const gasPrice = feeData.gasPrice;
        const estimate = yield provider.estimateGas({
            gasPrice: feeData.gasPrice,
        });
        const key = (0, utilities_1.getWalletKey)(symbol);
        const signer = new ethers_1.Wallet(key, provider);
        const BMOEContract = new ethers_1.Contract(address, abi, signer);
        const signedBMOEContract = BMOEContract.connect(signer);
        const BMOEOwner = (yield (0, manager_1.getOwnerByWalletAddress)(signer.address));
        for (let toAddress of toAddresses) {
            (0, delay_1.default)(5000);
            const toOwner = (yield (0, manager_1.getOwnerByWalletAddress)(toAddress));
            let status = 0;
            while (status !== 1) {
                try {
                    const asset = yield (0, openseaManager_1.getNextAvailableToken)(id, BMOEOwner.id);
                    console.log(`Reserved ${asset.tokenId} for ${toAddress}`);
                    const tokenId = parseInt(asset.tokenId);
                    const tx = yield signedBMOEContract.getFunction('safeTransferFrom')(signer.address, toAddress, tokenId);
                    yield tx.wait();
                    status = 1;
                    yield database_1.dataSource
                        .createQueryBuilder()
                        .update(entity_1.AssetEntity)
                        .set({ ownerId: toOwner.id })
                        .where('id = :id', { id: asset.id })
                        .execute();
                }
                catch (error) {
                    console.log(error);
                    status = 0;
                }
            }
        }
        yield database_1.dataSource.destroy();
        res.status(204).json({
            status: 'Success',
            code: 204,
            receipt: receipts,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
