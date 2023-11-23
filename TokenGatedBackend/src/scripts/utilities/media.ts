import { AssetEntity, MediaEntity } from '../../entity';
import { getAll } from '../manager';
import { dataSource } from './database';

export const getMediaForAsset = async (asset: AssetEntity) => {
    if (!asset) return null;

    const allMedia = (await dataSource
        .createQueryBuilder(MediaEntity, 'm')
        .where('m.archived=:archived', {
            archived: false,
        })
        .getMany()) as Array<MediaEntity>;

    return getAllMedia(allMedia, asset);
};
export const getMediaForAssetAndType = async (
    asset: AssetEntity,
    type: string
) => {
    if (!asset) return null;
    const allMedia = (await dataSource
        .createQueryBuilder(MediaEntity, 'm')
        .where('m.archived=:archived and m.type=:type', {
            archived: false,
            type: type,
        })
        .getMany()) as Array<MediaEntity>;

    return getAllMedia(allMedia, asset);
};

const getAllMedia = async (
    allMedia: Array<MediaEntity>,
    asset: AssetEntity
) => {
    const mediaArray: Array<MediaEntity> = [];
    const contractId = asset.contractId;
    const team = asset.attributes.filter(
        (attr) => attr.traitType === 'Colorway'
    )[0]?.value;
    const story = asset.name;
    for (const media of allMedia) {
        if (media.map.all) {
            mediaArray.push(media);
        }
        if (media.map.contracts.length > 0) {
            if (
                media.map.contracts.includes(contractId) &&
                !mediaArray.includes(media)
            ) {
                mediaArray.push(media);
            }
        }
        if (media.map.teams.length > 0) {
            if (media.map.teams.includes(team) && !mediaArray.includes(media)) {
                mediaArray.push(media);
            }
        }
        if (media.map.stories.length > 0) {
            if (
                media.map.stories.includes(story) &&
                !mediaArray.includes(media)
            ) {
                mediaArray.push(media);
            }
        }
        if (media.map.assets.length > 0) {
            if (
                media.map.assets.includes(asset.id) &&
                !mediaArray.includes(media)
            ) {
                mediaArray.push(media);
            }
        }
    }
    return mediaArray;
};
