import * as jwt from 'jsonwebtoken';
import { CustomError } from '../../definitions/CustomError';
import { dataSource, setDataSource } from './database';
import { RefreshTokenEntity } from '../../entity';
import { Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export const authenticate = async (req: any, res: Response, next: any) => {
    //if (ignorePaths.includes(req.path)) return next();
    try {
        const accessToken = req.cookies?.tokens?.accessToken;
        if (!accessToken)
            res.status(401).send({
                status: 'Unauthorized',
                code: 401,
                message: 'Missing Access Token',
            });
        let jwtPayload;
        try {
            jwtPayload = jwt.verify(
                accessToken,
                process.env.JWT_ACCESS_SECRET_KEY!
            ) as JwtPayload;
            req.decodedAddress = jwtPayload.address;
        } catch (e: any) {
            switch (e.constructor) {
                case jwt.TokenExpiredError:
                    const refreshToken = req.cookies?.tokens?.refreshToken;
                    try {
                        const { newAccessToken, newRefreshToken } =
                            await renewAllTokens(refreshToken);
                        setTokensCookie(res, newAccessToken, newRefreshToken);
                        jwtPayload = jwt.verify(
                            newAccessToken,
                            process.env.JWT_ACCESS_SECRET_KEY!
                        ) as JwtPayload;
                        req.decodedAddress = jwtPayload.address;
                    } catch (e) {
                        if (e instanceof CustomError) {
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
    } catch (e: any) {
        return res
            .status(403)
            .json({ status: 'Forbidden', code: 403, message: e });
    }
};

export const generateAccessToken = (address: string) => {
    return jwt.sign({ address }, process.env.JWT_ACCESS_SECRET_KEY!, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_IN_SECONDS + 's',
    });
};

export const generateRefreshToken = (
    address: string,
    refreshTokenVersion: number
) => {
    return jwt.sign(
        { address, refreshTokenVersion },
        process.env.JWT_REFRESH_SECRET_KEY!,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS + 's',
        }
    );
};

export const renewAllTokens = async (refreshToken: string) => {
    if (!refreshToken) throw new CustomError('No refresh token provided', 403);

    // Verify the refresh token and get the address
    let jwtPayload: jwt.JwtPayload;
    try {
        jwtPayload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY!
        ) as jwt.JwtPayload;
    } catch (e: any) {
        switch (e.constructor) {
            case jwt.TokenExpiredError:
                console.log('Refresh token expired');
                throw new CustomError('Refresh token expired', 403);
            case jwt.JsonWebTokenError:
                console.log('Invalid refresh token');
                throw new CustomError('Invalid refresh token', 403);
            default:
                console.log('Unknown error');
                throw new CustomError('Unknown error', 403);
        }
    }

    if (!jwtPayload) throw new CustomError('Invalid refresh token', 403);

    const addressFromJwt = jwtPayload.address;
    const refreshTokenVersionFromJwt = jwtPayload.refreshTokenVersion;
    const exp = jwtPayload.exp;

    if (!exp)
        throw new CustomError(
            "This is not a token we issued since it doesn't have a expiration date",
            403
        );

    if (exp < Date.now() / 1000) {
        console.log({ exp, now: Date.now() });
        throw new CustomError('This token has expired', 403);
    }

    if (!addressFromJwt && !refreshTokenVersionFromJwt)
        throw new CustomError(
            'Invalid refresh token because it is not the one we issued!',
            403
        );

    // Get the refresh token from the database
    const dbRefreshTokenEntry = await getRefreshTokenEntryFromDb(
        addressFromJwt
    );

    if (!dbRefreshTokenEntry) {
        throw new CustomError(
            `User is already logged out or can't find that jwt!`,
            403
        );
    }

    if (dbRefreshTokenEntry.version !== refreshTokenVersionFromJwt)
        throw new CustomError('Invalid refresh token version', 403);

    // Generate a new access token
    const newAccessToken = generateAccessToken(addressFromJwt);
    const newRefreshToken: string = generateRefreshToken(
        addressFromJwt,
        dbRefreshTokenEntry.version + 1
    );

    const refreshTokenRepository = await dataSource.getRepository(
        RefreshTokenEntity
    );
    dbRefreshTokenEntry.version += 1;
    dbRefreshTokenEntry.token = newRefreshToken;
    await refreshTokenRepository.save(dbRefreshTokenEntry);

    return { newAccessToken, newRefreshToken };
};

export const setTokensCookie = (
    res: Response,
    accessToken: string,
    refreshToken: string
) => {
    res.cookie(
        'tokens',
        { accessToken, refreshToken },
        {
            httpOnly: Boolean(process.env.IS_PRODUCTION), // to prevent XSS attacks
            secure: Boolean(process.env.IS_PRODUCTION), // to send the cookie over HTTPS only
            maxAge:
                parseInt(process.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS!) *
                1000, // cookie expiration time in milliseconds
            sameSite: 'none', // to prevent CSRF attacks
        }
    );
};

export const getRefreshTokenEntryFromDb = async (
    walletAddress: string
): Promise<RefreshTokenEntity | null> => {
    const refreshTokenRepository = await dataSource.getRepository(
        RefreshTokenEntity
    );
    return refreshTokenRepository.findOne({
        where: { owner: { walletAddress: walletAddress } },
        relations: ['owner'],
    });
};

export const removeRefreshTokenFromDb = async (refreshToken: string) => {
    // Get the refresh token from the database
    const refreshTokenRepository = await dataSource.getRepository(
        RefreshTokenEntity
    );

    // Delete the refresh token from the database
    await refreshTokenRepository.delete({ token: refreshToken });
};
