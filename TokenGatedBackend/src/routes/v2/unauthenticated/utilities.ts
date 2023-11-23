import { NextFunction, Request, Response, Router } from 'express';
import * as dotenv from 'dotenv';
import fs from 'fs';
import sharp from 'sharp';
import { downloadImage } from '../../../scripts/utilities';

export const utilitiesRoute = Router();
dotenv.config();

utilitiesRoute.post(
    '/Image/Download',
    async (req: Request, res: Response, next: NextFunction) => {
        const { imgUrl } = req.body;
    }
);

utilitiesRoute.post(
    '/Image/HueRotate',
    async (req: Request, res: Response, next: NextFunction) => {
        const { imgUrl } = req.body;
        const maxDegrees = 360;
        const degrees = 20;
        const tempDir = `${process.cwd()}/temp`;

        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const image = await downloadImage(imgUrl);
        const imageBuffer = Buffer.from(image);
        const imageFileName = `${tempDir}/original.png`;
        fs.writeFileSync(imageFileName, imageBuffer);

        for (let i = 0; i < maxDegrees; i += degrees) {
            await sharp(imageFileName)
                .modulate({ hue: i })
                .png({ quality: 100 })
                .toFile(`${tempDir}/${i / degrees + 1}`);
        }
        res.status(200).json({ status: 'Success', code: 200, message: 'done' });
    }
);
