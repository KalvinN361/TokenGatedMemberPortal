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
exports.blockchainRoute = void 0;
const express_1 = require("express");
const utilities_1 = require("../../../scripts/utilities");
const ethers_1 = require("ethers");
const abi_1 = require("../../../abi");
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../../../scripts/utilities/database");
const manager_1 = require("../../../scripts/manager");
const entity_1 = require("../../../entity");
const blockchainManager_1 = require("../../../scripts/manager/blockchainManager");
const axios_1 = __importDefault(require("axios"));
exports.blockchainRoute = (0, express_1.Router)();
exports.blockchainRoute.get('/Blockchain/IntegrityCheckerForAll/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    const { startIndex, endIndex } = req.query;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        yield (0, utilities_1.integrityCheckerForAll)(contractId, parseInt(startIndex), parseInt(endIndex));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Integrity check completed',
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.blockchainRoute.post('/Blockchain/TransferERC20', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { toAddress, amount, chainId } = req.body;
    try {
        const provider = (0, utilities_1.getAlchemyProvider)(chainId);
        const { PV_WALLET_PRIVATE_KEY } = process.env;
        const wallet = new ethers_1.Wallet(PV_WALLET_PRIVATE_KEY, provider);
        const tx = {
            to: toAddress,
            value: (0, ethers_1.parseEther)(amount),
        };
        const txHash = yield wallet.sendTransaction(tx);
        yield txHash.wait();
        res.json({ txHash });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.blockchainRoute.post('/Blockchain/SafeTransferFrom721PV', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { toAddress, contractAddress, tokenId, chainId, } = req.body;
    try {
        const provider = (0, utilities_1.getAlchemyProvider)(chainId);
        const { PV_WALLET_PRIVATE_KEY } = process.env;
        const signer = new ethers_1.Wallet(PV_WALLET_PRIVATE_KEY, provider);
        const contract = new ethers_1.Contract(contractAddress, abi_1.abi721, provider);
        const signedContract = contract.connect(signer);
        const tx = yield signedContract.getFunction('safeTransferFrom')(signer.address, toAddress, tokenId);
        res.status(204).json({ tx });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.blockchainRoute.post('/Blockchain/SafeTransferFrom1155', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { toAddress, contractAddress, tokenId, chainId, amount, } = req.body;
    try {
        const provider = (0, utilities_1.getAlchemyProvider)(chainId);
        const { PV_WALLET_PRIVATE_KEY } = process.env;
        const signer = new ethers_1.Wallet(PV_WALLET_PRIVATE_KEY, provider);
        const contract = new ethers_1.Contract(contractAddress, abi_1.abi1155, provider);
        const signedContract = contract.connect(signer);
        const tx = yield signedContract.getFunction('safeTransferFrom')(signer.address, toAddress, tokenId, amount);
        res.status(204).json({ tx });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.blockchainRoute.post('/MoonPay/SignUrl', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    const signature = crypto_1.default
        .createHmac('sha256', process.env.MOONPAY_SECRET_KEY)
        .update(new URL(url).search)
        .digest('base64');
    const urlWithSignature = `${url}&signature=${encodeURIComponent(signature)}`;
    res.status(200).json({ urlWithSignature });
}));
exports.blockchainRoute.post('/Blockchain/Mint3DGlasses/WalletAddress/:walletAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress } = req.params;
    try {
        yield database_1.dataSource.initialize();
        const bm3dContract = (yield (0, manager_1.getContractByAddress)('0xbda2753265642b73f4b57f2d100304576b0d6a85'));
        let txStatus = yield (0, blockchainManager_1.checkOwnedAndTransfer)(bm3dContract, walletAddress);
        if (txStatus.code === 404) {
            let mTxStatus = yield (0, blockchainManager_1.mintToken)(bm3dContract, walletAddress);
            res.json(mTxStatus);
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(txStatus);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.blockchainRoute.post('/Blockchain/Mint3DGlassesTest/WalletAddress/:walletAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress } = req.params;
    let txStatus;
    try {
        yield database_1.dataSource.initialize();
        const bm3dContract = (yield (0, manager_1.getContractByAddress)('0xcbe2f2d08adbcdb0058a3e47fa2b86ec48d95367'));
        txStatus = yield (0, blockchainManager_1.checkOwnedAndTransfer)(bm3dContract, walletAddress);
        if (txStatus.code === 404) {
            let mTxStatus = yield (0, blockchainManager_1.mintToken)(bm3dContract, walletAddress);
            if (database_1.dataSource.isInitialized)
                yield database_1.dataSource.destroy();
            res.json(mTxStatus);
        }
        else {
            if (database_1.dataSource.isInitialized)
                yield database_1.dataSource.destroy();
            res.status(200).json(txStatus);
        }
    }
    catch (error) {
        next(error.message);
    }
}));
exports.blockchainRoute.get('/Blockchain/Indexer/Contract/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    try {
        yield database_1.dataSource.initialize();
        const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        const { description, address, abi } = contract;
        const hasTransferEvent = (0, utilities_1.isTransferEventDefinedInABI)(abi);
        if (!hasTransferEvent) {
            console.log(`Transfer event not defined in ABI for ${address}`);
        }
        const provider = (0, utilities_1.getAlchemyProvider)(contract.chainId);
        const dbContract = new ethers_1.Contract(address, abi, provider);
        yield dbContract.on('Transfer', (from, to, id, event) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`${from} => ${to}: ${id}`);
            try {
                let oldOwner = (yield (0, manager_1.getOne)(entity_1.OwnerEntity, from));
                let newOwner = (yield (0, manager_1.getOne)(entity_1.OwnerEntity, to));
                if (!newOwner)
                    newOwner = (yield (0, manager_1.addOwner)({
                        walletAddress: to,
                    }));
                let asset = yield (0, manager_1.getAssetOneByContractAndTokenId)(contractId, id);
                if (!asset) {
                    let tokenUri = yield dbContract.getFunction('tokenURI')(id);
                    let tokenMetadata = yield (0, axios_1.default)(tokenUri).then((response) => {
                        return response.data;
                    });
                    asset = yield database_1.dataSource
                        .createQueryBuilder(entity_1.AssetEntity, 'a')
                        .insert()
                        .into(entity_1.AssetEntity)
                        .values({
                        contractId: contractId,
                        tokenId: id,
                        ownerId: newOwner.id,
                        image: tokenMetadata.image,
                        description: tokenMetadata.description,
                        name: tokenMetadata.name,
                        animation: tokenMetadata.animation_url,
                        updatedDate: new Date(),
                    })
                        .orUpdate(['ownerId', 'updatedDate'], ['contractId', 'tokenId'], {
                        skipUpdateIfNoValuesChanged: true,
                    })
                        .execute()
                        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
                        return (yield database_1.dataSource
                            .createQueryBuilder(entity_1.AssetEntity, 'a')
                            .where('a.archived=:archived AND a.id=:id', {
                            archived: false,
                            id: result.identifiers[0].id,
                        })
                            .getOne());
                    }));
                    yield (0, utilities_1.integrityCheckerForAll)(contractId, parseInt(id), parseInt(id) + 1);
                }
                else {
                    yield (0, manager_1.updateAssetOwner)(asset, newOwner.id);
                }
            }
            catch (error) {
                next(error.message);
            }
        }));
        yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            message: `Indexer completed for ${description} (${address})`,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.blockchainRoute.get('/Blockchain/ContractWalk/Contract/:contractAddress/StartIndex/:startIndex', database_1.setForeverDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractAddress, startIndex } = req.params;
    try {
        yield database_1.dataSource.initialize();
        const dbContract = (yield (0, manager_1.getContractByAddress)(contractAddress));
        const provider = (0, utilities_1.getAlchemyProvider)(1);
        const contract = new ethers_1.Contract(dbContract.address, dbContract.abi, provider);
        let totalSupply = yield contract.getFunction('totalSupply')();
        for (let i = parseInt(startIndex); i < totalSupply; i++) {
            yield (0, utilities_1.delay)(200);
            let ownerAddress = '';
            if (dbContract.symbol === 'C')
                ownerAddress = yield contract.getFunction('punkIndexToAddress')(i);
            else
                ownerAddress = yield contract.getFunction('ownerOf')(i);
            let owner = yield database_1.dataSource
                .createQueryBuilder(entity_1.OwnerEntity, 'o')
                .insert()
                .into(entity_1.OwnerEntity)
                .values({ walletAddress: ownerAddress })
                .orUpdate(['walletAddress'], ['walletAddress'], {
                skipUpdateIfNoValuesChanged: true,
            })
                .execute()
                .then((result) => __awaiter(void 0, void 0, void 0, function* () {
                return (yield database_1.dataSource
                    .createQueryBuilder(entity_1.OwnerEntity, 'o')
                    .where('o.archived=:archived AND o.walletAddress=:walletAddress', {
                    archived: false,
                    walletAddress: ownerAddress,
                })
                    .getOne());
            }));
            let image = '', name = '';
            if (dbContract.symbol === 'C') {
                let image = `https://cryptopunks.app/cryptopunks/cryptopunk${i}.png`;
                let name = `CryptoPunk #${i}`;
            }
            else {
                let tokenUri = yield contract.getFunction('tokenURI')(i);
                if (tokenUri.startsWith('ipfs://')) {
                    tokenUri = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                }
                let tokenMetadata = yield axios_1.default
                    .get(tokenUri)
                    .then((response) => {
                    return response.data;
                });
                image = tokenMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
                name = !tokenMetadata.name ? `#${i}` : tokenMetadata.name;
            }
            let asset = {
                tokenId: i,
                contractId: dbContract.id,
                ownerId: owner.id,
                name: name,
                image: image,
                updatedDate: new Date(),
            };
            console.log(`Adding ${name} to database with owner ${owner.id} (${owner.walletAddress}))`);
            yield database_1.dataSource
                .createQueryBuilder(entity_1.AssetEntity, 'a')
                .insert()
                .into(entity_1.AssetEntity)
                .values(asset)
                .orUpdate(['ownerId', 'updatedDate'], ['contractId', 'tokenId'], {
                skipUpdateIfNoValuesChanged: true,
            })
                .execute();
        }
        yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            message: `Indexer completed for Cryptopunks`,
        });
    }
    catch (error) {
        console.log(error);
        next(error.message);
    }
}));
