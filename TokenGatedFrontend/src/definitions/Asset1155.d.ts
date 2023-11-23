import { Base } from './Base';
import { Token1155 } from './Token1155';

export interface Asset1155 extends Base {
    token1155id: string;
    ownerId: string;
    quantity: number;
}

export interface Asset1155Portal extends Asset1155 {
    token1155: Token1155;
}
