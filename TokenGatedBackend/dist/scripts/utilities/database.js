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
exports.setForeverDataSource = exports.setPVDataSource = exports.setDataSource = exports.dataSource = void 0;
const util_1 = require("./util");
const app_data_source_1 = require("../../app-data-source");
const setDataSource = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const origin = req.header('Origin');
        const db = (0, util_1.checkOriginFrom)(origin);
        if (db)
            exports.dataSource = yield (0, app_data_source_1.getDataSource)(db);
        next();
    }
    catch (error) {
        next(error.message);
    }
});
exports.setDataSource = setDataSource;
const setPVDataSource = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = 'ProjectVenkman';
        if (db)
            exports.dataSource = yield (0, app_data_source_1.getDataSource)(db);
        next();
    }
    catch (error) {
        next(error.message);
    }
});
exports.setPVDataSource = setPVDataSource;
const setForeverDataSource = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = 'TheForever';
        if (db)
            exports.dataSource = yield (0, app_data_source_1.getDataSource)(db);
        console.log(db);
        next();
    }
    catch (error) {
        next(error.message);
    }
});
exports.setForeverDataSource = setForeverDataSource;
