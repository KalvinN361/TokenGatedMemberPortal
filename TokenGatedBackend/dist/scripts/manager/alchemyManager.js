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
exports.getNFTsForOwner = exports.getNFTs = exports.getOwners = exports.getAlchemy = exports.getNetwork = void 0;
const alchemy_sdk_1 = require("alchemy-sdk");
const getNetwork = (chainId) => {
    switch (chainId) {
        case 1:
            return alchemy_sdk_1.Network.ETH_MAINNET;
        case 5:
            return alchemy_sdk_1.Network.ETH_GOERLI;
        case 137:
            return alchemy_sdk_1.Network.MATIC_MAINNET;
        case 80001:
            return alchemy_sdk_1.Network.MATIC_MUMBAI;
    }
};
exports.getNetwork = getNetwork;
const getAlchemy = (chainAPIKey, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = {
        apiKey: chainAPIKey,
        network: (0, exports.getNetwork)(chainId),
    };
    return new alchemy_sdk_1.Alchemy(settings);
});
exports.getAlchemy = getAlchemy;
const getOwners = (chainAPIKey, chainId, address) => __awaiter(void 0, void 0, void 0, function* () {
    const alchemy = yield (0, exports.getAlchemy)(chainAPIKey, chainId);
    return yield alchemy.nft.getOwnersForContract(address).then((response) => {
        console.log(`PV::${new Date().toISOString()}::Found ${response.owners.length} owners for ${address}`);
        return response.owners;
    });
});
exports.getOwners = getOwners;
const getNFTs = (chainAPIKey, chainId, address, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const alchemy = yield (0, exports.getAlchemy)(chainAPIKey, chainId);
    return yield alchemy.nft
        .getNftsForContract(address, { pageSize: limit })
        .then((response) => {
        console.log(`PV::${new Date().toISOString()}::Found ${response.nfts.length} NFTs for ${address}`);
        return response.nfts;
    });
});
exports.getNFTs = getNFTs;
const getNFTsForOwner = (chainAPIKey, chainId, contractAddresses, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const alchemy = yield (0, exports.getAlchemy)(chainAPIKey, chainId);
    let nftList = [];
    let pageKey = '';
    do {
        yield alchemy.nft
            .getNftsForOwner(walletAddress, {
            contractAddresses: contractAddresses,
            omitMetadata: true,
            pageKey: pageKey,
        })
            .then((response) => {
            nftList = nftList.concat(response.ownedNfts);
            if (response.pageKey !== undefined)
                pageKey = response.pageKey;
            else
                pageKey = undefined;
            console.log(`PV::${new Date().toISOString()}::Found ${response.ownedNfts.length} NFTs for ${walletAddress}`);
            return response.ownedNfts;
        });
    } while (pageKey !== undefined);
    return nftList;
});
exports.getNFTsForOwner = getNFTsForOwner;
