import { Base } from './Base';

export interface Contract extends Base {
    description: string;
    symbol: string;
    address: string;
    type: string;
    chainId: number;
    chainURL: string;
    chainAPIKey: string;
    partnerContractId: string;
    abi: object;
    deployedBlock: string;
    burnable: boolean;
    burnNow: string;
    maxSupply: string;
}
