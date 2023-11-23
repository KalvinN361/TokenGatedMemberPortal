import { NextFunction, Request, Response, Router } from 'express';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import {
    getAssetsByContractAndLimit,
    getContractByAddress,
    getOne,
    getOwnerByWalletAddress,
} from '../../../scripts/manager';
import { AssetEntity, ContractEntity, OwnerEntity } from '../../../entity';
import {
    getAlchemyProvider,
    getOpenSeaChain,
    getWalletKey,
} from '../../../scripts/utilities';
import { Contract, Wallet } from 'ethers';
import axios from 'axios';
import { abi721, OpenSeaAbi } from '../../../abi';
import fs from 'fs';
import {
    getNextAvailableToken,
    mintPublicSeaDrop,
    replaceImageHash,
} from '../../../scripts/manager/openseaManager';
import { SafeTransferFrom721PVRequest } from '../../../definitions';
import { blockchainRoute } from './blockchain';
import delay from 'delay';

export const openSeaRoute = Router();
const OpenSeaApi = `https://api.opensea.io/v2/`;
const OpenSeaApiTest = `https://testnets-api.opensea.io/v2/`;

openSeaRoute.post(
    '/OpenSea/MintSeaDrop/Contract/:contractId/WalletAddress/:walletAddress/Amount/:amount',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId, amount } = req.params;
        const tx = await mintPublicSeaDrop(contractId, parseInt(amount));
        res.status(200).json({ tx });
    }
);

openSeaRoute.get(
    '/OpenSea/RefreshMetadata/Contract/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            const { address, chainId } = contract;
            const chain = getOpenSeaChain(chainId);
            const provider = getAlchemyProvider(chainId);
            const bcContract = new Contract(address, contract.abi, provider);
            const totalSupply = Number(
                await bcContract.getFunction('totalSupply')()
            );
            let url =
                chain === 'goerli' || chain === 'mumbai'
                    ? OpenSeaApiTest
                    : OpenSeaApi;

            for (let i = 1; i < totalSupply + 1; i++) {
                let headers: any = {
                    accept: 'application/json',
                };
                if (chain === 'ethereum' || chain === 'matic')
                    headers['X-API-KEY'] = process.env
                        .OPENSEA_API_KEY as string;

                console.log(`Refreshing ${address} ${i}`);
                await axios.post(
                    `${url}chain/${chain}/contract/${address}/nfts/${i}/refresh`,
                    {},
                    { headers: headers }
                );
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                message: `Items for contract ${address} has been queue for refresh`,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

openSeaRoute.get(
    '/OpenSea/RefreshMetadata/Contract/:contractId/Token/:tokenId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId, tokenId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            const { address, chainId } = contract;
            const chain = getOpenSeaChain(chainId);
            let url =
                chain === 'goerli' || chain === 'mumbai'
                    ? OpenSeaApiTest
                    : OpenSeaApi;
            let headers: any = {
                accept: 'application/json',
            };
            if (chain === 'ethereum' || chain === 'matic')
                headers['X-API-KEY'] = process.env.OPENSEA_API_KEY as string;

            console.log(`Refreshing ${address} ${tokenId}`);
            await axios.post(
                `${url}chain/${chain}/contract/${address}/nfts/${tokenId}/refresh`,
                {},
                { headers: headers }
            );
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                message: `token ${tokenId} for contract ${address} has been queue for refresh`,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

openSeaRoute.post(
    '/OpenSea/SetBaseURI/Contract/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        const { baseURI } = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            const { address, chainId, abi } = contract;
            const provider = getAlchemyProvider(chainId);
            const key = getWalletKey(contract.symbol as string) as string;
            const wallet = new Wallet(key, provider);
            const signedContract = new Contract(address, abi, provider).connect(
                wallet
            );
            const tx = await signedContract.getFunction('setBaseURI')(baseURI);
            await dataSource.destroy();
            res.status(200).json({ tx });
        } catch (error: any) {
            next(error.message);
        }
    }
);

openSeaRoute.post(
    '/OpenSea/CreateJSON/Contract/:contractId/ImageFolderHash/:hash',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId, hash } = req.params;
        const { jsonData } = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const tempDir = `${process.cwd()}/temp`;
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
            if (!fs.existsSync(`${tempDir}/metadata`))
                fs.mkdirSync(`${tempDir}/metadata`);

            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            const provider = getAlchemyProvider(contract.chainId as number);
            const blockChainContract = new Contract(
                contract.address,
                contract.abi,
                provider
            );
            /*const totalSupply =
                Number(await blockChainContract.getFunction('totalSupply')()) *
                2;*/
            const totalSupply = 750000;

            for (let i = 1; i < totalSupply + 1; i++) {
                let random = Math.floor(Math.random() * 17 + 1);
                let tmp = replaceImageHash(jsonData, hash);
                tmp.name = `${tmp.name} #${i}`;
                /*tmp.attributes.find(
                    (attribute: { trait_type: string; value: string }) =>
                        attribute.trait_type === 'Hue'
                ).value = random.toString();*/
                fs.writeFileSync(
                    `${tempDir}/metadata/${i}`,
                    JSON.stringify(tmp, null, 4)
                );
            }
            await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                message: 'done',
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

openSeaRoute.get(
    '/OpenSea/GetTokenURI/Contract/:contractAddress/Token/:tokenId',
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractAddress, tokenId } = req.params;
        try {
            await dataSource.initialize();
            const provider = getAlchemyProvider(80001);
            const contract = new Contract(
                contractAddress,
                OpenSeaAbi,
                provider
            );
            const tokenURI = await contract.getFunction('tokenURI')(tokenId);
            await dataSource.destroy();
            res.status(200).json({ tokenURI });
        } catch (error: any) {
            next(error.message);
        }
    }
);

