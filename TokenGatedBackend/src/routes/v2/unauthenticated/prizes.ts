import { NextFunction, Request, Response, Router } from 'express';
import {
    add,
    archive,
    getAll,
    getOne,
    remove,
    update,
    claimHoldTransfer,
    getPrizeCount,
    getOwnerByWalletAddress,
    remoteTimeHoldPrize,
    removeHoldPrize,
    addHoldPrize,
    claimTransfer,
} from '../../../scripts/manager';
import { OwnerEntity, PrizeEntity } from '../../../entity';
import {
    AddPrizeRequest,
    ArchivePrizeRequest,
    DeletePrizeRequest,
    PrizeCountRequest,
    PrizeRequest,
    UpdatePrizeRequest,
    GetAllUnclaimedByEventRequest,
    ClaimPrizeRequest,
    ClaimPrizeWalletRequest,
    RemoveHoldPrizeRequest,
} from '../../../definitions/Prize';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import { RemoveQueueHoldRequest } from '../../../definitions/Queue';

export const prizeRoute = Router();

prizeRoute.post(
    '/Prize/GetAll',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const prizes = (await getAll(PrizeEntity)) as Array<PrizeEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(prizes);
        } catch (error: any) {
            next(error.message);
        }
    }
);
prizeRoute.post(
    '/Prize/GetAllUnclaimedByEvent',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: GetAllUnclaimedByEventRequest = req.body;

        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const prizes = (await getAll(PrizeEntity)) as Array<PrizeEntity>;
            // console.log(prizes);
            const filteredPrizes = prizes.filter(
                (prize) =>
                    prize.eventId === eventId && !prize.claimed && !prize.hold
            );
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(filteredPrizes);
        } catch (error: any) {
            next(error.message);
        }
    }
);
prizeRoute.post(
    '/Prize/GetAllClaimedByEvent',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: GetAllUnclaimedByEventRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const prizes = (await getAll(PrizeEntity)) as Array<PrizeEntity>;
            const filteredPrizes = prizes.filter(
                (prize) => prize.eventId === eventId && prize.claimed
            );
            const returnData = [];
            for (const prize of filteredPrizes) {
                const owner = await getOne(OwnerEntity, prize.ownerId);

                const ownerWallet = owner ? owner.walletAddress : null;
                const prizeWithOwnerWallet = { ...prize, ownerWallet };
                returnData.push(prizeWithOwnerWallet);
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(returnData);
        } catch (error: any) {
            next(error.message);
        }
    }
);

prizeRoute.post(
    '/Prize/GetOne',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { prizeId }: PrizeRequest = req.body;

        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const prize = (await getOne(PrizeEntity, prizeId)) as PrizeEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(prize);
        } catch (error: any) {
            next(error.message);
        }
    }
);

prizeRoute.post(
    '/Prize/Add',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { prize }: AddPrizeRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await add(PrizeEntity, prize);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

prizeRoute.patch(
    '/Prize/GetPrizeCount',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: PrizeCountRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const prizeCount = await getPrizeCount(eventId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(prizeCount);
        } catch (error: any) {
            next(error.message);
        }
    }
);

prizeRoute.patch(
    '/Prize/Update',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { prize }: UpdatePrizeRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await update(PrizeEntity, prize);
            await dataSource.destroy();
            res.status(200).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

prizeRoute.patch(
    '/Prize/Archive',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { prizeId }: ArchivePrizeRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await archive(PrizeEntity, prizeId);
            await dataSource.destroy();
            res.status(200).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
prizeRoute.post(
    '/Prize/ClaimTransfer',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const prizes = req.body.prizes as PrizeEntity[];
        const walletAddress = req.body.walletAddress;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const owner = (await getOwnerByWalletAddress(
                walletAddress
            )) as OwnerEntity;
            let ownerId = owner.id;
            const result = await claimTransfer(prizes, ownerId, walletAddress);
            await dataSource.destroy();
            res.status(200).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
prizeRoute.post(
    '/Prize/ClaimHoldTransfer',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const prizes = req.body.prizes as PrizeEntity[];
        const walletAddress = req.body.walletAddress;
        try {
            await dataSource.initialize();
            const owner = (await getOwnerByWalletAddress(
                walletAddress
            )) as OwnerEntity;
            let ownerId = owner.id;
            const result = await claimHoldTransfer(prizes, ownerId);
            await dataSource.destroy();
            res.status(200).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
prizeRoute.post(
    '/Prize/Remove',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        //HERE is the last 6 characters of the Prize Id
        const { prizeId }: DeletePrizeRequest = req.body;
        // console.log(prizeId);
        const prizes = (await getAll(PrizeEntity)) as Array<PrizeEntity>;
        // console.log(prizes);
        const foundPrize = prizes.find(
            (prize) => prize.id.slice(-6) === prizeId
        );
        // console.log(foundPrize);
        try {
            await dataSource.initialize();
            const result = await remove(PrizeEntity, foundPrize!.id);
            await dataSource.destroy();
            res.status(200).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
// HERE this removes the items in the queue that are on hold for more than 2 minutes
prizeRoute.post(
    '/Prize/removeExpiredHold',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: RemoveHoldPrizeRequest = req.body;
        try {
            await dataSource.initialize();
            const newQueue = await remoteTimeHoldPrize(eventId);
            await dataSource.destroy();
            res.status(200).json(newQueue);
        } catch (error: any) {
            next(error.message);
        }
    }
);
prizeRoute.post(
    '/Prize/RemoveHold',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId, walletAddress, quantity }: RemoveQueueHoldRequest =
            req.body;
        try {
            await dataSource.initialize();
            const owner = (await getOwnerByWalletAddress(
                walletAddress
            )) as OwnerEntity;
            const newQueue = await removeHoldPrize(eventId, owner.id, quantity);
            await dataSource.destroy();
            res.status(200).json(newQueue);
        } catch (error: any) {
            next(error.message);
        }
    }
);
prizeRoute.post(
    '/Prize/holdPrize',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const walletAddress = req.body.walletAddress;
        console.log(walletAddress);
        const prizes = req.body.prizes;
        if (!Array.isArray(prizes)) {
            return res
                .status(400)
                .json({ error: 'Expected prizes to be an array.' });
        }
        try {
            await dataSource.initialize();
            const owner = (await getOwnerByWalletAddress(
                walletAddress
            )) as OwnerEntity;

            if (!owner) {
                return res.status(404).json({ error: 'Owner not found.' });
            }
            await addHoldPrize(owner.id, prizes);
            await dataSource.destroy();
            res.status(200).json({ message: 'Prizes held successfully.' });
        } catch (error: any) {
            next(error.message);
        }
    }
);

prizeRoute.post(
    '/Prize/CheckIfPrizeIsAvailable',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const prizeId = req.body.prizeId;
        try {
            await dataSource.initialize();
            // check prizes table and see if the prize with prizeId hold is false. If it is false, then it is available
            const prize = (await getOne(PrizeEntity, prizeId)) as PrizeEntity;
            await dataSource.destroy();
            if (!prize.hold) {
                res.status(200).json({ available: true });
            } else {
                res.status(200).json({ available: false });
            }
        } catch (error: any) {
            next(error.message);
        }
    }
);
