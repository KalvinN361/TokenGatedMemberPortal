import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

export type HomeProps<
    D extends React.ElementType = div['defaultComponent'],
    P = { result? },
> = div<P, D>;

export type PageStyleProps<
    P = {
        bgImage?: string;
        children?: React.ReactNode;
    },
> = P;

export type ProfileProps<P = {}> = P;
export type ChiveProps<P = {}> = P;
export type NavBarProps<
    P = {
        modalOpen: boolean;
        setModalOpen: Dispatch<SetStateAction<boolean>>;
        setModalType: Dispatch<SetStateAction<string>>;
    },
> = P;
export type PeachProps<P = {}> = P;
export type ItemProps<
    P = {
        image: string;
    },
> = P;
export type ItemSelectProps<P = {}> = P;
export type ResultModalProps<
    P = {
        modalOpen: boolean;
        setModalOpen: Dispatch<SetStateAction<boolean>>;
        modalType: string;
    },
> = P;

export type Web3ModalProps<P = {}> = P;
