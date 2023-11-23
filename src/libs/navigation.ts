export const getNavUrl = (e: string) => {
    switch (e) {
        case 'home':
            return '/Home';
        case 'media':
            return '/Media';
        case 'claim':
            return '/Claim';
        case 'transfer':
            return '/Transfer';
        case 'burn':
            return '/Burn';
        case 'giveaway':
            return '/Giveaway';
        case 'listings':
            return '/Listing';
        case 'trades':
            return '/Trades';
        case 'merch':
            return '/Merch';
        default:
            return '/Home';
    }
};
