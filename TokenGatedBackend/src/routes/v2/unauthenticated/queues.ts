import { NextFunction, Request, Response, Router } from 'express';
import {
    getAll,
    getOne,
    remove,
    update,
    getOwnerByWalletAddress,
    getPrizeCount,
} from '../../../scripts/manager';
import { OwnerEntity, PrizeEntity, QueueEntity } from '../../../entity';
import {
    AddToQueueRequest,
    CurrentPositionRequest,
    BaseEventQueueRequest,
    DeleteQueueRequest,
    MoveToEndRequest,
    NextInQueueRequest,
    QueueCountRequest,
    QueueRequest,
    UpdateQueueRequest,
    RemoveQueueHoldRequest,
    RemoveFailedHoldRequest,
    RemoveHoldQueueRequest,
} from '../../../definitions/Queue';
import {
    addToQueue,
    getAllByEventId,
    getNextInQueue,
    moveToEnd,
    queueCount,
    currentPositionQueue,
    removeHoldQueue,
    removeFailedHoldQueue,
    remoteTimeHoldQueue,
    updateQueueSpinStatus,
    currentPositionTransactionTypeQueue,
} from '../../../scripts/manager/queueManager';
import { queue } from 'sharp';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';

export const queueRoute = Router();

queueRoute.post(
    '/Queue/GetAll',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const queues = (await getAll(QueueEntity)) as Array<QueueEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(queues);
        } catch (error: any) {
            next(error.message);
        }
    }
);
queueRoute.post(
    '/Queue/GetAllByEvent',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: BaseEventQueueRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const queues = await getAllByEventId(eventId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(queues);
        } catch (error: any) {
            next(error.message);
        }
    }
);
queueRoute.post(
    '/Queue/GetOne',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { queueId }: QueueRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const queue = (await getOne(QueueEntity, queueId)) as QueueEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(queue);
        } catch (error: any) {
            next(error.message);
        }
    }
);

queueRoute.post(
    '/Queue/AddToQueue',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            eventId,
            walletAddress,
            quantity,
            transactionType,
        }: AddToQueueRequest = req.body;
        // console.log(walletAddress, 'walletAddress');
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const owner = (await getOwnerByWalletAddress(
                walletAddress
            )) as OwnerEntity;
            const newQueue = await addToQueue(
                eventId,
                owner.id,
                quantity,
                transactionType
            );
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(newQueue);
        } catch (error: any) {
            next(error.message);
        }
    }
);

queueRoute.post(
    '/Queue/RemoveHold',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId, walletAddress, quantity }: RemoveQueueHoldRequest =
            req.body;
        try {
            await dataSource.initialize();
            const owner = (await getOwnerByWalletAddress(
                walletAddress
            )) as OwnerEntity;
            const newQueue = await removeHoldQueue(eventId, owner.id, quantity);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(newQueue);
        } catch (error: any) {
            next(error.message);
        }
    }
);
// HERE this removes the items in the queue that are on hold for more than 2 minutes
queueRoute.post(
    '/Queue/RemoveHoldQueue',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: RemoveHoldQueueRequest = req.body;
        try {
            await dataSource.initialize();
            const newQueue = await remoteTimeHoldQueue(eventId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(newQueue);
        } catch (error: any) {
            next(error.message);
        }
    }
);
// HERE this removes the items in the queue when they payment from stripe fails

queueRoute.post(
    '/Queue/RemoveFailedHoldQueue',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId, walletAddress, quantity }: RemoveFailedHoldRequest =
            req.body;
        try {
            await dataSource.initialize();
            const newQueue = await removeFailedHoldQueue(
                eventId,
                walletAddress,
                quantity
            );
            await dataSource.destroy();
            res.status(200).json(newQueue);
        } catch (error: any) {
            next(error.message);
        }
    }
);
queueRoute.post(
    '/Queue/StopQueue',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: BaseEventQueueRequest = req.body;
        try {
            await dataSource.initialize();
            const queues = await getAllByEventId(eventId);
            const prizes = (await getAll(PrizeEntity)) as PrizeEntity[];
            let numberOfPrizesLeft = prizes.length - queues.length;
            await dataSource.destroy();
            if (queues.length >= prizes.length) {
                res.status(204).json({ message: 'Queue is full' });
            } else {
                res.status(200).json({
                    message: 'Queue is not full',
                    remainingPrizes: numberOfPrizesLeft,
                });
            }
        } catch (error: any) {
            next(error.message);
        }
    }
);

