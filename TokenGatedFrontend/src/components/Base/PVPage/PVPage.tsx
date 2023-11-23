import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

type PVPageProps<
    P = {
        children?: ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
        bgImage?: string;
    },
> = P;
export const PVPage: FC<PVPageProps> = (props) => {
    const { children, className, id, bgImage } = props;
    return (
        <PVPageStyled className={className} id={id} bgImage={bgImage}>
            {children}
        </PVPageStyled>
    );
};

type PVPageStyleProps<
    P = {
        bgImage?: string;
    },
> = P;

export const PVPageStyled = styled.div<PVPageStyleProps>(({ bgImage }) => [
    bgImage && `background-image: url(${bgImage});`,
    bgImage && tw`bg-cover bg-center bg-no-repeat`,
    tw`md:max-w-[768px] xl:max-w-[1280px] 3xl:max-w-[1920px] w-full pt-16 mx-auto h-full flex flex-col items-stretch relative overflow-auto md:overflow-hidden`,
]);

export default PVPage;
