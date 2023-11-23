"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getDataSource = void 0;
const typeorm_1 = require("typeorm");
const e = __importStar(require("./entity"));
const getDataSource = (database) => __awaiter(void 0, void 0, void 0, function* () {
    return new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        connectTimeoutMS: 0,
        maxQueryExecutionTime: 0,
        extra: {
            connectionTimeoutMillis: 0,
            query_timeout: 0,
            statement_timeout: 0,
            poolSize: 1000,
        },
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: database,
        entities: [
            e.AccessListEntity,
            e.AnnouncementEntity,
            e.AssetEntity,
            e.Asset1155Entity,
            e.AttributeEntity,
            e.OwnerEntity,
            e.ChiveBarsEntity,
            e.ClaimEntity,
            e.CollectEntity,
            e.CompanyEntity,
            e.ContractEntity,
            e.EventEntity,
            e.ShopEntity,
            e.MediaEntity,
            e.OwnerDataEntity,
            e.PrizeEntity,
            e.QueueEntity,
            e.RefreshTokenEntity,
            e.Token1155Entity,
        ],
        synchronize: false,
        logging: false,
    });
});
exports.getDataSource = getDataSource;
