import React, { useEffect } from 'react';
import { BurnOptionImageContainer } from '@styles/index';
import { setBurnSelected } from '@state/features';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { WalletOwnerInfo } from '@components/Wallet';
import { Api } from '@libs/API';
import { PVHeader } from '@components/Base';
import { BurnOption } from '@components/Burn/BurnOption';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BurnOptionDescriptionContainer } from '@components/Burn/BurnOptionDescription';

type OptionBurnAndTurnProps<P = {}> = P;

export const OptionBurnAndTurn: React.FC<OptionBurnAndTurnProps> = (props) => {
    const {} = props;
    const dispatch = useDispatch();
    const burn = useSelector((state: RootState) => state.burn);
    const owner = useSelector((state: RootState) => state.owner);

    const BurnAndTurnImage =
        'https://storage.googleapis.com/billmurray1000/WebAssets/image/C3D.png';

    useEffect(() => {
        (async () => {
            let contract = await Api.contract.getOneByContractId(
                burn.current.contractId
            );
        })();
    }, [burn.current]);

    return (
        <BurnOption
            id={'burn-and-turn'}
            optionSelected={'burnandturn'}
            onSelect={() => dispatch(setBurnSelected(burn.current.burnNow))}
        >
            <BurnOptionImageContainer className={'h-4/5'}>
                <PVHeader
                    className={'text-center'}
                    id={'selected-curtain-details'}
                >
                    <h1>
                        {`${burn.current?.name} - Token #${burn.current?.tokenId}`}
                    </h1>
                </PVHeader>
                <img
                    src={BurnAndTurnImage}
                    alt="Burn Curtain"
                    className={burn.selected}
                />
            </BurnOptionImageContainer>
            <BurnOptionDescriptionContainer id={'bnt-description-container'}>
                <BurnOptionDescription>
                    <h2>{'Burn and Turn'}</h2>
                    <p>
                        {'Get a pair of 3D glasses for your burning curtain!'}
                    </p>
                    <p>
                        {'Click this panel to start to continue with the burn'}
                    </p>
                </BurnOptionDescription>
                <WalletOwnerInfo
                    contractId={burn.current.contractId}
                    id={'wallet-owner-info'}
                    isMagic={false}
                    walletAddress={owner.walletAddress}
                />
            </BurnOptionDescriptionContainer>
        </BurnOption>
    );
};

const BurnOptionDescription = styled.div`
    ${tw`text-left md:w-1/3 mb-4 md:mb-0`}
    > h2 {
        ${tw`text-lg font-bold`}
    }

    > p {
        ${tw`text-sm font-normal`}
    }
`;

export default OptionBurnAndTurn;
