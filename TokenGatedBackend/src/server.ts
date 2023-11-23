import express, { Application } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { v2routes } from './routes/v2';
import { dataSource } from './scripts/utilities/database';

dotenv.config();

const server: Application = express();
const PORT: string | number = process.env.PORT || 5000;
//export let dataSource: DataSource;

const corsAccessList = [
    'http://localhost:3000',
    'http://localhost:3001/v2',
    'https://devmembers.billmurray1000.com',
    'https://membertest.billmurray1000.com',
    'https://members.billmurray1000.com',
    'https://members-billmurray1000.webflow.io',
    'https://vendabill-snzjakgcva-uc.a.run.app',
    'https://vendabill.billmurray1000.com',
    'https://a.theforever.com',
];

const corsOptions = {
    origin: (origin: any, callback: any) => {
        if (corsAccessList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

server.use(express.json({ type: '*/*' }));
server.use(express.urlencoded({ extended: false }));
server.use(cors(corsOptions));
server.use(cookieParser());
server.use(morgan('dev'));

/*server.use(async (req, res, next) => {
    res.on('close', async function () {
        if (dataSource.isInitialized) await dataSource.destroy();
    });
    next();
});*/

server.use('/v2', v2routes);

const ignorePaths: Array<string> = [
    '/Owner/UpdateOwnerData',
    //'/Asset/UpgradeBill3DFrame',
    //'/Asset/GetAllBurnablesByWalletAddress',
    '/Asset/ResizeSmallByContract',
];

server.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT} ${process.env.NODE_ENV}`);
});
