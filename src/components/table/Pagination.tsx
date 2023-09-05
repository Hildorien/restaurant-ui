import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { TableInstance } from 'react-table';
import { t } from 'i18next';

export type PageSize = {
    text: string;
    value: number;
};

type PaginationProps = {
    tableProps: TableInstance;
    sizePerPageList: PageSize[];
    currentPage?: number;
    sectionName?: string;
    queryParameters?: any;
};

const Pagination = ({ tableProps, sizePerPageList, currentPage, queryParameters, sectionName }: PaginationProps) => {

    const location = useLocation();
    let navigate = useNavigate(); 


    const buildPageQueryWithSearchParameters = useCallback((page: number) => {
        let queryParametersString = "";
        if (queryParameters) {
            Object.keys(queryParameters).forEach((key) => {
                queryParametersString += `&${key}=${queryParameters[key]}`;
            });
        }
        return `page=${page}${queryParametersString}`;
    }, [queryParameters]);

    /**
     * pagination count , index
     */
    const [pageCount, setPageCount] = useState<number>(tableProps.pageCount);
    const [pageIndex, setPageIndex] = useState<number>(currentPage || tableProps.state.pageIndex);

    useEffect(() => {
        setPageCount(tableProps.pageCount);
        setPageIndex(currentPage || tableProps.state.pageIndex);
    }, [tableProps.pageCount, tableProps.state.pageIndex, currentPage]);

    /**
     * get filter pages
     */
    const filterPages = useCallback(
        (visiblePages: number[], totalPages: number) => {
            return visiblePages.filter((page: number) => page <= pageCount);
        },
        [pageCount]
    );

    /**
     * handle visible pages
     */
    const getVisiblePages = useCallback(
        (page: number, total: number) => {
            if (total < 7) {
                return filterPages([1, 2, 3, 4, 5, 6], total);
            } else {
                if (page % 5 >= 0 && page > 4 && page + 2 < total) {
                    return [1, page - 1, page, page + 1, total];
                } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
                    return [1, total - 3, total - 2, total - 1, total];
                } else {
                    return [1, 2, 3, 4, 5, total];
                }
            }
        },
        [filterPages]
    );

    /**
     * handle page change
     * @param page - current page
     * @returns
     */
    const changePage = (page: number) => {
        const activePage = pageIndex + 1;

        if (page === activePage) {
            return;
        }

        const visiblePages = getVisiblePages(page, pageCount);
        setVisiblePages(filterPages(visiblePages, pageCount));

        tableProps.gotoPage(page - 1);
    };

    useEffect(() => {
        const visiblePages = getVisiblePages(0, pageCount);
        setVisiblePages(visiblePages);
    }, [pageCount, getVisiblePages]);

    const [visiblePages, setVisiblePages] = useState<number[]>(getVisiblePages(0, pageCount));
    const activePage: number = pageIndex + 1;

    return (
        <div className="d-lg-flex align-items-center text-center pb-1">
            {sizePerPageList.length > 0 && (
                <div className="d-inline-block me-3">
                    <label className="me-1">{t('Display')} :</label>
                    <select
                        value={tableProps.state.pageSize}
                        onChange={(e) => {
                            tableProps.setPageSize(Number(e.target.value));
                        }}
                        className="form-select d-inline-block w-auto"
                    >
                        {(sizePerPageList || []).map((pageSize, index) => {
                            return (
                                <option key={index.toString()} value={pageSize.value}>
                                    {pageSize.text}
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}

            <span className="me-3">
                {t('Page')}{' '}
                <strong>
                    {pageIndex + 1} {t('of')} {tableProps.pageOptions.length}
                </strong>{' '}
            </span>

            {
            <span className="d-inline-block align-items-center text-sm-start text-center my-sm-0 my-2">
                <label>{t("Go to page")} : </label>
                <input
                    type="number"
                    onKeyDown={(e) => { e.preventDefault();}}
                    value={pageIndex + 1}
                    min="1"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        if (page +1 > pageCount) {
                            return;
                        }
                        tableProps.gotoPage(page);
                        setPageIndex(tableProps.state.pageIndex);
                        if (sectionName) {
                            navigate(`/${sectionName}?${buildPageQueryWithSearchParameters(page+1)}`);
                        }
                    }}
                    className="form-control w-25 ms-1 d-inline-block"
                />
                </span>}

            <ul className="pagination pagination-rounded d-inline-flex ms-auto align-item-center mb-0">
                <li
                    key="prevpage"
                    className={classNames('page-item', 'paginate_button', 'previous', {
                        disabled: activePage === 1,
                    })}
                    onClick={() => {
                        if (activePage === 1) return;
                        changePage(activePage - 1);
                    }}
                >
                    <Link to={{ pathname: location.pathname, search: `${buildPageQueryWithSearchParameters(activePage-1)}` }} className="page-link">
                        <i className="mdi mdi-chevron-left"></i>
                    </Link>
                </li>
                {(visiblePages || []).map((page, index, array) => {
                    return array[index - 1] + 1 < page ? (
                        <React.Fragment key={page.toString()}>
                            <li className="page-item disabled d-none d-xl-inline-block">
                                <Link to={{ pathname: location.pathname, search: `${buildPageQueryWithSearchParameters(page)}` }} className="page-link">
                                    ...
                                </Link>
                            </li>
                            <li
                                className={classNames('page-item', 'd-none', 'd-xl-inline-block', {
                                    active: activePage === page,
                                })}
                                onClick={(e) => changePage(page)}
                            >
                                <Link to={{ pathname: location.pathname, search: `${buildPageQueryWithSearchParameters(page)}` }} className="page-link">
                                    {page}
                                </Link>
                            </li>
                        </React.Fragment>
                    ) : (
                        <li
                            key={page.toString()}
                            className={classNames('page-item', 'd-none', 'd-xl-inline-block', {
                                active: activePage === page,
                            })}
                            onClick={(e) => changePage(page)}
                        >
                            <Link to={{ pathname: location.pathname, search: `${buildPageQueryWithSearchParameters(page)}` }} className="page-link">
                                {page}
                            </Link>
                        </li>
                    );
                })}
                <li
                    key="nextpage"
                    className={classNames('page-item', 'paginate_button', 'next', {
                        disabled: activePage === tableProps.pageCount,
                    })}
                    onClick={() => {
                        if (activePage === tableProps.pageCount) return;
                        changePage(activePage + 1);
                    }}
                >
                    <Link to={{ pathname: location.pathname, search: `${buildPageQueryWithSearchParameters(activePage+1)}` }} className="page-link">
                        <i className="mdi mdi-chevron-right"></i>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export { Pagination };
