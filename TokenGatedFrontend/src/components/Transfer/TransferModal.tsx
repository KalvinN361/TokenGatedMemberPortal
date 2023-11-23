import React, {
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import { Asset } from '@definitions/Asset';
import { isAddress } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { transferBlockchain, transferMagic } from '@libs/blockchain';
import { Api } from '@libs/API';
import { EthNetwork } from '@definitions/Blockchain';
import { setOwnedAssets } from '@state/features';
import { Asset1155Portal } from '@definitions/Asset1155';
import {
    PVModalHeader,
    PVModal,
    PVModalBody,
    PVModalFooter,
    PVModalButton,
} from '@components/Base';
import { WalletOwnerInfo, WalletTransferInput } from '@components/Wallet';
import styled from 'styled-components';
import tw from 'twin.macro';

type TransferModalProps<
    P = {
        openTransferModal: boolean;
        setOpenTransferModal: Dispatch<SetStateAction<boolean>>;
        selectedTransferAsset: Asset | null;
    },
> = P;

export const TransferModalComponent: FC<TransferModalProps> = (props) => {
    const { openTransferModal, setOpenTransferModal, selectedTransferAsset } =
        props;
    const dispatch = useDispatch();
    const assets = useSelector((state: RootState) => state.assets);
    const [error, setError] = useState<'empty' | 'error' | 'valid'>('empty');
    const [toWalletAddress, setToWalletAddress] = useState<string>('');
    const [disabled, setDisabled] = useState<boolean>(true);
    const [status, setStatus] = useState<string>('Transfer');
    const [cancel, setCancel] = useState<string>('Cancel');
    const owner = useSelector((state: RootState) => state.owner);

    const handleCloseModal = () => {
        setOpenTransferModal(false);
    };
    const handleTransfer = () => {
        (async () => {
            setStatus('Transferring');
            setDisabled(true);
            try {
                if (owner.isMagic) {
                    console.log('transferMagic');
                    let tx = await transferMagic(
                        selectedTransferAsset!,
                        toWalletAddress
                    );
                    console.log({ tx });
                } else {
                    console.log('transferBlockchain');
                    let tx = await transferBlockchain(
                        selectedTransferAsset!,
                        toWalletAddress
                    );
                    console.log({ tx });
                }
                setStatus('Transfer Complete');
                let newAssets: Array<Asset | Asset1155Portal> =
                    (await Api.asset.getAlByWalletAddressNoBurnables(
                        owner.walletAddress
                    )) as Array<Asset | Asset1155Portal>;
                if (assets.ocean) newAssets = newAssets.concat(assets.ocean);
                dispatch(setOwnedAssets(newAssets));
                setCancel('Finished, Close Window');
            } catch (e) {
                console.log(e);
                setStatus('Transfer Failed');
                setCancel('Close Window');
            }
        })();
    };
    const handleWalletKeyUpCapture = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!isAddress(e.currentTarget.value)) {
            setError('error');
            setDisabled(true);
            return;
        }
        setToWalletAddress(e.currentTarget.value);
        setError('valid');
        setDisabled(false);
    };

    useEffect(() => {
        if (!owner) return;
        console.log(owner);
    }, [owner]);

    return (
        <PVModal id={'transfer-modal'} openModal={openTransferModal}>
            <PVModalHeader id={'transfer-modal-header'}>
                <h1>{`Transfer ${selectedTransferAsset?.name} (Token ID: ${selectedTransferAsset?.tokenId})`}</h1>
            </PVModalHeader>
            <PVModalBody id={'transfer-modal-body'}>
                <ModalBodyLeft id={'modal-body-left'}>
                    <img
                        src={
                            selectedTransferAsset?.imageSmall ||
                            selectedTransferAsset?.image
                        }
                        alt={'Membership Image'}
                    />
                </ModalBodyLeft>
                <ModalBodyRight id={'modal-body-right'}>
                    <WalletTransferInput
                        id={'transfer-wallet-input'}
                        handleOnChange={(e) => handleWalletKeyUpCapture(e)}
                        error={error}
                    />
                    <WalletOwnerInfo
                        contractId={selectedTransferAsset!.contractId}
                        id={'wallet-owner-info'}
                        isMagic={owner.isMagic}
                        walletAddress={owner.walletAddress}
                    />
                </ModalBodyRight>
            </PVModalBody>
            <PVModalFooter id={'transfer-modal-footer'}>
                <PVModalButton id={'burn-cancel'} handle={handleCloseModal}>
                    {cancel}
                </PVModalButton>
                <PVModalButton
                    id={'transfer-status'}
                    disabled={disabled}
                    handle={handleTransfer}
                >
                    {status}
                </PVModalButton>
            </PVModalFooter>
        </PVModal>
    );
};

const ModalBodyLeft = styled.div`
    ${tw`bg-gray-300 w-full md:w-1/2 h-1/2 md:h-full relative flex flex-col justify-center items-center py-4 px-4`}
    & > img {
        ${tw`h-auto max-h-full border-white border-solid border-8 rounded-md`}
    }
`;

const ModalBodyRight = styled.div`
    ${tw`bg-white w-full md:w-1/2 h-1/2 md:h-full p-4`}
`;

export default TransferModalComponent;
