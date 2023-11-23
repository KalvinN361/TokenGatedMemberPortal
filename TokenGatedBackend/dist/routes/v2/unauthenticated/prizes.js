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
exports.prizeRoute = void 0;
const express_1 = require("express");
const manager_1 = require("../../../scripts/manager");
const entity_1 = require("../../../entity");
const database_1 = require("../../../scripts/utilities/database");
exports.prizeRoute = (0, express_1.Router)();
exports.prizeRoute.post('/Prize/GetAll', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const prizes = (yield (0, manager_1.getAll)(entity_1.PrizeEntity));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(prizes);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.post('/Prize/GetAllUnclaimedByEvent', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const prizes = (yield (0, manager_1.getAll)(entity_1.PrizeEntity));
        // console.log(prizes);
        const filteredPrizes = prizes.filter((prize) => prize.eventId === eventId && !prize.claimed && !prize.hold);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(filteredPrizes);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.post('/Prize/GetAllClaimedByEvent', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const prizes = (yield (0, manager_1.getAll)(entity_1.PrizeEntity));
        const filteredPrizes = prizes.filter((prize) => prize.eventId === eventId && prize.claimed);
        const returnData = [];
        for (const prize of filteredPrizes) {
            const owner = yield (0, manager_1.getOne)(entity_1.OwnerEntity, prize.ownerId);
            const ownerWallet = owner ? owner.walletAddress : null;
            const prizeWithOwnerWallet = Object.assign(Object.assign({}, prize), { ownerWallet });
            returnData.push(prizeWithOwnerWallet);
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(returnData);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.post('/Prize/GetOne', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { prizeId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const prize = (yield (0, manager_1.getOne)(entity_1.PrizeEntity, prizeId));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(prize);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.post('/Prize/Add', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { prize } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.add)(entity_1.PrizeEntity, prize);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.patch('/Prize/GetPrizeCount', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const prizeCount = yield (0, manager_1.getPrizeCount)(eventId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(prizeCount);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.patch('/Prize/Update', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { prize } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.update)(entity_1.PrizeEntity, prize);
        yield database_1.dataSource.destroy();
        res.status(200).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.patch('/Prize/Archive', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { prizeId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.archive)(entity_1.PrizeEntity, prizeId);
        yield database_1.dataSource.destroy();
        res.status(200).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.post('/Prize/ClaimTransfer', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prizes = req.body.prizes;
    const walletAddress = req.body.walletAddress;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
        let ownerId = owner.id;
        const result = yield (0, manager_1.claimTransfer)(prizes, ownerId, walletAddress);
        yield database_1.dataSource.destroy();
        res.status(200).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.post('/Prize/ClaimHoldTransfer', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prizes = req.body.prizes;
    const walletAddress = req.body.walletAddress;
    try {
        yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
        let ownerId = owner.id;
        const result = yield (0, manager_1.claimHoldTransfer)(prizes, ownerId);
        yield database_1.dataSource.destroy();
        res.status(200).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.post('/Prize/Remove', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //HERE is the last 6 characters of the Prize Id
    const { prizeId } = req.body;
    // console.log(prizeId);
    const prizes = (yield (0, manager_1.getAll)(entity_1.PrizeEntity));
    // console.log(prizes);
    const foundPrize = prizes.find((prize) => prize.id.slice(-6) === prizeId);
    // console.log(foundPrize);
    try {
        yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.remove)(entity_1.PrizeEntity, foundPrize.id);
        yield database_1.dataSource.destroy();
        res.status(200).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
// HERE this removes the items in the queue that are on hold for more than 2 minutes
exports.prizeRoute.post('/Prize/removeExpiredHold', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const newQueue = yield (0, manager_1.remoteTimeHoldPrize)(eventId);
        yield database_1.dataSource.destroy();
        res.status(200).json(newQueue);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.post('/Prize/RemoveHold', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, walletAddress, quantity } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
        const newQueue = yield (0, manager_1.removeHoldPrize)(eventId, owner.id, quantity);
        yield database_1.dataSource.destroy();
        res.status(200).json(newQueue);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.post('/Prize/holdPrize', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const walletAddress = req.body.walletAddress;
    console.log(walletAddress);
    const prizes = req.body.prizes;
    if (!Array.isArray(prizes)) {
        return res
            .status(400)
            .json({ error: 'Expected prizes to be an array.' });
    }
    try {
        yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
        if (!owner) {
            return res.status(404).json({ error: 'Owner not found.' });
        }
        yield (0, manager_1.addHoldPrize)(owner.id, prizes);
        yield database_1.dataSource.destroy();
        res.status(200).json({ message: 'Prizes held successfully.' });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.prizeRoute.post('/Prize/CheckIfPrizeIsAvailable', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prizeId = req.body.prizeId;
    try {
        yield database_1.dataSource.initialize();
        // check prizes table and see if the prize with prizeId hold is false. If it is false, then it is available
        const prize = (yield (0, manager_1.getOne)(entity_1.PrizeEntity, prizeId));
        yield database_1.dataSource.destroy();
        if (!prize.hold) {
            res.status(200).json({ available: true });
        }
        else {
            res.status(200).json({ available: false });
        }
    }
    catch (error) {
        next(error.message);
    }
}));
