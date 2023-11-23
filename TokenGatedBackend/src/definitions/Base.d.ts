export interface Base {
    id: string;
    createdBy?: string;
    createdDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
    archived?: string;
}

export interface BaseRequest {
    database: 'BillMurray1000' | 'ELF' | 'Forever';
}
