import React, { useRef, useEffect, forwardRef, useState } from 'react';
import {
    useTable,
    useSortBy,
    usePagination,
    useRowSelect,
    useGlobalFilter,
    useAsyncDebounce,
    useExpanded,
    Column,
    Row,
    FilterValue,
} from 'react-table';
import classNames from 'classnames';
import { Pagination, PageSize } from './Pagination';
import { t } from 'i18next';
import { Button } from 'react-bootstrap';
import { URLSearchParamsInit } from 'react-router-dom';

export type CellFormatter<T extends Object = {}> = {
    row: Row<T>;
};

type GlobalFilterProps = {
    preGlobalFilteredRows: any;
    globalFilter: any;
    setGlobalFilter: (filterValue: FilterValue) => void;
    searchBoxClass?: string;
    focus?: boolean;
    isUpdatable?: boolean;
    onClickUpdate?: () => void;
};

const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter, searchBoxClass, focus, isUpdatable, onClickUpdate }: GlobalFilterProps) => {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = useState<any>(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCleanInput = () => {   
        setValue('');
        onChange('');
    }
    
    useEffect(() => {
        if(inputRef && focus) {
            inputRef.current?.focus();
        }
    }, [focus]);

    return (
        <div className={classNames(searchBoxClass)}>
            <div className="d-flex align-items-center justify-content-between">
            <span className="d-flex align-items-center">
                {t("Search")}:{' '}
                <input
                    value={value || ''}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    placeholder={ `${count} ` + t("records") + "..."}
                    className="form-control w-auto ms-1"
                    ref={inputRef}
                />
                <Button size="lg" variant="link" className="btn-icon text-danger" onClick={handleCleanInput}>
                    <i className="mdi mdi-trash-can-outline" title={t('Delete search')}></i>
                </Button>
            </span>
                { isUpdatable &&
                <Button variant="primary" onClick={onClickUpdate}>
                    {<><i className="mdi mdi-refresh me-1"></i> <span>{t('Update')}</span></>}
                </Button>
                }
            </div>
        </div>
    );
};

type IndeterminateCheckboxProps = {
    indeterminate: any;
    children?: React.ReactNode;
};

const IndeterminateCheckbox = forwardRef<HTMLInputElement, IndeterminateCheckboxProps>(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = useRef();
        const resolvedRef: any = ref || defaultRef;

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return (
            <div className="form-check">
                <input type="checkbox" className="form-check-input" ref={resolvedRef} {...rest} />
                <label htmlFor="form-check-input" className="form-check-label"></label>
            </div>
        );
    }
);

type TableProps<TableValues> = {
    isSearchable?: boolean;
    isSortable?: boolean;
    pagination?: boolean;
    isSelectable?: boolean;
    isExpandable?: boolean;
    sizePerPageList?: PageSize[];
    columns: ReadonlyArray<Column>;
    data: TableValues[];
    pageSize?: number;
    searchBoxClass?: string;
    tableClass?: string;
    theadClass?: string;
    // The following properties can be used to set manual pagination and additional query parameters for filtering data
    totalRows?: number;
    totalPages?: number;
    currentPage?: number;
    sectionName?: string;
    queryParameters?: URLSearchParamsInit;
    isUpdatable?: boolean;
    onClickUpdate?: () => void;
};

