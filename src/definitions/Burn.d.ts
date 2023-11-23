import { Asset, BurnAsset } from './Asset';

export type BurnProps<P = {}> = P;

export type BurnCardProps<
    P = {
        index: number;
        burnAsset: BurnAsset;
        copiedAddress: boolean;
    },
> = P & {
    onClick?: (index: number) => void;
};

export type BurnURLProps<
    P = {
        burnStatus: string;
        disabled: boolean;
    },
> = P;

export interface Burn {
    abi: Array<>;
    address: string;
    archived: boolean;
    burnable: boolean;
    chainAPIKey: string;
    chainId: number;
    chainURL: string;
    createBy: string;
    createdDate: string;
    deployedBlock: string;
    description: string;
    id: string;
    minter: string;
    partnerContractId: string;
    symbol: string;
    type: string;
    updatedBy: string;
    updatedDate: string;
}

export interface BurnOptions {
    option: 'burnandturn' | 'upgrade' | '';
}
