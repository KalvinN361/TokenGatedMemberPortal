import tw from 'twin.macro';
import styled from 'styled-components';

/** Burn and Turn */
export const BurnOptionImageContainer = styled.div`
    ${tw`flex flex-col pt-4 justify-center h-1/3 md:h-3/5`}
    > img {
        ${tw`w-full h-9/10 object-contain mx-auto`}
    }
`;

export const BurnOptionDescriptionContainer = styled.div`
    ${tw` w-full h-2/3 md:h-2/5 p-4 flex flex-col md:flex-row md:items-start justify-start md:justify-center`}
    > div {
        ${tw``}
        > h2 {
            ${tw`text-lg font-bold`}
        }

        > p {
            ${tw`text-sm font-normal`}
        }
    }
`;
