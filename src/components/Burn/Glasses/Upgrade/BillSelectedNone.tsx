import AddImage from '@assets/images/addImage.png';
import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

interface NoBillSelectedProps {}

export const BillSelectedNone: React.FC<NoBillSelectedProps> = (props) => {
    const {} = props;
    return (
        <NoBillSelectedStyled className={'add-bill-image'}>
            <img src={AddImage} alt="Sample Image" />
            <span className="click-text">
                Click here to add or update image
            </span>
        </NoBillSelectedStyled>
    );
};

const NoBillSelectedStyled = styled.div`
    ${tw`h-full p-4`}
    > img {
        ${tw`mb-2 max-h-[52px] max-w-[52px] mx-auto`}
    }

    > span {
        ${tw``}
    }
`;

export default BillSelectedNone;
