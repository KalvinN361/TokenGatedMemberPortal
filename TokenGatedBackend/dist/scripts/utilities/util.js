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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletKey = exports.getOpenSeaChain = exports.getAlchemyProvider = exports.toTitleCase = exports.buildBMAttributes = exports.buildBMAssetJSON = exports.delay = exports.uploadToGCP = exports.merge3DImages = exports.resizeAssetImageSmall = exports.getHandEmbellishment = exports.getNewFrameColor = exports.downloadImage = exports.checkIfSpooferRole = exports.addUserToAccessList = exports.getUpdateData = exports.checkOriginFrom = exports.verifySignature = void 0;
const crypto_1 = __importStar(require("crypto"));
const database_1 = require("./database");
const entity_1 = require("../../entity");
const axios_1 = __importDefault(require("axios"));
const entity_2 = require("../../entity");
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const manager_1 = require("../manager");
const ethers_1 = require("ethers");
const SIGNATURE_VALID_FOR = 30;
const getTimestamp = () => {
    return Math.round(new Date().getTime() / 1000);
};
const validateTimestamp = (timestamp) => {
    return getTimestamp() - timestamp <= SIGNATURE_VALID_FOR;
};
const generateSignature = (a) => {
    // order has to be the same
    let payload = `${a.method};${a.uri};${a.timestamp}`;
    if (a.body) {
        payload += `;${a.body}`;
    }
    return crypto_1.default
        .createHmac('sha256', a.secretKey)
        .update(payload)
        .digest('hex');
};
const verifySignature = (signature, secretKey, uri, method, timestamp, body) => {
    const generatedSignature = generateSignature({
        secretKey,
        uri,
        method,
        timestamp,
        body,
    });
    if (!crypto_1.default.timingSafeEqual(Buffer.from(generatedSignature, 'hex'), Buffer.from(signature, 'hex'))) {
        return false;
    }
    return validateTimestamp(timestamp);
};
exports.verifySignature = verifySignature;
const checkOriginFrom = (origin) => {
    if (!origin) {
        return 'BillMurray1000';
    }
    else if (origin.toLowerCase().indexOf('billmurray1000') > -1)
        return 'BillMurray1000';
    else if (origin.toLowerCase().indexOf('earthlightfoundation') > -1)
        return 'ELF';
    else if (origin.toLowerCase().indexOf('forever') > -1)
        return 'TheForever';
    else if (origin.toLowerCase().indexOf('projectvenkman') > -1)
        return 'ProjectVenkman';
    else
        return 'BillMurray1000';
};
exports.checkOriginFrom = checkOriginFrom;
const getUpdateData = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof walletAddress !== 'string')
        return {
            createdBy: (0, crypto_1.randomUUID)(),
            updatedBy: (0, crypto_1.randomUUID)(),
        };
    const owner = (yield (0, manager_1.getOwnerByWalletAddress)(walletAddress));
    return {
        createdBy: owner.id,
        updatedBy: owner.id,
    };
});
exports.getUpdateData = getUpdateData;
function addUserToAccessList(contractId, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessListId = yield database_1.dataSource
            .getRepository(entity_2.AccessListEntity)
            .createQueryBuilder('AccessList')
            .where('AccessList.contractId = (:contractId)', {
            contractId: contractId,
        })
            .getOne()
            .then((res) => {
            return res === null || res === void 0 ? void 0 : res.accessListId;
        });
        if (accessListId) {
            yield axios_1.default.put(`https://api.hypermint.com/v1/access-list/${accessListId}/addresses`, {
                addresses: [
                    {
                        address: address,
                    },
                ],
            }, {
                headers: {
                    HM_ACCESS_KEY: process.env.HM_ACCESS_KEY,
                    HM_ACCESS_KEY_SECRET: process.env.HM_ACCESS_KEY_SECRET,
                },
            });
        }
    });
}
exports.addUserToAccessList = addUserToAccessList;
function checkIfSpooferRole(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const spoofer = (yield database_1.dataSource
            .getRepository(entity_1.OwnerEntity)
            .createQueryBuilder('Owner')
            .where('Owner.walletAddress = (:walletAddress) AND Owner.role = (:role)', {
            walletAddress: address,
            role: 'spoofer',
        })
            .getOne());
        return Boolean(spoofer);
    });
}
exports.checkIfSpooferRole = checkIfSpooferRole;
const downloadImage = (image) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`PV::${new Date().toISOString()}::Downloading image... ` + image);
    return yield axios_1.default
        .get(image, {
        responseType: 'arraybuffer',
        onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                process.stdout.write(`Downloading... ${percentCompleted}%`);
            }
        },
    })
        .then((response) => {
        return response.data;
    });
});
exports.downloadImage = downloadImage;
const getNewFrameColor = (frame) => {
    console.log(`PV::${new Date().toISOString()}::Getting new frame color... ` + frame);
    switch (frame) {
        case 'Black':
            return 'SILVER';
        case 'Silver':
            return 'GOLD';
        case 'Gold':
            return null;
        default:
            return 'BLACK';
    }
};
exports.getNewFrameColor = getNewFrameColor;
const getHandEmbellishment = (handEmbellishment) => {
    console.log(`PV::${new Date().toISOString()}::Getting hand embellishment... `);
    switch (handEmbellishment) {
        case 'Clown Nose':
            return 'CLOWN';
        case 'Helmet':
            return 'EVEL';
        case 'Reversed':
            return 'FLIPPED';
        case 'Invisible':
            return null;
        default:
            return null;
    }
};
exports.getHandEmbellishment = getHandEmbellishment;
const resizeAssetImageSmall = (asset, bucketName) => __awaiter(void 0, void 0, void 0, function* () {
    const tempDir = `${process.cwd()}/temp`;
    const imageFileName = `${tempDir}/${asset === null || asset === void 0 ? void 0 : asset.tokenId}-tmp.png`;
    const imageSmallFileName = `${tempDir}/${asset === null || asset === void 0 ? void 0 : asset.tokenId}.png`;
    const destination = `${asset.contractId}/${asset === null || asset === void 0 ? void 0 : asset.tokenId}.png`;
    const image = yield (0, exports.downloadImage)(asset.image);
    const imageBuffer = Buffer.from(image);
    fs_1.default.writeFileSync(imageFileName, imageBuffer);
    yield (0, sharp_1.default)(imageFileName)
        .metadata()
        .then(({ width }) => {
        (0, sharp_1.default)(imageFileName)
            .resize(Math.round(width * 0.25))
            .png({ compressionLevel: 1, quality: 100 })
            .toFile(imageSmallFileName);
    });
    yield (0, exports.uploadToGCP)(imageSmallFileName, destination, bucketName);
    fs_1.default.unlinkSync(imageFileName);
    //fs.unlinkSync(imageSmallFileName);
});
exports.resizeAssetImageSmall = resizeAssetImageSmall;
const merge3DImages = (asset, glassImage) => __awaiter(void 0, void 0, void 0, function* () {
    const tempDir = `${process.cwd()}/temp`;
    let composite = [];
    console.log(`PV::${new Date().toISOString()}::Downloading asset image... ` +
        asset.image);
    const image = yield (0, exports.downloadImage)(asset.image);
    const imageBuffer = Buffer.from(image);
    const imageFileName = `${tempDir}/${asset === null || asset === void 0 ? void 0 : asset.tokenId}.png`;
    fs_1.default.writeFileSync(imageFileName, imageBuffer);
    composite.push({ input: imageFileName });
    console.log(`PV::${new Date().toISOString()}::Downloading glasses image... ` +
        glassImage);
    const glasses = yield (0, exports.downloadImage)(glassImage);
    const glassesBuffer = Buffer.from(glasses);
    const glassesFileName = `${tempDir}/${asset === null || asset === void 0 ? void 0 : asset.tokenId}-glasses.png`;
    fs_1.default.writeFileSync(glassesFileName, glassesBuffer);
    composite.push({ input: glassesFileName });
    console.log(`PV::${new Date().toISOString()}::Merging images... `);
    const tempImageName = `${tempDir}/${asset === null || asset === void 0 ? void 0 : asset.tokenId}-temp.png`;
    try {
        console.log({ composite });
        yield (0, sharp_1.default)(imageFileName)
            .composite(composite)
            .png({ compressionLevel: 9, quality: 50 })
            .toFile(tempImageName);
    }
    catch (error) {
        console.log(error.message);
    }
    console.log(`PV::${new Date().toISOString()}::Merged image... ` + tempImageName);
    //fs.unlinkSync(imageFileName);
    //fs.unlinkSync(glassesFileName);
    return tempImageName;
});
exports.merge3DImages = merge3DImages;
const uploadToGCP = (sourceFilePath, destinationFileName, bucketName) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`PV::${new Date().toISOString()}::${sourceFilePath} uploading to ${bucketName}/${destinationFileName}...`);
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage({
        keyFilename: `${process.cwd()}/secrets/pv-storage.json`,
    });
    const uploadOptions = {
        destination: destinationFileName,
        ifGenerationMatch: 'None',
    };
    try {
        yield storage.bucket(bucketName).upload(sourceFilePath, uploadOptions);
    }
    catch (error) {
        console.log(error.message);
    }
    console.log(`PV::${new Date().toISOString()}::${sourceFilePath} uploaded to ${bucketName}`);
    return `https://storage.googleapis.com/${bucketName}/${destinationFileName}`;
});
exports.uploadToGCP = uploadToGCP;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
exports.delay = delay;
const buildBMAssetJSON = (asset) => {
    console.log(`PV::${new Date().toISOString()}::Building BM Asset JSON... `);
    return {
        name: asset.name,
        description: asset.description,
        image: asset.image,
        animation_url: asset.animation,
        attributes: (0, exports.buildBMAttributes)(asset.attributes),
    };
};
exports.buildBMAssetJSON = buildBMAssetJSON;
const buildBMAttributes = (attributes) => {
    console.log(`PV::${new Date().toISOString()}::Building BM Attributes... `);
    const bmAttributes = [];
    attributes.forEach((attribute) => {
        bmAttributes.push({
            trait_type: attribute.traitType,
            value: attribute.value,
        });
    });
    return bmAttributes;
};
exports.buildBMAttributes = buildBMAttributes;
const toTitleCase = (text) => {
    return text.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
};
exports.toTitleCase = toTitleCase;
const getAlchemyProvider = (chain) => {
    let apiKey = '';
    let network = '';
    switch (chain) {
        case 5:
            apiKey = process.env.ALCHEMY_GOERLI_KEY;
            network = 'goerli';
            break;
        case 137:
            apiKey = process.env.ALCHEMY_POLYGON_KEY;
            network = 'matic';
            break;
        case 80001:
            apiKey = process.env.ALCHEMY_MUMBAI_KEY;
            network = 'matic-mumbai';
            break;
        case 11155111:
            apiKey = process.env.ALCHEMY_SEPOLIA_KEY;
            network = 'sepolia';
            break;
        default:
            apiKey = process.env.ALCHEMY_MAINNET_KEY;
            network = 'homestead';
    }
    return new ethers_1.AlchemyProvider(network, apiKey);
};
exports.getAlchemyProvider = getAlchemyProvider;
const getOpenSeaChain = (chain) => {
    switch (chain) {
        case 5:
            return 'goerli';
        case 137:
            return 'matic';
        case 80001:
            return 'mumbai';
        default:
            return 'ethereum';
    }
};
exports.getOpenSeaChain = getOpenSeaChain;
const getWalletKey = (symbol) => {
    switch (symbol) {
        case 'BMOE':
            return process.env.BMOE_WALLET_PRIVATE_KEY;
        case 'STD2-TEST':
            return process.env.JTN_WALLET_PRIVATE_KEY;
        default:
            return null;
    }
};
exports.getWalletKey = getWalletKey;
