import React, { useEffect, useState } from 'react';
import { LoginProps, PageStyleProps } from '@definitions/index';
import { LoginLogoImg } from '@styles/index';
import { Api } from '@libs/API';
import { Company } from '@definitions/Company';
import BM10003D from '@assets/backgrounds/login/BM1000LogoGlassesWords.png';
import styled from 'styled-components';
import tw from 'twin.macro';

export const Login: React.FC<LoginProps> = () => {
    const currentUrl = new URL(window.location.href);
    const [heroBG, setHeroBG] = useState<string>('');

    useEffect(() => {
        (async () => {
            let hostname = currentUrl.hostname
                .split('.')
                .slice(-2)
                .join('.')
                .toLowerCase();
            if (hostname === 'localhost') hostname = 'projectvenkman.com';
            const company = (await Api.company.getOne(hostname)) as Company;
            setHeroBG(company.heroImage);
        })();
    }, [currentUrl.hostname]);

    return (
        <LoginPage bgImage={heroBG} id={'login-page'}>
            <LoginLogoContainer id={'logo-container'}>
                <LoginLogoImg src={BM10003D} alt={'Splash'} />
            </LoginLogoContainer>
        </LoginPage>
    );
};

const LoginPage = styled.div<PageStyleProps>(({ bgImage }) => [
    bgImage && `background-image: url(${bgImage});`,
    bgImage && tw`max-w-[1920px] w-full bg-cover bg-center bg-no-repeat h-full`,
    tw`relative max-w-[1920px] pt-[64px] flex flex-col items-center relative bg-black/50 bg-cover bg-center bg-no-repeat h-full`,
]);
const LoginLogoContainer = styled.div`
    ${tw`
        absolute bottom-[50%] left-[50%] w-[78%] md:w-[initial] h-[10%] md:h-[128px]
        transform translate-x-[-54%] md:translate-x-[-50%] translate-y-[140%] md:translate-y-[180%]
	`};
    rotate: -7deg;
`;

export default Login;