queueRoute.post(
    '/Queue/CurrentPosition',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId, walletAddress }: CurrentPositionRequest = req.body;
        // console.log(walletAddress, 'walletAddress');
        try {
            await dataSource.initialize();
            const owner = (await getOwnerByWalletAddress(
                walletAddress
            )) as OwnerEntity;
            if (!owner) return res.status(404).json({ message: 'Not Found' });
            const currentPosition = await currentPositionQueue(
                eventId,
                owner.id
            );
            await dataSource.destroy();
            res.status(200).json(currentPosition);
        } catch (error: any) {
            next(error.message);
        }
    }
);
queueRoute.post(
    '/Queue/GetPositionTransactionType',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId, walletAddress }: CurrentPositionRequest = req.body;
        try {
            await dataSource.initialize();
            const owner = (await getOwnerByWalletAddress(
                walletAddress
            )) as OwnerEntity;
            if (!owner) return res.status(404).json({ message: 'Not Found' });
            const currentPositionTransactionType =
                await currentPositionTransactionTypeQueue(eventId, owner.id);
            await dataSource.destroy();
            res.status(200).json(currentPositionTransactionType);
        } catch (error: any) {
            next(error.message);
        }
    }
);
queueRoute.post(
    '/Queue/GetEventCount',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: QueueCountRequest = req.body;

        try {
            await dataSource.initialize();
            let count = await queueCount(eventId);
            await dataSource.destroy();
            res.status(200).json(count);
        } catch (error: any) {
            next(error.message);
        }
    }
);

queueRoute.post(
    '/Queue/NextInQueue',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: NextInQueueRequest = req.body;
        try {
            await dataSource.initialize();
            const nextInQueue = await getNextInQueue(eventId);
            await dataSource.destroy();
            res.status(200).json(nextInQueue);
        } catch (error: any) {
            next(error.message);
        }
    }
);

queueRoute.post(
    '/Queue/CheckSpinStatus',
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId } = req.body;
        try {
            await dataSource.initialize();
            const queues = await getAllByEventId(eventId);
            // loop through the queues and check for position 1. if position 1 then return the status
            const positionOne = queues.filter((queue) => queue.position === 1);
            await dataSource.destroy();
            if (positionOne.length > 0) {
                res.status(200).json(positionOne[0].status);
            }
        } catch (error: any) {
            next(error.message);
        }
    }
);

queueRoute.post(
    '/Queue/StatusSpin',
    async (req: Request, res: Response, next: NextFunction) => {
        const { status, eventId, position } = req.body;
        try {
            await dataSource.initialize();
            // const updateSpinStatus = await update(QueueEntity, eventId);
            const updateSpinStatus = await updateQueueSpinStatus(
                eventId,
                position,
                status
            );
            await dataSource.destroy();
            res.status(200).json(updateSpinStatus);
        } catch (error: any) {
            next(error.message);
        }
    }
);

queueRoute.post(
    '/Queue/MoveToEnd',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: MoveToEndRequest = req.body;
        try {
            await dataSource.initialize();
            await moveToEnd(eventId);
            await dataSource.destroy();
            res.status(200).json({
                message:
                    'Your minute has passed to spin. You have been moved to end of queue',
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

queueRoute.patch(
    '/Queue/Update',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { queueId }: UpdateQueueRequest = req.body;
        try {
            await dataSource.initialize();
            const newQueue = await update(QueueEntity, queueId);
            await dataSource.destroy();
            res.status(200).json(newQueue);
        } catch (error: any) {
            next(error.message);
        }
    }
);

queueRoute.delete(
    '/Queue/Remove',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { queueId }: DeleteQueueRequest = req.body;
        try {
            await dataSource.initialize();
            const newQueue = await remove(QueueEntity, queueId);
            await dataSource.destroy();
            res.status(200).json(newQueue);
        } catch (error: any) {
            next(error.message);
        }
    }
);
//HERE we need to add a list of winnable prizes with a column called claimed... If Claimed !== true then return the prize
//HERE we need to also add a function to set the prize to claimed in addition to setting the wallet of the user who claimed the prize
