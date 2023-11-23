import { Asset } from '@definitions/Asset';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { isAsset } from '@libs/utils';
import styled from 'styled-components';
import tw from 'twin.macro';
import {
    PVFooter,
    PVHeader,
    PVModal,
    PVModalFooter,
    PVModalHeader,
} from '@components/Base';
import PVBody from '@components/Base/PVPage/PVBody';
import PVModalBody from '../../Base/PVModal/PVModalBody';

type BillSelectionModalProps<
    P = {
        handleImageClick: (walletAsset: Asset) => void;
        billSelectModalOpen: boolean;
    },
> = P;

const bm1000ContractIds = [
    '40000001-0001-0001-0002-000000000001',
    '40000001-0001-0001-0002-000000000002',
    'efe0d138-eb40-4ec8-8714-0d02ca5b59ab',
];

export const BillSelectionModal: React.FC<BillSelectionModalProps> = (
    props
) => {
    const { handleImageClick, billSelectModalOpen } = props;
    const assets = useSelector((state: RootState) => state.assets);
    const billMurray721 = assets.owned.filter((asset) =>
        isAsset(asset)
    ) as Array<Asset>;

    useEffect(() => {
        console.log({ assets });
    }, [assets]);

    return (
        <PVModal id={'bill-selection-modal'} openModal={billSelectModalOpen}>
            <PVModalHeader id={'bill-selection-header'}>
                <h1>Please Select Your Bill Murray to Upgrade</h1>
            </PVModalHeader>
            <PVModalBody id={'bill-selection-body'} className={''}>
                <BillSelectionGridContainer>
                    {billMurray721
                        .filter((asset) =>
                            bm1000ContractIds.includes(asset.contractId)
                        )
                        .sort(
                            (a, b) => parseInt(a.tokenId) - parseInt(b.tokenId)
                        )
                        .map((asset: Asset, i: number) => (
                            <div key={i}>
                                <img
                                    key={asset.id}
                                    src={asset.imageSmall || asset.image}
                                    alt={asset.name}
                                    onClick={() => handleImageClick(asset)}
                                />
                                <div>
                                    <p>{`${asset.name} - Token ID: ${asset.tokenId}`}</p>
                                </div>
                            </div>
                        ))}
                </BillSelectionGridContainer>
            </PVModalBody>
            <PVModalFooter id={'bill-selection-footer'}></PVModalFooter>
        </PVModal>
    );
};

const BillSelectionGridContainer = styled.div`
    ${tw`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 overflow-auto`}
    > div {
        ${tw`relative hover:border-green-500`}
        > img {
            ${tw`max-w-full h-auto hover:opacity-50 cursor-pointer hover:border-4 border-solid`}
        }

        > div {
            ${tw`text-white bg-black/50 absolute bottom-0 w-full p-2`}
        }
    }
`;
