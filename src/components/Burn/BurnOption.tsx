import { FC, MouseEvent, MouseEventHandler, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useDispatch } from 'react-redux';
import { setOptionSelected } from '@state/features';

type BurnOptionProps<
    P = {
        children?: ReactNode;
        id?: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
        optionSelected: '' | 'burnandturn' | 'upgrade';
        onSelect?: () => void;
    },
> = P;

export const BurnOption: FC<BurnOptionProps> = (props) => {
    const { children, id, className, optionSelected, onSelect } = props;
    const dispatch = useDispatch();

    const handleOptionSelect = () => {
        dispatch(setOptionSelected(optionSelected));
        onSelect && onSelect();
    };

    return (
        <BurnOptionStyled
            id={id}
            className={className}
            onClick={handleOptionSelect}
        >
            {children}
        </BurnOptionStyled>
    );
};

export const BurnOptionStyled = styled.div`
    ${tw`relative bg-white w-full h-full flex flex-col items-center justify-center md:border-r border-solid border-gray-200 cursor-pointer `}
    &:last-child {
        ${tw`border-r-0`}
    }

    &:hover {
        ${tw`bg-gray-300 border-2 border-solid border-gold`}
    }

    > img {
        ${tw`w-full h-full object-contain mx-auto`}
    }
`;

export default BurnOption;
