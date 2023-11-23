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
exports.authenticateRoute = void 0;
const express_1 = require("express");
const siwe_1 = require("siwe");
const admin_1 = require("@magic-sdk/admin");
const database_1 = require("../../../scripts/utilities/database");
const entity_1 = require("../../../entity");
const CustomError_1 = require("../../../definitions/CustomError");
const utilities_1 = require("../../../scripts/utilities");
const utilities_2 = require("../../../scripts/utilities");
const manager_1 = require("../../../scripts/manager");
exports.authenticateRoute = (0, express_1.Router)();
exports.authenticateRoute.get('/Auth/GenerateChallenge', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send((0, siwe_1.generateNonce)());
}));
exports.authenticateRoute.post('/Auth/IssueTokens', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const { message, signature } = req.body;
        if (!message && !signature)
            res.status(400).json({
                status: 'Unauthorized',
                code: 400,
                message: 'Include message and signature in body',
            });
        const siweMessage = new siwe_1.SiweMessage(message);
        const fields = yield siweMessage.verify({ signature });
        let address = fields.data.address;
        const isSpoofer = yield (0, utilities_1.checkIfSpooferRole)(address);
        if (isSpoofer) {
            address = '0x2611B286994571b4D5292ACFF5619da8074b5c54'; //gavin
        }
        let owner = (yield (0, manager_1.getOwnerByWalletAddress)(address));
        if (!owner) {
            const user = {
                walletAddress: address,
            };
            const newOwner = yield database_1.dataSource
                .getRepository(entity_1.OwnerEntity)
                .createQueryBuilder()
                .insert()
                .into(entity_1.OwnerEntity)
                .values(Object.assign({}, user))
                .execute();
            if (newOwner) {
                owner = (yield (0, manager_1.getOne)(entity_1.OwnerEntity, newOwner.identifiers[0].id));
            }
        }
        // check if owner has any assets
        const assets = yield (0, manager_1.getAssetsCountByOwner)(owner.id);
        const eventContract1155 = yield (0, utilities_1.HMgetOwnedTokens)('d7720bb1-9f72-462c-9204-800c1d11fe97', owner.walletAddress);
        // Oceanside Commemorative
        let ocCommemorative = eventContract1155.tokens.filter((token) => token.tokenId === 1)[0];
        console.log({ ocCommemorative });
        if (assets === 0 && !ocCommemorative)
            return res.status(403).send({
                status: 'Failed',
                code: 403,
                message: 'User has no assets',
            });
        const accessToken = (0, utilities_2.generateAccessToken)(address);
        //const refreshToken = generateRefreshToken(address, 0);
        /*const refreshTokenEntryInDb = await getRefreshTokenEntryFromDb(
            address
        );*/
        /*if (refreshTokenEntryInDb)
            await removeRefreshTokenFromDb(refreshTokenEntryInDb.token);*/
        // Create new Refresh Token Entry in db
        //const refreshTokenEntry = new RefreshTokenEntity();
        //refreshTokenEntry.token = refreshToken;
        //refreshTokenEntry.owner = owner;
        /*await dataSource
            .createQueryBuilder(RefreshTokenEntity, 'r')
            .insert()
            .into(RefreshTokenEntity)
            .values({
                token: refreshToken,
                owner: owner,
                createdDate: new Date(),
                updatedDate: new Date(),
            })
            .orUpdate(['token', 'updatedDate'], ['ownerId'])
            .execute();*/
        //setTokensCookie(res, accessToken, refreshToken);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.cookie('tokens', { accessToken }, { sameSite: 'none', secure: true, httpOnly: true }).json({
            status: 'success',
            code: 200,
            message: 'Successfully logged in',
        });
        //res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        res.status(403).send(e);
    }
}));
exports.authenticateRoute.post('/Auth/InvalidateTokens', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const refreshTokenFromJwt = (_b = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.tokens) === null || _b === void 0 ? void 0 : _b.refreshToken;
        if (!refreshTokenFromJwt)
            return res.status(403).send('Include refresh token in cookies');
        yield (0, utilities_2.removeRefreshTokenFromDb)(refreshTokenFromJwt);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.clearCookie('tokens', { sameSite: 'none', secure: true });
        res.status(200).send('You have been logged out!');
    }
    catch (e) {
        console.log(e);
        res.status(403).json(e);
    }
}));
exports.authenticateRoute.post('/Auth/IsSpoofer', database_1.setDataSource, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        if (!req.decodedAddress)
            throw new CustomError_1.CustomError('No cookie with address provided', 403);
        const isSpoofer = yield (0, utilities_1.checkIfSpooferRole)(req.decodedAddress);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).send({ isSpoofer });
    }
    catch (e) {
        console.log(e);
        res.status(403).json(e);
    }
}));
exports.authenticateRoute.post('/Auth/Magic/Login', database_1.setDataSource, (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const magic = new admin_1.Magic(process.env.MAGIC_SECRET_KEY);
        let didToken;
        if ((_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c.authorization) {
            didToken = magic.utils.parseAuthorizationHeader((_d = req === null || req === void 0 ? void 0 : req.headers) === null || _d === void 0 ? void 0 : _d.authorization);
        }
        if (didToken) {
            // magic.token.validate(didToken)
            const metadata = yield magic.users.getMetadataByToken(didToken);
            const owner = yield database_1.dataSource
                .createQueryBuilder(entity_1.OwnerEntity, 'o')
                .where('o.archived = (:archived) AND o.walletAddress = (:walletAddress)', {
                archived: false,
                walletAddress: metadata.publicAddress,
            })
                .getOne();
            if (owner) {
                res.status(200).send({ ownerId: owner.id });
            }
            if (!owner && metadata.publicAddress && metadata.email) {
                const user = {
                    walletAddress: metadata.publicAddress,
                    email: metadata.email,
                };
                const newOwner = yield database_1.dataSource
                    .getRepository(entity_1.OwnerEntity)
                    .createQueryBuilder()
                    .insert()
                    .into(entity_1.OwnerEntity)
                    .values(Object.assign({}, user))
                    .execute();
                if (newOwner) {
                    res.status(200).send({
                        ownerId: newOwner.identifiers[0].id,
                    });
                }
            }
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
exports.authenticateRoute.post('/Auth/Magic/Logout', (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const magic = new admin_1.Magic(process.env.MAGIC_SECRET_KEY);
        if (((_e = req === null || req === void 0 ? void 0 : req.headers) === null || _e === void 0 ? void 0 : _e.authorization) != null) {
            const didToken = magic.utils.parseAuthorizationHeader((_f = req === null || req === void 0 ? void 0 : req.headers) === null || _f === void 0 ? void 0 : _f.authorization);
            yield magic.users.logoutByToken(didToken);
            res.status(200).send('Successfully logged out');
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
