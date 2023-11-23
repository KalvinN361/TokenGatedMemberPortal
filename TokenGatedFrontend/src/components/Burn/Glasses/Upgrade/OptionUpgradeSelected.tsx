import React, { useEffect, useState } from 'react';
import {
    BillSelectionModal,
    BillSelectedNone,
    GlassesSelected,
    BillSelected,
} from '@components/Burn';
import { FaEquals, FaPlus } from 'react-icons/fa';
import { Asset, Attribute } from '@definitions/Asset';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { getEmbellishment, getNewFrame } from '@libs/utils';
import styled from 'styled-components';
import tw from 'twin.macro';
import { setBurnSelected, setSelectedAsset } from '@state/features';
import UpgradePreview from '@components/Burn/Glasses/Upgrade/UpgradePreview';
import UpgradeCard from '@components/Burn/Glasses/Upgrade/UpgradeCard';
import { WalletOwnerInfo } from '@components/Wallet';

type OptionUpgradeSelectedProps<P = {}> = P;

export const OptionUpgradeSelected: React.FC<OptionUpgradeSelectedProps> = (
    props
) => {
    const {} = props;
    const dispatch = useDispatch();
    const [billSelectModalOpen, setBillSelectModalOpen] =
        useState<boolean>(false);
    const burn = useSelector((state: RootState) => state.burn);
    const owner = useSelector((state: RootState) => state.owner);

    const handleBillSelectModal = () => {
        setBillSelectModalOpen(true);
    };

    const handleImageClick = (asset: Asset) => {
        dispatch(setSelectedAsset(asset));
        dispatch(setBurnSelected(burn.current.burnNow));
        setBillSelectModalOpen(false); // Optionally close the select modal after selecting an asset
    };

    return (
        <UpgradeWrapper id={'upgrade-wrapper'}>
            <UpgradeContainer className="card-container">
                <UpgradeCard className="card-bill">
                    <UpgradeCardContent
                        onClick={handleBillSelectModal}
                        className="card-content"
                    >
                        {!burn.selectedAsset.image ? (
                            <BillSelectedNone />
                        ) : (
                            <BillSelected />
                        )}
                    </UpgradeCardContent>
                </UpgradeCard>
                <UpgradeSymbol className="plus-sign">
                    <FaPlus />
                </UpgradeSymbol>
                <UpgradeCard className="card-3dglasses">
                    <GlassesSelected />
                </UpgradeCard>
                <UpgradeSymbol className="plus-sign">
                    <FaEquals />
                </UpgradeSymbol>
                <UpgradeCard className="card-bill-preview">
                    <UpgradePreview />
                </UpgradeCard>
            </UpgradeContainer>
            <UpgradeDetailContainer className={'upgrade-details'}>
                <UpgradeDetails className={'selected-bill-details'}>
                    <h2>Upgrade your Bill</h2>
                    <p>
                        Click the left panel to choose your Bill to Upgrade and
                        you will see your preview.
                    </p>
                    <p>
                        Disclaimer: If you upgrade, this will be permanent on
                        the chain and will be able to revert the change.
                    </p>
                </UpgradeDetails>
                <WalletOwnerInfo
                    contractId={burn.current.contractId}
                    id={'wallet-owner-info'}
                    isMagic={false}
                    walletAddress={owner.walletAddress}
                />
            </UpgradeDetailContainer>
            {billSelectModalOpen && (
                <BillSelectionModal
                    handleImageClick={handleImageClick}
                    billSelectModalOpen={billSelectModalOpen}
                />
            )}
        </UpgradeWrapper>
    );
};

const UpgradeWrapper = styled.div`
    ${tw`flex flex-col w-full py-4 md:py-0`}
`;

const UpgradeContainer = styled.div`
    ${tw`flex flex-col md:flex-row w-full items-center justify-evenly h-full md:h-4/5 overflow-auto`}
`;

const UpgradeCardContent = styled.div`
    ${tw`flex flex-col h-full items-center justify-center md:p-4`}
`;

const UpgradeSymbol = styled.div`
    ${tw`items-center flex text-[64px]`}
`;

const UpgradeDetailContainer = styled.div`
    ${tw`flex flex-row w-full h-full md:h-2/5 justify-center items-center`}
`;

const UpgradeDetails = styled.div`
    ${tw`p-4 w-1/2`}
    > h2 {
        ${tw`font-bold text-lg`}
    }

    > p {
        ${tw``}
    }
`;
