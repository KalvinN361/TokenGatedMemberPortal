import crypto, { randomUUID } from 'crypto';
import { dataSource } from './database';
import { AssetEntity, OwnerEntity } from '../../entity';
import axios from 'axios';
import { AccessListEntity } from '../../entity';
import sharp from 'sharp';
import fs from 'fs';
import { getOwnerByWalletAddress } from '../manager';
import { AlchemyProvider, ethers } from 'ethers';

const SIGNATURE_VALID_FOR = 30;

interface gsig {
    secretKey: string; // your secret key e.g. sk_test_6CDFl9eVtnRpiJsKu6tHD3jye9AW2u
    uri: string; // do not include your base URL
    method: string; // HTTP request method in upper case
    timestamp: number; // timestamp is a number
    body?: string;
}

const getTimestamp = (): number => {
    return Math.round(new Date().getTime() / 1000);
};

const validateTimestamp = (timestamp: number): boolean => {
    return getTimestamp() - timestamp <= SIGNATURE_VALID_FOR;
};

const generateSignature = (a: gsig): string => {
    // order has to be the same
    let payload = `${a.method};${a.uri};${a.timestamp}`;
    if (a.body) {
        payload += `;${a.body}`;
    }
    return crypto
        .createHmac('sha256', a.secretKey)
        .update(payload)
        .digest('hex');
};

export const verifySignature = (
    signature: string,
    secretKey: string,
    uri: string,
    method: string,
    timestamp: number,
    body?: string
): boolean => {
    const generatedSignature = generateSignature({
        secretKey,
        uri,
        method,
        timestamp,
        body,
    });

    if (
        !crypto.timingSafeEqual(
            Buffer.from(generatedSignature, 'hex'),
            Buffer.from(signature, 'hex')
        )
    ) {
        return false;
    }

    return validateTimestamp(timestamp);
};

export const checkOriginFrom = (origin?: string) => {
    if (!origin) {
        return 'BillMurray1000';
    } else if (origin.toLowerCase().indexOf('billmurray1000') > -1)
        return 'BillMurray1000';
    else if (origin.toLowerCase().indexOf('earthlightfoundation') > -1)
        return 'ELF';
    else if (origin.toLowerCase().indexOf('forever') > -1) return 'TheForever';
    else if (origin.toLowerCase().indexOf('projectvenkman') > -1)
        return 'ProjectVenkman';
    else return 'BillMurray1000';
};

export const getUpdateData = async (
    walletAddress: string | Array<string> | undefined
) => {
    if (typeof walletAddress !== 'string')
        return {
            createdBy: randomUUID(),
            updatedBy: randomUUID(),
        };
    const owner = (await getOwnerByWalletAddress(walletAddress)) as OwnerEntity;
    return {
        createdBy: owner.id,
        updatedBy: owner.id,
    };
};

export async function addUserToAccessList(contractId: string, address: string) {
    const accessListId = await dataSource
        .getRepository(AccessListEntity)
        .createQueryBuilder('AccessList')
        .where('AccessList.contractId = (:contractId)', {
            contractId: contractId,
        })
        .getOne()
        .then((res) => {
            return res?.accessListId;
        });

    if (accessListId) {
        await axios.put(
            `https://api.hypermint.com/v1/access-list/${accessListId}/addresses`,
            {
                addresses: [
                    {
                        address: address,
                    },
                ],
            },
            {
                headers: {
                    HM_ACCESS_KEY: process.env.HM_ACCESS_KEY!,
                    HM_ACCESS_KEY_SECRET: process.env.HM_ACCESS_KEY_SECRET!,
                },
            }
        );
    }
}

export async function checkIfSpooferRole(address: string) {
    const spoofer = (await dataSource
        .getRepository(OwnerEntity)
        .createQueryBuilder('Owner')
        .where(
            'Owner.walletAddress = (:walletAddress) AND Owner.role = (:role)',
            {
                walletAddress: address,
                role: 'spoofer',
            }
        )
        .getOne()) as OwnerEntity;
    return Boolean(spoofer);
}

export const downloadImage = async (image: any) => {
    console.log(
        `PV::${new Date().toISOString()}::Downloading image... ` + image
    );
    return await axios
        .get(image, {
            responseType: 'arraybuffer',
            onDownloadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    process.stdout.write(`Downloading... ${percentCompleted}%`);
                }
            },
        })
        .then((response) => {
            return response.data;
        });
};

export const getNewFrameColor = (frame: string) => {
    console.log(
        `PV::${new Date().toISOString()}::Getting new frame color... ` + frame
    );
    switch (frame) {
        case 'Black':
            return 'SILVER';
        case 'Silver':
            return 'GOLD';
        case 'Gold':
            return null;
        default:
            return 'BLACK';
    }
};

export const getHandEmbellishment = (handEmbellishment: string) => {
    console.log(
        `PV::${new Date().toISOString()}::Getting hand embellishment... `
    );
    switch (handEmbellishment) {
        case 'Clown Nose':
            return 'CLOWN';
        case 'Helmet':
            return 'EVEL';
        case 'Reversed':
            return 'FLIPPED';
        case 'Invisible':
            return null;
        default:
            return null;
    }
};

