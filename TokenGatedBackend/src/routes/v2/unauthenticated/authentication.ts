import { NextFunction, Request, Response, Router } from 'express';
import { generateNonce, SiweMessage } from 'siwe';
import { Magic } from '@magic-sdk/admin';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import { OwnerEntity } from '../../../entity';
import { CustomError } from '../../../definitions/CustomError';
import {
    checkIfSpooferRole,
    HMgetOwnedTokens,
} from '../../../scripts/utilities';
import {
    generateAccessToken,
    removeRefreshTokenFromDb,
} from '../../../scripts/utilities';
import { HMGetOwnedTokensResponse } from '../../../definitions';
import {
    getAssetsCountByOwner,
    getOne,
    getOwnerByWalletAddress,
} from '../../../scripts/manager';

export const authenticateRoute = Router();

authenticateRoute.get(
    '/Auth/GenerateChallenge',
    async (_: Request, res: Response) => {
        res.send(generateNonce());
    }
);

authenticateRoute.post(
    '/Auth/IssueTokens',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const { message, signature } = req.body;
            if (!message && !signature)
                res.status(400).json({
                    status: 'Unauthorized',
                    code: 400,
                    message: 'Include message and signature in body',
                });
            const siweMessage = new SiweMessage(message);
            const fields = await siweMessage.verify({ signature });
            let address = fields.data.address;
            const isSpoofer = await checkIfSpooferRole(address);
            if (isSpoofer) {
                address = '0x2611B286994571b4D5292ACFF5619da8074b5c54'; //gavin
            }
            let owner = (await getOwnerByWalletAddress(address)) as OwnerEntity;
            if (!owner) {
                const user = {
                    walletAddress: address,
                };
                const newOwner = await dataSource
                    .getRepository(OwnerEntity)
                    .createQueryBuilder()
                    .insert()
                    .into(OwnerEntity)
                    .values({ ...user })
                    .execute();
                if (newOwner) {
                    owner = (await getOne(
                        OwnerEntity,
                        newOwner.identifiers[0].id
                    )) as OwnerEntity;
                }
            }

            // check if owner has any assets
            const assets = await getAssetsCountByOwner(owner.id);
            const eventContract1155: HMGetOwnedTokensResponse =
                await HMgetOwnedTokens(
                    'd7720bb1-9f72-462c-9204-800c1d11fe97',
                    owner.walletAddress
                );

            // Oceanside Commemorative
            let ocCommemorative = eventContract1155.tokens.filter(
                (token) => token.tokenId === 1
            )[0];
            console.log({ ocCommemorative });

            if (assets === 0 && !ocCommemorative)
                return res.status(403).send({
                    status: 'Failed',
                    code: 403,
                    message: 'User has no assets',
                });

            const accessToken = generateAccessToken(address);
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
            if (dataSource.isInitialized) await dataSource.destroy();
            res.cookie(
                'tokens',
                { accessToken },
                { sameSite: 'none', secure: true, httpOnly: true }
            ).json({
                status: 'success',
                code: 200,
                message: 'Successfully logged in',
            });

            //res.sendStatus(200);
        } catch (e) {
            console.log(e);
            res.status(403).send(e);
        }
    }
);

authenticateRoute.post(
    '/Auth/InvalidateTokens',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const refreshTokenFromJwt = req.cookies?.tokens?.refreshToken;
            if (!refreshTokenFromJwt)
                return res.status(403).send('Include refresh token in cookies');
            await removeRefreshTokenFromDb(refreshTokenFromJwt);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.clearCookie('tokens', { sameSite: 'none', secure: true });
            res.status(200).send('You have been logged out!');
        } catch (e) {
            console.log(e);
            res.status(403).json(e);
        }
    }
);

authenticateRoute.post(
    '/Auth/IsSpoofer',
    setDataSource,
    async (req: Request, res: Response) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            if (!req.decodedAddress)
                throw new CustomError('No cookie with address provided', 403);
            const isSpoofer = await checkIfSpooferRole(req.decodedAddress);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).send({ isSpoofer });
        } catch (e) {
            console.log(e);
            res.status(403).json(e);
        }
    }
);

authenticateRoute.post(
    '/Auth/Magic/Login',
    setDataSource,
    async (req: Request, res, _) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const magic = new Magic(process.env.MAGIC_SECRET_KEY);
            let didToken;
            if (req?.headers?.authorization) {
                didToken = magic.utils.parseAuthorizationHeader(
                    req?.headers?.authorization
                );
            }
            if (didToken) {
                // magic.token.validate(didToken)
                const metadata = await magic.users.getMetadataByToken(didToken);
                const owner = await dataSource
                    .createQueryBuilder(OwnerEntity, 'o')
                    .where(
                        'o.archived = (:archived) AND o.walletAddress = (:walletAddress)',
                        {
                            archived: false,
                            walletAddress: metadata.publicAddress,
                        }
                    )
                    .getOne();

                if (owner) {
                    res.status(200).send({ ownerId: owner.id });
                }

                if (!owner && metadata.publicAddress && metadata.email) {
                    const user = {
                        walletAddress: metadata.publicAddress,
                        email: metadata.email,
                    };
                    const newOwner = await dataSource
                        .getRepository(OwnerEntity)
                        .createQueryBuilder()
                        .insert()
                        .into(OwnerEntity)
                        .values({ ...user })
                        .execute();
                    if (newOwner) {
                        res.status(200).send({
                            ownerId: newOwner.identifiers[0].id,
                        });
                    }
                }
            }
            if (dataSource.isInitialized) await dataSource.destroy();
        } catch (e) {
            console.log(e);
            res.status(500).send(e);
        }
    }
);

authenticateRoute.post('/Auth/Magic/Logout', async (req: Request, res, _) => {
    try {
        const magic = new Magic(process.env.MAGIC_SECRET_KEY);
        if (req?.headers?.authorization != null) {
            const didToken = magic.utils.parseAuthorizationHeader(
                req?.headers?.authorization
            );
            await magic.users.logoutByToken(didToken);
            res.status(200).send('Successfully logged out');
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
