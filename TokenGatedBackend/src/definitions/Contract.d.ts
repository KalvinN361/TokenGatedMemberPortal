import { BaseRequest } from './Base';
import { BaseEntity, ContractEntity } from '../entity';

export interface BaseContractRequest {
    contract: ContractEntity;
}

export interface ContractRequest extends BaseRequest {
    contractId: string;
}

export interface AddContractRequest {
    contract: Omit<ContractEntity, BaseEntity>;
}

export interface UpdateContractRequest extends BaseContractRequest {}

export interface ArchiveContractRequest extends ContractRequest {}

export interface DeleteContractRequest extends ContractRequest {}
