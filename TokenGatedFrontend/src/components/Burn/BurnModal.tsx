import React, {
    useState,
    FC,
    useEffect,
    Dispatch,
    SetStateAction,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BurnAsset } from '@definitions/index';
import { RootState } from '@state/store';
import { useNavigate } from 'react-router';
import { Api } from '@libs/API';
import { GlassesOptions } from '@components/Burn/Glasses/GlassesOptions';
import { CurtainOptions } from '@components/Burn/Curtains/CurtainOptions';
import {
    setBurnAssets,
    setBurnNowType,
    setBurnSelected,
} from '@state/features';
import { burnCurtainsMethod } from '@libs/burnMethods';
import {
    PVModal,
    PVModalButton,
    PVModalBody,
    PVModalHeader,
    PVModalFooter,
} from '@components/Base';
import styled from 'styled-components';
import tw from 'twin.macro';

type BurnModalProps<
    P = {
        openBurnModal: boolean;
        setOpenBurnModal: Dispatch<SetStateAction<boolean>>;
        selectedBurnAsset: BurnAsset | null;
    },
> = P;

enum Burn3DStatus {
    Burn = 'Burn',
    Burning = 'Burning...',
    Burned = 'Burned!!',
    BurnFailed = 'Burn Failed! Click to Try Again.',
    Minting3D = 'Minting 3D Glasses...',
    Minted = '3D Glasses Minted! Click to Refresh Site.',
    MintFailed = 'Mint Failed! Click to Try Again.',
    NotReady = 'Not Ready Yet! Coming Soon!',
}

export const BurnModalComponent: FC<BurnModalProps> = (props) => {
    const { openBurnModal, setOpenBurnModal, selectedBurnAsset } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const owner = useSelector((state: RootState) => state.owner);
    const [burnStatus, setBurnStatus] = useState<Burn3DStatus>(
        Burn3DStatus.Burn
    );
    const burn = useSelector((state: RootState) => state.burn);
    const [spinnerHidden, setSpinnerHidden] = useState(true);
    const [burnButtonDisabled, setBurnButtonDisabled] = useState(false);

    const handleCloseModal = () => {
        console.log('closing modal');
        dispatch(setBurnSelected(''));
        setOpenBurnModal(false);
    };

    const handleBurnMethod = async () => {
        if (burnStatus === '3D Glasses Minted! Click to Refresh Site.') {
            let newBurnAssets = await Api.asset.getAllBurnablesByWalletAddress(
                owner.walletAddress
            );
            dispatch(setBurnAssets(newBurnAssets));
            navigate('/Burn');
        }
        switch (burn.type) {
            case 'burnandturn':
                await burnAndTurnMethod();
                break;
            case '3dGlasses':
                //await upgrade3DGlassesMethod(currentBurnAsset, selectedBill);
                setBurnButtonDisabled(true);
                setBurnStatus(Burn3DStatus.NotReady);
                break;
            default:
                break;
        }
    };

    const burnAndTurnMethod = async () => {
        setBurnStatus(Burn3DStatus.Burning);
        setSpinnerHidden(false);
        setBurnButtonDisabled(true);
        let success = await burnCurtainsMethod(
            burn.current,
            owner.walletAddress
        ).then(async (res) => {
            return res;
        });
        if (success) {
            await mint3DGlasses();
        } else {
            setBurnStatus(Burn3DStatus.BurnFailed);
            setSpinnerHidden(true);
            setBurnButtonDisabled(false);
        }
    };

    const mint3DGlasses = async () => {
        console.log('Time to Mint!');
        setBurnStatus(Burn3DStatus.Burned);
        //setSpinnerHidden(true);
        setBurnStatus(Burn3DStatus.Minting3D);
        let mTx = await Api.blockchain.mint3DTest(owner.walletAddress);
        if (mTx.status === 'success') {
            setBurnStatus(Burn3DStatus.Minted);
        } else if (mTx.status === 'failed') {
            setBurnStatus(Burn3DStatus.MintFailed);
        }
        let newBurnAssets = await Api.asset.getAllBurnablesByWalletAddress(
            owner.walletAddress
        );
        dispatch(setBurnAssets(newBurnAssets));
        setSpinnerHidden(true);
        setBurnButtonDisabled(false);
    };

    useEffect(() => {
        if (!burn.current) return;
        dispatch(setBurnNowType(burn.current.burnNow));
    }, [burn.current]);

    return (
        <PVModal id="burn-modal" openModal={openBurnModal}>
            <PVModalHeader id={'burn-modal-header'}>
                <h1>Choose what you would like to do with your burn item.</h1>
            </PVModalHeader>
            <PVModalBody id={'burn-modal-body'}>
                <BurnModalOptionsContainer className={'burn-options'}>
                    {burn.optionPanel === '3dGlasses' && <GlassesOptions />}
                    {burn.optionPanel === 'burnandturn' && <CurtainOptions />}
                </BurnModalOptionsContainer>
            </PVModalBody>
            <PVModalFooter id={'burn-modal-footer'}>
                {(burnStatus === Burn3DStatus.Burn ||
                    burnStatus === Burn3DStatus.BurnFailed ||
                    burnStatus === Burn3DStatus.NotReady) && (
                    <PVModalButton id={'burn-cancel'} handle={handleCloseModal}>
                        Cancel
                    </PVModalButton>
                )}
                {burn.selected !== '' && (
                    <PVModalButton
                        id={'burn-status'}
                        handle={handleBurnMethod}
                        disabled={burnButtonDisabled}
                    >
                        {burnStatus}
                    </PVModalButton>
                )}
            </PVModalFooter>
        </PVModal>
    );
};

const BurnModalOptionsContainer = styled.div`
    ${tw`relative bg-gray-200 h-full w-full`}
`;

export default BurnModalComponent;
