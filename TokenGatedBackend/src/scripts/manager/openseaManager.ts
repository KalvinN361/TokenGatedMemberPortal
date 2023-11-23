import { getOne } from './baseManager';
import { AssetEntity, ContractEntity } from '../../entity';
import { getAlchemyProvider } from '../utilities';
import { Contract, ethers, Wallet } from 'ethers';
import { SeaDropAbi } from '../../abi';
import { random } from 'underscore';
import { dataSource } from '../utilities/database';

export const replaceImageHash = (data: any, hash: string, name?: string) => {
    let tmp = { ...data };
    tmp.image = `ipfs://${hash}/${name ? name : '1'}`;
    return tmp;
};

export const mintPublicSeaDrop = async (
    contractId: string,
    quantity: number
) => {
    const { JTN_WALLET_PRIVATE_KEY } = process.env;
    let tx,
        receipt = [];
    try {
        const contract = (await getOne(
            ContractEntity,
            contractId
        )) as ContractEntity;
        const { address, abi } = contract;
        const provider = getAlchemyProvider(contract.chainId as number);
        const signer = new Wallet(JTN_WALLET_PRIVATE_KEY as string, provider);
        const SeaDropContract = new Contract(
            '0x00005EA00Ac477B1030CE78506496e8C2dE24bf5',
            SeaDropAbi,
            signer
        );
        const PVOpenSeaContract = new Contract(address, abi, signer);
        const signedSeaDropContract = SeaDropContract.connect(signer);
        const feeData = await provider.getFeeData();
        const fee = feeData.gasPrice as bigint;
        const estimate = await provider.estimateGas({
            gasPrice: feeData.gasPrice,
        });
        const nonce = await provider.getTransactionCount(signer.address);
        const block = (await provider.getBlock('latest')) as ethers.Block;
        const salt = ethers.solidityPackedSha256(
            ['uint256', 'uint256', 'uint256'],
            [block.number, fee, random(100000)]
        );
        const signature = await signer.signMessage(salt);
        const feeRecipient = '0x0000a26b00c1F0DF003000390027140000fAa719';
        const minterIfNotPayer = '0x0000000000000000000000000000000000000000';
        const increment = 5000;
        for (let i = quantity; i > 0; i -= increment) {
            console.log({ i, address });
            let mintQuantity = i > increment ? increment : i;
            tx = await signedSeaDropContract.getFunction('mintPublic')(
                address,
                feeRecipient,
                minterIfNotPayer,
                mintQuantity,
                { gasPrice: feeData.gasPrice, gasLimit: Number(estimate) * 256 }
            );
            console.log({ tx });
            receipt.push(await tx.wait());
            console.log({ receipt });
        }
        return { status: 'success', code: 200, receipt };
    } catch (e) {
        console.log(e);
        return { status: 'failed', code: 404, response: e };
    }
};

export const getNextAvailableToken = async (
    contractId: string,
    contractOwnerId: string
) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .where(
            'a.archived=:archived AND a.contractId=:contractId AND a.ownerId=:ownerId AND a.reserve=:reserve',
            {
                archived: false,
                contractId: contractId,
                ownerId: contractOwnerId,
                reserve: false,
            }
        )
        .orderBy('a.tokenId :: integer', 'ASC')
        .getOne()
        .then(async (res) => {
            let updateAsset = res as AssetEntity;
            await dataSource
                .createQueryBuilder()
                .update(AssetEntity)
                .set({ reserve: true })
                .where('id = :id', { id: updateAsset.id })
                .execute();
            return updateAsset as AssetEntity;
        });
};
