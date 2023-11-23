import { NextFunction, Request, Response, Router } from 'express';
import {
    SafeTransferFrom1155PVRequest,
    SafeTransferFrom721PVRequest,
} from '../../../definitions';
import {
    delay,
    getAlchemyProvider,
    integrityCheckerForAll,
    isTransferEventDefinedInABI,
} from '../../../scripts/utilities';
import { Contract, Wallet, parseEther } from 'ethers';
import { abi721, abi1155, cryptopunksAbi } from '../../../abi';
import crypto from 'crypto';
import {
    dataSource,
    setDataSource,
    setForeverDataSource,
} from '../../../scripts/utilities/database';
import {
    addAssets,
    addOwner,
    getAssetOneByContractAndTokenId,
    getContractByAddress,
    getOne,
    updateAssetOwner,
} from '../../../scripts/manager';
import { AssetEntity, ContractEntity, OwnerEntity } from '../../../entity';
import {
    checkOwnedAndTransfer,
    mintToken,
} from '../../../scripts/manager/blockchainManager';
import axios from 'axios';

export const blockchainRoute = Router();

blockchainRoute.get(
    '/Blockchain/IntegrityCheckerForAll/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        const { startIndex, endIndex } = req.query;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            await integrityCheckerForAll(
                contractId,
                parseInt(startIndex as string) as number,
                parseInt(endIndex as string) as number
            );
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Integrity check completed',
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

blockchainRoute.post(
    '/Blockchain/TransferERC20',
    async (req: Request, res: Response, next: NextFunction) => {
        const { toAddress, amount, chainId } = req.body as any;

        try {
            const provider = getAlchemyProvider(chainId);

            const { PV_WALLET_PRIVATE_KEY } = process.env;
            const wallet = new Wallet(
                PV_WALLET_PRIVATE_KEY as string,
                provider
            );

            const tx = {
                to: toAddress,
                value: parseEther(amount),
            };

            const txHash = await wallet.sendTransaction(tx);
            await txHash.wait();

            res.json({ txHash });
        } catch (error: any) {
            next(error.message);
        }
    }
);

blockchainRoute.post(
    '/Blockchain/SafeTransferFrom721PV',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            toAddress,
            contractAddress,
            tokenId,
            chainId,
        }: SafeTransferFrom721PVRequest = req.body;

        try {
            const provider = getAlchemyProvider(chainId);

            const { PV_WALLET_PRIVATE_KEY } = process.env;
            const signer = new Wallet(
                PV_WALLET_PRIVATE_KEY as string,
                provider
            );

            const contract = new Contract(contractAddress, abi721, provider);
            const signedContract = contract.connect(signer);
            const tx = await signedContract.getFunction('safeTransferFrom')(
                signer.address,
                toAddress,
                tokenId
            );

            res.status(204).json({ tx });
        } catch (error: any) {
            next(error.message);
        }
    }
);

blockchainRoute.post(
    '/Blockchain/SafeTransferFrom1155',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            toAddress,
            contractAddress,
            tokenId,
            chainId,
            amount,
        }: SafeTransferFrom1155PVRequest = req.body;

        try {
            const provider = getAlchemyProvider(chainId);

            const { PV_WALLET_PRIVATE_KEY } = process.env;
            const signer = new Wallet(
                PV_WALLET_PRIVATE_KEY as string,
                provider
            );

            const contract = new Contract(contractAddress, abi1155, provider);
            const signedContract = contract.connect(signer);
            const tx = await signedContract.getFunction('safeTransferFrom')(
                signer.address,
                toAddress,
                tokenId,
                amount
            );

            res.status(204).json({ tx });
        } catch (error: any) {
            next(error.message);
        }
    }
);

blockchainRoute.post(
    '/MoonPay/SignUrl',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { url } = req.body;
        const signature = crypto
            .createHmac('sha256', process.env.MOONPAY_SECRET_KEY!)
            .update(new URL(url).search)
            .digest('base64');
        const urlWithSignature = `${url}&signature=${encodeURIComponent(
            signature
        )}`;
        res.status(200).json({ urlWithSignature });
    }
);

