import {
    AssetEntity,
    CollectEntity,
    ContractEntity,
    OwnerEntity,
} from '../../entity';
import { dataSource } from '../utilities/database';
import { getOne } from './baseManager';
import { getAlchemyProvider, getWalletKey } from '../utilities';
import { Contract, Wallet } from 'ethers';
import {
    getAssetsByContract,
    getAssetsByContractAndLimit,
    updateAssetOwner,
} from './assetManager';
import { getOwnerByWalletAddress } from './ownerManager';
import chalk from 'chalk';
import { getNextAvailableToken } from './openseaManager';

export const getOneByShortName = async (shortName: string) => {
    const collect = await dataSource
        .createQueryBuilder(CollectEntity, 'c')
        .where('c.archived = (:archived) AND c.shortName = (:shortName)', {
            archived: false,
            shortName: shortName,
        })
        .getOne();
    return collect as CollectEntity;
};

export const transferBMOE = async (
    dbContract: ContractEntity,
    owner: OwnerEntity,
    email?: string
) => {
    const { address, abi, chainId } = dbContract;
    const { walletAddress } = owner;
    const provider = getAlchemyProvider(chainId as number);
    const feeData = await provider.getFeeData();
    const fee = feeData.gasPrice as bigint;
    const estimate = await provider.estimateGas({
        gasPrice: feeData.gasPrice,
    });
    const key = getWalletKey(dbContract.symbol as string) as string;
    const signer = new Wallet(key, provider);
    const BMOEContract = new Contract(address, abi, signer);
    const signedBMOEContract = BMOEContract.connect(signer);

    const BMOEOwner = (await getOwnerByWalletAddress(
        signer.address
    )) as OwnerEntity;

    const assetCount = await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .where(
            'a.archived=:archived AND a.contractId=:contractId AND a.ownerId=:ownerId',
            {
                archived: false,
                contractId: dbContract.id,
                ownerId: owner.id,
            }
        )
        .getCount();
    console.log(owner.id, { assetCount });
    if (assetCount > 200) return null;
    let status = 0;
    let retAsset: AssetEntity | null = null;
    while (status !== 1) {
        try {
            const txAsset = await getNextAvailableToken(
                dbContract.id,
                BMOEOwner.id
            );

            console.log(
                chalk.yellow(
                    `PV::${new Date().toISOString()}::Sending token ${
                        txAsset.tokenId
                    } from contract ${address} to ${walletAddress}`
                )
            );
            const tx = await signedBMOEContract.getFunction('safeTransferFrom')(
                signer.address,
                walletAddress,
                txAsset.tokenId
            );
            console.log(tx);
            await tx.wait();
            status = 1;
            retAsset = await updateAssetOwner(txAsset, owner.id);
        } catch (e) {
            console.log(e);
            status = 0;
        }
    }
    return retAsset;
};

export const transferTokenToOwners = async (
    dropContract: ContractEntity,
    ownersContractId: string
) => {
    const bmWalletIds = [
        '3c597bbc-9691-41cc-9e64-a92e2eac8c1e',
        '91845f58-1ef4-4848-a314-04489e7e7aaf',
    ];
    let receipts: Array<any> = [];
    const key = getWalletKey(dropContract.symbol as string) as string;
    const provider = getAlchemyProvider(dropContract.chainId as number);
    const bmoeSigner = new Wallet(key, provider);
    const assets = (await getAssetsByContract(
        ownersContractId
    )) as Array<AssetEntity>;
    const filteredAssets = assets.filter((asset) => {
        return !bmWalletIds.includes(asset.ownerId);
    });
    const shuffledAssets = filteredAssets.sort(() => 0.5 - Math.random());
    console.log('shuffledAssets', shuffledAssets.length);
    const dropAssets = await getAssetsByContractAndLimit(
        dropContract.id,
        shuffledAssets.length,
        '91845f58-1ef4-4848-a314-04489e7e7aaf'
    );
    /*const filteredDropAssets = dropAssets.filter((asset) => {
        return bmWalletIds.includes(asset.ownerId);
    });*/
    console.log('filteredDropAssets', dropAssets.length);
    const transferContract = new Contract(
        dropContract.address,
        dropContract.abi,
        bmoeSigner
    );
    const signedTransferContract = transferContract.connect(bmoeSigner);
    for (let i = 0; i < shuffledAssets.length; i++) {
        console.log(
            `transfer ${dropAssets[i].tokenId} to ${shuffledAssets[i].ownerId}`
        );
        const toAddress = (await getOne(
            OwnerEntity,
            shuffledAssets[i].ownerId
        )) as OwnerEntity;
        console.log(
            bmoeSigner.address,
            toAddress.walletAddress,
            dropAssets[i].tokenId
        );
        const tx = await signedTransferContract.getFunction('safeTransferFrom')(
            bmoeSigner.address,
            toAddress.walletAddress,
            dropAssets[i].tokenId
        );
        const tmpReceipt = await tx.wait();
        receipts.push(tmpReceipt);
        await dataSource
            .createQueryBuilder()
            .update(AssetEntity)
            .set({
                ownerId: shuffledAssets[i].ownerId,
                updatedDate: new Date(),
            })
            .where('id = :id', { id: dropAssets[i].id })
            .execute();
    }
    return receipts;
};
