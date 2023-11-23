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
exports.announcementRoute = void 0;
const express_1 = require("express");
const database_1 = require("../../../scripts/utilities/database");
const manager_1 = require("../../../scripts/manager");
exports.announcementRoute = (0, express_1.Router)();
exports.announcementRoute.get('/Announcements/GetAll', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const announcements = (yield (0, manager_1.getAllAnnouncements)());
        yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: announcements.length,
            announcements: announcements,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.announcementRoute.get('/Announcements/GetOne/Announcement/:announcementId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { announcementId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const announcement = (yield (0, manager_1.getOneAnnouncement)(announcementId));
        yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            announcement: announcement,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.announcementRoute.get('/Announcements/GetAll/Type/:type', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const announcements = yield (0, manager_1.getAllAnnouncementsByType)(type);
        yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: announcements.length,
            announcements: announcements,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
