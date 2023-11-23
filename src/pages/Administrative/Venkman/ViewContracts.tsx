import React, { useEffect, useState } from 'react';
import { Api } from '@libs/API';
import { DataGrid } from 'devextreme-react';
import {
    Column,
    Editing,
    HeaderFilter,
    MasterDetail,
    Pager,
    Paging,
    Scrolling,
    Search,
} from 'devextreme-react/data-grid';
import EventInfo from 'devextreme/ui/data_grid';
import 'devextreme/dist/css/dx.dark.css';
import { Asset } from '@definitions/Asset';
import { AssetMasterDetails } from '@pages/Administrative/Venkman/AssetMasterDetails';

interface ContractWithAssets {
    assets: Array<Asset>;
}

export type ContractsWithAssetsProps<P = {}> = P;

export const ViewContracts: React.FC<ContractsWithAssetsProps> = (props) => {
    const {} = props;
    const [contracts, setContracts] = useState<Array<ContractWithAssets>>([]);
    const [change, setChange] = useState<ContractWithAssets | null>(null);

    const pageSizes: Array<number | 'all' | 'auto'> | 'auto' = [
        10,
        25,
        50,
        100,
        'all',
    ];

    useEffect(() => {
        if (contracts.length) return;
        (async () => {
            await Api.contract.getAllWithAssets().then((res) => {
                setContracts(
                    res /*.sort((a: ClaimItems, b: ClaimItems) => a.tokenID.localeCompare(b.tokenID))*/
                );
            });
        })();
    }, [contracts]);

    useEffect(() => {
        if (change === null) return;
        console.log('updating');
        (async () => {
            // TODO: update asset
        })();
    }, [change]);

    const handleSave = (e: EventInfo<any> & any) => {
        //console.log("bool", e.changes[0].key);
        setChange(e.changes[0].key);
    };

    return (
        <DataGrid
            className={'w-full h-full mx-auto relative'}
            dataSource={contracts}
            showBorders={true}
            columnAutoWidth={true}
            allowColumnReordering={true}
            rowAlternationEnabled={true}
            showRowLines={true}
            onSaving={handleSave}
            keyExpr={'id'}
        >
            <HeaderFilter visible={true} />
            <Column
                dataField={'description'}
                caption={'Contract'}
                allowFiltering={true}
            >
                <HeaderFilter allowSelectAll={false}>
                    <Search enabled={true} />
                </HeaderFilter>
            </Column>
            <Column
                dataField={'symbol'}
                caption={'Symbol'}
                width={50}
                allowEditing={false}
                allowSorting={false}
            ></Column>
            <Column
                dataField={'address'}
                caption={'Contract Address'}
                allowEditing={false}
                allowSorting={false}
            ></Column>
            <Column
                dataField={'type'}
                caption={'Type'}
                allowEditing={false}
                allowSorting={false}
            ></Column>
            <Column
                dataField={'minter'}
                caption={'Minter'}
                allowEditing={false}
                allowSorting={false}
            ></Column>
            <Column
                dataField={'partnerContractId'}
                caption={'Partner Contract ID'}
                allowEditing={false}
                allowSorting={false}
            ></Column>
            <MasterDetail enabled={true} render={AssetMasterDetails} />
            <Paging defaultPageSize={25} />
            <Pager
                visible={true}
                allowedPageSizes={pageSizes}
                displayMode={'compact'}
                showPageSizeSelector={true}
                showNavigationButtons={true}
            />
            <Editing
                mode={'cell'}
                allowUpdating={true}
                allowDeleting={false}
                allowAdding={false}
            />
            <Scrolling rowRenderingMode={'virtual'} />
        </DataGrid>
    );
};

export default ViewContracts;
