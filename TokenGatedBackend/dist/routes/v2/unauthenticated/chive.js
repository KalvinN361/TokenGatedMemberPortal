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
exports.chiveRoute = void 0;
const express_1 = require("express");
const database_1 = require("../../../scripts/utilities/database");
const entity_1 = require("../../../entity");
exports.chiveRoute = (0, express_1.Router)();
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
exports.chiveRoute.post('/Chive/coins', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const vBar = (yield database_1.dataSource
            .getRepository(entity_1.ChiveBarsEntity)
            .createQueryBuilder('ChiveBars')
            .where('ChiveBars.type = :type', { type: 'VBars' })
            .getMany()) || [];
        const crown = (yield database_1.dataSource
            .getRepository(entity_1.ChiveBarsEntity)
            .createQueryBuilder('ChiveBars')
            .where('ChiveBars.type = :type', { type: 'Crowns' })
            .getMany()) || [];
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.json({ vBar, crown });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}));
