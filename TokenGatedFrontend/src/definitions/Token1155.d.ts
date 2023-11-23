import { Base } from './Base';

export interface Token1155 extends Base {
    tokenId: string;
    contractId: string;
    supply: number;
    maxSupply: number;
    name: string;
    description: string;
    image: string;
    animation: string;
}
