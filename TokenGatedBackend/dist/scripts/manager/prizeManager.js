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
exports.addHoldPrize = exports.removeHoldPrize = exports.remoteTimeHoldPrize = exports.claimHoldTransfer = exports.claimTransfer = exports.getPrizeCount = void 0;
const ethers_1 = require("ethers");
const entity_1 = require("../../entity");
const database_1 = require("../../scripts/utilities/database");
const utilities_1 = require("../utilities");
const contractManager_1 = require("./contractManager");
const getPrizeCount = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const prizeCount = yield database_1.dataSource
        .createQueryBuilder(entity_1.PrizeEntity, 'p')
        .where('p.eventId = :eventId', { eventId: eventId })
        .getCount();
    return prizeCount;
});
exports.getPrizeCount = getPrizeCount;
const claimTransfer = (prizes, ownerId, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const results = [];
    for (const prize of prizes) {
        const result = yield database_1.dataSource
            .createQueryBuilder()
            .update(entity_1.PrizeEntity)
            .set({ claimed: true, ownerId: ownerId, transactionType: 'crypto' })
            .where('id = :id AND claimed = :claimed', {
            id: prize.id,
            claimed: false,
        })
            .execute()
            .catch((error) => {
            return {
                error: error,
                message: 'Could not be claimed, check if data is correct',
            };
        });
        let prizeContract = (yield (0, contractManager_1.getContractByAddress)(prize.contractAddress));
        const provider = (0, utilities_1.getAlchemyProvider)(prizeContract.chainId);
        const { PV_WALLET_PRIVATE_KEY } = process.env;
        const signer = new ethers_1.Wallet(PV_WALLET_PRIVATE_KEY, provider);
        // TODO: Here we will be setting the prize contract chainId
        const contract = new ethers_1.Contract(prize.contractAddress, prizeContract.abi, provider);
        const signedContract = contract.connect(signer);
        const amountString = prize.name;
        const amount = ((_a = amountString.match(/[\d.]+/)) === null || _a === void 0 ? void 0 : _a[0]) || '';
        // TODO grab the abi from the database.
        if (prize.type === 'ERC20') {
            console.log(amount, 'amount');
            const tx = {
                to: walletAddress,
                value: (0, ethers_1.parseEther)(amount),
            };
            const txHash = yield signer.sendTransaction(tx);
        }
        else if (prize.type === 'ERC721') {
            const tx = yield signedContract.getFunction('safeTransferFrom')(signer.address, walletAddress, prize.tokenId);
            console.log(tx, 'tx');
        }
        else if (prize.type === 'ERC1155') {
            const tx = yield signedContract.getFunction('safeTransferFrom')(signer.address, walletAddress, prize.tokenId, amount);
            console.log(tx, 'tx');
        }
        results.push(result);
    }
    return results;
});
exports.claimTransfer = claimTransfer;
const claimHoldTransfer = (prizes, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    for (const prize of prizes) {
        const result = yield database_1.dataSource
            .createQueryBuilder()
            .update(entity_1.PrizeEntity)
            .set({ claimed: true, ownerId: ownerId, transactionType: 'fiat' })
            .where('id = :id AND claimed = :claimed', {
            id: prize.id,
            claimed: false,
        })
            .execute()
            .catch((error) => {
            return {
                error: error,
                message: 'Could not be claimed, check if data is correct',
            };
        });
        results.push(result);
    }
});
exports.claimHoldTransfer = claimHoldTransfer;
const remoteTimeHoldPrize = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const twoMinutesAgo = new Date();
    twoMinutesAgo.setUTCMinutes(twoMinutesAgo.getUTCMinutes() - 2);
    const twoMinutesAgoISOString = twoMinutesAgo.toISOString().slice(0, -1);
    const prize = yield database_1.dataSource
        .createQueryBuilder(entity_1.PrizeEntity, 'q')
        .where('q.eventId = :eventId', { eventId })
        .andWhere('q.hold = :hold', { hold: true })
        .andWhere('q.updatedDate <= :twoMinutesAgo', {
        twoMinutesAgo: twoMinutesAgoISOString,
    })
        .getMany();
    for (const prizeItem of prize) {
        prizeItem.hold = false;
        yield database_1.dataSource.getRepository(entity_1.PrizeEntity).save(prizeItem);
    }
});
exports.remoteTimeHoldPrize = remoteTimeHoldPrize;
const removeHoldPrize = (eventId, ownerId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    let prize = yield database_1.dataSource
        .createQueryBuilder(entity_1.PrizeEntity, 'q')
        .where('q.eventId = :eventId', {
        eventId: eventId,
    })
        .andWhere('q.ownerId = :ownerId', {
        ownerId: ownerId,
    })
        .andWhere('q.hold = :hold', {
        hold: true,
    })
        .take(quantity)
        .getMany();
    for (const prizeItem of prize) {
        prizeItem.hold = false;
        // Update the queueItem in the data source
        yield database_1.dataSource.getRepository(entity_1.PrizeEntity).save(prizeItem);
    }
});
exports.removeHoldPrize = removeHoldPrize;
const addHoldPrize = (ownerId, prizes) => __awaiter(void 0, void 0, void 0, function* () {
    if (!prizes || prizes.length === 0) {
        throw new Error('Prizes array is empty.');
    }
    for (let prize of prizes) {
        yield database_1.dataSource
            .createQueryBuilder()
            .update(entity_1.PrizeEntity)
            .set({ ownerId: ownerId, hold: true }) // set ownerId column to provided ownerId
            .where('id = :prizeId', { prizeId: prize.id }) // Match based on the ID of the prize
            .execute();
    }
});
exports.addHoldPrize = addHoldPrize;
