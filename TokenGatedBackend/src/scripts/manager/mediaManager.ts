import { AssetEntity, MediaEntity } from '../../entity';
import { getAssetOne } from './assetManager';
import { getAll } from './baseManager';

export const getMediaByAsset = async (assetId: string) => {
    let asset = (await getAssetOne(assetId)) as AssetEntity;
    let media = (await getAll(MediaEntity)) as Array<MediaEntity>;
    let viewableMedia = await allViewableMediaByAsset(media, asset);
};

export const allViewableMediaByAsset = async (
    media: Array<MediaEntity>,
    asset: AssetEntity
) => {
    let viewableMedia = [];
    let contractId = asset.contractId;
    let team = asset.attributes.filter(
        (attr) => attr.traitType === 'Colorway'
    )[0]?.value;
    let story = asset.name;

    for (let m of media) {
        if (m.map.all) {
            viewableMedia.push(m);
        }
        if (m.map.contracts.length > 0) {
            if (
                m.map.contracts.includes(contractId) &&
                !viewableMedia.includes(m)
            ) {
                viewableMedia.push(m);
            }
        }
        if (m.map.teams.length > 0) {
            if (m.map.teams.includes(team) && !viewableMedia.includes(m)) {
                viewableMedia.push(m);
            }
        }
        if (m.map.stories.length > 0) {
            if (m.map.stories.includes(story) && !viewableMedia.includes(m)) {
                viewableMedia.push(m);
            }
        }
        if (m.map.assets.length > 0) {
            if (m.map.assets.includes(asset.id) && !viewableMedia.includes(m)) {
                viewableMedia.push(m);
            }
        }
    }
    return viewableMedia;
};
