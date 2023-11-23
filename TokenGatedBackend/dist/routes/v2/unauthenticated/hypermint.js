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
exports.call = exports.hyperMintRoute = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = require("express");
exports.hyperMintRoute = (0, express_1.Router)();
const version = `v1`;
const baseURL = `https://api.hypermint.com`;
const access_key = process.env.HM_ACCESS_KEY;
const secret_key = process.env.HM_ACCESS_KEY_SECRET;
const headers = {
    HM_ACCESS_KEY: access_key,
    HM_ACCESS_KEY_SECRET: secret_key,
};
const call = (config) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, axios_1.default)({
        method: config.httpsMethod,
        url: `${baseURL}/${config.endpoint}`,
        headers: headers,
        data: config.data ? config.data : '',
    }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return yield res.data;
    }));
});
exports.call = call;
exports.hyperMintRoute.post('/HyperMint/GetContractInfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/CreateDraftContract', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract`,
        data: body,
    }));
}));
exports.hyperMintRoute.post('HyperMint/DeployContract', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/deploy/${contractId}`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/GetTokens', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/tokens`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/GetTokenInformation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/AuthoriseBuy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId, query } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/authorise-buy?address=${query.walletAddress}&amount=${query.amount}`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/MintStatus', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, mintId } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/mint/${mintId}`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/GetOwnedTokens', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, walletAddress } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/tokens/owners/${walletAddress}`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/TransferToken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract/${contractId}/transfer`,
        data: body,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/GetTransferStatus', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, transferId } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/transfer/${transferId}`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/UpdateContractNameAndSymbol', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-name-and-symbol`,
        data: body,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/UpdateContractERC721', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}`,
        data: body,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/UpdateContractMetadataUrls', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-metadata-urls`,
        data: body,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/UpdateContractBuyOnNetwork', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-buy-on-network`,
        data: body,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/UpdateContractDates', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-dates`,
        data: body,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/AddAccessListAddresses', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessListId, body } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/access-list/${accessListId}/addresses`,
        data: body,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/GetContractHostedMetadata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `metadata/${contractId}`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/GetTokenHostedMetadata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `metadata/${contractId}/${tokenId}`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/SetTokenHostedMetadata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId, body } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/metadata`,
        data: body,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/UploadContractMetadataMedia', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract/${contractId}/metadata-image`,
        data: body,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/UploadTokenMetadataImage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId, path } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/metadata-image`,
        data: path,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/UploadTokenMetadataAnimation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId, path } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/metadata-animation`,
        data: path,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/GetTokenAllocation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}`,
    }));
}));
exports.hyperMintRoute.post('/HyperMint/VerifyTokenBurn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, txHash } = req.body;
    res.json(yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/verify-burn/${contractId}/${txHash}`,
    }));
}));
