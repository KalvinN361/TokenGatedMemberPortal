import { BaseEntity, MediaEntity } from '../entity';

export interface MediaMap {
    all: boolean;
    contracts: Array<string>;
    teams: Array<string>;
    stories: Array<string>;
    assets: Array<string>;
}

export interface BaseMediaRequest {
    media: MediaEntity;
}

export interface MediaByAssetsRequest {
    assetId: string;
}

export interface MediaRequest {
    mediaId: string;
}

export interface AddMediaRequest {
    media: Omit<MediaEntity, BaseEntity>;
}

export interface UpdateMediaRequest extends BaseMediaRequest {}

export interface ArchiveMediaRequest extends MediaRequest {}

export interface DeleteMediaRequest extends MediaRequest {}
