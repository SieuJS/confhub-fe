import { useEffect, useMemo, useState } from 'react';
import 'react-resizable/css/styles.css';
import './custom_table.css';
import { useFilters, useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table';
import useAdmin from '../../hooks/useAdmin';
import { useTranslation } from 'react-i18next';

const DefaultColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

const TableRender = ({ data, columns }) => {
  const { t } = useTranslation()
  const { handleGetHeadersExport } = useAdmin()
  const [pageInput, setPageInput] = useState(null)

  const handlePageInput = (e) => {
    if (
      !(
        (e.key >= '0' && e.key <= '9') || // số từ 0 đến 9
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      )
    ) {
      e.preventDefault();
      const pageNumber = Number(pageInput) - 1;
      if (pageNumber >= 0 && pageNumber < pageCount) {
        gotoPage(pageNumber);
      }
      setPageInput(null);
    }   
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || (value >= 1 && value <= pageCount)) {
      setPageInput(value);
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageCount,
    gotoPage,
    allColumns,
    state: { pageIndex },
  } = useTable({ columns, data, initialState: { pageIndex: 0 } },
    useResizeColumns,
    useSortBy,
    usePagination, useFlexLayout);

  // Lưu allColumns vào context khi nó thay đổi
  useEffect(() => {
    handleGetHeadersExport(allColumns);
  }, [allColumns]);

  const renderPageNumbers = () => {
    const visiblePageNumbers = [];
    const totalPages = pageCount;
    const displayCount = 2; // Số lượng trang hiển thị ở mỗi đầu
    const ellipsisThreshold = 1; // Ngưỡng số trang lớn hơn 1 để hiển thị dấu chấm

    const addPageNumber = (number) => {
      visiblePageNumbers.push(
        <span
          key={number}
          style={{ cursor: 'pointer', marginRight: '5px', fontWeight: pageIndex === number ? 'bold' : 'normal' }}
          onClick={() => gotoPage(number)}
        >
          {pageIndex === number ? `[${number + 1}]` : number + 1}
        </span>
      );
    };

    const addEllipsis = (key) => {
      visiblePageNumbers.push(<span key={key}>...</span>);
    };

    // Hiển thị 2 trang đầu
    for (let i = 0; i < Math.min(2, totalPages); i++) {
      addPageNumber(i);
    }

    if (pageIndex > displayCount + ellipsisThreshold + 1) {
      addEllipsis('start');
    }

    // Hiển thị các số trang xung quanh trang hiện tại
    for (let i = Math.max(2, pageIndex - displayCount); i <= Math.min(totalPages - 3, pageIndex + displayCount); i++) {
      addPageNumber(i);
    }

    if (pageIndex < totalPages - displayCount - ellipsisThreshold - 2) {
      addEllipsis('end');
    }

    // Hiển thị 2 trang cuối
    for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
      addPageNumber(i);
    }

    return visiblePageNumbers;
  };

  return (
    <div>
      <div className="conference-table-container pt-2 w-100">
        <table className="conference-table w-100" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column, index) => (
                  <th {...column.getHeaderProps()} key={column.id}
                    className={`bg-primary-light text-color-black text-center 
                                            ${index === columns.length - 1 && column.id !== 'error' ? 'fixed-column fixed-right' : ''}
                                            ${index === 0 && 'fixed-column fixed-left'}
                                            `}>
                    {column.render('Header')}
                    {!column.disableResizing && (
                      <div
                        {...column.getResizerProps()}
                        className="resizer"
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} style={{ minHeight: '200px' }}>
            {
              page.length > 0 ?
                <>
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={row.id} className={` ${index % 2 === 0 ? 'bg-blue-light' : 'bg-white'}`}>

                        {row.cells.map((cell, index) => {
                          return (
                            <td {...cell.getCellProps()} key={cell.column.id}
                              className={`py-1 px-2 text-color-black d-flex align-items-center 
                                                      ${index === columns.length - 1 &&  cell.column.id !== 'error' ? 'fixed-column fixed-right justify-content-center p-0': ''} 
                                                      ${index === 0 && 'fixed-column fixed-left'} 
                                                      ${cell.column.id === 'error' ? 'custom-error-column' : ''} 
                                                      ${(index === 0 ||                                                        
                                  cell.column.id === 'status' ||
                                  cell.column.id === 'type' ||
                                  cell.column.id === 'rank' ||
                                  cell.column.id === 'acronym' ||
                                  cell.column.id === 'import' ||
                                  cell.column.id === 'progress' ||
                                  cell.column.id === 'duration' ||
                                  cell.column.id === 'important_dates')
                                && 'justify-content-center '}`}
                            >
                              {cell.render('Cell')}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </>
                :
                (
                  <tr>
                    <td colSpan={columns.length} style={{ textAlign: 'center', }}>
                      No data available
                    </td>
                  </tr>
                )
            }
          </tbody>
        </table>
      </div>
      < div className='d-flex align-items-center justify-content-end mt-3 text-nowrap'>
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className='border-0 bg-transparent'>
          {`<`}
        </button>{' '}
        {renderPageNumbers()}
        {`| ${t('go_to_page')} `}
        <input
          type="number"
          placeholder={t('page')}
          value={pageInput}
          onChange={handleInputChange}
          onKeyDown={handlePageInput}
          max={pageCount}
          min={1}
          className='ms-2 rounded'
        />
        <button onClick={() => nextPage()} disabled={!canNextPage} className='border-0 bg-transparent'>
          {`>`}
        </button>{' '}
      </div>
    </div>
  )
};

export default TableRender;
