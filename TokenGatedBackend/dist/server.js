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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const v2_1 = require("./routes/v2");
dotenv.config();
const server = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
//export let dataSource: DataSource;
const corsAccessList = [
    'http://localhost:3000',
    'http://localhost:3001/v2',
    'https://devmembers.billmurray1000.com',
    'https://membertest.billmurray1000.com',
    'https://members.billmurray1000.com',
    'https://members-billmurray1000.webflow.io',
    'https://vendabill-snzjakgcva-uc.a.run.app',
    'https://vendabill.billmurray1000.com',
    'https://a.theforever.com',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (corsAccessList.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
server.use(express_1.default.json({ type: '*/*' }));
server.use(express_1.default.urlencoded({ extended: false }));
server.use((0, cors_1.default)(corsOptions));
server.use((0, cookie_parser_1.default)());
server.use((0, morgan_1.default)('dev'));
/*server.use(async (req, res, next) => {
    res.on('close', async function () {
        if (dataSource.isInitialized) await dataSource.destroy();
    });
    next();
});*/
server.use('/v2', v2_1.v2routes);
const ignorePaths = [
    '/Owner/UpdateOwnerData',
    //'/Asset/UpgradeBill3DFrame',
    //'/Asset/GetAllBurnablesByWalletAddress',
    '/Asset/ResizeSmallByContract',
];
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ${process.env.NODE_ENV}`);
});
