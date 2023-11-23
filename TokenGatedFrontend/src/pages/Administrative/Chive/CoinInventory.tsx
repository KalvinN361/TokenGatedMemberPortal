import React, { useEffect, useState } from 'react';
import { Coin, CoinInventoryProps } from '@definitions/CoinInventory';
import { Api } from '@libs/API';
import { DataGrid } from 'devextreme-react';
import {
    Column,
    Editing,
    FilterRow,
    GroupPanel,
    HeaderFilter,
    LoadPanel,
    Pager,
    Paging,
    Scrolling,
    Search,
    SearchPanel,
} from 'devextreme-react/data-grid';
import EventInfo from 'devextreme/ui/data_grid';
import 'devextreme/dist/css/dx.dark.css';
import { Claim } from '@definitions/Claim';
import PVPage from '@components/Base/PVPage/PVPage';
import { PoweredByVenkman, PVFooter, PVHeader } from '@components/Base';
import PVBody from '@components/Base/PVPage/PVBody';

export const CoinInventory: React.FC<CoinInventoryProps> = (props) => {
    const {} = props;
    const [coins, setCoins] = useState<Array<Claim>>([]);
    const pageSizes: Array<number | 'all' | 'auto'> | 'auto' = [
        10,
        25,
        50,
        100,
        'all',
    ];

    useEffect(() => {
        if (coins.length) return;
        (async () => {
            await Api.claim.getAllByTypeInventory('coin').then((res) => {
                setCoins(
                    res /*.sort((a: ClaimItems, b: ClaimItems) => a.tokenID.localeCompare(b.tokenID))*/
                );
            });
        })();
    }, [coins]);

    const handleSave = async (e: EventInfo<any> & any) => {
        if (!e) return;
        let key = e.changes[0].key;
        let changes = e.changes[0].data;
        let { asset: omitted, ...newClaim } = key;
        let data = { ...newClaim, ...changes };
        await Api.claim.updateInventory(data);
    };

    return (
        <PVPage id={'coin-inventory-page'}>
            <PVHeader id={'coin-inventory-header'}>
                <h1>Coin Inventory</h1>
            </PVHeader>
            <PVBody id={'coin-inventory-body'}>
                <DataGrid
                    className={'w-3/4 h-full mx-auto'}
                    dataSource={coins}
                    showBorders={true}
                    columnAutoWidth={false}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showRowLines={true}
                    /*pager={{ visible: true, allowedPageSizes: pageSizes }}*/
                    onSaving={handleSave}
                    /*grouping={{ autoExpandAll: true, allowCollapsing: true }}*/
                >
                    <LoadPanel enabled />
                    <HeaderFilter visible={true} />
                    <Column
                        dataField={'name'}
                        allowFiltering={true}
                        allowEditing={false}
                        groupIndex={0}
                    >
                        <HeaderFilter allowSelectAll={false}>
                            <Search enabled={true} />
                        </HeaderFilter>
                    </Column>
                    <Column
                        dataField={'asset.name'}
                        allowEditing={false}
                        allowFiltering={true}
                    >
                        <HeaderFilter allowSelectAll={false}>
                            <Search enabled={true} />
                        </HeaderFilter>
                    </Column>
                    <Column
                        dataField={'tokenId'}
                        allowFiltering={true}
                        allowEditing={false}
                        sortOrder={'asc'}
                        width={100}
                    >
                        <HeaderFilter allowSelectAll={false}>
                            <Search enabled={true} />
                        </HeaderFilter>
                    </Column>
                    <Column
                        dataField={'claimed'}
                        allowFiltering={true}
                        width={75}
                    >
                        <HeaderFilter allowSelectAll={false}>
                            <Search enabled={true} />
                        </HeaderFilter>
                        <input type={'checkbox'} checked={!this} />
                    </Column>
                    <Column
                        dataField={'code'}
                        allowFiltering={true}
                        allowEditing={false}
                        width={125}
                    >
                        {' '}
                        <HeaderFilter allowSelectAll={true}>
                            <Search enabled={true} />
                        </HeaderFilter>
                    </Column>
                    <Column
                        dataField={'orderId'}
                        allowFiltering={true}
                        width={125}
                    >
                        {' '}
                        <HeaderFilter allowSelectAll={true}>
                            <Search enabled={true} />
                        </HeaderFilter>
                    </Column>
                    <Column
                        dataField={'url'}
                        allowFiltering={false}
                        allowEditing={false}
                    >
                        <HeaderFilter allowSelectAll={true}>
                            <Search enabled={true} />
                        </HeaderFilter>
                    </Column>
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
                    {/*<FilterRow visible={true} />*/}
                    <SearchPanel visible={true} />
                    <Scrolling rowRenderingMode={'virtual'} />
                    <GroupPanel visible={true} />
                </DataGrid>
            </PVBody>
            <PVFooter id={'coin-inventory-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
        </PVPage>
    );
};

export default CoinInventory;
