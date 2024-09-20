import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';


const TablePagination = ({ data, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

  return (
    <div>
      <ReactPaginate
        pageCount={Math.ceil(data.length / itemsPerPage)}
        pageRangeDisplayed={5} // Số lượng trang hiển thị ở trung tâm
        marginPagesDisplayed={2} // Số lượng trang hiển thị ở đầu và cuối
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        nextLabel={'>'}
        previousLabel={'<'}
      />
    </div>
  );
};

export default TablePagination;
