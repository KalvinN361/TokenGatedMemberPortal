import { Asset } from '@definitions/Asset';
import React from 'react';
import { DataGrid } from 'devextreme-react';
import {
    Column,
    Editing,
    HeaderFilter,
    MasterDetail,
    Pager,
    Paging,
    Scrolling,
} from 'devextreme-react/data-grid';
import { MetadataMasterDetails } from '@pages/Administrative/Venkman/MetadataMasterDetails';

type AssetDetailProps<
    P = {
        data: { assets: Array<Asset> };
    },
> = P;

export const AssetMasterDetails: React.FC<AssetDetailProps> = (props) => {
    const { assets } = props.data;
    const pageSizes: Array<number | 'all' | 'auto'> | 'auto' = [
        10,
        25,
        50,
        100,
        'all',
    ];

    return (
        <div className={'w-full relative'} id={'asset-grid'}>
            <DataGrid
                className={'relative'}
                dataSource={assets}
                showBorders={true}
                columnAutoWidth={false}
                allowColumnReordering={true}
                rowAlternationEnabled={true}
                showRowLines={true}
                //onSaving={handleSave}
            >
                <HeaderFilter visible={true} />
                <Column
                    dataField={'tokenId'}
                    caption={'Token ID'}
                    width={50}
                    allowSorting={true}
                    sortingMethod={(a: string, b: string) =>
                        parseInt(a) - parseInt(b)
                    }
                    sortOrder={'asc'}
                />
                <Column
                    width={200}
                    dataField={'name'}
                    caption={'Name'}
                    allowEditing={false}
                    allowSorting={false}
                ></Column>
                <Column
                    dataField={'description'}
                    caption={'Description'}
                    allowEditing={false}
                    allowSorting={false}
                ></Column>
                <MasterDetail enabled={true} render={MetadataMasterDetails} />
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
        </div>
    );
};
