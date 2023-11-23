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
exports.getAllAnnouncementsByType = exports.getOneAnnouncement = exports.getAllAnnouncements = void 0;
const entity_1 = require("../../entity");
const database_1 = require("../utilities/database");
const getAllAnnouncements = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AnnouncementEntity, 'a')
        .where('now() < a.endDate and now() > startDate')
        .getMany();
});
exports.getAllAnnouncements = getAllAnnouncements;
const getOneAnnouncement = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AnnouncementEntity, 'a')
        .where('a.id = (:id) AND now() < a.endDate and now() > startDate', {
        id: id,
    })
        .getOne();
});
exports.getOneAnnouncement = getOneAnnouncement;
const getAllAnnouncementsByType = (type) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AnnouncementEntity, 'a')
        .where('a.type = (:type) AND now() < a.endDate and now() > startDate', {
        type: type,
    })
        .getMany();
});
exports.getAllAnnouncementsByType = getAllAnnouncementsByType;