blockchainRoute.post(
    '/Blockchain/Mint3DGlasses/WalletAddress/:walletAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { walletAddress } = req.params;
        try {
            await dataSource.initialize();
            const bm3dContract = (await getContractByAddress(
                '0xbda2753265642b73f4b57f2d100304576b0d6a85'
            )) as ContractEntity;

            let txStatus = await checkOwnedAndTransfer(
                bm3dContract,
                walletAddress
            );

            if (txStatus.code === 404) {
                let mTxStatus = await mintToken(bm3dContract, walletAddress);
                res.json(mTxStatus);
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(txStatus);
        } catch (error: any) {
            next(error.message);
        }
    }
);

blockchainRoute.post(
    '/Blockchain/Mint3DGlassesTest/WalletAddress/:walletAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { walletAddress } = req.params;
        let txStatus;
        try {
            await dataSource.initialize();

            const bm3dContract = (await getContractByAddress(
                '0xcbe2f2d08adbcdb0058a3e47fa2b86ec48d95367'
            )) as ContractEntity;

            txStatus = await checkOwnedAndTransfer(bm3dContract, walletAddress);

            if (txStatus.code === 404) {
                let mTxStatus = await mintToken(bm3dContract, walletAddress);
                if (dataSource.isInitialized) await dataSource.destroy();
                res.json(mTxStatus);
            } else {
                if (dataSource.isInitialized) await dataSource.destroy();
                res.status(200).json(txStatus);
            }
        } catch (error: any) {
            next(error.message);
        }
    }
);