openSeaRoute.get(
    '/OpenSea/GetTokenURI/Contract/:contractAddress/changePublicStart/:time',
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractAddress, time } = req.params;
        try {
            await dataSource.initialize();
            const provider = getAlchemyProvider(80001);
            const contract = new Contract(
                contractAddress,
                OpenSeaAbi,
                provider
            );
            const tx = await contract.getFunction('multiConfigure')(
                200000000, // maxSupply
                '', // baseURI
                '', // contractURI
                '0x00005EA00Ac477B1030CE78506496e8C2dE24bf5' // SeaDrop Contract
            );
            await dataSource.destroy();
            res.status(200).json({ tx });
        } catch (error: any) {
            next(error.message);
        }
    }
);

openSeaRoute.post(
    '/OpenSea/SafeTransferFromBMOE/Contract/:contractAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractAddress } = req.params;
        const { toAddresses }: { toAddresses: Array<string> } = req.body;
        const receipts: Array<any> = [];
        try {
            await dataSource.initialize();
            const dbContract = (await getContractByAddress(
                contractAddress
            )) as ContractEntity;
            const { symbol, chainId, abi, id, address } = dbContract;
            const provider = getAlchemyProvider(chainId as number);
            const feeData = await provider.getFeeData();
            const gasPrice = feeData.gasPrice as bigint;
            const estimate = await provider.estimateGas({
                gasPrice: feeData.gasPrice,
            });
            const key = getWalletKey(symbol as string) as string;
            const signer = new Wallet(key, provider);

            const BMOEContract = new Contract(address, abi, signer);
            const signedBMOEContract = BMOEContract.connect(signer);

            const BMOEOwner = (await getOwnerByWalletAddress(
                signer.address
            )) as OwnerEntity;
            for (let toAddress of toAddresses) {
                delay(5000);
                const toOwner = (await getOwnerByWalletAddress(
                    toAddress
                )) as OwnerEntity;
                let status = 0;
                while (status !== 1) {
                    try {
                        const asset = await getNextAvailableToken(
                            id,
                            BMOEOwner.id
                        );
                        console.log(
                            `Reserved ${asset.tokenId} for ${toAddress}`
                        );

                        const tokenId = parseInt(asset.tokenId);
                        const tx = await signedBMOEContract.getFunction(
                            'safeTransferFrom'
                        )(signer.address, toAddress, tokenId);
                        await tx.wait();
                        status = 1;
                        await dataSource
                            .createQueryBuilder()
                            .update(AssetEntity)
                            .set({ ownerId: toOwner.id })
                            .where('id = :id', { id: asset.id })
                            .execute();
                    } catch (error: any) {
                        console.log(error);
                        status = 0;
                    }
                }
            }
            await dataSource.destroy();
            res.status(204).json({
                status: 'Success',
                code: 204,
                receipt: receipts,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