const Table = <TableValues extends object = {}>(props: TableProps<TableValues>) => {
    const isSearchable = props['isSearchable'] || false;
    const isSortable = props['isSortable'] || false;
    const pagination = props['pagination'] || false;
    const isSelectable = props['isSelectable'] || false;
    const isExpandable = props['isExpandable'] || false;
    const sizePerPageList = props['sizePerPageList'] || [];
    const totalPages = props['totalPages'] || 0;
    const currentPage = props['currentPage'] || 1;
    const queryParameters = props['queryParameters'] || {};
    const sectionName = props['sectionName'];
    const isUpdatable = props['isUpdatable'] || false;
    const onClickUpdate = props['onClickUpdate'];

    let otherProps: any = {};

    if (isSearchable) {
        otherProps['useGlobalFilter'] = useGlobalFilter;
    }
    if (isSortable) {
        otherProps['useSortBy'] = useSortBy;
    }
    if (isExpandable) {
        otherProps['useExpanded'] = useExpanded;
    }
    if (pagination) {
        otherProps['usePagination'] = usePagination;
    }
    if (isSelectable) {
        otherProps['useRowSelect'] = useRowSelect;
    }

    const dataTable = useTable(
        {
            columns: props['columns'],
            data: props['data'],
            initialState: { pageSize: props['pageSize'] || 10 },
            manualPagination: totalPages > 0,
            pageCount: totalPages
        },

        otherProps.hasOwnProperty('useGlobalFilter') && otherProps['useGlobalFilter'],
        otherProps.hasOwnProperty('useSortBy') && otherProps['useSortBy'],
        otherProps.hasOwnProperty('useExpanded') && otherProps['useExpanded'],
        otherProps.hasOwnProperty('usePagination') && otherProps['usePagination'],
        otherProps.hasOwnProperty('useRowSelect') && otherProps['useRowSelect'],

        (hooks) => {
            isSelectable &&
                hooks.visibleColumns.push((columns) => [
                    // Let's make a column for selection
                    {
                        id: 'selection',
                        // The header can use the table's getToggleAllRowsSelectedProps method
                        // to render a checkbox
                        Header: ({ getToggleAllPageRowsSelectedProps }: any) => (
                            <div>
                                <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
                            </div>
                        ),
                        // The cell can use the individual row's getToggleRowSelectedProps method
                        // to the render a checkbox
                        Cell: ({ row }: any) => (
                            <div>
                                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                            </div>
                        ),
                    },
                    ...columns,
                ]);

            isExpandable &&
                hooks.visibleColumns.push((columns) => [
                    // Let's make a column for selection
                    {
                        // Build our expander column
                        id: 'expander', // Make sure it has an ID
                        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                            <span {...getToggleAllRowsExpandedProps()}>{isAllRowsExpanded ? '-' : '+'}</span>
                        ),
                        Cell: ({ row }) =>
                            // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
                            // to build the toggle for expanding a row
                            row.canExpand ? (
                                <span
                                    {...row.getToggleRowExpandedProps({
                                        style: {
                                            // We can even use the row.depth property
                                            // and paddingLeft to indicate the depth
                                            // of the row
                                            paddingLeft: `${row.depth * 2}rem`,
                                        },
                                    })}
                                >
                                    {row.isExpanded ? '-' : '+'}
                                </span>
                            ) : null,
                    },
                    ...columns,
                ]);
        }
    );

    let rows = pagination ? dataTable.page : dataTable.rows;

    return (
        <>
            {isSearchable && (
                <GlobalFilter
                    preGlobalFilteredRows={dataTable.preGlobalFilteredRows}
                    globalFilter={dataTable.state.globalFilter}
                    setGlobalFilter={dataTable.setGlobalFilter}
                    searchBoxClass={props['searchBoxClass']}
                    isUpdatable={isUpdatable}
                    onClickUpdate={onClickUpdate}  
                />
            )}

            <div className="table-responsive">
                <table
                    {...dataTable.getTableProps()}
                    className={classNames('table table-centered react-table', props['tableClass'])}
                >
                    <thead className={props['theadClass']}>
                        {dataTable.headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column: any) => (
                                    <th
                                        {...column.getHeaderProps(
                                            column.defaultCanSort && column.getSortByToggleProps()
                                        )}
                                        className={classNames({
                                            sorting_desc: column.isSortedDesc === true,
                                            sorting_asc: column.isSortedDesc === false,
                                            sortable: column.defaultCanSort === true,
                                        })}
                                    >
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...dataTable.getTableBodyProps()}>
                        {(rows || []).map((row, i) => {
                            dataTable.prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {pagination && 
                <Pagination 
                    tableProps={dataTable} 
                    sizePerPageList={sizePerPageList} 
                    currentPage={currentPage-1} 
                    queryParameters={queryParameters}
                    sectionName={sectionName}
                />
            }
        </>
    );
};

export { Table };
