import { Base } from './Base';
import { ClaimFull } from '@definitions/UnclaimedCoin';
import { Asset } from '@definitions/Asset';
import { Contract } from '@definitions/Contract';

export type ClaimProps<P = {}> = P;

export type ClaimCardProps<
    P = {
        claim: ClaimFull;
        children?: JSX.Element;
    },
> = P;

export type ClaimRegistrationButtonProps<
    P = {
        index: number;
        text: string;
    },
> = P;

export interface Claim extends Base {
    name: string;
    description: string;
    tokenId: string;
    orderId: string;
    url: string;
    code: string;
    claimed: boolean;
    type: string;
    assetId: string;
    image: string;
}

export interface ClaimWithAssetName extends Claim {
    assetName: string;
}

export interface ClaimAsset extends Asset {
    contract: Contract;
}

export interface ClaimFull extends Claim {
    asset: ClaimAsset;
}
