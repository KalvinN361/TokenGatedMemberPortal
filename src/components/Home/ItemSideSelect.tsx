import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Asset, Asset1155Portal, ItemSelectProps } from '@definitions/index';
import {
    FaChevronLeft,
    FaChevronRight,
    FaChevronUp,
    FaChevronDown,
} from 'react-icons/fa';
import { RootState, setCurrentAsset } from '@state/index';
import { isAsset, isAsset1155Portal } from '@libs/utils';
import styled from 'styled-components';
import tw from 'twin.macro';

export const ItemSideSelect: React.FC<ItemSelectProps> = (props) => {
    const assets = useSelector((state: RootState) => state.assets);
    /*const ownedAssets: Array<Asset> = useSelector(
(state: RootState) => state.ownedAssets
);*/
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [tokenId, setTokenId] = useState<string>('');
    const [listAssets, setListAssets] = useState<
        Array<Asset | Asset1155Portal>
    >([]);

    const toggleOptions = () => setIsOpen(!isOpen);

    const handleSelectionClick = (value: number) => {
        setIsOpen(false);
        dispatch(setCurrentAsset(assets.noOpenEdition[value]));
    };

    const handleSelectionClick2 = (value: number) => {
        setIsOpen(false);
        //dispatch(setCurrentOwnedAsset(ownedAssets[value]));
    };

    /*const isAsset = (item: any): item is Asset => {
return (item as Asset).name !== undefined;
};*/

    useEffect(() => {
        if (!assets.noOpenEdition) return;
        if (assets.noOpenEdition.length) {
            if (isAsset(assets.noOpenEdition[0])) {
                dispatch(setCurrentAsset(assets.noOpenEdition[0] as Asset));
            } else {
                dispatch(
                    setCurrentAsset(assets.noOpenEdition[0] as Asset1155Portal)
                );
            }
        }
    }, [assets.noOpenEdition]);

    useEffect(() => {
        if (!assets.current) return;
        if (isAsset(assets.current)) {
            setName(assets.current.name);
            setTokenId(assets.current.tokenId);
        } else if (isAsset1155Portal(assets.current)) {
            setName(assets.current.token1155.name);
            setTokenId(assets.current.token1155.tokenId);
        }
    }, [assets.current]);
    return (
        <SideSelectionWrapper
            id={'side-selection-wrapper'}
            className={isOpen ? 'opened' : ''}
        >
            <SelectionHandle
                id={'selection-side-handle'}
                onClick={
                    assets.owned.length > 1 /*|| ownedAssets.length > 1*/
                        ? toggleOptions
                        : () => {}
                }
            >
                <SelectionIcon id={'selection-icon'}>
                    <span className={'mr-4'}>{`Change Badge`}</span>
                    <ChevronContainer id={'chevron'}>
                        {isOpen ? <FaChevronDown /> : <FaChevronUp />}
                    </ChevronContainer>
                </SelectionIcon>
            </SelectionHandle>
            <SideSelectionContainer id={'side-selection-container'}>
                <SelectionOptionWrapper
                    id={'selection-option-wrapper'}
                    className={isOpen ? 'opened' : ''}
                >
                    <SelectionOptionsContainer
                        id={'selection-option-container'}
                    >
                        <SelectionOptionsList id={'selecion-option-list'}>
                            {assets.noOpenEdition.map(
                                (asset: Asset | Asset1155Portal, i: number) => {
                                    let aname = '';
                                    let atokenId = '';
                                    if (asset) {
                                        if (isAsset(asset)) {
                                            aname = asset.name;
                                            atokenId = asset.tokenId;
                                        } else {
                                            aname = asset.token1155.name;
                                            atokenId = asset.token1155.tokenId;
                                        }
                                    }
                                    return (
                                        <SelectionOptionsListItem
                                            key={i}
                                            id={'selection-option-list-item'}
                                            className={
                                                name === aname &&
                                                tokenId === atokenId
                                                    ? 'selected'
                                                    : ''
                                            }
                                            onClick={() =>
                                                handleSelectionClick(i)
                                            }
                                        >
                                            {`${aname} (${atokenId})`}
                                        </SelectionOptionsListItem>
                                    );
                                }
                            )}
                        </SelectionOptionsList>
                    </SelectionOptionsContainer>
                </SelectionOptionWrapper>
            </SideSelectionContainer>
        </SideSelectionWrapper>
    );
};

const SideSelectionWrapper = styled.div`
    ${tw`w-full absolute bottom-0 translate-y-[10%] z-60 origin-bottom`}
    &.opened {
        ${tw`z-100`}
    }
`;

const SideSelectionContainer = styled.div`
    ${tw`flex flex-col h-full w-full justify-center items-center text-black`};
`;
const SelectionOptionWrapper = styled.div`
    ${tw`ease-in-out duration-500 bg-white/50 w-full sm:w-2/3 xl:w-1/3 h-0`}
    &.opened {
        ${tw`block flex-1 h-full ease-in-out duration-500`}
    }
`;
const SelectionOptionsContainer = styled.div`
    ${tw`
		z-100 h-full overflow-y-auto
	`}
`;
const SelectionOptionsList = styled.ul`
    ${tw`
		w-full left-0 ease-in-out duration-300
	`}
`;
const SelectionOptionsListItem = styled.li`
    ${tw`
        px-4 py-2 cursor-pointer 
        text-sm font-bold hover:text-green-700 hover:bg-white/25 
        border-b first:border-t border-solid border-white/25
    `};

    &.selected {
        ${tw`text-gray-700 hover:text-gray-700 cursor-default hover:bg-transparent`}
    }
`;
const SelectionHandle = styled.div`
    ${tw`h-fit w-full px-1 flex justify-center items-center font-bold hover:bg-black/25`};
`;
const SelectionIcon = styled.div`
    ${tw`
        flex justify-center items-center w-fit h-fit px-2 pt-2 
        bg-white/50 rounded-t-xl border-t-2 border-x-2 border-white/50 border-solid cursor-pointer`};
`;
const ChevronContainer = styled.div`
    ${tw`animate-bounce`};
`;

export default ItemSideSelect;
