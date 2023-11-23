import React from 'react';
import {
    BurnOptionImageContainer,
    BurnOptionDescriptionContainer,
} from '@styles/index';
import { BurnOption } from '@components/Burn/BurnOption';

const Upgrade3DImage =
    'https://storage.googleapis.com/billmurray1000/WebAssets/image/Upgrade.png';

type OptionUpgradeProps<P = {}> = P;

export const OptionUpgrade: React.FC<OptionUpgradeProps> = (props) => {
    const {} = props;

    return (
        <BurnOption id={'upgrade-option'} optionSelected={'upgrade'}>
            <BurnOptionImageContainer id={'option-image-container'}>
                <img
                    src={Upgrade3DImage}
                    alt="Bill Frame Upgrade"
                    className="3d-upgrade-image-initial"
                />
            </BurnOptionImageContainer>
            <BurnOptionDescriptionContainer id={'option-description-container'}>
                <div>
                    <h2>{'3D Glass Frame Upgrade'}</h2>
                    <p>
                        {
                            'Upgrade your Bill Murray 3D glass frames. This is still in development. However, you can preview what your Bill will look like with one burnt 3D Glasses.'
                        }
                    </p>
                </div>
            </BurnOptionDescriptionContainer>
        </BurnOption>
    );
};
