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
import { setListings } from '@state/features';
import ListingCard from '@components/Shop/Listing/ListingCard';

type ListingProps<P = {}> = P;

const billSplash =
    'https://storage.googleapis.com/billmurray1000/WebAssets/image/Backgrounds/Blank-Desk.jpg';

export const Listing: FC<ListingProps> = (props) => {
    const {} = props;
    const dispatch = useDispatch();
    const owner = useSelector((state: RootState) => state.owner);
    const shop = useSelector((state: RootState) => state.shop);
    const shopType = 'listing';

    useEffect(() => {
        (async () => {
            const shops = (await Api.shop.getShopsByType(
                shopType
            )) as Array<ShopType>;
            dispatch(setListings(shops));
        })();
    }, []);

    useEffect(() => {
        //console.log({ shop });
    }, [shop]);

    return (
        <PVPage id={'listing-page'} bgImage={billSplash}>
            <Overlay id={'listing-page-overlay'} color={'black'} />
            <PVHeader id={'listing-page-header'}>
                <h1>Listings</h1>
            </PVHeader>
            <PVBody id={'listing-page-body'}>
                {shop.listings.length && (
                    <PVGridContainer id={'listing-grid-container'} columns={3}>
                        {shop.listings.map((listing) => {
                            return (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                />
                            );
                        })}
                    </PVGridContainer>
                )}
            </PVBody>
            <PVFooter id={'listing-page-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
        </PVPage>
    );
};

export default Listing;