blockchainRoute.get(
    '/Blockchain/Indexer/Contract/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        try {
            await dataSource.initialize();
            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            const { description, address, abi } = contract;
            const hasTransferEvent = isTransferEventDefinedInABI(abi);
            if (!hasTransferEvent) {
                console.log(`Transfer event not defined in ABI for ${address}`);
            }
            const provider = getAlchemyProvider(contract.chainId as number);
            const dbContract = new Contract(address, abi, provider);

            await dbContract.on('Transfer', async (from, to, id, event) => {
                console.log(`${from} => ${to}: ${id}`);

                try {
                    let oldOwner = (await getOne(
                        OwnerEntity,
                        from
                    )) as OwnerEntity;
                    let newOwner = (await getOne(
                        OwnerEntity,
                        to
                    )) as OwnerEntity | null;

                    if (!newOwner)
                        newOwner = (await addOwner({
                            walletAddress: to,
                        })) as OwnerEntity;
                    let asset = await getAssetOneByContractAndTokenId(
                        contractId,
                        id
                    );

                    if (!asset) {
                        let tokenUri = await dbContract.getFunction('tokenURI')(
                            id
                        );
                        let tokenMetadata = await axios(tokenUri).then(
                            (response) => {
                                return response.data;
                            }
                        );
                        asset = await dataSource
                            .createQueryBuilder(AssetEntity, 'a')
                            .insert()
                            .into(AssetEntity)
                            .values({
                                contractId: contractId,
                                tokenId: id,
                                ownerId: newOwner.id,
                                image: tokenMetadata.image,
                                description: tokenMetadata.description,
                                name: tokenMetadata.name,
                                animation: tokenMetadata.animation_url,
                                updatedDate: new Date(),
                            })
                            .orUpdate(
                                ['ownerId', 'updatedDate'],
                                ['contractId', 'tokenId'],
                                {
                                    skipUpdateIfNoValuesChanged: true,
                                }
                            )
                            .execute()
                            .then(async (result) => {
                                return (await dataSource
                                    .createQueryBuilder(AssetEntity, 'a')
                                    .where(
                                        'a.archived=:archived AND a.id=:id',
                                        {
                                            archived: false,
                                            id: result.identifiers[0].id,
                                        }
                                    )
                                    .getOne()) as AssetEntity;
                            });
                        await integrityCheckerForAll(
                            contractId,
                            parseInt(id),
                            parseInt(id) + 1
                        );
                    } else {
                        await updateAssetOwner(
                            asset as AssetEntity,
                            newOwner.id
                        );
                    }
                } catch (error: any) {
                    next(error.message);
                }
            });
            await dataSource.destroy();

            res.status(200).json({
                status: 'success',
                code: 200,
                message: `Indexer completed for ${description} (${address})`,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

blockchainRoute.get(
    '/Blockchain/ContractWalk/Contract/:contractAddress/StartIndex/:startIndex',
    setForeverDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractAddress, startIndex } = req.params;
        try {
            await dataSource.initialize();
            const dbContract = (await getContractByAddress(
                contractAddress
            )) as ContractEntity;
            const provider = getAlchemyProvider(1);
            const contract = new Contract(
                dbContract.address,
                dbContract.abi,
                provider
            );

            let totalSupply = await contract.getFunction('totalSupply')();
            for (let i = parseInt(startIndex); i < totalSupply; i++) {
                await delay(200);
                let ownerAddress = '';
                if (dbContract.symbol === 'C')
                    ownerAddress = await contract.getFunction(
                        'punkIndexToAddress'
                    )(i);
                else ownerAddress = await contract.getFunction('ownerOf')(i);

                let owner = await dataSource
                    .createQueryBuilder(OwnerEntity, 'o')
                    .insert()
                    .into(OwnerEntity)
                    .values({ walletAddress: ownerAddress })
                    .orUpdate(['walletAddress'], ['walletAddress'], {
                        skipUpdateIfNoValuesChanged: true,
                    })
                    .execute()
                    .then(async (result) => {
                        return (await dataSource
                            .createQueryBuilder(OwnerEntity, 'o')
                            .where(
                                'o.archived=:archived AND o.walletAddress=:walletAddress',
                                {
                                    archived: false,
                                    walletAddress: ownerAddress,
                                }
                            )
                            .getOne()) as OwnerEntity;
                    });
                let image = '',
                    name = '';
                if (dbContract.symbol === 'C') {
                    let image = `https://cryptopunks.app/cryptopunks/cryptopunk${i}.png`;
                    let name = `CryptoPunk #${i}`;
                } else {
                    let tokenUri = await contract.getFunction('tokenURI')(i);
                    if (tokenUri.startsWith('ipfs://')) {
                        tokenUri = tokenUri.replace(
                            'ipfs://',
                            'https://ipfs.io/ipfs/'
                        );
                    }
                    let tokenMetadata = await axios
                        .get(tokenUri)
                        .then((response) => {
                            return response.data;
                        });
                    image = tokenMetadata.image.replace(
                        'ipfs://',
                        'https://ipfs.io/ipfs/'
                    );
                    name = !tokenMetadata.name ? `#${i}` : tokenMetadata.name;
                }
                let asset: any = {
                    tokenId: i,
                    contractId: dbContract.id,
                    ownerId: owner.id,
                    name: name,
                    image: image,
                    updatedDate: new Date(),
                };
                console.log(
                    `Adding ${name} to database with owner ${owner.id} (${owner.walletAddress}))`
                );
                await dataSource
                    .createQueryBuilder(AssetEntity, 'a')
                    .insert()
                    .into(AssetEntity)
                    .values(asset)
                    .orUpdate(
                        ['ownerId', 'updatedDate'],
                        ['contractId', 'tokenId'],
                        {
                            skipUpdateIfNoValuesChanged: true,
                        }
                    )
                    .execute();
            }
            await dataSource.destroy();

            res.status(200).json({
                status: 'success',
                code: 200,
                message: `Indexer completed for Cryptopunks`,
            });
        } catch (error: any) {
            console.log(error);
            next(error.message);
        }
    }
);
