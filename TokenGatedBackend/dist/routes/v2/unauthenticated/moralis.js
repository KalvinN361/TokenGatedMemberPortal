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
exports.moralisRoute = void 0;
const moralis_1 = __importDefault(require("moralis"));
const common_evm_utils_1 = require("@moralisweb3/common-evm-utils");
const express_1 = require("express");
const manager_1 = require("../../../scripts/manager");
const entity_1 = require("../../../entity");
const database_1 = require("../../../scripts/utilities/database");
exports.moralisRoute = (0, express_1.Router)();
const api_key = process.env.MORALIS_API_KEY;
const startMoralis = () => __awaiter(void 0, void 0, void 0, function* () {
    yield moralis_1.default.start({
        apiKey: api_key,
    });
});
const getChain = (chainId) => {
    switch (chainId) {
        case 1:
            return common_evm_utils_1.EvmChain.ETHEREUM;
        case 5:
            return common_evm_utils_1.EvmChain.GOERLI;
        case 137:
            return common_evm_utils_1.EvmChain.POLYGON;
        case 80001:
            return common_evm_utils_1.EvmChain.MUMBAI;
    }
};
exports.moralisRoute.post('/Moralis/GetNftByWallet', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, chainId } = req.body;
    const chain = getChain(chainId);
    yield startMoralis();
    yield moralis_1.default.EvmApi.nft
        .getWalletNFTs({ address, chain })
        .then((response) => {
        res.status(200).json(response === null || response === void 0 ? void 0 : response.result);
    })
        .catch((error) => {
        next(error.message);
    });
}));
exports.moralisRoute.post('/Moralis/GetNftByContract', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, chainId } = req.body;
    const chain = getChain(chainId);
    yield startMoralis();
    yield moralis_1.default.EvmApi.nft
        .getContractNFTs({ address, chain })
        .then((response) => {
        res.status(200).json(response === null || response === void 0 ? void 0 : response.result);
    })
        .catch((error) => {
        next(error.message);
    });
}));
exports.moralisRoute.post('/Moralis/GetNftTransfersByWallet', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, chainId } = req.body;
    const chain = getChain(chainId);
    yield startMoralis();
    yield moralis_1.default.EvmApi.nft
        .getWalletNFTTransfers({ address, chain })
        .then((response) => {
        res.status(200).json(response === null || response === void 0 ? void 0 : response.result);
    })
        .catch((error) => {
        next(error.message);
    });
}));
exports.moralisRoute.post('/Moralis/GetNftTransfersByContract', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, chainId } = req.body;
    const chain = getChain(chainId);
    yield startMoralis();
    yield moralis_1.default.EvmApi.nft
        .getNFTContractTransfers({ address, chain })
        .then((response) => {
        res.status(200).json(response === null || response === void 0 ? void 0 : response.result);
    })
        .catch((error) => {
        next(error.message);
    });
}));
exports.moralisRoute.post('/Moralis/GetNftTransfersByTokenId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, chainId, tokenId } = req.body;
    const chain = getChain(chainId);
    yield startMoralis();
    yield moralis_1.default.EvmApi.nft
        .getNFTTransfers({ address, chain, tokenId })
        .then((response) => {
        res.status(200).json(response === null || response === void 0 ? void 0 : response.result);
    })
        .catch((error) => {
        next(error.message);
    });
}));
exports.moralisRoute.post('/Moralis/GetNftCollectionsByWallet', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, chainId } = req.body;
    const chain = getChain(chainId);
    yield startMoralis();
    yield moralis_1.default.EvmApi.nft
        .getWalletNFTCollections({ address, chain })
        .then((response) => {
        res.status(200).json(response === null || response === void 0 ? void 0 : response.result);
    })
        .catch((error) => {
        next(error.message);
    });
}));
exports.moralisRoute.post('/Moralis/GetNftCollectionsMetadata', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, chainId } = req.body;
    const chain = getChain(chainId);
    yield startMoralis();
    yield moralis_1.default.EvmApi.nft
        .getNFTContractMetadata({ address, chain })
        .then((response) => {
        res.status(200).json(response === null || response === void 0 ? void 0 : response.result);
    })
        .catch((error) => {
        next(error.message);
    });
}));
exports.moralisRoute.get('/Moralis/GetNftOwners/ContractId/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
    const { address, chainId } = contract;
    const chain = getChain(chainId);
    yield startMoralis();
    yield moralis_1.default.EvmApi.nft
        .getNFTOwners({ address, chain })
        .then((response) => {
        res.status(200).json({
            status: 'success',
            code: 200,
            data: response === null || response === void 0 ? void 0 : response.result.length,
        });
    })
        .catch((error) => {
        next(error.message);
    });
}));
exports.moralisRoute.post('/Moralis/GetNftOwnersByTokenId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, chainId, tokenId } = req.body;
    const chain = getChain(chainId);
    yield startMoralis();
    yield moralis_1.default.EvmApi.nft
        .getNFTTokenIdOwners({ address, chain, tokenId })
        .then((response) => {
        res.status(200).json(response === null || response === void 0 ? void 0 : response.result);
    })
        .catch((error) => {
        next(error.message);
    });
}));
exports.moralisRoute.post('/Moralis/GetNftMetadata', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, chainId, tokenId } = req.body;
    const chain = getChain(chainId);
    yield startMoralis();
    yield moralis_1.default.EvmApi.nft
        .getNFTMetadata({ address, chain, tokenId })
        .then((response) => {
        res.status(200).json(response === null || response === void 0 ? void 0 : response.result);
    })
        .catch((error) => {
        next(error.message);
    });
}));
