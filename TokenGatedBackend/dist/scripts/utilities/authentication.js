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
exports.removeRefreshTokenFromDb = exports.getRefreshTokenEntryFromDb = exports.setTokensCookie = exports.renewAllTokens = exports.generateRefreshToken = exports.generateAccessToken = exports.authenticate = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const CustomError_1 = require("../../definitions/CustomError");
const database_1 = require("./database");
const entity_1 = require("../../entity");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    //if (ignorePaths.includes(req.path)) return next();
    try {
        const accessToken = (_b = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.tokens) === null || _b === void 0 ? void 0 : _b.accessToken;
        if (!accessToken)
            res.status(401).send({
                status: 'Unauthorized',
                code: 401,
                message: 'Missing Access Token',
            });
        let jwtPayload;
        try {
            jwtPayload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);
            req.decodedAddress = jwtPayload.address;
        }
        catch (e) {
            switch (e.constructor) {
                case jwt.TokenExpiredError:
                    const refreshToken = (_d = (_c = req.cookies) === null || _c === void 0 ? void 0 : _c.tokens) === null || _d === void 0 ? void 0 : _d.refreshToken;
                    try {
                        const { newAccessToken, newRefreshToken } = yield (0, exports.renewAllTokens)(refreshToken);
                        (0, exports.setTokensCookie)(res, newAccessToken, newRefreshToken);
                        jwtPayload = jwt.verify(newAccessToken, process.env.JWT_ACCESS_SECRET_KEY);
                        req.decodedAddress = jwtPayload.address;
                    }
                    catch (e) {
                        if (e instanceof CustomError_1.CustomError) {
                            return res.status(e.statusCode).send(e.message);
                        }
                    }
                    break;
                case jwt.JsonWebTokenError:
                    return res.status(401).json({
                        status: 'error',
                        code: '401',
                        message: 'Invalid Token',
                    });
                default:
                    return res
                        .status(403)
                        .json({ status: 'Forbidden', code: 403, message: e });
            }
        }
        next();
    }
    catch (e) {
        return res
            .status(403)
            .json({ status: 'Forbidden', code: 403, message: e });
    }
});
exports.authenticate = authenticate;
const generateAccessToken = (address) => {
    return jwt.sign({ address }, process.env.JWT_ACCESS_SECRET_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_IN_SECONDS + 's',
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (address, refreshTokenVersion) => {
    return jwt.sign({ address, refreshTokenVersion }, process.env.JWT_REFRESH_SECRET_KEY, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS + 's',
    });
};
exports.generateRefreshToken = generateRefreshToken;
const renewAllTokens = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken)
        throw new CustomError_1.CustomError('No refresh token provided', 403);
    // Verify the refresh token and get the address
    let jwtPayload;
    try {
        jwtPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
    }
    catch (e) {
        switch (e.constructor) {
            case jwt.TokenExpiredError:
                console.log('Refresh token expired');
                throw new CustomError_1.CustomError('Refresh token expired', 403);
            case jwt.JsonWebTokenError:
                console.log('Invalid refresh token');
                throw new CustomError_1.CustomError('Invalid refresh token', 403);
            default:
                console.log('Unknown error');
                throw new CustomError_1.CustomError('Unknown error', 403);
        }
    }
    if (!jwtPayload)
        throw new CustomError_1.CustomError('Invalid refresh token', 403);
    const addressFromJwt = jwtPayload.address;
    const refreshTokenVersionFromJwt = jwtPayload.refreshTokenVersion;
    const exp = jwtPayload.exp;
    if (!exp)
        throw new CustomError_1.CustomError("This is not a token we issued since it doesn't have a expiration date", 403);
    if (exp < Date.now() / 1000) {
        console.log({ exp, now: Date.now() });
        throw new CustomError_1.CustomError('This token has expired', 403);
    }
    if (!addressFromJwt && !refreshTokenVersionFromJwt)
        throw new CustomError_1.CustomError('Invalid refresh token because it is not the one we issued!', 403);
    // Get the refresh token from the database
    const dbRefreshTokenEntry = yield (0, exports.getRefreshTokenEntryFromDb)(addressFromJwt);
    if (!dbRefreshTokenEntry) {
        throw new CustomError_1.CustomError(`User is already logged out or can't find that jwt!`, 403);
    }
    if (dbRefreshTokenEntry.version !== refreshTokenVersionFromJwt)
        throw new CustomError_1.CustomError('Invalid refresh token version', 403);
    // Generate a new access token
    const newAccessToken = (0, exports.generateAccessToken)(addressFromJwt);
    const newRefreshToken = (0, exports.generateRefreshToken)(addressFromJwt, dbRefreshTokenEntry.version + 1);
    const refreshTokenRepository = yield database_1.dataSource.getRepository(entity_1.RefreshTokenEntity);
    dbRefreshTokenEntry.version += 1;
    dbRefreshTokenEntry.token = newRefreshToken;
    yield refreshTokenRepository.save(dbRefreshTokenEntry);
    return { newAccessToken, newRefreshToken };
});
exports.renewAllTokens = renewAllTokens;
const setTokensCookie = (res, accessToken, refreshToken) => {
    res.cookie('tokens', { accessToken, refreshToken }, {
        httpOnly: Boolean(process.env.IS_PRODUCTION),
        secure: Boolean(process.env.IS_PRODUCTION),
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS) *
            1000,
        sameSite: 'none', // to prevent CSRF attacks
    });
};
exports.setTokensCookie = setTokensCookie;
const getRefreshTokenEntryFromDb = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenRepository = yield database_1.dataSource.getRepository(entity_1.RefreshTokenEntity);
    return refreshTokenRepository.findOne({
        where: { owner: { walletAddress: walletAddress } },
        relations: ['owner'],
    });
});
exports.getRefreshTokenEntryFromDb = getRefreshTokenEntryFromDb;
const removeRefreshTokenFromDb = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the refresh token from the database
    const refreshTokenRepository = yield database_1.dataSource.getRepository(entity_1.RefreshTokenEntity);
    // Delete the refresh token from the database
    yield refreshTokenRepository.delete({ token: refreshToken });
});
exports.removeRefreshTokenFromDb = removeRefreshTokenFromDb;
