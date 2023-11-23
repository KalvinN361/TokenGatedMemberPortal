import { Asset } from './Asset';
import { Claim } from '@definitions/Claim';
import { Contract } from '@definitions/Contract';

export interface UnclaimedCoinAsset extends Asset {
    contract: any;
}
