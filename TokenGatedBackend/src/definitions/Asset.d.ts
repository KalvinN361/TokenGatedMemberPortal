import { AssetEntity, AttributeEntity } from '../entity';
import { BaseEntity } from 'typeorm';

interface BaseAsset extends Omit<AssetEntity, BaseEntity | 'attributes'> {
    attributes: Array<Omit<AttributeEntity, BaseEntity>>;
}

export interface BaseAssetRequest {
    asset: AssetEntity;
}

export interface BurnableAsset extends Omit<AssetEntity, 'createId'> {
    contractAddress: string;
    burnNow: string;
}

export interface AssetRequest {
    assetId: string;
}

export interface GetByContractsRequest {
    contractIds: Array<string>;
}

export interface GetByContractRequest {
    contractId: string;
}

export interface GetAssetByContractAndTokenRequest
    extends GetByContractRequest {
    tokenId: string;
}

export interface AddAssetRequest {
    asset: BaseAsset;
}

export interface UpdateAssetRequest extends BaseAssetRequest {}

export interface ArchiveAssetRequest extends AssetRequest {}

export interface DeleteAssetRequest extends AssetRequest {}

export interface FailedAsset {
    id: string | null;
    tokenId: string | null;
    incorrectOwner: string | null;
    correctOwner: string | null;
    corrected: boolean;
}

export interface NoTraits {
    tokenId: string | null;
}
