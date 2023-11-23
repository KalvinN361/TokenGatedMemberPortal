import axios from 'axios';
import CryptoJS from 'crypto-js';
import { APIConfigProps } from '@definitions/Base';

export const apiConfig: APIConfigProps = {
    //host: environments[process.env.REACT_APP_DEV as keyof typeof environments].ProtonPack,
    //host: 'https://apiv2.projectvenkman.com/',
    //host: 'https://apitest-snzjakgcva-uc.a.run.app/',
    //host: 'http://localhost:3001/',
    //version: "v1", // add a / to end of string if version is included
    //key: "",
    //secret: "",
    url: process.env.REACT_APP_API_HOST_URL as string,
};

export const POSTAuthenticated = async (
    method: string,
    host: APIConfigProps,
    data?: any
) => {
    let { dts, signature, payload } = generateSignature(method, host, data);
    return await axios.post(
        `${host.url}/${host.version}/${method}`,
        payload,
        generateConfigAuthenticated(dts, signature)
    );
};

export const PATCHAuthenticated = async (
    method: string,
    host: APIConfigProps,
    data?: any
) => {
    let { dts, signature, payload } = generateSignature(method, host, data);
    return await axios.patch(
        `${host.url}/${host.version}/${method}`,
        payload,
        generateConfigAuthenticated(dts, signature)
    );
};

export const GETAuthenticated = async (
    method: string,
    host: APIConfigProps
) => {
    return await axios.get(`${host.url}/${host.version}/${method}`);
};

const generateSignature = (method: string, host: APIConfigProps, data: any) => {
    let dts = new Date().toISOString(); // format yyyy-mm-ddThh:mm:ss.000Z
    //    let payload = data // serialized post data (form fields)
    // if (!data) throw new Error("No data provided");
    let payload = data ? JSON.stringify(data) : '{}'; // serialized post data (form fields)
    let string_to_sign =
        dts +
        ' ' +
        host.host +
        '/' +
        method +
        '/' /*+ host.version*/ +
        ' ' +
        CryptoJS.SHA256(payload).toString(); // create the string to sign
    let hash = CryptoJS.HmacSHA256(string_to_sign, '' /*, host.secret*/);
    let signature = hash.toString();
    return {
        dts: dts,
        signature: signature,
        payload: payload,
    };
};

const generateConfig = (dts: string, signature: string) => {
    return {
        //mode: 'no-cors',
        headers: {
            ...baseHeaders,
            /*"API-key": Kahlil.key,*/
            /*"API-version": Kahlil.version,*/
            /*"API-date": dts,*/
            /*"API-signature": signature*/
        },
    };
};

const generateConfigAuthenticated = (
    dts: string,
    signature: string /*, CompanyUser: CompanyUser, ContractId?: string*/
) => {
    return {
        withCredentials: true,
        headers: {
            // "CompanyId": cu ? cu.companyId as string : "C8494FD1-D34A-461F-A176-B79BB578C17F",
            // "UserId": "00000000-0000-0000-0000-000000000000",
            // "SessionId": cu ? cu.sessionId as string : "",
            // "ContractType": "40000000-0001-0001-0002-000000000001",
            //"ContractType": ContractId ? ContractId : "00000004-0001-0001-0002-000000000002",
            ...baseHeaders,
        },
    };
};

const baseHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
};
