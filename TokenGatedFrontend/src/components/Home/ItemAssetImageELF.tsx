import React, { useEffect, useRef, useState } from 'react';
import { Asset, Asset1155Portal, ItemProps } from '@definitions/index';
import { NFTImg } from '@styles/index';
import { useSelector } from 'react-redux';
import { RootState } from '@state/index';
import { Metadata } from '@definitions/HyperMint';
import { isAsset, isAsset1155Portal } from '@libs/utils';

export const ItemAssetImageELF: React.FC<ItemProps> = (props) => {
    const {} = props;
    const asset = useSelector((state: RootState) => state.assets);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [image, setImage] = useState<string>('');
    const onLoad = () => {
        setLoaded(true);
    };
    useEffect(() => {
        if (!asset.current) return;
        if (isAsset(asset.current)) {
            setImage(
                (asset.current as Asset).imageSmall ||
                    (asset.current as Asset).image
            );
        } else if (isAsset1155Portal(asset.current)) {
            setImage((asset.current as Asset1155Portal).token1155.image);
        }
    }, [asset.current]);
    return (
        <React.Fragment>
            <NFTImg
                className={loaded ? 'loaded' : ''}
                src={image}
                onLoad={onLoad}
            />
            {/*{!loaded && <NFTImg src={loadingGif}/>}*/}
        </React.Fragment>
    );
};
