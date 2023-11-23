import tw from 'twin.macro';
import styled from 'styled-components';
import billOEImage from '@assets/backgrounds/collect/billOpenEdition.png';
import billOEImageVert from '@assets/backgrounds/collect/billOpenEditionVert.png';

const random360 = Math.floor(Math.random() * 360);
export const CollectPage = styled.div`
    //background-image: url(${billOEImage});
    filter: hue-rotate(${random360}deg);
    ${tw`mx-auto pb-16 md:pb-0 max-w-[1024px] bg-khaki bg-contain bg-top md:bg-center bg-no-repeat h-full flex flex-col items-center md:justify-center relative font-barlow text-billBlue overflow-auto md:overflow-hidden`}
`;

export const CollectImageContainer = styled.div`
    background-image: url(${billOEImage});
    ${tw`w-full max-h-full absolute top-[10%] hidden md:block h-4/5 bg-contain bg-center bg-no-repeat`};
`;

export const CollectImageContainerVert = styled.div`
    background-image: url(${billOEImageVert});
    ${tw`w-full max-h-full relative md:hidden h-full bg-contain bg-center bg-no-repeat`};
`;

export const CollectHeader = styled.div`
    ${tw`flex flex-col items-center justify-center w-full h-[10%]`};

    h1 {
        ${tw`font-['Courier_New'] text-billBlue font-bold text-xl md:text-5xl`}
    }
`;

export const CollectBody = styled.div`
    ${tw`w-full md:h-[80%] flex justify-center relative px-4`};
`;

export const CollectCard = styled.div`
    ${tw`w-full md:w-1/2 h-full flex flex-col md:items-center justify-center text-center`};
`;

export const CollectQuestion = styled.div`
    > p {
        ${tw`text-xl md:text-2xl my-2`};

        &.email,
        &.referral {
            ${tw`overflow-hidden whitespace-nowrap mx-auto tracking-tight text-green-800 font-bold font-['Courier_New']`}
            animation: typing 2.5s steps(40, end),
      blink-caret 0.75s step-end infinite;
        }
    }

    @keyframes typing {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }

    /* The typewriter cursor effect */
    @keyframes blink-caret {
        from,
        to {
            border-color: transparent;
        }
        50% {
            border-color: orange;
        }
    }
`;

export const CollectButtonContainer = styled.div`
    ${tw`mt-4 md:mt-2 text-2xl flex flex-col md:flex-row w-full md:w-3/4 justify-evenly md:justify-between`};

    &.connected {
        ${tw`justify-center!`}
    }
`;
export const CollectButton = styled.button`
    ${tw`cursor-pointer`}
    &:hover {
        ${tw`text-blue-500`}
    }

    &.portal {
        ${tw`animate-bounce`}
    }
`;

export const CollectAssetShow = styled.div`
    filter: hue-rotate(0deg);
    ${tw`h-1/5 relative`};

    & > img {
        ${tw`h-full mx-auto`}
    }
`;

export const CollectFooter = styled.div`
    ${tw`flex flex-col items-center justify-center w-full h-[10%]`};
`;

export const CollectFooterWallet = styled.p``;
