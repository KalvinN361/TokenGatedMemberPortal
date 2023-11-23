import React from 'react';
import { MediaButtonProps } from '@definitions/index';
import { FiBookOpen } from 'react-icons/fi';
import { GiSoundWaves } from 'react-icons/gi';
import { MdVideoLibrary } from 'react-icons/md';
import { ImImages } from 'react-icons/im';
import styled from 'styled-components';
import tw from 'twin.macro';

export const MediaButtonComponent: React.FC<
    MediaButtonProps & React.HTMLProps<HTMLButtonElement>
> = (props) => {
    const { mediaType, isActive, onClick } = props;

    const getButtonIcon = () => {
        if (mediaType === 'description') return <FiBookOpen />;
        if (mediaType === 'audio') return <GiSoundWaves />;
        if (mediaType === 'video') return <MdVideoLibrary />;
        if (mediaType === 'image') return <ImImages />;
    };

    return (
        <MediaButton className={isActive ? ' active ' : ''} onClick={onClick}>
            {getButtonIcon()}
        </MediaButton>
    );
};

export const MediaButton = styled.button`
    ${tw`
		text-white text-3xl cursor-pointer z-50
	`}
    &.active {
        ${tw`text-gold`}
    }
`;

export default MediaButtonComponent;
