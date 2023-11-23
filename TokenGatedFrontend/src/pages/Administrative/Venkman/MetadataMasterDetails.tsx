import { Attribute } from '@definitions/Asset';
import React from 'react';
import { DataGrid, TextArea } from 'devextreme-react';
import { Column, Editing } from 'devextreme-react/data-grid';

type MetadataDetailProps<
    P = {
        data: {
            description: string;
            image: string;
            imageSmall: string;
            animation: string;
            attributes: Array<Attribute>;
        };
    },
> = P;

export const MetadataMasterDetails: React.FC<MetadataDetailProps> = (props) => {
    const { description, image, imageSmall, animation, attributes } =
        props.data;

    return (
        <div className={'w-full flex flex-row justify-between'}>
            <div className={'w-1/2 flex justify-center'}>
                <div className={'p-2 w-1/2'}>
                    {!image && !imageSmall && (
                        <video
                            src={animation}
                            autoPlay={true}
                            loop={true}
                            muted={true}
                            controls={true}
                        />
                    )}
                    {(image || imageSmall) && (
                        <img src={imageSmall ? imageSmall : image} alt={''} />
                    )}
                </div>
                <div className={'p-2 w-1/2 h-full'}>
                    <TextArea height={'100%'} value={description} />
                </div>
            </div>
            <div className={'w-1/2 p-2'} id={'metadata-grid'}>
                <DataGrid
                    dataSource={attributes}
                    showBorders={true}
                    columnAutoWidth={false}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showRowLines={true}
                    //onSaving={handleSave}
                >
                    <Column
                        dataField={'traitType'}
                        width={200}
                        caption={'Trait'}
                        allowSorting={true}
                        sortOrder={'asc'}
                    />
                    <Column
                        dataField={'value'}
                        width={200}
                        caption={'Value'}
                        allowSorting={true}
                    />
                    <Editing
                        mode={'cell'}
                        allowUpdating={true}
                        allowDeleting={false}
                        allowAdding={false}
                    />
                </DataGrid>
            </div>
        </div>
    );
};
