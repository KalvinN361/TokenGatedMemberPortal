import React, { Dispatch, FC, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@state/store';
import styled from 'styled-components';
import tw from 'twin.macro';

type BadgeProps<
    P = {
        loaded: boolean;
        image: string;
        setLoaded: Dispatch<SetStateAction<boolean>>;
    },
> = P;
export const BMBadge: FC<BadgeProps> = (props) => {
    const { loaded, image, setLoaded } = props;
    const loading = useSelector(
        (state: RootState) => state.isLoading
    ).isLoading;
    const badgeUrl = `https://storage.googleapis.com/billmurray1000/WebAssets/image/Home/badge.png`;
    const glossUrl = `https://storage.googleapis.com/billmurray1000/WebAssets/image/Home/gloss.png`;

    return (
        <>
            {!loading && (
                <BadgeContainer className={loaded ? 'loaded' : ''}>
                    <BadgeImageContainer id={'badge-container'}>
                        <img src={badgeUrl} />
                    </BadgeImageContainer>
                    <ImageContainer id={'image-container'}>
                        <BillImg
                            className={'bill'}
                            src={image}
                            onLoad={() => setLoaded(true)}
                        />
                    </ImageContainer>
                    <GlossContainer id={'gloss-container'}>
                        <img className={'rounded-xl'} src={glossUrl} />
                    </GlossContainer>
                </BadgeContainer>
            )}
        </>
    );
};

const BadgeContainer = styled.div`
    ${tw`relative top-0 left-0 flex h-full w-full opacity-0`};
    transition: opacity 1s linear;

    &.loaded {
        ${tw`opacity-100`}
    }
`;
const BadgeImageContainer = styled.div`
    ${tw`absolute top-0 left-0 flex h-full`};
`;

const ImageContainer = styled.div`
    ${tw`absolute top-[33.7%] left-[2.3%] flex w-[26%] min-h-[59%] bg-green-700 rounded-xl flex flex-col items-center justify-center`};
`;
const GlossContainer = styled.div`
    ${tw`absolute top-[23.7%] left-[1.9%] flex w-[26.7%]`};
`;
const BillImg = styled.img`
    ${tw`w-full h-full rounded-xl object-cover object-center`};
`;

export default BMBadge;
