import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { getNavUrl } from '@libs/navigation';
import { useNavigate } from 'react-router-dom';

type NavButtonMobileProps<
    P = {
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
        button: any;
        setShowMenu: Dispatch<SetStateAction<boolean>>;
        children?: ReactNode;
    },
> = P;
export const NavButtonMobile: FC<NavButtonMobileProps> = (props) => {
    const { button, id, className, setShowMenu } = props;
    const navigate = useNavigate();
    const handleNavClicks = (e: string) => {
        setShowMenu(false);
        navigate(getNavUrl(e));
    };

    return (
        <NavButtonMobileStyled
            className={className}
            id={id}
            onClick={() => handleNavClicks(button.name)}
        >
            <span>{button.name}</span>
        </NavButtonMobileStyled>
    );
};

export const NavButtonMobileStyled = styled.li`
    ${tw`p-4 bg-black`}
    &.disabled {
        ${tw`cursor-not-allowed`}
    }

    &:not(:last-child) {
        ${tw`border-b border-solid border-gray-300/25`}
    }

    span {
        ${tw`font-barlow uppercase tracking-[1.5px] text-[18px] leading-[28.8px] font-black antialiased hover:animate-pulse hover:text-gold`};
    }
`;
