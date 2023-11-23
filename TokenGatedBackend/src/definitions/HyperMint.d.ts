import FormData from 'form-data';

export interface HMCall {
    httpsMethod: string;
    endpoint: string;
    data?: any;
    headers?: any;
}

interface HMBaseBody {
    contractId: string;
}

export interface HMGetContractInfo extends HMBaseBody {}

export interface HMContractResponse {
    id: string;
    name: string;
    symbol: string;
    status: NFTContractStatus;
    allowBuyOnNetwork: boolean;
    network: {
        type: NetworkType;
        environment: NetworkEnvironment;
        chain?: NetworkChain;
        contractAddress?: string;
        contractType: NFTContractType;
        customerAddress: string;
        useManagedAccessList: boolean;
    };
    metadata: {
        type: NFTContractMetadataType;
        contractUrl?: string;
        tokenUrl?: string;
    };
    publicSaleAt?: Date;
    saleClosesAt?: Date;
    erc721Price?: number;
    erc721MaxPerTransaction?: number;
    enableOpenSeaOperatorFilterRegistry: boolean;
    tokenCount: number;
}

export type HMCreateDraftContractProps<
    p = {
        body: CreateNFTContractRequest;
    },
> = p;

export interface HMCreateDraftContract {
    body: CreateNFTContractRequest;
}

export interface HMDeployContract extends HMBaseBody {}

export interface HMGetTokensBody extends HMBaseBody {}

export interface HMGetTokenInformation extends HMBaseBody {
    tokenId: string;
}

export interface HMAuthoriseBuy extends HMBaseBody {
    tokenId: string;
    query: HMAuthoriseBuyQuery;
}

export interface HMAuthoriseBuyQuery {
    walletAddress: string;
    amount: number;
}

export interface Metadata {
    name?: string;
    description?: string;
    image?: string; // Can use a prehosted image url here if not use the upload token metadata media endpoint
    external_url?: string;
    background_color?: string;
    animation_url?: string;
    youtube_url?: string;
    attributes?: Array<MetadataAttribute>;
}

export interface MetadataAttribute {
    trait_type?: string;
    value?: string;
    display_type?: string;
}

export interface CreateNFTContractRequest {
    name: string;
    network: CreateNFTNetworkRequest;
    symbol: string;
    allowBuyOnNetwork: boolean;
    metadata: CreateNFTContractMetadataRequest;
    publicSaleAt?: Date; // Date Format is YYYY-MM-DDTHH:mm:ss.sssZ
    saleClosesAt?: Date; // Date Format is YYYY-MM-DDTHH:mm:ss.sssZ
    secondarySaleBasisPoints: number;
    erc721Price?: number; // Price in ETH
    erc721MaxPerTransaction?: number;
    allowBuyWithMoonPay?: boolean;
    enableOpenSeaOperatorFilterRegistry: boolean;
}

export interface CreateNFTNetworkRequest {
    type: NetworkType;
    environment: NetworkEnvironment;
    chain: NetworkChain;
    // Address used to reclaim control of the contract from HM if desired in the future
    recoveryAddress: string;
    // Used when providing custom access list behavior via an external API
    presaleAddress?: string;
    customerPrimaryRoyaltyAddress: string;
    // Address show as the owner on marketplaces
    collectionOwnerAddress: string;
    contractType: NFTContractType;
    useManagedAccessList: boolean;
    usePrimarySaleSplitter?: boolean;
    //primarySaleSplitterId will be required if usePrimarySaleSplitter is set to true
    primarySaleSplitterId?: string;
    secondaryRoyaltyAddress: string;
    useSecondarySaleSplitter?: boolean;
    //secondarySaleSplitterId will be required if useSecondarySaleSplitter is set to true
    secondarySaleSplitterId?: string;
}

export interface CreateNFTContractMetadataRequest {
    type: NFTContractMetadataType;
    contractUrl?: string;
    tokenUrl?: string;
    description?: string;
    externalLink?: string;
}

export interface MetadataAttribute {
    trait_type?: string;
    value?: string;
    display_type?: string;
}

export interface HMMint extends HMBaseBody {
    walletAddress: string;
    id: number;
    amount: number;
}

interface MintRequest {
    address: string;
    tokens: Array<{
        id: number;
        amount: number;
    }>;
}

export interface HMMintStatus extends HMBaseBody {
    mintId: string;
}

export interface HMGetOwnedTokens extends HMBaseBody {
    contractId: string;
    walletAddress: string;
}

export interface HMGetOwnedTokensResponse {
    tokens: {
        tokenId: number;
        amount: number; // Always 1 for ERC721
        tokenAddress?: string; // Only populated for Solana
        tokenAccountAddress?: string; // Only populated for Solana
    }[];
}

export interface HMTransferToken extends HMBaseBody {
    body: TransferRequestBody;
}

export interface TransferRequestBody {
    address: string;
    tokenId: number;
    amount?: number; // ERC1155 only
}

export interface HMGetTransferStatus extends HMBaseBody {
    transferId: string;
}

export interface HMUpdateErc721Contract extends HMBaseBody {
    body: HMUpdateErc721ContractBody;
}

