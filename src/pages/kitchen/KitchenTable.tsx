import { PageSize, Table } from 'components';
import React from 'react'
import { KitchenOrderRecord } from './types';
import { columns } from './KitchenTableColumns';

export interface DeliveryTableProps {
    data: KitchenOrderRecord[];
    updateTableHandler: () => void;
}

export const KitchenTable = ({ data, updateTableHandler }: DeliveryTableProps) => {

    const sizePerPageList: PageSize[] = [
        {
            text: '10',
            value: 10,
        },
        {
            text: '20',
            value: 20,
        },
        {
            text: 'All',
            value: data.length,
        },
    ];


    return (
        <Table<KitchenOrderRecord>
            columns={columns}
            data={data}
            pageSize={20}
            sizePerPageList={sizePerPageList}
            isSortable={true}
            pagination={true}
            isSelectable={false}
            isSearchable={true}
            theadClass="table-light"
            searchBoxClass="mb-2"
            isUpdatable={true}
            onClickUpdate={updateTableHandler}
        />
      )
}
