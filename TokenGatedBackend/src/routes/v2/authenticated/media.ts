import { NextFunction, Request, Response, Router } from 'express';
import { AssetEntity, MediaEntity } from '../../../entity';
import { getUpdateData } from '../../../scripts/utilities';
import {
    add,
    archive,
    getAll,
    getAssetsByIds,
    getOne,
    remove,
    update,
} from '../../../scripts/manager';
import {
    AddMediaRequest,
    ArchiveMediaRequest,
    DeleteMediaRequest,
    UpdateMediaRequest,
} from '../../../definitions';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import {
    getMediaForAsset,
    getMediaForAssetAndType,
} from '../../../scripts/utilities/media';

export const mediaRoute = Router();

/* GET users listing. */
mediaRoute.post(
    '/Media/GetAll',
    setDataSource,
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const media = (await getAll(MediaEntity)) as Array<MediaEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: media.length,
                media: media,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

mediaRoute.post(
    '/Media/GetAll/AssetByIds',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { assetIds } = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let mediaArray: Array<MediaEntity> = [];
            //const asset = (await getOne(AssetEntity, assetId)) as AssetEntity;
            const assets = (await getAssetsByIds(
                assetIds
            )) as Array<AssetEntity>;

            for (const asset of assets) {
                const assetMedia = (await getMediaForAsset(
                    asset
                )) as Array<MediaEntity>;
                mediaArray = [...mediaArray, ...assetMedia];
            }

            let unique = [
                ...new Map(
                    mediaArray.map((media) => [media['id'], media])
                ).values(),
            ];
            if (dataSource.isInitialized) await dataSource.destroy();

            res.status(200).json({
                status: 'success',
                code: 200,
                count: unique.length,
                media: unique,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

mediaRoute.post(
    '/Media/GetAll/AssetByIds/Type/:type',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { assetIds } = req.body;
        const { type } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let mediaArray: Array<MediaEntity> = [];
            //const asset = (await getOne(AssetEntity, assetId)) as AssetEntity;
            const assets = (await getAssetsByIds(
                assetIds
            )) as Array<AssetEntity>;

            for (const asset of assets) {
                const assetMedia = (
                    (await getMediaForAssetAndType(
                        asset,
                        type
                    )) as Array<MediaEntity>
                ).filter((m) => m.type === type);
                mediaArray = [...mediaArray, ...assetMedia];
            }

            let unique = [
                ...new Map(
                    mediaArray.map((media) => [media['id'], media])
                ).values(),
            ];
            if (dataSource.isInitialized) await dataSource.destroy();

            res.status(200).json({
                status: 'success',
                code: 200,
                count: unique.length,
                media: unique,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

mediaRoute.get(
    '/Media/GetAll/Category/:categories',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { categories } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const categoryList = categories
                ?.toString()
                .split(',') as Array<string>;
            const media = (await getAll(MediaEntity)) as Array<MediaEntity>;
            const filteredMedia = media.filter((m) =>
                categoryList.includes(m.category)
            );
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: filteredMedia.length,
                media: filteredMedia,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

mediaRoute.get(
    '/Media/GetOne/:id',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const media = await getOne(MediaEntity, id);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                media: media,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
mediaRoute.post(
    '/Media/Add',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { media }: AddMediaRequest = req.body;
        const { ...createData } = await getUpdateData(
            req.headers['walletaddress']
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await add(MediaEntity, { ...media, ...createData });
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(201).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

mediaRoute.patch(
    '/Media/Update',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { media }: UpdateMediaRequest = req.body;
        const { createdBy: omitted, ...updateData } = await getUpdateData(
            req.headers['walletaddress']
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await update(MediaEntity, {
                ...media,
                ...updateData,
            });
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

mediaRoute.patch(
    '/Media/Archive',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { mediaId }: ArchiveMediaRequest = req.body;
        const { createdBy: omitted, ...updateData } = await getUpdateData(
            req.headers['walletaddress']
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await archive(MediaEntity, mediaId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

mediaRoute.delete(
    '/Media/Delete',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { mediaId }: DeleteMediaRequest = req.body;

        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await remove(MediaEntity, mediaId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
