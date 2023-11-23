import React from 'react';
import { HomeProps } from '@definitions/index';
import { PVBody, PVPage, PVHeader, PVFooter } from '@components/Base';

export const PVHome: React.FC<HomeProps> = (props) => {
    const {} = props;

    return (
        <PVPage id={'pv-home-page'}>
            <PVHeader id={'pv-home-header'}>
                <h1>Home</h1>
            </PVHeader>
            <PVBody id={'pv-home-body'}></PVBody>
            <PVFooter id={'pv-home-footer'}></PVFooter>
        </PVPage>
    );
};

export default PVHome;
