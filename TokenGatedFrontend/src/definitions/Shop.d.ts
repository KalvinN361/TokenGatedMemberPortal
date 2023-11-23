import { Base } from './Base';

export interface Shop extends Base {
    assetId: string;
    type: string;
    price: string;
    asset: AseetWithData;
}
