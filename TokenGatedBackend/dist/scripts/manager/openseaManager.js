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
exports.getNextAvailableToken = exports.mintPublicSeaDrop = exports.replaceImageHash = void 0;
const baseManager_1 = require("./baseManager");
const entity_1 = require("../../entity");
const utilities_1 = require("../utilities");
const ethers_1 = require("ethers");
const abi_1 = require("../../abi");
const underscore_1 = require("underscore");
const database_1 = require("../utilities/database");
const replaceImageHash = (data, hash, name) => {
    let tmp = Object.assign({}, data);
    tmp.image = `ipfs://${hash}/${name ? name : '1'}`;
    return tmp;
};
exports.replaceImageHash = replaceImageHash;
const mintPublicSeaDrop = (contractId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const { JTN_WALLET_PRIVATE_KEY } = process.env;
    let tx, receipt = [];
    try {
        const contract = (yield (0, baseManager_1.getOne)(entity_1.ContractEntity, contractId));
        const { address, abi } = contract;
        const provider = (0, utilities_1.getAlchemyProvider)(contract.chainId);
        const signer = new ethers_1.Wallet(JTN_WALLET_PRIVATE_KEY, provider);
        const SeaDropContract = new ethers_1.Contract('0x00005EA00Ac477B1030CE78506496e8C2dE24bf5', abi_1.SeaDropAbi, signer);
        const PVOpenSeaContract = new ethers_1.Contract(address, abi, signer);
        const signedSeaDropContract = SeaDropContract.connect(signer);
        const feeData = yield provider.getFeeData();
        const fee = feeData.gasPrice;
        const estimate = yield provider.estimateGas({
            gasPrice: feeData.gasPrice,
        });
        const nonce = yield provider.getTransactionCount(signer.address);
        const block = (yield provider.getBlock('latest'));
        const salt = ethers_1.ethers.solidityPackedSha256(['uint256', 'uint256', 'uint256'], [block.number, fee, (0, underscore_1.random)(100000)]);
        const signature = yield signer.signMessage(salt);
        const feeRecipient = '0x0000a26b00c1F0DF003000390027140000fAa719';
        const minterIfNotPayer = '0x0000000000000000000000000000000000000000';
        const increment = 5000;
        for (let i = quantity; i > 0; i -= increment) {
            console.log({ i, address });
            let mintQuantity = i > increment ? increment : i;
            tx = yield signedSeaDropContract.getFunction('mintPublic')(address, feeRecipient, minterIfNotPayer, mintQuantity, { gasPrice: feeData.gasPrice, gasLimit: Number(estimate) * 256 });
            console.log({ tx });
            receipt.push(yield tx.wait());
            console.log({ receipt });
        }
        return { status: 'success', code: 200, receipt };
    }
    catch (e) {
        console.log(e);
        return { status: 'failed', code: 404, response: e };
    }
});
exports.mintPublicSeaDrop = mintPublicSeaDrop;
const getNextAvailableToken = (contractId, contractOwnerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .where('a.archived=:archived AND a.contractId=:contractId AND a.ownerId=:ownerId AND a.reserve=:reserve', {
        archived: false,
        contractId: contractId,
        ownerId: contractOwnerId,
        reserve: false,
    })
        .orderBy('a.tokenId :: integer', 'ASC')
        .getOne()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        let updateAsset = res;
        yield database_1.dataSource
            .createQueryBuilder()
            .update(entity_1.AssetEntity)
            .set({ reserve: true })
            .where('id = :id', { id: updateAsset.id })
            .execute();
        return updateAsset;
    }));
});
exports.getNextAvailableToken = getNextAvailableToken;
