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
exports.sheetsRoute = void 0;
const express_1 = require("express");
const googleapis_1 = require("googleapis");
const entity_1 = require("../../../entity");
const database_1 = require("../../../scripts/utilities/database");
const { GoogleAuth } = require('google-auth-library');
const sheets = googleapis_1.google.sheets('v4');
exports.sheetsRoute = (0, express_1.Router)();
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
exports.sheetsRoute.post('/Sheets/SyncDb', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = new GoogleAuth({
        scopes: SCOPES,
        keyFile: 
        //process.cwd() + '/secrets/project-venkman-dcce19cbcb8d.json',
        process.cwd() + '/secrets/project-venkman-7998c5a47593.json',
    });
    const authToken = yield auth.getClient();
    const allSheets = ['VBars', 'Crowns'];
    for (const sheet of allSheets) {
        console.log({ sheet });
        const options = {
            spreadsheetId: '1qCvb6r50PxTbnHbv4FFnfctGezR5pHnlQZqU9R9Wdcs',
            auth: authToken,
            range: sheet,
        };
        const response = yield sheets.spreadsheets.values.get(options);
        const values = response.data.values;
        if (!values)
            return res.status(400).send('No values found in spreadsheet');
        console.log(values);
        for (let i = 2; i < values.length; i++) {
            const email = values[i][0];
            const quantity = values[i][1];
            console.log({ email, quantity });
            const chiveBarsEntry = new entity_1.ChiveBarsEntity();
            chiveBarsEntry.email = email;
            chiveBarsEntry.qtyRemaining = quantity;
            chiveBarsEntry.type = sheet;
            yield database_1.dataSource
                .getRepository(entity_1.ChiveBarsEntity)
                .save(chiveBarsEntry);
        }
        const clearOptions = {
            spreadsheetId: '1qCvb6r50PxTbnHbv4FFnfctGezR5pHnlQZqU9R9Wdcs',
            auth: authToken,
            range: sheet + '!A3:B',
        };
        yield sheets.spreadsheets.values.clear(clearOptions);
    }
    res.sendStatus(200);
}));
