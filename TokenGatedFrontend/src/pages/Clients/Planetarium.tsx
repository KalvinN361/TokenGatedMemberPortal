import React from 'react';
import { LoginProps } from '@definitions/index';
import { LoginLogoImg, LoginTextContainer } from '@styles/index';
import { PVLogin } from 'src/components/Login';
import PVPage from '@components/Base/PVPage/PVPage';
import { PVHeader } from '@components/Base';
import PVBody from '@components/Base/PVPage/PVBody';

//const spacebg =
//    'https://storage.googleapis.com/earthlightfoundation/WebAssets/image/hero-33.png';
const splash =
    'https://storage.googleapis.com/billmurray1000/WebAssets/image/COUCH-FOR-SPLASH-PAGE.png';

const PlanetariumLogin: React.FC<LoginProps> = () => {
    // window.localStorage.clear();

    return (
        <PVPage id={'login-page'}>
            <PVHeader id={'login-page-header'}>
                <LoginLogoImg src={splash} alt={'Bill Murray 1000 Splash'} />
            </PVHeader>
            <PVBody id={'login-page-body'}>
                <LoginTextContainer>
                    {/*<LoginText >Hello! Welcome to the Official Bill Murray 1000 redemption site.</LoginText>
					<LoginText>Please click your wallet type below for NFT verification and to claim your reward!</LoginText>
					<LoginText>Need help? Reach out to our Discord admin!</LoginText>
					<LoginText>Not sure what this is? Please feel free to visit <a style={{color: "blue", fontWeight: "bold"}} href={"https://theSHACK.theCHIVE.com"} target={"_blank"}>theSHACK.theCHIVE.com</a> or visit our <a style={{color: "blue", fontWeight: "bold"}} href={"https://discord.com/invite/HnXFs2Deqv"} target={"_blank"}>Discord!</a></LoginText>*/}
                </LoginTextContainer>
                <PVLogin />
            </PVBody>
        </PVPage>
    );
};

export default PlanetariumLogin;
