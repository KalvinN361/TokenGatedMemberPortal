import styled from 'styled-components';
import tw from 'twin.macro';
import { FC, ReactNode } from 'react';

type UpgradeCardProps<
    P = {
        children?: ReactNode;
        id?: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
    },
> = P;

export const UpgradeCard: FC<UpgradeCardProps> = (props) => {
    const { children, id, className } = props;

    return (
        <UpgradeCardStyled className={className} id={id}>
            {children}
        </UpgradeCardStyled>
    );
};

const UpgradeCardStyled = styled.div`
    ${tw`w-full md:w-1/2 h-[300px] flex items-center justify-center`}
`;

export default UpgradeCard;
