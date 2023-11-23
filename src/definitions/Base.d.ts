export interface Base {
    id: string;
    createdDate?: Date;
    updatedDate?: Date;
    archived: boolean;
}

export interface APIConfigProps {
    host?: string;
    version?: string;
    key?: string;
    secret?: string;
    url: string;
}
