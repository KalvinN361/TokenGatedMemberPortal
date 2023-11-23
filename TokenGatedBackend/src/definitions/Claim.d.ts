import { BaseEntity, ClaimEntity } from '../entity';

export interface BaseClaimRequest {
    claim: ClaimEntity;
}

export interface ClaimByAssetsRequest {
    assetIds: Array<string>;
}

export interface ClaimByAssetRequest {
    assetId: string;
}

export interface ClaimByTypeRequest {
    claimType: string;
}

export interface ClaimRequest {
    claimId: string;
}

export interface ClaimEntityWithAssetName
    extends OmitClaimEntity<ClaimEntity, 'createId'> {
    nftName: string;
}

export interface AddClaimRequest {
    claim: Omit<ClaimEntity, BaseEntity>;
}

export interface UpdateClaimRequest extends BaseClaimRequest {}

export interface ArchiveClaimRequest extends ClaimRequest {}

export interface DeleteClaimRequest extends ClaimRequest {}
