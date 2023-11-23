import { Base } from './Base';
import { Contract } from '@definitions/Contract';

export interface Asset extends Base {
    animation: string;
    animationSmall: string;
    attributes: Array<Attribute>;
    contractId: string;
    description: string;
    image: string;
    imageSmall: string;
    name: string;
    ownerId: string;
    status: string;
    tokenId: string;
}

export interface AssetWithData extends Asset {
    contract: Contract;
    owner: Owner;
}

export interface Attribute extends Base {
    assetId: string;
    traitType: string;
    value: string;
}

export interface BurnAsset extends Asset {
    contractAddress: string;
    burnNow: string;
}
