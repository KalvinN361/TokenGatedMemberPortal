import React, { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { PVModalHeader, PVModal, PVModalBody } from '@components/Base';

type InfoModalProps<
    P = {
        openInfoModal: boolean;
        setOpenInfoModal: Dispatch<SetStateAction<boolean>>;
        children?: ReactNode;
        title?: string;
    },
> = P;

export const InfoModalComponent: FC<InfoModalProps> = (props) => {
    const { openInfoModal, setOpenInfoModal, children, title } = props;

    const handleCloseModal = () => {
        setOpenInfoModal(false);
    };

    return (
        <PVModal id={'transfer-modal'} openModal={openInfoModal}>
            <PVModalHeader id={'transfer-modal-header'}>
                <h1>{title}</h1>
            </PVModalHeader>
            <PVModalBody id={'transfer-modal-body'}>{children}</PVModalBody>
        </PVModal>
    );
};
