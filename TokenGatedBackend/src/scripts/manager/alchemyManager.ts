import { Alchemy, Network } from 'alchemy-sdk';

export const getNetwork = (chainId: number) => {
    switch (chainId) {
        case 1:
            return Network.ETH_MAINNET;
        case 5:
            return Network.ETH_GOERLI;
        case 137:
            return Network.MATIC_MAINNET;
        case 80001:
            return Network.MATIC_MUMBAI;
    }
};

export const getAlchemy = async (chainAPIKey: string, chainId: number) => {
    const settings = {
        apiKey: chainAPIKey,
        network: getNetwork(chainId),
    };
    return new Alchemy(settings);
};

export const getOwners = async (
    chainAPIKey: string,
    chainId: number,
    address: string
) => {
    const alchemy = await getAlchemy(chainAPIKey, chainId);
    return await alchemy.nft.getOwnersForContract(address).then((response) => {
        console.log(
            `PV::${new Date().toISOString()}::Found ${
                response.owners.length
            } owners for ${address}`
        );
        return response.owners;
    });
};

export const getNFTs = async (
    chainAPIKey: string,
    chainId: number,
    address: string,
    limit?: number
) => {
    const alchemy = await getAlchemy(chainAPIKey, chainId);
    return await alchemy.nft
        .getNftsForContract(address, { pageSize: limit })
        .then((response) => {
            console.log(
                `PV::${new Date().toISOString()}::Found ${
                    response.nfts.length
                } NFTs for ${address}`
            );
            return response.nfts;
        });
};

export const getNFTsForOwner = async (
    chainAPIKey: string,
    chainId: number,
    contractAddresses: Array<string>,
    walletAddress: string
) => {
    const alchemy = await getAlchemy(chainAPIKey, chainId);
    let nftList: Array<any> = [];
    let pageKey: string | undefined = '';

    do {
        await alchemy.nft
            .getNftsForOwner(walletAddress, {
                contractAddresses: contractAddresses,
                omitMetadata: true,
                pageKey: pageKey,
            })
            .then((response) => {
                nftList = nftList.concat(response.ownedNfts);
                if (response.pageKey !== undefined) pageKey = response.pageKey;
                else pageKey = undefined;
                console.log(
                    `PV::${new Date().toISOString()}::Found ${
                        response.ownedNfts.length
                    } NFTs for ${walletAddress}`
                );
                return response.ownedNfts;
            });
    } while (pageKey !== undefined);
    return nftList;
};
