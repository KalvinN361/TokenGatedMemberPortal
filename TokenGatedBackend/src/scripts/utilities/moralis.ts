import Moralis from 'moralis';
import {
    add,
    getAssetOneByContractAndTokenId,
    getContractByAddress,
    getOne,
    getOwnerByWalletAddress,
} from '../manager';
import {
    Asset1155Entity,
    ContractEntity,
    OwnerEntity,
    Token1155Entity,
} from '../../entity';
import { getOneByContractAndTokenId } from '../manager/asset1155Manager';

const MORALIS_API_KEY = process.env.MORALIS_API_KEY as string;

export const getNftOwnersByContract = async (contractAddress: string) => {
    try {
        let contract = (await getContractByAddress(
            contractAddress
        )) as ContractEntity;
        await Moralis.start({
            apiKey: MORALIS_API_KEY,
        });
        let cursor = '';
        let owners = {};
        do {
            const response = await Moralis.EvmApi.nft.getNFTOwners({
                chain: getChain(contract.chainId),
                format: 'decimal',
                mediaItems: false,
                address: contractAddress,
                cursor: cursor,
                limit: 100,
                disableTotal: false,
            });
            for (const NFT of response.result) {
                let tokenId = NFT.tokenId;
                let walletAddress = NFT.ownerOf?.checksum as string;
                let currentOwner = (await getOwnerByWalletAddress(
                    walletAddress
                )) as OwnerEntity;
                if (!currentOwner)
                    currentOwner = (
                        await add(OwnerEntity, {
                            walletAddress: walletAddress,
                        })
                    )[0] as OwnerEntity;
                let token1155 = (await getOneByContractAndTokenId(
                    contract,
                    tokenId.toString()
                )) as Token1155Entity;
                if (tokenId in owners) {
                    // @ts-ignore
                    owners[tokenId].push({
                        token1155Id: token1155.id,
                        ownerId: currentOwner.id,
                        quantity: NFT.amount,
                    });
                } else {
                    // @ts-ignore
                    owners[tokenId] = [
                        {
                            token1155Id: token1155.id,
                            ownerId: currentOwner.id,
                            quantity: NFT.amount,
                        },
                    ];
                }
            }
            cursor = response.pagination.cursor as string;
        } while (cursor !== '' && cursor !== null);
        return owners;
    } catch (error: any) {
        console.log(error);
        return { success: false, message: error };
    }
};

const getChain = (chainId: number) => {
    switch (chainId) {
        case 1:
            return '0x1';
        case 5:
            return '0x5';
        case 137:
            return '0x89';
        case 80001:
            return '0x13881';
    }
};
