import { Asset, BurnAsset } from '@definitions/Asset';
import { Asset1155Portal } from '@definitions/Asset1155';
import { Media as MediaType, Media } from '@definitions/Media';

export const truncateAddress = (address: string) => {
    if (!address) return 'No Account';
    const match = address.match(
        /^(0x[a-zA-Z0-9]{5})[a-zA-Z0-9]+([a-zA-Z0-9]{5})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

// export const clearAllCookies = () => {
//     let cookies = document.cookie.split(';');

//     for (let i = 0; i < cookies.length; i++) {
//         let cookie = cookies[i];
//         let eqPos = cookie.indexOf('=');
//         let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//         document.cookie =
//             name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
//     }
// };

export const isBillNft = (asset: Asset | Asset1155Portal) => {
    let bm1000Contracts = [
        '40000001-0001-0001-0002-000000000001',
        '40000001-0001-0001-0002-000000000002',
    ];
    if (isAsset1155Portal(asset)) return;
    return bm1000Contracts.includes(asset.contractId);
};

export const isAsset = (item: any): item is Asset => {
    return (item as Asset).name !== undefined;
};

export const isAsset1155Portal = (item: any): item is Asset1155Portal => {
    return (item as Asset1155Portal).token1155 !== undefined;
};

// export const toHex = (num) => {
//     const val = Number(num);
//     return '0x' + val.toString(16);
// };

// export const usePrevious = (value) => {
//     const ref = useRef();
//     useEffect(() => {
//         ref.current = value;
//     }, [value]);
//     return ref.current;
// };

export const getNewFrame = (frame: string) => {
    switch (frame) {
        case 'Black':
            return 'SILVER';
        case 'Silver':
            return 'GOLD';
        default:
            return 'BLACK';
    }
};

export const getEmbellishment = (embellishment: string) => {
    switch (embellishment) {
        case 'Clown Nose':
            return 'CLOWN';
        case 'Helmet':
            return 'EVEL';
        case 'Reversed':
            return 'FLIPPED';
        case 'Invisible':
            return null;
        default:
            return null;
    }
};

export const getNavButtons = () => {
    return [
        { name: 'home', type: 'button' },
        { name: 'media', type: 'button' },
        { name: 'claim', type: 'button' },
        { name: 'giveaway', type: 'button' },
        /*{ name: 'transfer', type: 'button' },
        { name: 'burn', type: 'button' },*/
        {
            name: 'actions',
            type: 'dropdown',
            subs: [
                { name: 'transfer', type: 'button' },
                { name: 'burn', type: 'button' },
            ],
        },
        {
            name: 'shop',
            type: 'dropdown',
            subs: [
                { name: 'listings', type: 'button' },
                { name: 'trades', type: 'button' },
                {
                    name: 'merch',
                    type: 'button',
                },
            ],
        },
    ];
};

export const getMediaCategories = (asset: Array<Media>) => {
    const assetsByCategory: {
        [category: string]: MediaType[];
    } = asset.reduce(
        (acc, asset) => {
            if (acc.hasOwnProperty(asset.category)) {
                acc[asset.category].push(asset);
            } else {
                acc[asset.category] = [asset];
            }
            return acc;
        },
        {} as {
            [category: string]: Array<Media>;
        }
    );
    return assetsByCategory;
};
