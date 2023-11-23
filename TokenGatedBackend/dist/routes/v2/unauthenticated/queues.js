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
exports.queueRoute = void 0;
const express_1 = require("express");
const manager_1 = require("../../../scripts/manager");
const entity_1 = require("../../../entity");
const queueManager_1 = require("../../../scripts/manager/queueManager");
const database_1 = require("../../../scripts/utilities/database");
exports.queueRoute = (0, express_1.Router)();
exports.queueRoute.post('/Queue/GetAll', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const queues = (yield (0, manager_1.getAll)(entity_1.QueueEntity));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(queues);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/GetAllByEvent', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const queues = yield (0, queueManager_1.getAllByEventId)(eventId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(queues);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/GetOne', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { queueId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const queue = (yield (0, manager_1.getOne)(entity_1.QueueEntity, queueId));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(queue);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/AddToQueue', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, walletAddress, quantity, transactionType, } = req.body;
    // console.log(walletAddress, 'walletAddress');
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
        const newQueue = yield (0, queueManager_1.addToQueue)(eventId, owner.id, quantity, transactionType);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(newQueue);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/RemoveHold', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, walletAddress, quantity } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
        const newQueue = yield (0, queueManager_1.removeHoldQueue)(eventId, owner.id, quantity);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(newQueue);
    }
    catch (error) {
        next(error.message);
    }
}));
// HERE this removes the items in the queue that are on hold for more than 2 minutes
exports.queueRoute.post('/Queue/RemoveHoldQueue', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const newQueue = yield (0, queueManager_1.remoteTimeHoldQueue)(eventId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(newQueue);
    }
    catch (error) {
        next(error.message);
    }
}));
// HERE this removes the items in the queue when they payment from stripe fails
exports.queueRoute.post('/Queue/RemoveFailedHoldQueue', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, walletAddress, quantity } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const newQueue = yield (0, queueManager_1.removeFailedHoldQueue)(eventId, walletAddress, quantity);
        yield database_1.dataSource.destroy();
        res.status(200).json(newQueue);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/StopQueue', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const queues = yield (0, queueManager_1.getAllByEventId)(eventId);
        const prizes = (yield (0, manager_1.getAll)(entity_1.PrizeEntity));
        let numberOfPrizesLeft = prizes.length - queues.length;
        yield database_1.dataSource.destroy();
        if (queues.length >= prizes.length) {
            res.status(204).json({ message: 'Queue is full' });
        }
        else {
            res.status(200).json({
                message: 'Queue is not full',
                remainingPrizes: numberOfPrizesLeft,
            });
        }
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/CurrentPosition', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, walletAddress } = req.body;
    // console.log(walletAddress, 'walletAddress');
    try {
        yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
        if (!owner)
            return res.status(404).json({ message: 'Not Found' });
        const currentPosition = yield (0, queueManager_1.currentPositionQueue)(eventId, owner.id);
        yield database_1.dataSource.destroy();
        res.status(200).json(currentPosition);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/GetPositionTransactionType', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, walletAddress } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
        if (!owner)
            return res.status(404).json({ message: 'Not Found' });
        const currentPositionTransactionType = yield (0, queueManager_1.currentPositionTransactionTypeQueue)(eventId, owner.id);
        yield database_1.dataSource.destroy();
        res.status(200).json(currentPositionTransactionType);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/GetEventCount', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        yield database_1.dataSource.initialize();
        let count = yield (0, queueManager_1.queueCount)(eventId);
        yield database_1.dataSource.destroy();
        res.status(200).json(count);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/NextInQueue', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const nextInQueue = yield (0, queueManager_1.getNextInQueue)(eventId);
        yield database_1.dataSource.destroy();
        res.status(200).json(nextInQueue);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/CheckSpinStatus', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const queues = yield (0, queueManager_1.getAllByEventId)(eventId);
        // loop through the queues and check for position 1. if position 1 then return the status
        const positionOne = queues.filter((queue) => queue.position === 1);
        yield database_1.dataSource.destroy();
        if (positionOne.length > 0) {
            res.status(200).json(positionOne[0].status);
        }
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/StatusSpin', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, eventId, position } = req.body;
    try {
        yield database_1.dataSource.initialize();
        // const updateSpinStatus = await update(QueueEntity, eventId);
        const updateSpinStatus = yield (0, queueManager_1.updateQueueSpinStatus)(eventId, position, status);
        yield database_1.dataSource.destroy();
        res.status(200).json(updateSpinStatus);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.post('/Queue/MoveToEnd', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        yield database_1.dataSource.initialize();
        yield (0, queueManager_1.moveToEnd)(eventId);
        yield database_1.dataSource.destroy();
        res.status(200).json({
            message: 'Your minute has passed to spin. You have been moved to end of queue',
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.patch('/Queue/Update', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { queueId } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const newQueue = yield (0, manager_1.update)(entity_1.QueueEntity, queueId);
        yield database_1.dataSource.destroy();
        res.status(200).json(newQueue);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.queueRoute.delete('/Queue/Remove', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { queueId } = req.body;
    try {
        yield database_1.dataSource.initialize();
        const newQueue = yield (0, manager_1.remove)(entity_1.QueueEntity, queueId);
        yield database_1.dataSource.destroy();
        res.status(200).json(newQueue);
    }
    catch (error) {
        next(error.message);
    }
}));
//HERE we need to add a list of winnable prizes with a column called claimed... If Claimed !== true then return the prize
//HERE we need to also add a function to set the prize to claimed in addition to setting the wallet of the user who claimed the prize
