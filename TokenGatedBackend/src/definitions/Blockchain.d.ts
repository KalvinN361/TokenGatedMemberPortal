export interface SafeTransferFrom721PVRequest {
    toAddress: string;
    contractAddress: string;
    tokenId: string;
    chainId: number;
}

export interface SafeTransferFrom1155PVRequest {
    toAddress: string;
    contractAddress: string;
    tokenId: string;
    chainId: number;
    amount: number;
}
