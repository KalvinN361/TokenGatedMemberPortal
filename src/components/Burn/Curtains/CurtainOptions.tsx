import React from 'react';
import { OptionBurnAndTurn } from '@components/Burn/Curtains/OptionBurnAndTurn';
import styled from 'styled-components';
import tw from 'twin.macro';

type CurtainProps<P = {}> = P;

export const CurtainOptions: React.FC<CurtainProps> = (props) => {
    const {} = props;

    return (
        <CurtainOptionsStyled className="curtain-wrapper">
            <OptionBurnAndTurn />
        </CurtainOptionsStyled>
    );
};

const CurtainOptionsStyled = styled.div`
    ${tw`w-full bg-gray-200 flex flex-row justify-center relative h-full`}
    > div {
        ${tw`h-full`}
        > img {
            ${tw`h-full object-contain mx-auto`}
            &.left {
                ${tw`w-full`}
            }
        }

        > div {
            ${tw`font-bold text-xl text-black w-full`}
        }
    }
`;
