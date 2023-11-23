import { dataSource } from '../utilities/database';
import { ContractEntity, OwnerEntity } from '../../entity';
import {
    delay,
    HMgetOwnedTokens,
    HMgetTokenHostedMetadata,
    HMgetTransferStatus,
    HMmint,
    HMmintStatus,
    HMtransferToken,
} from '../utilities';
import { HMMetadataAttribute } from '../../definitions';
import { getOwnerByWalletAddress } from './ownerManager';

export const checkOwnedAndTransfer = async (
    contract: ContractEntity,
    walletAddress: string
) => {
    const ownedTokens = await HMgetOwnedTokens(
        contract.partnerContractId as string,
        '0x8697e2B04b16eFfDf399Ff1bC7D42663709a8851'
    );

    if (ownedTokens.tokens.length > 0) {
        let pc = contract.partnerContractId as string;
        let tokenId = ownedTokens.tokens[0].tokenId;
        let tx = await HMtransferToken(pc, walletAddress, tokenId.toString());
        console.log({ tx });
        let txStatus = await HMgetTransferStatus(pc, tx.id);
        console.log({ txStatus });
        return { status: 'success', code: 200, txStatus };
    }
    return { status: 'failed', code: 404, message: 'No tokens to transfer' };
};

export const mintToken = async (
    contract: ContractEntity,
    walletAddress: string
) => {
    let pc = contract.partnerContractId as string;
    console.log(`PV::${new Date()}::Getting owner for ${walletAddress}`);
    let owner = (await getOwnerByWalletAddress(walletAddress)) as OwnerEntity;
    console.log(`PV::${new Date()}::Minting token for ${walletAddress}`);
    let mTx = await HMmint(pc, walletAddress, 0, 1);
    console.log(
        `PV::${new Date()}::Minting status for ${walletAddress} with transaction Id ${
            mTx.id
        }`
    );
    let mTxStatus = await HMmintStatus(pc, mTx.id);
    do {
        mTxStatus = await HMmintStatus(pc, mTx.id);
        await delay(5000);
    } while (mTxStatus.status !== 'Complete' && mTxStatus.status !== 'Failed');
    if (mTxStatus.status === 'Complete') {
        await delay(5000);
        mTxStatus = await HMmintStatus(pc, mTx.id);
        console.log(`PV::${new Date()}::Minting complete for ${walletAddress}`);
        console.log('tokens', mTxStatus.result);
        let token = mTxStatus.result[0];
        console.log(
            `PV::${new Date()}::Getting metadata for token ${
                token.id
            } from contract ${pc}`
        );
        let tokenMetadata = await HMgetTokenHostedMetadata(
            pc,
            token.id.toString()
        );
        console.log(`PV::${new Date()}::Adding asset ${token.id} to database`);
        let insertAssetResult = await dataSource
            .createQueryBuilder()
            .insert()
            .into('AssetEntity')
            .values({
                contractId: contract.id,
                ownerId: owner.id,
                tokenId: token.id,
                image: tokenMetadata.image,
                animation: tokenMetadata.animation_url,
                name: tokenMetadata.name,
                description: tokenMetadata.description,
            })
            .execute();
        console.log(`PV::${new Date()}::Adding attributes to database`);
        let assetId = insertAssetResult.identifiers[0].id;
        let hmAttributes =
            tokenMetadata.attributes as Array<HMMetadataAttribute>;
        let attributes = [];
        for (let attribute of hmAttributes) {
            let tmp = {
                assetId: assetId,
                traitType: attribute.trait_type,
                value: attribute.value,
            };
            attributes.push(tmp);
        }
        await dataSource
            .createQueryBuilder()
            .insert()
            .into('AttributeEntity')
            .values(attributes)
            .execute();
        return { status: 'success', code: 200, response: mTxStatus };
    } else if (mTxStatus.status === 'Failed')
        return {
            status: 'failed',
            code: 404,
            response: 'Minting failed. Please contact Project Venkman.',
        };
};
