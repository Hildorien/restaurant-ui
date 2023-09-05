import { OrderDocument } from "darwinModels";
import { PageSize, Table } from 'components';
import { columns } from './OrderHistoryColumns';

export interface OrderHistoryTableProps {
    data: OrderDocument[];
    totalPages: number;
    totalDocs: number;
    currentPage: number;
    queryParameters?: any;
}

export const OrderHistoryTable = ({ data, totalPages, currentPage, queryParameters }: OrderHistoryTableProps) => {

    const sizePerPageList: PageSize[] = [
        {
            text: '15',
            value: 15,
        },
    ];
    
    return (
        <Table<OrderDocument>
            columns={columns}
            data={data}
            pageSize={15}
            sizePerPageList={sizePerPageList}
            isSortable={true}
            pagination={true}
            isSelectable={false}
            isSearchable={false}
            theadClass="table-light"
            searchBoxClass="mb-2"
            totalPages={totalPages}
            currentPage={currentPage}
            queryParameters={queryParameters}
            sectionName='orders'
        />
      )
}
