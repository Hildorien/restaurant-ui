import { Column } from "react-table";
import { t } from "i18next";
import { CellFormatter } from "components";
import { BrandRecord } from "redux/operationalMetrics/types";
import config from "config/config";

/* status column render */
const BrandColumn = ({ row }: CellFormatter<BrandRecord>) => {
    

    return (
        <>
            { row.original.brandLogoSrc !== '' &&
            <img 
            src={config.imageUrl + row.original.brandLogoSrc} 
            title={row.original.brandName}
            alt="brandLogo" style={{borderRadius: '50%' }} height="48" width="48"/>
            }
            <span>{'    '}</span>
            <p className="m-0 d-inline-block align-middle font-16">{row.original.brandName}</p>
        </>

    );
};

const MonthColumn = ({ row }: CellFormatter<BrandRecord>) => {
    return ( 
        <>
            {row.original.monthName}
        </>
    )
}

const ScoringColumn = ({ row }: CellFormatter<BrandRecord>) => {
    return ( 
        <>
            {row.original.score || '--'}
        </>
    )
}

const DelayColumn = ({ row }: CellFormatter<BrandRecord>) => {
    return ( 
        <>
            {row.original.delay || '--'}
        </>
    )
}

const CancellationColumn = ({ row }: CellFormatter<BrandRecord>) => {
    return ( 
        <>
            {row.original.cancellation || '--'}
        </>
    )
}

const AvailabilityColumn = ({ row }: CellFormatter<BrandRecord>) => {
    return ( 
        <>
            {row.original.availability || '--'}
        </>
    )
}

const ProductAvailabilityColumn = ({ row }: CellFormatter<BrandRecord>) => {
    return ( 
        <>
            {row.original.productAvailability || '--'}
        </>
    )
}

export const columns: ReadonlyArray<Column> = [
    {
        Header: t('Brand').toString(),
        accessor: 'brandName',
        defaultCanSort: true,
        Cell: BrandColumn
    },
    {
        Header: t('Year').toString(),
        accessor: 'year',
        defaultCanSort: true,
    },
    {
        Header: t('Month').toString(),
        accessor: 'month',
        defaultCanSort: true,
        sortType: (a, b) => {
            if(a.values['month']  >b.values['month']) {
                return 1;
            }
            return -1;
        },
        Cell: MonthColumn
    },
    {
        Header: t('Scoring').toString(),
        accessor: 'score',
        defaultCanSort: true,
        Cell: ScoringColumn
    },
    {
        Header: t('Delay').toString() + ' (min.)',
        accessor: 'delay',
        defaultCanSort: true,
        Cell: DelayColumn
    },
    {
        Header: t('Cancellation').toString() + ' (%)',
        accessor: 'cancellation',
        defaultCanSort: true,
        Cell: CancellationColumn
    },
    {
        Header: t('Availability').toString() + ' (%)',
        accessor: 'availability',
        defaultCanSort: true,
        Cell: AvailabilityColumn
    },
    {
        Header: t('Product availability').toString() + ' (%)',
        accessor: 'productAvailability',
        defaultCanSort: true,
        Cell: ProductAvailabilityColumn
    },
];