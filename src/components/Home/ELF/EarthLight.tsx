import React, { useState } from 'react';
import { Asset, HomeProps } from '@definitions/index';
import {
    ImageContainerELF,
    ResultCardContentELF,
    ResultCardELF,
    ResultPageELF,
    TelescopeImg,
} from '@styles/index';
import { RootState } from '@state/store';
import { useSelector } from 'react-redux';
import { truncateAddress } from '@libs/utils';
import { LoadIndicator } from 'devextreme-react';
import ItemSideSelect from '@components/Home/ItemSideSelect';
import {
    PVHeader,
    PVPage,
    Overlay,
    PVBody,
    PVFooter,
    PoweredByVenkman,
} from '@components/Base';

const telescope =
    'https://storage.googleapis.com/earthlightfoundation/WebAssets/image/telescope.png';

export const ELFHome: React.FC<HomeProps> = (props) => {
    const {} = props;
    /*const owner = useSelector((state: RootState) => state.owner);
    const assets = useSelector((state: RootState) => state.assets);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>('');
    const loading: boolean = useSelector(
        (state: RootState) => state.isLoading
    ).isLoading;*/
    return (
        <PVPage id={'elf-home-page'}>
            <Overlay id={'elf-home-overlay'} color={'black'} />
            <PVHeader id={'elf-home-header'}></PVHeader>
            <PVBody id={'elf-home-body'}>
                {/*{loading && !assets.owned.length && (
                <ResultCardELF id={'result-card'}>
                    <ResultCardContentELF id={'result-card-content'}>
                        <TelescopeImg id={'frame'} src={telescope} />
                        <ImageContainerELF id={'image-container'}>
                            <div
                                className={
                                    ' text-white p-2 absolute top-1/2 left-1/2 w-[67%] h-[62%] z-100'
                                }
                                style={{ transform: 'translate(-50%, -50%)' }}
                            >
                                <p>{`Retrieving NFTs for ${truncateAddress(
                                    owner.walletAddress
                                )}`}</p>
                                <LoadIndicator
                                    visible={loading}
                                ></LoadIndicator>
                            </div>
                        </ImageContainerELF>
                    </ResultCardContentELF>
                </ResultCardELF>
            )}
            {assets.owned.length > 0 && (
                <ResultCardELF id={'result-card'}>
                    <ResultCardContentELF id={'result-card-content'}>
                        <TelescopeImg
                            className="z-30"
                            id={'frame'}
                            src={telescope}
                        />
                        {owner.walletAddress ==
                            '0x42017df7ce71AD2Fe80cCa4C3D9bFc0512fff5Cf' && (
                            <ImageContainerELF
                                className="z-50"
                                id={'image-container'}
                            >
                                // @ts-ignore
                                {!loading && (
                                    <ItemAssetImageELF key={1} image={''} />
                                )}
                            </ImageContainerELF>
                        )}
                    </ResultCardContentELF>
                </ResultCardELF>
            )}
            {!assets.owned.length && !loading && (
                <ResultCardELF id={'result-card'}>
                    <ResultCardContentELF id={'result-card-content'}>
                        <TelescopeImg id={'frame'} src={telescope} />
                        <ImageContainerELF id={'image-container'}>
                            <Invalid />
                        </ImageContainerELF>
                    </ResultCardContentELF>
                </ResultCardELF>
            )}*/}
            </PVBody>
            <PVFooter id={'elf-home-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
            {/*{modalOpen && (
                <ItemModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    modalType={modalType}
                />
            )}*/}
        </PVPage>
    );
};

export default ELFHome;
