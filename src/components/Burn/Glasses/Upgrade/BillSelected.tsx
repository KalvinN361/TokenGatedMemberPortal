import React from 'react';
import { RootState } from '@state/store';
import { useSelector } from 'react-redux';
import { Selected } from '@components/Burn/Glasses/Upgrade/Selected';

type BillSelectedProps<P = {}> = P;

export const BillSelected: React.FC<BillSelectedProps> = (props) => {
    const {} = props;
    const burn = useSelector((state: RootState) => state.burn);
    return (
        <Selected className={'add-bill-image'} id={'selected-bill'}>
            <img
                className="select-bill-image"
                src={burn.selectedAsset.image}
                alt="Image 1"
            />
            <div className={'selected-bill-details'}>
                <p>
                    {burn.selectedAsset?.name} - Token ID:{' '}
                    {burn.selectedAsset?.tokenId}
                </p>
            </div>
        </Selected>
    );
};
