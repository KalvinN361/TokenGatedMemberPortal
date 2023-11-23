import React, { useEffect, useState } from 'react';
import { Asset, ProfileProps, Asset1155Portal } from '@definitions/index';
import { RootState } from '@state/store';
import { useSelector } from 'react-redux';
import { isAsset, isAsset1155Portal } from '@libs/utils';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

const frame =
    'https://storage.googleapis.com/billmurray1000/WebAssets/image/FRAME-NO-BILL2.png';

export const Profile: React.FC<ProfileProps> = (props) => {
    const {} = props;
    const navigate = useNavigate();
    let currentAsset: Asset | Asset1155Portal | null = useSelector(
        (state: RootState) => state.assets.current
    ) as Asset | Asset1155Portal;

    const assets = useSelector((state: RootState) => state.assets);
    const owner = useSelector((state: RootState) => state.owner);
    const [image, setImage] = useState<string>('');
    const currentTokenId = isAsset(currentAsset)
        ? currentAsset.tokenId
        : currentAsset.token1155.tokenId;

    const filteredAssets = assets.owned.filter((asset) => {
        if (isAsset(asset)) {
            return asset.tokenId !== currentTokenId;
        } else {
            return asset.token1155.tokenId !== currentTokenId;
        }
    });

    console.log(filteredAssets);
    // use wallet address to get id

    const benefits = [
        'Competitive salaries',
        'Flexible work hours',
        '30 days of paid vacation',
        'Annual team retreats',
        'Benefits for you and your family',
        'A great work environment',
    ];

    useEffect(() => {
        if (isAsset(currentAsset)) {
            if (currentAsset.imageSmall !== null)
                setImage(currentAsset.imageSmall);
            else setImage(currentAsset.image);
        } else if (isAsset1155Portal(currentAsset)) {
            setImage(currentAsset.token1155.image);
        }
    }, [currentAsset]);

    return (
        <div className="flex justify-center bg-gray-900 py-24 sm:py-32 h-full w-full ">
            <div className="relative flex items-center isolate">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8"></div>
                    <div
                        id="topProfileContainer"
                        className="mx-auto flex max-w-2xl flex-col gap-16 bg-white/5 px-6 py-16 ring-1 ring-white/10 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20"
                    >
                        <img
                            className="h-96 w-full flex-none rounded-2xl object-cover shadow-xl lg:aspect-square lg:h-auto lg:max-w-sm"
                            src={image}
                            alt=""
                        />
                        <div className="w-full flex-auto">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Join our team (Project Venkman)
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                Lorem ipsum dolor sit amet consect adipisicing
                                elit. Possimus magnam voluptatum cupiditate
                                veritatis in accusamus quisquam.
                            </p>
                            <ul
                                role="list"
                                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base leading-7 text-white sm:grid-cols-2"
                            >
                                {benefits.map((benefit) => (
                                    <li key={benefit} className="flex gap-x-3">
                                        <CheckCircleIcon
                                            className="h-7 w-5 flex-none"
                                            aria-hidden="true"
                                        />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10 flex">
                                <a
                                    href="#"
                                    className="text-sm font-semibold leading-6 text-indigo-400"
                                >
                                    See our job postings{' '}
                                    <span aria-hidden="true">&rarr;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-white px-4">
                        <h3 className="text-2xl font-bold">
                            Update Current NFT
                        </h3>
                        <div
                            className="mt-4 flex overflow-x-auto whitespace-nowrap"
                            style={{
                                overflowY: 'hidden',
                                overflowX: 'auto',
                                height: '200px',
                            }}
                        >
                            {filteredAssets.map((asset) => (
                                <div key={asset.id} className="flex-none mr-4">
                                    <img
                                        src={
                                            isAsset(asset)
                                                ? asset.image
                                                : asset.token1155.image
                                        }
                                        style={{
                                            maxHeight: '200px',
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
                    aria-hidden="true"
                >
                    <div
                        className="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
                        style={{
                            clipPath:
                                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;
