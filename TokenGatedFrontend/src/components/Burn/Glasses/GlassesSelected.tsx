import React from 'react';
import { RootState } from '@state/store';
import { useSelector } from 'react-redux';
import { Selected } from '@components/Burn/Glasses/Upgrade/Selected';

type Selected3DProps<P = {}> = P;

export const GlassesSelected: React.FC<Selected3DProps> = (props) => {
    const {} = props;
    const glasses = useSelector((state: RootState) => state.burn.current);
    return (
        <Selected id={'selected-glasses-container'} className={'mx-4'}>
            {glasses.animation && (
                <video
                    className="select-3dglasses-video max-w-1/2"
                    src={glasses.animation}
                    autoPlay
                    loop
                    muted
                    poster={glasses.image ? glasses.image : ''}
                />
            )}
            {glasses.image && !glasses.animation && (
                <img
                    className="select-3dglasses-image"
                    src={glasses.image}
                    alt="3D Glasses"
                />
            )}
            <div className={'selected-3dglasses-details'}>
                <p>
                    {glasses?.name} - {glasses?.tokenId}
                </p>
            </div>
        </Selected>
    );
};
