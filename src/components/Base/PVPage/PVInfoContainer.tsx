import React, { FC } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { PVHeader } from '@components/Base';

type PVInfoContainerProps<
    P = {
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
        children?: React.ReactNode;
        title?: string;
    },
> = P;

export const PVInfoContainer: FC<PVInfoContainerProps> = (props) => {
    const { title, className, id, children } = props;
    return (
        <PVInfoContainerContainer>
            <PVHeader id={'announcement-container-header'}>
                <h1 style={{ textShadow: '#000 2px 2px 6px' }}>{title}</h1>
            </PVHeader>
            {children}
        </PVInfoContainerContainer>
    );
};

const PVInfoContainerContainer = styled.div`
    ${tw`w-10/12 md:w-2/3 h-3/4 bg-black/50 text-white text-base md:text-xl p-4 border-8 border-solid border-white rounded-xl z-70`};
`;

export default PVInfoContainer;
