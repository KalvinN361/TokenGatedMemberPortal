import React from 'react';
import { Base } from './Base';

export interface Collect extends Base {
    shortName: string;
    name: string;
    description: string;
    bgImage: string;
}

export type CollectProps<
    P = {
        shortName?: string;
    },
> = P;

export type CollectPageStyleProps<
    P = {
        bgimage?: string;
        children?: React.ReactNode;
    },
> = P;

export type CardStep0Props<
    P = {
        handleStepClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
        email: string;
        referral: string;
    },
> = P;

export type CardStep1Props<
    P = {
        handleStepClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    },
> = P;

export type CardStep2Props<
    P = {
        handleStepClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    },
> = P;

export type CardStep3Props<
    P = {
        handleStepClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    },
> = P;

export type CardStepSoldOutProps<P = {}> = P;