interface HMUpdateErc721ContractBody {
    name: string;
    symbol: string;
    network?: CreateUpdateNFTNetworkInput;
    secondarySaleBasisPoints?: number;
    erc721TotalSupply?: number;
    erc721MaxPerTransaction?: number;
    erc721Price?: number;
}

interface HMUpdateMetadataUrls extends HMBaseBody {
    body: HMUpdateMetadataUrlsBody;
}

interface HMUpdateMetadataUrlsBody {
    contractMetadataUrl?: string;
    tokenMetadataUrl?: string;
}

interface HMUpdateBuyOnNetwork extends HMBaseBody {
    body: HMUpdateBuyOnNetworkBody;
}

interface HMUpdateBuyOnNetworkBody {
    allowBuyOnNetwork: boolean;
}

interface HMUpdateDates extends HMBaseBody {
    body: HMUpdateDatesBody;
}

interface HMUpdateDatesBody {
    publicSaleAt?: Date; // Date Format is YYYY-MM-DDTHH:mm:ss.sssZ
    saleClosesAt?: Date; // Date Format is YYYY-MM-DDTHH:mm:ss.sssZ
}

interface HMGetTokenAllocation extends HMBaseBody {}

interface HMVerifyTokenBurn extends HMBaseBody {
    txHash: string;
}

export interface HMAddAccessListAddresses {
    accessListId: string;
    body: HMAddAccessListAddressesBody;
}

interface CreateUpdateNFTNetworkInput {
    type?: NetworkType;
    environment?: NetworkEnvironment;
    chain?: NetworkChain;
    recoveryAddress?: string;
    collectionOwnerAddress?: string;
    customerPrimaryRoyaltyAddress?: string;
}

export interface HMUpdateNameAndSymbolRequest extends HMBaseBody {
    body: UpdateNameAndSymbolRequestBody;
}

interface UpdateNameAndSymbolRequestBody {
    name: string;
    symbol: string;
}

export interface HMGetContractHostedMetadata extends HMBaseBody {}

export interface HMGetTokenHostedMetadata extends HMBaseBody {
    tokenId: string;
}

export interface HMSetTokenHostedMetadata extends HMBaseBody {
    tokenId: string;
    body: Metadata;
}

export interface HMUploadContractMedia extends HMBaseBody {
    body: UploadMediaBody;
}

export interface HMUploadTokenMediaImage extends HMBaseBody {
    tokenId: string;
    path: string;
}

export interface HMUploadTokenMediaAnimation extends HMBaseBody {
    tokenId: string;
    path: string;
}

export interface UploadMediaBody {
    media: file;
}

export const enum NFTContractStatus {
    Draft = 'Draft',
    Deploying = 'Deploying',
    Deployed = 'Deployed',
}

export const enum NetworkType {
    Ethereum = 'Ethereum',
    Polygon = 'Polygon',
    Solana = 'Solana',
}

export const enum NetworkEnvironment {
    Emulator = 'Emulator',
    Testnet = 'Testnet',
    Mainnet = 'Mainnet',
}

export enum NetworkChain {
    EVMLocal = 'EVMLocal',
    Ethereum = 'Ethereum',
    Goerli = 'Goerli',
    Polygon = 'Polygon',
    Mumbai = 'Mumbai',
}

export const enum NetworkChainID {
    EVMLocal = 0,
    Ethereum = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Polygon = 137,
    Mumbai = 80001,
}

export enum NFTContractType {
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155',
}

export const enum NFTContractMetadataType {
    None = 'None',
    Hosted = 'Hosted',
    Url = 'Url',
}

export interface AuthPresaleResponse {
    totalPrice: number;
    maxPerAddress?: number;
    expires: number;
    signature: string;
}

interface HMContractTokensResponse {
    tokens: HMContractToken[];
}

interface HMContractToken {
    id: number;
    totalSupply: number;
    price: number;
    supply?: number;
    remaining?: number;
    maxPerTransaction: number;
}

interface HMTransferResponse {
    id: string;
}

interface HMTokenOwnershipResponse {
    tokens: {
        tokenId: number;
        amount: number; // Always 1 for ERC721
        tokenAddress?: string; // Only populated for Solana
        tokenAccountAddress?: string; // Only populated for Solana
    }[];
}

interface HMTransferStatusResponse {
    id: string;
    status: HMNetworkInteractionStatus;
    statusReason?: string;
    address: string;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    transactionHash?: string;
    tokenId: number;
    amount?: number;
}

enum HMNetworkInteractionStatus {
    Pending = 'Pending',
    Sent = 'Sent',
    Complete = 'Complete',
    Failed = 'Failed',
}

interface HMMintResponse {
    id: string;
}

interface HMMintStatusResponse {
    id: string;
    status: HMNetworkInteractionStatus;
    statusReason?: string;
    address: string;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    transactionHash?: string;
    tokens: {
        id: number;
        amount: number;
    }[];
    result: {
        id: number;
        amount: number;
    }[];
    contract: {
        id: string;
    };
}

interface HMMetadata {
    name?: string;
    description?: string;
    image?: string;
    external_url?: string;
    background_color?: string;
    animation_url?: string;
    youtube_url?: string;
    attributes?: HMMetadataAttribute[];
}

interface HMMetadataAttribute {
    trait_type?: string;
    value?: string;
    display_type?: string;
}
