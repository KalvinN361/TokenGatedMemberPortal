import styled from 'styled-components';
import React, { FC, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { Api } from '@libs/API';
import { Contract as ContractType } from '@definitions/Contract';
import {
    getChainNetwork,
    getGasPrice,
    getUnitName,
    getWalletBalance,
} from '@libs/blockchain';

type WalletOwnerInfoProps<
    P = {
        contractId: string;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
        isMagic: boolean;
        walletAddress: string;
    },
> = P;

export const WalletOwnerInfo: FC<WalletOwnerInfoProps> = (props) => {
    const { contractId, className, id, isMagic = false, walletAddress } = props;
    const [network, setNetwork] = useState<string>('Ethereum');
    const [networkId, setNetworkId] = useState<number>(1);
    const [balance, setBalance] = useState<string>('0');
    const [unit, setUnit] = useState<string>('ETH');
    const [gasEstimate, setGasEstimate] = useState<string>('0');

    useEffect(() => {
        (async () => {
            let dbContract = (await Api.contract.getOneByContractId(
                contractId
            )) as ContractType;
            const { chainId } = dbContract;
            setNetwork(getChainNetwork(chainId) as string);
            setNetworkId(chainId);
            setBalance(
                (
                    await getWalletBalance(isMagic, walletAddress, chainId)
                ).toString()
            );
            setUnit(getUnitName(chainId) as string);
            setGasEstimate(await getGasPrice(chainId));
        })();
    }, [contractId, isMagic, walletAddress]);

    return (
        <WalletOwnerInfoStyled className={className} id={id}>
            <h1>Wallet Info:</h1>
            <p>{`Network: ${network}`}</p>
            <p>{`Wallet: ${walletAddress}`}</p>
            <p>{`Balance: ${balance} ${unit}`}</p>
            <p>{`Gas Estimate: ${gasEstimate} ${unit}`}</p>
        </WalletOwnerInfoStyled>
    );
};

export const WalletOwnerInfoStyled = styled.div`
    ${tw`text-sm text-black`}
    & > h1 {
        ${tw`text-lg font-bold`}
    }

    & > p {
        ${tw`text-sm font-normal`}
    }
`;

export default WalletOwnerInfo;
