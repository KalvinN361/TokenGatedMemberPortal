import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { useAccount } from 'wagmi';
import { getNavButtons } from '@libs/utils';
import { getNavUrl } from '@libs/navigation';
import { NavbarDesktopProps } from '@definitions/Navigation';
import { NavButtonDesktop } from '@components/Navigation/NavButtonDesktop';
import { NavDropDownDesktop } from '@components/Navigation/NavDropDownDesktop';
import styled from 'styled-components';
import tw from 'twin.macro';

export const NavbarDesktop: React.FC<NavbarDesktopProps> = (props) => {
    const {} = props;
    const navigate = useNavigate();
    const project = useSelector((state: RootState) => state.project);
    const { isConnected, isDisconnected, address, status } = useAccount();

    const navButtons = getNavButtons();
    const handleNavClicks = (e: string) => {
        navigate(getNavUrl(e));
    };

    return (
        <NavWrapper id="nav-wrapper">
            {isConnected && (
                <NavContainer id={'nav-container'}>
                    <NavBar id={'nav-bar'}>
                        {navButtons.map((btn: any, i: number) => {
                            if (btn.type === 'button') {
                                return (
                                    <NavButtonDesktop
                                        button={btn}
                                        id={`nav-btn-${btn.name}`}
                                        key={i}
                                    />
                                );
                            } else if (btn.type === 'dropdown') {
                                return (
                                    <NavDropDownDesktop
                                        id={`nav-dd-${btn.name}`}
                                        button={btn}
                                        key={i}
                                    />
                                );
                            }
                        })}
                    </NavBar>
                    {project.name === 'bm1000' && (
                        <div className="flex justify-center">
                            <h1 className="my-2 text-xl md:2xl animate-bounce">
                                Welcome to The Bill Murray 1000. Click{' '}
                                <span
                                    className="text-blue-500 cursor-pointer animate-pulse"
                                    onClick={() => handleNavClicks('giveaway')}
                                >
                                    Here{' '}
                                </span>
                                to for your chance to party with Bill Murray.
                            </h1>
                        </div>
                    )}
                </NavContainer>
            )}
        </NavWrapper>
    );
};

export const NavWrapper = styled.div`
    ${tw`max-w-[1920px] md:flex h-[64px] z-80 w-full bg-black/75 text-white flex flex-row justify-center items-center absolute top-0`};
`;
export const NavContainer = styled.div`
    ${tw`flex flex-col justify-center`};
`;

const NavBar = styled.div`
    ${tw`flex justify-center`};
`;

export default NavbarDesktop;
