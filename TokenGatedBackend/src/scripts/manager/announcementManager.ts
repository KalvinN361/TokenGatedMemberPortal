import { AnnouncementEntity } from '../../entity';
import { dataSource } from '../utilities/database';

export const getAllAnnouncements = async () => {
    return await dataSource
        .createQueryBuilder(AnnouncementEntity, 'a')
        .where('now() < a.endDate and now() > startDate')
        .getMany();
};

export const getOneAnnouncement = async (id: string) => {
    return await dataSource
        .createQueryBuilder(AnnouncementEntity, 'a')
        .where('a.id = (:id) AND now() < a.endDate and now() > startDate', {
            id: id,
        })
        .getOne();
};

export const getAllAnnouncementsByType = async (type: string) => {
    return await dataSource
        .createQueryBuilder(AnnouncementEntity, 'a')
        .where('a.type = (:type) AND now() < a.endDate and now() > startDate', {
            type: type,
        })
        .getMany();
};