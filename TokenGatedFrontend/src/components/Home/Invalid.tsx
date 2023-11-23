import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PeachProps } from '@definitions/Home';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { truncateAddress } from '@libs/utils';
import { useDisconnect } from 'wagmi';
import styled from 'styled-components';
import tw from 'twin.macro';

export const Invalid: React.FC<PeachProps> = (props) => {
    const {} = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { disconnect } = useDisconnect();
    const owner = useSelector((state: RootState) => state.owner);
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // window.localStorage.clear();
        disconnect();
        dispatch({ type: 'RESET' });
        navigate('/');
    };

    return (
        <InvalidWrapper>
            <p>
                {`Something didn't work right for wallet ${truncateAddress(
                    owner.walletAddress
                )}`}
            </p>
            <br />
            <button onClick={handleClick}>Click here to return to Login</button>
        </InvalidWrapper>
    );
};

export const InvalidWrapper = styled.div`
    ${tw`bg-black text-white p-2 absolute top-1/2 left-1/2 w-[67%] h-[71%] z-100`}
    transform: translate(-50%, -50%);

    p {
    }

    > button {
        ${tw`z-100 cursor-pointer`}
    }
`;

export default Invalid;
