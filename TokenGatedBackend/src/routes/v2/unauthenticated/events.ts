import { NextFunction, Request, Response, Router } from 'express';
import { add, archive, getAll, getOne, remove } from '../../../scripts/manager';
import { EventEntity } from '../../../entity';
import {
    AddEventRequest,
    ArchiveEventRequest,
    DeleteEventRequest,
    EventRequest,
    UpdateEventRequest,
} from '../../../definitions/Event';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';

export const eventRoute = Router();
eventRoute.post(
    '/Event/GetAll',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const events = (await getAll(EventEntity)) as Array<EventEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(events);
        } catch (error: any) {
            next(error.message);
        }
    }
);

eventRoute.post(
    '/Event/GetOne',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: EventRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const event = (await getOne(EventEntity, eventId)) as EventEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(event);
        } catch (error: any) {
            next(error.message);
        }
    }
);

eventRoute.post(
    '/Event/Add',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { event }: AddEventRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await add(EventEntity, event);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

eventRoute.patch(
    '/Event/Update',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { event }: UpdateEventRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await add(EventEntity, event);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

eventRoute.patch(
    '/Event/Archive',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: ArchiveEventRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await archive(EventEntity, eventId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

eventRoute.delete(
    '/Event/Remove',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId }: DeleteEventRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await remove(EventEntity, eventId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
