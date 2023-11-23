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
exports.eventRoute = void 0;
const express_1 = require("express");
const manager_1 = require("../../../scripts/manager");
const entity_1 = require("../../../entity");
const database_1 = require("../../../scripts/utilities/database");
exports.eventRoute = (0, express_1.Router)();
exports.eventRoute.post('/Event/GetAll', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const events = (yield (0, manager_1.getAll)(entity_1.EventEntity));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(events);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.eventRoute.post('/Event/GetOne', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const event = (yield (0, manager_1.getOne)(entity_1.EventEntity, eventId));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json(event);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.eventRoute.post('/Event/Add', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { event } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.add)(entity_1.EventEntity, event);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.eventRoute.patch('/Event/Update', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { event } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.add)(entity_1.EventEntity, event);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.eventRoute.patch('/Event/Archive', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.archive)(entity_1.EventEntity, eventId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
exports.eventRoute.delete('/Event/Remove', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const result = yield (0, manager_1.remove)(entity_1.EventEntity, eventId);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json(result);
    }
    catch (error) {
        next(error.message);
    }
}));
