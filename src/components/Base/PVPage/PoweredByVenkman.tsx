import { FC } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

type PoweredByVenkmanProps<
    P = {
        color: 'White' | 'Black';
    },
> = P;
export const PoweredByVenkman: FC<PoweredByVenkmanProps> = (props) => {
    const { color } = props;
    const poweredByVenkmanUrl = `https://storage.googleapis.com/project-venkman/Logos/PoweredByPVLogo${color}.png`;
    return (
        <PoweredByVenkmanContainer className="poweredByVenkman">
            <a href={'https://projectvenkman.com'} target={'_blank'}>
                <img src={poweredByVenkmanUrl} alt="Powered by Venkman" />
            </a>
        </PoweredByVenkmanContainer>
    );
};

const PoweredByVenkmanContainer = styled.div`
    ${tw`flex flex-row justify-center items-center p-4 z-100 h-full relative`}
    & > a {
        ${tw``}
        & > img {
            ${tw`h-10 max-w-full`}
        }
    }
`;

export default PoweredByVenkman;
