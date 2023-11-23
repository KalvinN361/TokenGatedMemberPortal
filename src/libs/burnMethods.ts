import { Asset, BurnAsset } from '@definitions/Asset';
import { Contract as EthersContract, ethers } from 'ethers';
import { abi_721 } from '@libs/abi/abi_721';
import { Api } from './API';
import wait from 'fork-ts-checker-webpack-plugin/lib/utils/async/wait';

//@ts-ignore
const { Contract } = HyperMint;

export const burnCurtainsMethod = async (
    burnAsset: BurnAsset,
    fromAddress: string
) => {
    try {
        let ethersProvider = new ethers.BrowserProvider(window.ethereum);
        let toAddress =
            (await ethersProvider.resolveName('bm1000burnandturn.eth')) ||
            '0x4B77b0CcF0eB6125CeaBc4e9a43c7a87CDEDCeff';
        let signer = await ethersProvider.getSigner();

        let BurnContract = new EthersContract(
            burnAsset.contractAddress,
            abi_721,
            signer
        );
        const tx = await BurnContract.transferFrom(
            fromAddress,
            toAddress,
            burnAsset.tokenId
        );
        console.log('txHash', tx.hash);
        const receipt = await tx.wait();
        console.log('receipt', receipt);

        if (receipt) {
            Api.asset
                .updateOwner(burnAsset.id, toAddress)
                .then((res: any) => {});
        }
        return true;
    } catch (error) {
        console.log({ status: 'failed', error });
        return false;
    }
};

export const upgrade3DGlassesMethod = async (
    burnAsset: BurnAsset,
    billAsset: Asset
) => {
    //console.log('upgrade3DGlassesMethod()', burnAsset);
    let tx = await burnGlasses(burnAsset);
    if (tx.transactionStatus === 'Failed') return 'Failed';
    if (tx.transactionStatus === 'Complete') {
        await Api.asset.upgradeBill3DFrame(billAsset.id);
    }
};

export const burnGlasses = async (burnAsset: BurnAsset) => {
    const burnAssetContract = await Api.contract.getOneByContractId(
        burnAsset.contractId
    );
    const contract = new Contract({
        //hard coded for now need to find a way to get this dynamic.
        //contractId: '60f3b39d-370a-4489-b6f1-56b42ccd5e60',
        contractId: burnAssetContract!.partnerContractId,
        enableLogging: true,
    });
    //const tx = await contract.burn(burnAsset.tokenId, 1, true);
    const tx = { hash: '', transactionStatus: 'Complete' };
    return tx;
};
