import { Contract, Wallet, parseEther } from 'ethers';
import { ContractEntity, PrizeEntity } from '../../entity';
import { dataSource, setDataSource } from '../../scripts/utilities/database';
import { getAlchemyProvider } from '../utilities';
import { abi721 } from '../../abi';
import { getContractByAddress } from './contractManager';

export const getPrizeCount = async (eventId: string) => {
    const prizeCount = await dataSource
        .createQueryBuilder(PrizeEntity, 'p')
        .where('p.eventId = :eventId', { eventId: eventId })
        .getCount();

    return prizeCount;
};

export const claimTransfer = async (
    prizes: PrizeEntity[],
    ownerId: string,
    walletAddress: string
) => {
    const results = [];
    for (const prize of prizes) {
        const result = await dataSource
            .createQueryBuilder()
            .update(PrizeEntity)
            .set({ claimed: true, ownerId: ownerId, transactionType: 'crypto' })
            .where('id = :id AND claimed = :claimed', {
                id: prize.id,
                claimed: false,
            })
            .execute()
            .catch((error) => {
                return {
                    error: error,
                    message: 'Could not be claimed, check if data is correct',
                };
            });

        let prizeContract = (await getContractByAddress(
            prize.contractAddress
        )) as ContractEntity;
        const provider = getAlchemyProvider(prizeContract.chainId);
        const { PV_WALLET_PRIVATE_KEY } = process.env;
        const signer = new Wallet(PV_WALLET_PRIVATE_KEY as string, provider);
        // TODO: Here we will be setting the prize contract chainId
        const contract = new Contract(
            prize.contractAddress,
            prizeContract.abi,
            provider
        );
        const signedContract = contract.connect(signer);
        const amountString = prize.name;
        const amount = amountString.match(/[\d.]+/)?.[0] || '';
        // TODO grab the abi from the database.
        if (prize.type === 'ERC20') {
            console.log(amount, 'amount');
            const tx = {
                to: walletAddress,
                value: parseEther(amount),
            };
            const txHash = await signer.sendTransaction(tx);
        } else if (prize.type === 'ERC721') {
            const tx = await signedContract.getFunction('safeTransferFrom')(
                signer.address,
                walletAddress,
                prize.tokenId
            );
            console.log(tx, 'tx');
        } else if (prize.type === 'ERC1155') {
            const tx = await signedContract.getFunction('safeTransferFrom')(
                signer.address,
                walletAddress,
                prize.tokenId,
                amount
            );
            console.log(tx, 'tx');
        }
        results.push(result);
    }

    return results;
};
export const claimHoldTransfer = async (
    prizes: PrizeEntity[],
    ownerId: string
) => {
    const results = [];
    for (const prize of prizes) {
        const result = await dataSource
            .createQueryBuilder()
            .update(PrizeEntity)
            .set({ claimed: true, ownerId: ownerId, transactionType: 'fiat' })
            .where('id = :id AND claimed = :claimed', {
                id: prize.id,
                claimed: false,
            })
            .execute()
            .catch((error) => {
                return {
                    error: error,
                    message: 'Could not be claimed, check if data is correct',
                };
            });
        results.push(result);
    }
};

export const remoteTimeHoldPrize = async (eventId: string) => {
    const twoMinutesAgo = new Date();
    twoMinutesAgo.setUTCMinutes(twoMinutesAgo.getUTCMinutes() - 2);

    const twoMinutesAgoISOString = twoMinutesAgo.toISOString().slice(0, -1);
    const prize = await dataSource
        .createQueryBuilder(PrizeEntity, 'q')
        .where('q.eventId = :eventId', { eventId })
        .andWhere('q.hold = :hold', { hold: true })
        .andWhere('q.updatedDate <= :twoMinutesAgo', {
            twoMinutesAgo: twoMinutesAgoISOString,
        })
        .getMany();
    for (const prizeItem of prize) {
        prizeItem.hold = false;
        await dataSource.getRepository(PrizeEntity).save(prizeItem);
    }
};
export const removeHoldPrize = async (
    eventId: string,
    ownerId: string,
    quantity: number
) => {
    let prize = await dataSource
        .createQueryBuilder(PrizeEntity, 'q')
        .where('q.eventId = :eventId', {
            eventId: eventId,
        })
        .andWhere('q.ownerId = :ownerId', {
            ownerId: ownerId,
        })
        .andWhere('q.hold = :hold', {
            hold: true,
        })
        .take(quantity)
        .getMany();
    for (const prizeItem of prize) {
        prizeItem.hold = false;
        // Update the queueItem in the data source
        await dataSource.getRepository(PrizeEntity).save(prizeItem);
    }
};
export const addHoldPrize = async (ownerId: string, prizes: PrizeEntity[]) => {
    if (!prizes || prizes.length === 0) {
        throw new Error('Prizes array is empty.');
    }

    for (let prize of prizes) {
        await dataSource
            .createQueryBuilder()
            .update(PrizeEntity)
            .set({ ownerId: ownerId, hold: true }) // set ownerId column to provided ownerId
            .where('id = :prizeId', { prizeId: prize.id }) // Match based on the ID of the prize
            .execute();
    }
};
