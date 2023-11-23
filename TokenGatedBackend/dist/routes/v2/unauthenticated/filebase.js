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
exports.filebaseRoute = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const express_1 = require("express");
const filebaseManager_1 = require("../../../scripts/manager/filebaseManager");
const baseURL = 'https://s3.filebase.com';
const access_key = process.env.FILEBASE_ACCESS_KEY;
const secret_key = process.env.FILEBASE_SECRET_KEY;
const s3 = new client_s3_1.S3({
    region: 'us-east-1',
    endpoint: baseURL,
    credentials: {
        accessKeyId: access_key,
        secretAccessKey: secret_key,
    },
});
exports.filebaseRoute = (0, express_1.Router)();
exports.filebaseRoute.get('/Filebase/CreateBucket/:bucketName', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketName } = req.params;
    try {
        const params = {
            Bucket: bucketName,
        };
        s3.createBucket(params, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            }
            else {
                console.log(data);
                res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: data,
                });
            }
        });
    }
    catch (error) {
        next(error.message);
    }
}));
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
exports.filebaseRoute.post('/Filebase/DeleteFolder/:bucketName/:folderName', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketName, folderName } = req.params;
    try {
        s3.deleteObject({ Bucket: bucketName, Key: folderName }, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            }
            else {
                console.log(data);
                res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: data,
                });
            }
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.filebaseRoute.post('/Filebase/UploadFolder/:bucketName/:folderName', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketName, folderName } = req.params;
    const metadataDir = `${process.cwd()}/temp/metadata`;
    try {
        const fileList = yield (0, filebaseManager_1.getFileList)(metadataDir);
        console.log(fileList);
        res.status(200).json({ fileList });
    }
    catch (error) {
        next(error.message);
    }
}));