export const resizeAssetImageSmall = async (
    asset: AssetEntity,
    bucketName: string
) => {
    const tempDir = `${process.cwd()}/temp`;
    const imageFileName = `${tempDir}/${asset?.tokenId}-tmp.png`;
    const imageSmallFileName = `${tempDir}/${asset?.tokenId}.png`;
    const destination = `${asset.contractId}/${asset?.tokenId}.png`;

    const image = await downloadImage(asset.image);
    const imageBuffer = Buffer.from(image);
    fs.writeFileSync(imageFileName, imageBuffer);

    await sharp(imageFileName)
        .metadata()
        .then(({ width }) => {
            sharp(imageFileName)
                .resize(Math.round(width! * 0.25))
                .png({ compressionLevel: 1, quality: 100 })
                .toFile(imageSmallFileName);
        });
    await uploadToGCP(imageSmallFileName, destination, bucketName);
    fs.unlinkSync(imageFileName);
    //fs.unlinkSync(imageSmallFileName);
};

export const merge3DImages = async (asset: AssetEntity, glassImage: string) => {
    const tempDir = `${process.cwd()}/temp`;
    let composite = [];

    console.log(
        `PV::${new Date().toISOString()}::Downloading asset image... ` +
            asset.image
    );
    const image = await downloadImage(asset.image);
    const imageBuffer = Buffer.from(image);
    const imageFileName = `${tempDir}/${asset?.tokenId}.png`;
    fs.writeFileSync(imageFileName, imageBuffer);
    composite.push({ input: imageFileName });

    console.log(
        `PV::${new Date().toISOString()}::Downloading glasses image... ` +
            glassImage
    );
    const glasses = await downloadImage(glassImage);
    const glassesBuffer = Buffer.from(glasses);
    const glassesFileName = `${tempDir}/${asset?.tokenId}-glasses.png`;
    fs.writeFileSync(glassesFileName, glassesBuffer);
    composite.push({ input: glassesFileName });

    console.log(`PV::${new Date().toISOString()}::Merging images... `);
    const tempImageName = `${tempDir}/${asset?.tokenId}-temp.png`;
    try {
        console.log({ composite });
        await sharp(imageFileName)
            .composite(composite)
            .png({ compressionLevel: 9, quality: 50 })
            .toFile(tempImageName);
    } catch (error: any) {
        console.log(error.message);
    }

    console.log(
        `PV::${new Date().toISOString()}::Merged image... ` + tempImageName
    );
    //fs.unlinkSync(imageFileName);
    //fs.unlinkSync(glassesFileName);
    return tempImageName;
};

export const uploadToGCP = async (
    sourceFilePath: string,
    destinationFileName: string,
    bucketName: string
) => {
    console.log(
        `PV::${new Date().toISOString()}::${sourceFilePath} uploading to ${bucketName}/${destinationFileName}...`
    );
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage({
        keyFilename: `${process.cwd()}/secrets/pv-storage.json`,
    });
    const uploadOptions = {
        destination: destinationFileName,
        ifGenerationMatch: 'None',
    };
    try {
        await storage.bucket(bucketName).upload(sourceFilePath, uploadOptions);
    } catch (error: any) {
        console.log(error.message);
    }
    console.log(
        `PV::${new Date().toISOString()}::${sourceFilePath} uploaded to ${bucketName}`
    );
    return `https://storage.googleapis.com/${bucketName}/${destinationFileName}`;
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const buildBMAssetJSON = (asset: AssetEntity) => {
    console.log(`PV::${new Date().toISOString()}::Building BM Asset JSON... `);
    return {
        name: asset.name,
        description: asset.description,
        image: asset.image,
        animation_url: asset.animation,
        attributes: buildBMAttributes(asset.attributes),
    };
};

export const buildBMAttributes = (attributes: any) => {
    console.log(`PV::${new Date().toISOString()}::Building BM Attributes... `);
    const bmAttributes: any[] = [];
    attributes.forEach((attribute: any) => {
        bmAttributes.push({
            trait_type: attribute.traitType,
            value: attribute.value,
        });
    });
    return bmAttributes;
};

export const toTitleCase = (text: string) => {
    return text.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
};

export const getAlchemyProvider = (chain: number) => {
    let apiKey = '';
    let network = '';
    switch (chain) {
        case 5:
            apiKey = process.env.ALCHEMY_GOERLI_KEY as string;
            network = 'goerli';
            break;
        case 137:
            apiKey = process.env.ALCHEMY_POLYGON_KEY as string;
            network = 'matic';
            break;
        case 80001:
            apiKey = process.env.ALCHEMY_MUMBAI_KEY as string;
            network = 'matic-mumbai';
            break;
        case 11155111:
            apiKey = process.env.ALCHEMY_SEPOLIA_KEY as string;
            network = 'sepolia';
            break;
        default:
            apiKey = process.env.ALCHEMY_MAINNET_KEY as string;
            network = 'homestead';
    }
    return new AlchemyProvider(network, apiKey);
};

export const getOpenSeaChain = (chain: number) => {
    switch (chain) {
        case 5:
            return 'goerli';
        case 137:
            return 'matic';
        case 80001:
            return 'mumbai';
        default:
            return 'ethereum';
    }
};

export const getWalletKey = (symbol: string) => {
    switch (symbol) {
        case 'BMOE':
            return process.env.BMOE_WALLET_PRIVATE_KEY as string;
        case 'STD2-TEST':
            return process.env.JTN_WALLET_PRIVATE_KEY as string;
        default:
            return null;
    }
};
