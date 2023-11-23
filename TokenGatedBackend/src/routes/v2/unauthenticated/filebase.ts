import { S3 } from '@aws-sdk/client-s3';
import ipfsCar from 'ipfs-car';
import { Request, Response, NextFunction, Router } from 'express';
import { getFileList } from '../../../scripts/manager/filebaseManager';

const baseURL = 'https://s3.filebase.com';
const access_key = process.env.FILEBASE_ACCESS_KEY as string;
const secret_key = process.env.FILEBASE_SECRET_KEY as string;

const s3 = new S3({
    region: 'us-east-1',
    endpoint: baseURL,
    credentials: {
        accessKeyId: access_key,
        secretAccessKey: secret_key,
    },
});

export const filebaseRoute = Router();

filebaseRoute.get(
    '/Filebase/CreateBucket/:bucketName',
    async (req: Request, res: Response, next: NextFunction) => {
        const { bucketName } = req.params;

        try {
            const params = {
                Bucket: bucketName,
            };
            s3.createBucket(params, (err: any, data: any) => {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    console.log(data);
                    res.status(200).json({
                        status: 'success',
                        code: 200,
                        message: data,
                    });
                }
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

/*filebaseRoute.post(
    '/Filebase/UploadFolder/:bucketName/:folderName',
    async (req: Request, res: Response, next: NextFunction) => {
        const { bucketName, folderName } = req.params;

        try {
            const params = {
                Bucket: bucketName,
                Key: folderName,
                ContentType: 'application/x-directory',
                Body: `${process.cwd()}/temp/${folderName}.car`,
                ACL: 'public-read',
            };
            s3.putObject(params, (err: any, data: any) => {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    console.log(data);
                    res.status(200).json({
                        status: 'success',
                        code: 200,
                        message: data,
                    });
                }
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);*/

filebaseRoute.post(
    '/Filebase/DeleteFolder/:bucketName/:folderName',
    async (req: Request, res: Response, next: NextFunction) => {
        const { bucketName, folderName } = req.params;
        try {
            s3.deleteObject(
                { Bucket: bucketName, Key: folderName },
                (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                    } else {
                        console.log(data);
                        res.status(200).json({
                            status: 'success',
                            code: 200,
                            message: data,
                        });
                    }
                }
            );
        } catch (error: any) {
            next(error.message);
        }
    }
);

filebaseRoute.post(
    '/Filebase/UploadFolder/:bucketName/:folderName',
    async (req: Request, res: Response, next: NextFunction) => {
        const { bucketName, folderName } = req.params;
        const metadataDir = `${process.cwd()}/temp/metadata`;
        try {
            const fileList = await getFileList(metadataDir);
            console.log(fileList);

            res.status(200).json({ fileList });
        } catch (error: any) {
            next(error.message);
        }
    }
);
