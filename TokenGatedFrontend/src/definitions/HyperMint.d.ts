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

export interface MetadataAttribute {
    trait_type?: string;
    value?: string;
    display_type?: string;
}

interface PVMintStatusResponse {
    status: PVNetworkInteractionStatus;
    code: number;
    response: HMMintStatusResponse | string;
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

enum HMNetworkInteractionStatus {
    Pending = 'Pending',
    Sent = 'Sent',
    Complete = 'Complete',
    Failed = 'Failed',
}
