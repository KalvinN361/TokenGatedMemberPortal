import React, { FC, useState } from 'react';
import { RootState } from '@state/store';
import { useSelector } from 'react-redux';
import { isAsset } from '@libs/utils';
import { Asset } from '@definitions/Asset';
import { TransferModalComponent } from '@components/Transfer/TransferModal';
import {
    Overlay,
    PVPage,
    PVBody,
    PVFooter,
    PVHeader,
    PoweredByVenkman,
    PVGridContainer,
} from '@components/Base';
import { TransferCardContainer } from '@components/Transfer';
import { FaCircleInfo } from 'react-icons/fa6';

type TransferProps<P = {}> = P;

export const Transfer: FC<TransferProps> = (props) => {
    const {} = props;
    const assets = useSelector((state: RootState) => state.assets);
    const [openTransferModal, setOpenTransferModal] = useState<boolean>(false);
    const [openInfoModal, setOpenInfoModal] = useState<boolean>(true);
    const [selectedTransferAsset, setSelectedTransferAsset] =
        useState<Asset | null>(null);
    const billSplash =
        'https://storage.googleapis.com/billmurray1000/WebAssets/image/Backgrounds/Blank-Desk.jpg';

    return (
        <PVPage id={'transfer-page-container'} bgImage={billSplash}>
            <Overlay id={'transfer-page-overlay'} color={'black'} />
            <PVHeader id={'transfer-page-header'}>
                <h1 className={'flex gap-4 justify-center'}>
                    Your Digital Memberships and Tokens
                    <FaCircleInfo className={'text-white'} />
                </h1>
            </PVHeader>
            <PVBody id={'transfer-page-body'}>
                <PVGridContainer id={'transfer-grid-container'} columns={6}>
                    {(assets.owned.filter((a) => isAsset(a)) as Array<Asset>)
                        .sort((a: Asset, b: Asset) =>
                            a.contractId.localeCompare(b.contractId)
                        )
                        .map(
                            (asset) =>
                                asset.name !== null && (
                                    <TransferCardContainer
                                        asset={asset}
                                        setOpenTransferModal={
                                            setOpenTransferModal
                                        }
                                        setSelectedTransferAsset={
                                            setSelectedTransferAsset
                                        }
                                    />
                                )
                        )}
                </PVGridContainer>
            </PVBody>
            <PVFooter id={'transfer-page-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
            {openTransferModal && (
                <TransferModalComponent
                    openTransferModal={openTransferModal}
                    setOpenTransferModal={setOpenTransferModal}
                    selectedTransferAsset={selectedTransferAsset}
                />
            )}
            {openInfoModal && <div></div>}
        </PVPage>
    );
};

export default Transfer;
