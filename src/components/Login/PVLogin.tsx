import React, { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { Api, truncateAddress } from '@libs/index';
import { SiweMessage } from 'siwe';
import {
    setMessageSigned,
    setName,
    setWalletAddress,
    setIsMagic,
} from '@state/features';
import { Magic } from 'magic-sdk';
import { PiCoinVerticalBold } from 'react-icons/pi';
import styled from 'styled-components';
import { FaRegEnvelope, FaRegEnvelopeOpen } from 'react-icons/fa';
import tw from 'twin.macro';

export const PVLogin = () => {
    const { open, close } = useWeb3Modal();
    const project = process.env.REACT_APP_PROJECT as string;
    const { isConnected, isDisconnected, address, status } = useAccount();
    const { disconnect } = useDisconnect();
    axios.defaults.withCredentials = true;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const label = isConnected ? 'Log Off' : 'Log On';
    const {
        data,
        isError,
        error,
        isLoading,
        isSuccess,
        signMessage,
        signMessageAsync,
        reset,
    } = useSignMessage({
        message: message,
        onError(error) {
            console.log('PV::Error::', error);
        },
        onSuccess(data) {
            dispatch(setMessageSigned(true));
            console.log(`PV::${new Date().toISOString()}::Message Signed`);
        },
    });
    const onOpen = async () => {
        console.log('PV::onOpen::Loading Wallet Connect');
        setLoading(true);
        await open();
        setLoading(false);
        console.log('PV::onOpen::Finished Loading Wallet Connect');
    };
    const onClick = async () => {
        if (isConnected) {
            console.log(`PV::${new Date().toISOString()}::Disconnecting`);
            disconnect();
            close();
            new Magic(process.env.REACT_APP_MAGIC_KEY as string).user.logout();
            setMessage(undefined);
            dispatch(setIsMagic(false));
            localStorage.clear();
            //clearAllCookies();
            reset();
            dispatch(setWalletAddress(''));
            dispatch(setMessageSigned(false));
            navigate('/');
        } else await onOpen();
    };

    const navUnclaimed = () => {
        navigate('/Unclaimed');
    };

    useEffect(() => {
        console.log({ project });
        if (!project) return;
        dispatch(setName(project));
    }, [project]);

    useEffect(() => {
        if (!address && !isConnected) return;
        try {
            console.log(`PV::${new Date().toISOString()}::Signing message`);
            (async () => {
                const domain = window.location.host;
                const origin = window.location.origin;
                let nonce = await Api.auth.generateChallenge();
                let siweMessage = new SiweMessage({
                    domain: domain,
                    address: address,
                    statement: origin,
                    uri: origin,
                    chainId: 137,
                    version: '1',
                    nonce: nonce,
                });
                setMessage(siweMessage.prepareMessage());
            })();
        } catch (err: any) {
            console.log(isError, err);
        }
    }, [isConnected, address]);

    useEffect(() => {
        if (!message) return;
        signMessage();
    }, [message]);

    useEffect(() => {
        (async () => {
            if (isSuccess && message) {
                try {
                    await Api.auth.issueTokens(message, data!.toString());
                } catch (err: any) {
                    if (err.response && err.response.status === 403) {
                        navigate('/login');
                    }
                }
                localStorage.setItem('IssuedTokens', 'true');
                dispatch(setWalletAddress(address!.toString()));
                navigate('/Home');
            } else if (isError) {
                console.log('error', error);
                navigate('/');
            }
        })();
    }, [isSuccess, message]);

    return (
        <ConnectedButtonGrid id={'connected-button-grid'}>
            <div
                className={
                    'w-full relative flex flex-col justify-center md:justify-end'
                }
            >
                <ConnectedButtonContainer id={'connected-button-container'}>
                    <ConnectedButton
                        className={'coinCheck'}
                        onClick={() => navUnclaimed()}
                    >
                        <ConnectedButtonText>
                            <PiCoinVerticalBold />
                            Coin Check
                        </ConnectedButtonText>
                    </ConnectedButton>
                    <ConnectedButton
                        id={'connected-button'}
                        type="button"
                        className="btn btn-primary connectWallet"
                        onClick={onClick}
                    >
                        <ConnectedButtonText>
                            {label === 'Log On' ? (
                                <EnvelopeIcon />
                            ) : (
                                <EnvelopeOpenIcon />
                            )}
                            {loading ? 'Loading...' : label}
                        </ConnectedButtonText>
                    </ConnectedButton>
                </ConnectedButtonContainer>
                <ConnectedAddress className={'address'}>
                    {isConnected
                        ? 'Connected to ' + truncateAddress(address!.toString())
                        : ''}
                </ConnectedAddress>
            </div>
        </ConnectedButtonGrid>
    );
};

const ConnectedButtonGrid = styled.div`
    ${tw`
		flex flex-row justify-center items-center z-100
		w-auto h-[60px]
		my-0 mx-4 p-0
		absolute top-0 right-0
	`};

    &.logged-in {
        ${tw`absolute top-0 right-0`}
    }
`;
const ConnectedButtonContainer = styled.div`
    ${tw`
		flex flex-row justify-center
	`};

    > span {
        ${tw`w-full`}
        &.address {
            ${tw`text-xs text-gray-600 flex-nowrap w-full`};
        }
    }
`;

const ConnectedAddress = styled.span`
    ${tw`text-xs text-yellow-200 flex-nowrap w-full flex flex-row justify-end`};
`;

const EnvelopeIcon = styled(FaRegEnvelope)`
    ${tw`text-white`};
`;

const EnvelopeOpenIcon = styled(FaRegEnvelopeOpen)`
    ${tw`text-white`};
`;

const ConnectedButtonText = styled.span`
    ${tw`portrait:md:text-2xl flex flex-row gap-2 justify-center items-center`};
`;

const ConnectedButton = styled.button`
    ${tw`text-white/75 bg-transparent w-auto h-auto`};

    &:first-child {
        ${tw`mr-4`}
    }

    &:hover {
        ${tw`text-gold`};
    }

    &.mobile {
        ${tw`w-full`};
    }

    > span {
        ${tw`w-full`}
        &.address {
            ${tw`text-xs text-gray-600 flex-nowrap w-full`};
        }
    }
`;

export default PVLogin;
