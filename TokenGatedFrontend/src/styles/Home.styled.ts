import tw from 'twin.macro';
import styled from 'styled-components';

const space =
    'https://storage.googleapis.com/earthlightfoundation/WebAssets/image/Space.jpg';

export const Maintenance = styled.div`
    ${tw`w-full h-8 bg-yellow-300 font-bold text-xl italic flex text-center justify-center items-center absolute top-0`}
`;
export const HomeOverlayTopLeft = styled.div`
    ${tw`absolute top-[-7%] left-[-7%] w-1/5 h-1/5`}
`;
export const HomeOverlayTopRight = styled.div`
    ${tw`absolute top-[-3%] right-[-3%] w-1/5 h-1/5`}
`;
export const HomeOverlayBottomLeft = styled.div`
    ${tw`absolute bottom-[-25%] left-[-16%] w-1/2 h-1/2`}
`;
export const HomeOverlayBottomRight = styled.div`
    ${tw`absolute bottom-[2%] right-[-7%] w-1/3 h-1/3`}
`;
export const ResultCardELF = styled.div`
    background-image: url(${space});

    ${tw`
		relative
		rounded-full
		w-4/5 md:portrait:w-4/5 md:w-4/5 xl:w-2/3
		top-14 md:-top-16 xl:-top-4 sm:-top-20 3xs:-top-6 lg:-top-10
		xs:tall:portrait:-top-8 short:portrait:-top-2 md:tall:portrait:-top-6 md:portrait:-top-20 
	`};
`;

export const NftTitleSpan = styled.span`
    ${tw`
        bg-black/75 text-sm text-gold px-3 py-2 rounded-3xl z-60
        absolute left-[-16.7%] bottom-[30.5%] md:left-[-20.6%] md:bottom-[35.5%]`}
    rotate: -90deg;
`;
export const ImageContainer = styled.div`
    ${tw`absolute top-[33.7%] left-[2.3%] flex w-[26%] min-h-[59%] bg-green-700 rounded-xl flex flex-col items-center justify-center`};
`;
export const NFTImg = styled.img`
    ${tw`w-full h-full opacity-0 rounded-xl`};
    transition: opacity 1s linear;

    &.loaded {
        ${tw`opacity-100`}
    }
`;

export const TelescopeImg = styled.img`
    ${tw`z-30 w-8/12 3xs:w-full 2xs:w-full xs:w-full md:w-full lg:w-full xl:w-full`};
`;

export const ResultCardContentELF = styled.div`
    ${tw`relative w-full h-full flex flex-col justify-center items-center`};
    // transform: rotate(-4deg);
`;
export const ImageContainerELF = styled.div`
    ${tw`absolute w-8/12 3xs:w-7/12 2xs:w-7/12 xs:w-7/12 md:w-7/12 lg:w-7/12 xl:w-7/12 h-full flex flex-col items-center justify-center`};
`;
export const ResultPageELF = styled.div`
    background-image: url(${space});
    ${tw`flex flex-col items-center justify-center h-full relative bg-cover bg-center bg-no-repeat`}
`;
