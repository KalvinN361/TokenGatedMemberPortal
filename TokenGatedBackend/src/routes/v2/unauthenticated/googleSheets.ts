import { NextFunction, Request, Response, Router } from 'express';
import { google } from 'googleapis';
import { ChiveBarsEntity } from '../../../entity';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';

const { GoogleAuth } = require('google-auth-library');

const sheets = google.sheets('v4');

export const sheetsRoute = Router();
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
sheetsRoute.post(
    '/Sheets/SyncDb',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const auth = new GoogleAuth({
            scopes: SCOPES,
            keyFile:
                //process.cwd() + '/secrets/project-venkman-dcce19cbcb8d.json',
                process.cwd() + '/secrets/project-venkman-7998c5a47593.json',
        });
        const authToken = await auth.getClient();
        const allSheets = ['VBars', 'Crowns'];
        for (const sheet of allSheets) {
            console.log({ sheet });
            const options = {
                spreadsheetId: '1qCvb6r50PxTbnHbv4FFnfctGezR5pHnlQZqU9R9Wdcs',
                auth: authToken,
                range: sheet,
            };
            const response = await sheets.spreadsheets.values.get(options);
            const values = response.data.values;
            if (!values)
                return res.status(400).send('No values found in spreadsheet');
            console.log(values);
            for (let i = 2; i < values.length; i++) {
                const email = values[i][0];
                const quantity = values[i][1];
                console.log({ email, quantity });
                const chiveBarsEntry = new ChiveBarsEntity();
                chiveBarsEntry.email = email;
                chiveBarsEntry.qtyRemaining = quantity;
                chiveBarsEntry.type = sheet;
                await dataSource
                    .getRepository(ChiveBarsEntity)
                    .save(chiveBarsEntry);
            }
            const clearOptions = {
                spreadsheetId: '1qCvb6r50PxTbnHbv4FFnfctGezR5pHnlQZqU9R9Wdcs',
                auth: authToken,
                range: sheet + '!A3:B',
            };
            await sheets.spreadsheets.values.clear(clearOptions);
        }
        res.sendStatus(200);
    }
);
