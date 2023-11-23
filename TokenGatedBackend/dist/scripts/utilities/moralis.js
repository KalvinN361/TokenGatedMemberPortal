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
exports.getNftOwnersByContract = void 0;
const moralis_1 = __importDefault(require("moralis"));
const manager_1 = require("../manager");
const entity_1 = require("../../entity");
const asset1155Manager_1 = require("../manager/asset1155Manager");
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const getNftOwnersByContract = (contractAddress) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let contract = (yield (0, manager_1.getContractByAddress)(contractAddress));
        yield moralis_1.default.start({
            apiKey: MORALIS_API_KEY,
        });
        let cursor = '';
        let owners = {};
        do {
            const response = yield moralis_1.default.EvmApi.nft.getNFTOwners({
                chain: getChain(contract.chainId),
                format: 'decimal',
                mediaItems: false,
                address: contractAddress,
                cursor: cursor,
                limit: 100,
                disableTotal: false,
            });
            for (const NFT of response.result) {
                let tokenId = NFT.tokenId;
                let walletAddress = (_a = NFT.ownerOf) === null || _a === void 0 ? void 0 : _a.checksum;
                let currentOwner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
                if (!currentOwner)
                    currentOwner = (yield (0, manager_1.add)(entity_1.OwnerEntity, {
                        walletAddress: walletAddress,
                    }))[0];
                let token1155 = (yield (0, asset1155Manager_1.getOneByContractAndTokenId)(contract, tokenId.toString()));
                if (tokenId in owners) {
                    // @ts-ignore
                    owners[tokenId].push({
                        token1155Id: token1155.id,
                        ownerId: currentOwner.id,
                        quantity: NFT.amount,
                    });
                }
                else {
                    // @ts-ignore
                    owners[tokenId] = [
                        {
                            token1155Id: token1155.id,
                            ownerId: currentOwner.id,
                            quantity: NFT.amount,
                        },
                    ];
                }
            }
            cursor = response.pagination.cursor;
        } while (cursor !== '' && cursor !== null);
        return owners;
    }
    catch (error) {
        console.log(error);
        return { success: false, message: error };
    }
});
exports.getNftOwnersByContract = getNftOwnersByContract;
const getChain = (chainId) => {
    switch (chainId) {
        case 1:
            return '0x1';
        case 5:
            return '0x5';
        case 137:
            return '0x89';
        case 80001:
            return '0x13881';
    }
};
