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
exports.HMverifyTokenBurn = exports.HMgetTokenAllocation = exports.HMuploadTokenMetadataAnimation = exports.HMuploadTokenMetadataImage = exports.HMuploadContractMetadataMedia = exports.HMsetTokenHostedMetadata = exports.HMgetTokenHostedMetadata = exports.HMgetContractHostedMetadata = exports.HMaddAccessListAddresses = exports.HMupdateContractDates = exports.HMupdateContractBuyOnNetwork = exports.HMupdateContractMetadataUrls = exports.HMupdateContractERC721 = exports.HMupdateContractNameAndSymbol = exports.HMgetTransferStatus = exports.HMtransferToken = exports.HMgetOwnedTokens = exports.HMmintStatus = exports.HMmint = exports.HMauthoriseBuy = exports.HMgetTokenInformation = exports.HMgetTokens = exports.HMdeployContract = exports.HMgetContractInfo = exports.call = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
require('dotenv').config();
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
        headers: Object.assign(Object.assign({}, headers), config.headers),
        data: config.data ? config.data : '',
    }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return yield res.data;
    }));
});
exports.call = call;
const HMgetContractInfo = (contractId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}`,
    });
});
exports.HMgetContractInfo = HMgetContractInfo;
const HMdeployContract = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = props;
    return yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/deploy/${contractId}`,
    });
});
exports.HMdeployContract = HMdeployContract;
const HMgetTokens = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = props;
    return yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/tokens`,
    });
});
exports.HMgetTokens = HMgetTokens;
const HMgetTokenInformation = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId } = props;
    return yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}`,
    });
});
exports.HMgetTokenInformation = HMgetTokenInformation;
const HMauthoriseBuy = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId, query } = props;
    return yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/authorise-buy?address=${query.walletAddress}&amount=${query.amount}`,
    });
});
exports.HMauthoriseBuy = HMauthoriseBuy;
const HMmint = (contractId, walletAddress, id, amount) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract/${contractId}/mint`,
        data: {
            address: walletAddress,
            tokens: [
                {
                    id: id,
                    amount: amount,
                },
            ],
        },
    }));
});
exports.HMmint = HMmint;
const HMmintStatus = (contractId, mintId) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/mint/${mintId}`,
    }));
});
exports.HMmintStatus = HMmintStatus;
const HMgetOwnedTokens = (contractId, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/tokens/owners/${walletAddress}`,
    }));
});
exports.HMgetOwnedTokens = HMgetOwnedTokens;
const HMtransferToken = (contractId, address, tokenId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    let data = new form_data_1.default();
    data.append('address', address);
    data.append('tokenId', tokenId);
    data.append('amount', (amount === null || amount === void 0 ? void 0 : amount.toString()) || '0');
    return (yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract/${contractId}/transfer`,
        data: data,
    }));
});
exports.HMtransferToken = HMtransferToken;
const HMgetTransferStatus = (contractId, transferId) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/transfer/${transferId}`,
    }));
});
exports.HMgetTransferStatus = HMgetTransferStatus;
const HMupdateContractNameAndSymbol = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = props;
    return yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-name-and-symbol`,
        data: body,
    });
});
exports.HMupdateContractNameAndSymbol = HMupdateContractNameAndSymbol;
const HMupdateContractERC721 = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = props;
    return yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}`,
        data: body,
    });
});
exports.HMupdateContractERC721 = HMupdateContractERC721;
const HMupdateContractMetadataUrls = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = props;
    return yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-metadata-urls`,
        data: body,
    });
});
exports.HMupdateContractMetadataUrls = HMupdateContractMetadataUrls;
const HMupdateContractBuyOnNetwork = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = props;
    return yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-buy-on-network`,
        data: body,
    });
});
exports.HMupdateContractBuyOnNetwork = HMupdateContractBuyOnNetwork;
const HMupdateContractDates = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = props;
    return yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-dates`,
        data: body,
    });
});
exports.HMupdateContractDates = HMupdateContractDates;
const HMaddAccessListAddresses = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessListId, body } = props;
    return yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/access-list/${accessListId}/addresses`,
        data: body,
    });
});
exports.HMaddAccessListAddresses = HMaddAccessListAddresses;
const HMgetContractHostedMetadata = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = props;
    return yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `metadata/${contractId}`,
    });
});
exports.HMgetContractHostedMetadata = HMgetContractHostedMetadata;
const HMgetTokenHostedMetadata = (contractId, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `metadata/${contractId}/${tokenId}`,
    }));
});
exports.HMgetTokenHostedMetadata = HMgetTokenHostedMetadata;
const HMsetTokenHostedMetadata = (contractId, tokenId, body) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.call)({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/metadata`,
        data: body,
    });
});
exports.HMsetTokenHostedMetadata = HMsetTokenHostedMetadata;
const HMuploadContractMetadataMedia = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, body } = props;
    return yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract/${contractId}/metadata-image`,
        data: body,
    });
});
exports.HMuploadContractMetadataMedia = HMuploadContractMetadataMedia;
const HMuploadTokenMetadataImage = (contractId, tokenId, path) => __awaiter(void 0, void 0, void 0, function* () {
    let bodyFormData = new form_data_1.default();
    bodyFormData.append('media', fs_1.default.createReadStream(path));
    return yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/contract/${contractId}/token/${tokenId}/metadata-image`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
});
exports.HMuploadTokenMetadataImage = HMuploadTokenMetadataImage;
const HMuploadTokenMetadataAnimation = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, tokenId, path } = props;
    let bodyFormData = new form_data_1.default();
    bodyFormData.append('media', fs_1.default.createReadStream(path));
    return yield (0, exports.call)({
        httpsMethod: 'put',
        endpoint: `${version}/contract/${contractId}/token/${tokenId}/metadata-animation`,
        data: bodyFormData,
    });
});
exports.HMuploadTokenMetadataAnimation = HMuploadTokenMetadataAnimation;
const HMgetTokenAllocation = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = props;
    return yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}`,
    });
});
exports.HMgetTokenAllocation = HMgetTokenAllocation;
const HMverifyTokenBurn = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, txHash } = props;
    return yield (0, exports.call)({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/verify-burn/${contractId}/${txHash}`,
    });
});
exports.HMverifyTokenBurn = HMverifyTokenBurn;
