import React, { Fragment, useState } from 'react';
import { IoMenuSharp } from 'react-icons/io5';
import { useAccount } from 'wagmi';
import { getNavButtons } from '@libs/utils';
import { NavbarMobileProps } from '@definitions/Navigation';
import { NavButtonMobile } from '@components/Navigation/NavButtonMobile';
import styled from 'styled-components';
import tw from 'twin.macro';

export const NavbarMobile: React.FC<NavbarMobileProps> = (props) => {
    const { isConnected, isDisconnected, address, status } = useAccount();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [showSubMenu, setShowSubMenu] = useState<boolean>(false);
    const navButtons = getNavButtons();

    return (
        isConnected && (
            <NavMobileWrapper id="nav-mobile-wrapper">
                <button hidden={showMenu}>
                    <IoMenuSharp
                        className={'text-2xl'}
                        onClick={() => setShowMenu(!showMenu)}
                    />
                </button>
                {showMenu && (
                    <div
                        className={'menu'}
                        onClick={() => {
                            setShowMenu(!showMenu);
                        }}
                    />
                )}
                <NavMobileListContainer
                    hidden={!showMenu}
                    id={'nav-mobile-list-container'}
                >
                    {navButtons.map((btn: any) => {
                        if (btn.type === 'button') {
                            return (
                                <NavButtonMobile
                                    key={`${btn.name}`}
                                    button={btn}
                                    id={`nav-btn-${btn.name}`}
                                    setShowMenu={setShowMenu}
                                />
                            );
                        } else if (btn.type === 'dropdown') {
                            return (
                                <Fragment>
                                    <NavButtonMobile
                                        key={`${btn.name}`}
                                        button={btn}
                                        id={`nav-dd-${btn.name}`}
                                        setShowMenu={setShowSubMenu}
                                    ></NavButtonMobile>
                                    <NavMobileListContainer
                                        hidden={showSubMenu}
                                        id={'nav-mobile-list-container'}
                                    >
                                        {btn.subs.map((sub: any) => {
                                            console.log(sub);
                                            return (
                                                <NavButtonMobile
                                                    key={`${sub.name}`}
                                                    button={sub}
                                                    id={`nav-btn-${sub.name}`}
                                                    setShowMenu={setShowMenu}
                                                />
                                            );
                                        })}
                                    </NavMobileListContainer>{' '}
                                </Fragment>
                            );
                        }
                    })}
                </NavMobileListContainer>
            </NavMobileWrapper>
        )
    );
};

const NavMobileWrapper = styled.div`
    ${tw`flex justify-start z-90 h-16 w-full bg-black/75 text-white absolute top-0 right-0`};

    > button {
        ${tw`text-white px-4`};
    }

    > div {
        &.menu {
            ${tw`h-screen w-full absolute top-0 left-0`}
        }
    }
`;

const NavMobileListContainer = styled.ul`
    ${tw`bg-black w-full relative h-full`};
`;

export default NavbarMobile;
