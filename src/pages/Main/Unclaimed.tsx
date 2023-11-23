import React, { useEffect, useState } from 'react';
import { Api } from '@libs/API';
import { ClaimFull, UnclaimedCoinAsset } from '@definitions/index';
import {
    PVGridContainer,
    UnclaimedCardContainer,
    UnclaimedSelect,
} from '@components/index';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import {
    PVHeader,
    PVPage,
    PVBody,
    PVFooter,
    PoweredByVenkman,
} from '@components/Base';

type UnclaimedCoinProps<P = {}> = P;
const contracts = [
    {
        id: '40000001-0001-0001-0002-000000000001',
        name: 'Bill Murray 1000: Original Bill',
        count: 0,
    },
    {
        id: '40000001-0001-0001-0002-000000000002',
        name: 'Bill Murray 1000: Destinations',
        count: 0,
    },
];

export const Unclaimed: React.FC<UnclaimedCoinProps> = (props) => {
    const {} = props;
    const [claims, setClaims] = useState<Array<ClaimFull>>([]);
    const [current, setCurrent] = useState<Array<ClaimFull>>([]);
    const [selected, setSelected] = useState<{
        id: string;
        name: string;
        count: number;
    }>(contracts[0]);
    const [searchToken, setSearchToken] = useState<string>('');

    const handleTokenSearch = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();
        if (e.type === 'click' && searchToken.length > 0) {
            setSearchToken('');
            return;
        }
        const tokenSearch = e.target as HTMLInputElement;
        setSearchToken(tokenSearch.value);
    };

    useEffect(() => {
        if (searchToken.length === 0) {
            setCurrent(claims);
            return;
        }
        const filtered = claims.filter((claim) => {
            return (
                claim.tokenId.toString().indexOf(searchToken.toString()) !==
                    -1 ||
                claim.asset.tokenId
                    .toString()
                    .indexOf(searchToken.toString()) !== -1
            );
        });
        setCurrent(filtered);
    }, [searchToken]);

    useEffect(() => {
        (async () => {
            const unclaims: Array<ClaimFull> = (await Api.claim.getAllUnclaimed(
                'Bill Murray NFT Coin',
                false,
                selected.id
            )) as Array<ClaimFull>;
            setClaims(unclaims);
            selected.count = unclaims.length;
        })();
    }, [selected]);

    useEffect(() => {
        if (!claims.length) return;
        setCurrent(claims);
    }, [claims]);

    useEffect(() => {
        console.log({ current });
    }, [current]);

    useEffect(() => {
        if (!claims.length) return;
    }, [claims]);

    return (
        <PVPage id={'unclaimed-page'}>
            <PVHeader id={'unclaimed-header'}>
                <h1 className={'title'}>Unclaimed Bill Murray 1000 Coins</h1>
                <div
                    className={'selector flex jusify-center items-center gap-4'}
                >
                    <UnclaimedSelect
                        list={contracts}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <form
                        className={
                            'flex items-center border-white border-solid border text-white'
                        }
                    >
                        <FaSearch
                            className={
                                'searchIcon text-white m-2 cursor-pointer'
                            }
                        />
                        <input
                            type="search"
                            placeholder={'Search'}
                            className={
                                'token text-white p-1 bg-transparent focus-visible:outline-none placeholder-gold placeholder-opacity-50'
                            }
                            onEmptied={() => setSearchToken('')}
                            onChange={(e) => handleTokenSearch(e)}
                            value={searchToken}
                        />
                        <button
                            className={'mx-2 hover:text-gray-500'}
                            onClick={(e) => handleTokenSearch(e)}
                        >
                            {searchToken.length ? 'Clear' : 'Search'}
                        </button>
                    </form>
                </div>
            </PVHeader>
            <PVBody id={'unclaimed-body'}>
                <PVGridContainer id={'unclaimed-grid-container'} columns={6}>
                    {current.map((claim) => (
                        <UnclaimedCardContainer
                            key={claim.tokenId}
                            asset={claim.asset}
                        />
                    ))}
                    {/*{current.map(
                        (asset) =>
                            asset.name !== null && (
                                <UnclaimedCardContainer
                                    key={asset.id}
                                    asset={asset}
                                />
                            )
                    )}*/}
                </PVGridContainer>
            </PVBody>
            <PVFooter id={'unclaimed-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
        </PVPage>
    );
};

export default Unclaimed;
