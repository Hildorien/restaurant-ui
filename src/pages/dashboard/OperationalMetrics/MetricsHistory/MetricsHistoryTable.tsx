import React from 'react'
import { PageSize, Table } from 'components';
import { MetricsHistoryTableProps } from './types';
import { columns } from './MetricsHistoryColumns';
import { BrandRecord } from 'redux/operationalMetrics/types';

export const MetricsHistoryTable = ({ recordsProps }: MetricsHistoryTableProps) => {
    
    const sizePerPageList: PageSize[] = [
        {
            text: '5',
            value: 5,
        },
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
            value: recordsProps.length,
        },
    ];

    return (
      <Table<BrandRecord>
          columns={columns}
          data={recordsProps}
          pageSize={5}
          sizePerPageList={sizePerPageList}
          isSortable={true}
          pagination={true}
          isSelectable={false}
          isSearchable={true}
          theadClass="table-light"
          searchBoxClass="mb-2"
      />
    )
}
