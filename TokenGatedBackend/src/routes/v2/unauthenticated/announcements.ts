import { NextFunction, Request, Response, Router } from 'express';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import {
    getAllAnnouncements,
    getAllAnnouncementsByType,
    getOneAnnouncement,
} from '../../../scripts/manager';
import { AnnouncementEntity } from '../../../entity';

export const announcementRoute = Router();

announcementRoute.get(
    '/Announcements/GetAll',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const announcements =
                (await getAllAnnouncements()) as Array<AnnouncementEntity>;
            await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: announcements.length,
                announcements: announcements,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

announcementRoute.get(
    '/Announcements/GetOne/Announcement/:announcementId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { announcementId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const announcement = (await getOneAnnouncement(
                announcementId
            )) as AnnouncementEntity;
            await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                announcement: announcement,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

announcementRoute.get(
    '/Announcements/GetAll/Type/:type',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { type } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const announcements = await getAllAnnouncementsByType(type);
            await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: announcements.length,
                announcements: announcements,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
