import { FC, useEffect } from 'react';
import PVPage from '@components/Base/PVPage/PVPage';
import {
    Overlay,
    PoweredByVenkman,
    PVFooter,
    PVHeader,
    PVBody,
    PVGridContainer,
} from '@components/Base';
import { RootState } from '@state/store';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@libs/API';
import { Shop as ShopType } from '@definitions/Shop';
import { setTrades } from '@state/features';
import { TradeCard } from '@components/Shop';

type TradeProps<P = {}> = P;

const billSplash =
    'https://storage.googleapis.com/billmurray1000/WebAssets/image/Backgrounds/Blank-Desk.jpg';

export const Trade: FC<TradeProps> = (props) => {
    const {} = props;
    const dispatch = useDispatch();
    const owner = useSelector((state: RootState) => state.owner);
    const shop = useSelector((state: RootState) => state.shop);
    const shopType = 'trade';

    useEffect(() => {
        (async () => {
            const shops = (await Api.shop.getShopsByType(
                shopType
            )) as Array<ShopType>;
            dispatch(setTrades(shops));
        })();
    }, []);

    useEffect(() => {
        //console.log({ shop });
    }, [shop]);

    return (
        <PVPage id={'trade-page'} bgImage={billSplash}>
            <Overlay id={'trade-page-overlay'} color={'black'} />
            <PVHeader id={'trade-page-header'}>
                <h1>Trades</h1>
            </PVHeader>
            <PVBody id={'trade-page-body'}>
                {shop.trades.length && (
                    <PVGridContainer id={'trade-grid-container'} columns={3}>
                        {shop.trades.map((trade) => {
                            return <TradeCard key={trade.id} trade={trade} />;
                        })}
                    </PVGridContainer>
                )}
            </PVBody>
            <PVFooter id={'trade-page-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
        </PVPage>
    );
};

export default Trade;
