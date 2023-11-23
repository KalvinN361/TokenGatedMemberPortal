import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import welcomeBill from '@assets/images/pvCollector.jpg';
import glassJar from '@assets/images/glassJar.png';
import welcomeBackground from '@assets/images/ocean-illustration.png';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';

interface WelcomeProps {
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    openModal: boolean;
}

export const Welcome: FC<WelcomeProps> = ({
    setOpenModal,
    openModal = false,
}) => {
    //const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const handleContestClick = () => {
        navigate('/Giveaway');
    };
    /*useEffect(() => {
        if (!isOpenProp) return;
        setOpenModal(isOpenProp);
    }, [isOpenProp]);*/
    return (
        openModal && (
            <WelcomeModalWrapper id={'welcome-modal-wrapper'}>
                <WelcomeModal>
                    <div
                        className={'absolute inset-0 bg-white opacity-70'}
                    ></div>
                    <WelcomeModalHeader>
                        <WelcomeCloseButton onClick={() => setOpenModal(false)}>
                            x
                        </WelcomeCloseButton>
                        <WelcomeModalTitle>
                            Here's your membership card.
                        </WelcomeModalTitle>
                    </WelcomeModalHeader>
                    <WelcomeModalBody>
                        <BMOEImageContainer>
                            <img src={welcomeBill} alt="Top Image" />
                        </BMOEImageContainer>
                        <WelcomeModalContent>
                            <h2>Welcome to the Club!</h2>
                            <img src={glassJar} alt="glassJar" />
                            <h3>Gill's New Member To-Do's</h3>
                            <p>
                                We want to give you a chance to party with the
                                legendary Bill Murray at hour next in-person
                                event, so let's get you set up with the Gleam
                                Tool!
                            </p>
                        </WelcomeModalContent>
                    </WelcomeModalBody>
                    <WelcomeModalFooter>
                        <WelcomeFooterH2>
                            Please use the Gleam tool
                            <span onClick={handleContestClick}> Here </span>
                            to enter the contest. Most importantly join our
                            Discords!
                        </WelcomeFooterH2>
                    </WelcomeModalFooter>
                </WelcomeModal>
            </WelcomeModalWrapper>
        )
    );
};

const WelcomeModalWrapper = styled.div`
    ${tw`absolute flex items-center justify-center z-90 fixed inset-0 bg-gray-500/50`}
`;

const WelcomeModal = styled.div`
    background-image: url(${welcomeBackground});
    ${tw`overflow-auto flex-col flex relative w-full h-[85%] md:h-3/4 md:w-1/2`}
`;

const WelcomeModalHeader = styled.div`
    ${tw`h-[10%] flex flex-col justify-center items-center`}
`;

const WelcomeModalTitle = styled.h1`
    ${tw`relative text-center font-bold mt-2 text-xl md:text-3xl sm:text-2xl xs:text-2xl`}
`;
const WelcomeModalBody = styled.div`
    ${tw`h-[80%] flex flex-col`}
`;

const BMOEImageContainer = styled.div`
    ${tw`flex items-center justify-center h-[30%] md:h-[35%]`}
    & > img {
        ${tw`z-20 h-full object-contain`}
    }
`;

const WelcomeModalContent = styled.div`
    ${tw`relative mx-auto flex flex-col items-center sm:w-full overflow-y-auto w-full md:w-[80%]`}
    & > h2 {
        ${tw`relative my-8 text-center font-bold text-5xl md:text-3xl sm:text-2xl xs:text-2xl`}
    }

    & > h3 {
        ${tw`relative text-center font-bold mt-6 text-2xl md:text-2xl sm:text-lg xs:text-base`}
    }

    & > img {
        ${tw`relative sm:w-[25%] xs:w-1/4 md:w-[15%] lg:w-[15%] xl:w-[15%]`}
    }

    & > p {
        ${tw`relative text-center px-6 mt-4 text-xl md:text-2xl sm:text-sm xs:text-sm`}
    }
`;

const WelcomeModalFooter = styled.div`
    ${tw`h-[10%] flex justify-center items-center`}
`;

const WelcomeCloseButton = styled.button`
    ${tw`absolute top-0 right-0 m-4 text-3xl font-bold cursor-pointer`}
`;

const WelcomeFooterH2 = styled.h2`
    ${tw`relative text-center font-bold mt-6 text-2xl md:text-xl sm:text-lg xs:text-base`}
    & > span {
        ${tw`text-blue-700 cursor-pointer animate-pulse`}
    }
`;

export default Welcome;
