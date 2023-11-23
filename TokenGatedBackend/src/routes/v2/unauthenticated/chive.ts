import { NextFunction, Request, Response, Router } from 'express';
import { Magic } from '@magic-sdk/admin';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import { ChiveBarsEntity } from '../../../entity';

export const chiveRoute = Router();
/*
chiveRoute.post(
    '/Chive/VbarsMint',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { didToken } = req.body;
            if (!didToken)
                return res.status(400).send('Include didToken in body');
            let magic = new Magic(process.env.MAGIC_SECRET_KEY!);
            const metadata = await magic.users.getMetadataByToken(didToken);
            const email = metadata.email;
            if (!email)
                return res.status(400).send('No email found in metadata');
            //check if email is in the Chive Bars Table
            const chiveBarClaim = await dataSource
                .getRepository(ChiveBarsEntity)
                .findOne({
                    where: { email: email },
                });
            if (!chiveBarClaim)
                return res
                    .status(400)
                    .send(`This email is not whitelisted for claim`);
            if (chiveBarClaim.qtyRemaining === 0)
                return res
                    .status(400)
                    .send(`You don't have any Chive Bars remaining to claim`);
            let mintId = await hypermintMint(
                process.env.CHIVE_VBARS_CONTRACT_ID!,
                {
                    address: metadata.publicAddress,
                    tokens: [
                        {
                            id: 0,
                            amount: chiveBarClaim.qtyRemaining,
                        },
                    ],
                }
            );
            res.json({ mintId });
        } catch (e) {
            res.sendStatus(500);
        }
    }
);
*/

chiveRoute.post(
    '/Chive/coins',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const vBar =
                (await dataSource
                    .getRepository(ChiveBarsEntity)
                    .createQueryBuilder('ChiveBars')
                    .where('ChiveBars.type = :type', { type: 'VBars' })
                    .getMany()) || [];
            const crown =
                (await dataSource
                    .getRepository(ChiveBarsEntity)
                    .createQueryBuilder('ChiveBars')
                    .where('ChiveBars.type = :type', { type: 'Crowns' })
                    .getMany()) || [];
            if (dataSource.isInitialized) await dataSource.destroy();
            res.json({ vBar, crown });
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
);
