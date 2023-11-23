import { Base } from './Base';
import { BaseEntity, OwnerEntity } from '../entity';

export interface Owner extends Base {
    walletAddress: string;
    chainId: number;
    userName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface BaseOwnerRequest {
    owner: OwnerEntity;
}

export interface OwnerByWalletAddressRequest {
    walletAddress: string;
}

export interface OwnerByEmailRequest {
    email: string;
}

export interface OwnerRequest {
    ownerId: string;
}

export interface AddOwnerRequest {
    owner: Omit<OwnerEntity, BaseEntity>;
}

export interface UpdateOwnerRequest extends BaseOwnerRequest {}

export interface ArchiveOwnerRequest extends OwnerRequest {}

export interface DeleteOwnerRequest extends OwnerRequest {}
