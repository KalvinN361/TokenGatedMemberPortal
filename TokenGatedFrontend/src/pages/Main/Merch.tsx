import { FC } from 'react';
import PVPage from '@components/Base/PVPage/PVPage';
import {
    Overlay,
    PoweredByVenkman,
    PVFooter,
    PVHeader,
    PVBody,
} from '@components/Base';

type MerchProps<P = {}> = P;

const billSplash =
    'https://storage.googleapis.com/billmurray1000/WebAssets/image/Backgrounds/Blank-Desk.jpg';

export const Merch: FC<MerchProps> = (props) => {
    const {} = props;

    return (
        <PVPage id={'merch-page'} bgImage={billSplash}>
            <Overlay id={'merch-page-overlay'} color={'black'} />
            <PVHeader id={'merch-page-header'}>
                <h1>Merch</h1>
            </PVHeader>
            <PVBody id={'merch-page-body'}></PVBody>
            <PVFooter id={'merch-page-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
        </PVPage>
    );
};

export default Merch;
