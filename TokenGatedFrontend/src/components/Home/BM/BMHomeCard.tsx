import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

type BMHomeCardProps<
    P = {
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
        children?: ReactNode;
    },
> = P;

export const BMHomeCard: FC<BMHomeCardProps> = (props) => {
    const { className, id, children } = props;
    return (
        <BMHomeCardStyled className={className} id={id}>
            <BMHomeCardContent>{children}</BMHomeCardContent>
        </BMHomeCardStyled>
    );
};

export const BMHomeCardStyled = styled.div`
    ${tw`
		absolute flex flex-col items-center justify-center
		h-[600px] w-[980px] md:h-[400px] md:w-[650px] xl:h-[600px] xl:w-[980px] 
		top-[50%] left-[50%] transform
		translate-x-[-15.4%] md:translate-x-[-49%] xl:translate-x-[-52%] 3xl:translate-x-[-65%]
		translate-y-[-68%] xl:translate-y-[-70%] 
	`};
`;
export const BMHomeCardContent = styled.div`
    ${tw`relative w-full h-full flex flex-col justify-center items-center`};
    //transform: rotate(-4deg);
`;

export default BMHomeCard;
