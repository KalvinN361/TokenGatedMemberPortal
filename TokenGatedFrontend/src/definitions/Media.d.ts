import { Base } from './Base';

export type MediaContainerProps<P = {}> = P;
export type MediaButtonProps<
    P = {
        mediaType: 'description' | 'audio' | 'video' | 'image';
        isActive: boolean;
        onClick: () => void;
    },
> = P;

export type MediaPlayerProps<
    P = {
        mediaType: 'description' | 'audio' | 'video' | 'image';
        assetIds: Array<string>;
    },
> = P;
export type MediaAudioProps<
    P = {
        mediaType: 'description' | 'audio' | 'video' | 'image';
    },
> = P;
export type ImageViewerProps<
    P = {
        images: Array<Media>;
    },
> = P;
export type ImageSliderProps<
    P = {
        images: Array<Media>;
    },
> = P;

export interface Media extends Base {
    description: string;
    map: MediaMap;
    name: string;
    type: string;
    url: string;
    category: string;
}
