import { FC, ReactNode } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { getNavUrl } from '@libs/navigation';
import { useNavigate } from 'react-router-dom';

type NavButtonDesktopProps<
    P = {
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
        button: any;
    },
> = P;
export const NavButtonDesktop: FC<NavButtonDesktopProps> = (props) => {
    const { button, id, className } = props;
    const navigate = useNavigate();
    const handleNavClicks = (e: string) => {
        navigate(getNavUrl(e));
    };

    return (
        <NavButtonDesktopStyled
            className={className}
            id={id}
            onClick={() => handleNavClicks(button.name)}
        >
            <span>{button.name}</span>
        </NavButtonDesktopStyled>
    );
};

export const NavButtonDesktopStyled = styled.button`
    ${tw`px-4 hover:text-gold cursor-pointer`}
    &.disabled {
        ${tw`opacity-50 cursor-not-allowed`}
    }

    span {
        ${tw`first:ml-0 flex font-barlow uppercase tracking-[1.5px] text-[18px] leading-[28.8px] font-black antialiased hover:animate-pulse hover:text-gold`};
    }
`;
