import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CollectProps } from '@definitions/Collect';
import {
    CollectBody,
    CollectFooter,
    CollectHeader,
    CollectImageContainer,
    CollectImageContainerVert,
    CollectPage,
} from '@styles/Collect.styled';
import { Api } from '@libs/API';
import {
    CardStep0,
    CardStep1,
    CardStepWallet,
    CardStepEmail,
    CardStepSoldOut,
} from '@components/index';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/store';
import {
    setDrop,
    setEmail,
    setReferral,
    setWalletAddress,
} from '@state/features';
import { magic } from '@libs/magic';

export const Collect: React.FC<CollectProps> = (props) => {
    const {} = props;
    const dispatch = useDispatch();
    const { dropSymbol } = useParams();
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState<number>(0);
    const [count, setCount] = useState<number>(1);
    const collect = useSelector((state: RootState) => state.collect);
    // const dropContract = useSelector((state: RootState) => state.collect.drop);
    // const email = useSelector((state: RootState) => state.collect.email);
    // const referral = useSelector((state: RootState) => state.collect.referral);
    const owner = useSelector((state: RootState) => state.owner);

    const handleStepClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        magic.user.logout();
        dispatch(setEmail(''));
        dispatch(setReferral(''));
        dispatch(setWalletAddress(''));
        const value = parseInt(e.currentTarget.value);
        setStep(value);
    };

    useEffect(() => {
        if (!collect.drop.id) return;
        const timeout = setTimeout(() => {
            (async () => {
                const amount = (await Api.collect.getCountByContractId(
                    collect.drop.id,
                    '91845f58-1ef4-4848-a314-04489e7e7aaf'
                )) as number;
                setCount(amount);
            })();
        }, 1000);
        return () => clearTimeout(timeout);
    }, [collect]);

    useEffect(() => {
        if (!dropSymbol) return;
        (async () => {
            const dropContract = await Api.contract.getOneBySymbol(
                dropSymbol.toUpperCase()
            );
            dispatch(setDrop(dropContract));
        })();
    }, [dropSymbol]);

    useEffect(() => {
        let e = searchParams.get('email');
        let r = searchParams.get('referral');
        //if (!e && !r) setStep(1);
        //else {
        dispatch(setEmail(searchParams.get('email') as string));
        dispatch(setReferral(searchParams.get('referral') as string));
        //}
    }, []);

    return (
        <CollectPage>
            <CollectImageContainer />
            <CollectHeader>
                <h1>Bill Murray 1000: Open Edition</h1>
                <div
                    className={'w-full py-4 flex justify-center'}
                >{`${count} left to claim`}</div>
            </CollectHeader>
            <CollectBody>
                {count < 1 && <CardStepSoldOut />}
                {count > 0 && step === 0 && (
                    <CardStep0
                        handleStepClick={handleStepClick}
                        email={collect.email}
                        referral={collect.referral}
                    />
                )}
                {count > 0 && step === 1 && (
                    <CardStep1 handleStepClick={handleStepClick} />
                )}
                {count > 0 && step === 2 && (
                    <CardStepWallet handleStepClick={handleStepClick} />
                )}
                {count > 0 && step === 3 && (
                    <CardStepEmail handleStepClick={handleStepClick} />
                )}
            </CollectBody>
            <CollectFooter>
                {collect.email && (
                    <p className={'font-arial font-normal text-sm'}>
                        email: {collect.email}
                    </p>
                )}
                {owner.walletAddress && (
                    <p className={'font-arial font-normal text-sm text-center'}>
                        connected to {owner.walletAddress}
                    </p>
                )}
            </CollectFooter>
        </CollectPage>
    );
};

export default Collect;
