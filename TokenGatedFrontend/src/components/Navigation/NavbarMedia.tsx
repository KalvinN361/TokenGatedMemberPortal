import { MediaButtonComponent } from '@components/Media';
import React, { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import { setMediaItems } from '@state/features';
import styled from 'styled-components';
import tw from 'twin.macro';

interface NavbarMediaProps {
    setActiveMedia: SetStateAction<Dispatch<string>>;
    activeMedia: string;
}

export const NavbarMedia: React.FC<NavbarMediaProps> = (props) => {
    const { setActiveMedia, activeMedia } = props;
    const dispatch = useDispatch();
    const mediaTypes: Array<any> = ['description', 'audio', 'video', 'image'];
    const handleButtonClick = (e: any) => {
        dispatch(setMediaItems([]));
        setActiveMedia(e);
    };

    return (
        <NavMediaWrapper id={'nav-media-wrapper'}>
            <NavMediaContainer id={'nav-media-container'}>
                <NavMediaBar id={'nav-media-bar'}>
                    {mediaTypes.map((mediaType, i) => {
                        return (
                            <MediaButtonComponent
                                key={i}
                                isActive={activeMedia === mediaType}
                                mediaType={mediaType}
                                onClick={() => handleButtonClick(mediaType)}
                            >
                                <span>{mediaType}</span>
                            </MediaButtonComponent>
                        );
                    })}
                </NavMediaBar>
            </NavMediaContainer>
        </NavMediaWrapper>
    );
};

const NavMediaWrapper = styled.div`
    ${tw`md:flex h-[72px] z-80 w-full py-2 bg-black/50 text-white flex flex-row justify-center items-center absolute top-0`};
`;
const NavMediaContainer = styled.div`
    ${tw`flex flex-col justify-center`};
`;
const NavMediaBar = styled.div`
    ${tw`flex justify-center gap-16`};
`;

export default NavbarMedia;
