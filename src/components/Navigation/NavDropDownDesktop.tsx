import { FC, ReactNode, useState } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { getNavUrl } from '@libs/navigation';
import { useNavigate } from 'react-router-dom';
import { set } from 'devextreme/events/core/events_engine';

type NavButtonDesktopProps<
    P = {
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
        button: any;
    },
> = P;
export const NavDropDownDesktop: FC<NavButtonDesktopProps> = (props) => {
    const { button, id, className } = props;
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleNavClicks = (e: string) => {
        navigate(getNavUrl(e));
        setOpen(false);
    };

    const handleOpenDropDown = () => {
        setOpen(!open);
    };

    return (
        <NavDropDownDesktopContainer>
            <NavButtonDesktopStyled
                className={className}
                id={id}
                //onClick={handleOpenDropDown}
                onMouseOver={handleOpenDropDown}
            >
                <span>{button.name}</span>
            </NavButtonDesktopStyled>
            {open && (
                <NavDropDown onMouseLeave={() => setOpen(false)}>
                    {button.subs.map((sub: any, i: number) => {
                        return (
                            <NavButtonDesktopStyled
                                key={i}
                                className={className}
                                id={id}
                                onClick={() => handleNavClicks(sub.name)}
                            >
                                <span>{sub.name}</span>
                            </NavButtonDesktopStyled>
                        );
                    })}
                </NavDropDown>
            )}
        </NavDropDownDesktopContainer>
    );
};

export const NavDropDownDesktopContainer = styled.div`
    ${tw`relative flex flex-col`}
`;
export const NavButtonDesktopStyled = styled.button`
    ${tw`px-4 hover:text-gold cursor-pointer`}
    &.disabled {
        ${tw`opacity-50 cursor-not-allowed`}
    }

    span {
        ${tw`first:ml-0 flex font-barlow uppercase tracking-[1.5px] text-[18px] leading-[28.8px] font-black antialiased hover:animate-pulse hover:text-gold`};
    }
`;

const NavDropDown = styled.div`
    ${tw`w-fit h-fit origin-top-right absolute left-0 top-9 mt-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-gray-900 z-50 py-4 flex flex-col gap-2`}
`;
