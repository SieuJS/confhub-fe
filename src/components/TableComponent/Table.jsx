import { useState, useCallback, useEffect, useRef } from "react";

import TablePagination from "./Pagination";


const Table = ({ headers, minCellWidth, tableContent, data, maxpage, count, scroll }) => {
  const [tableHeight, setTableHeight] = useState("auto");
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef(null);

  const numColumns = headers.length;
  const tableWidth = minCellWidth * numColumns
  
const createHeaders = (headers) => {
  return headers.map((item) => ({
    text: item,
    ref: useRef()
  }));
};
  const columns = createHeaders(headers);

  useEffect(() => {
    const columnWidth = Math.floor(tableWidth / numColumns);
    let gridColumnString = "";
    for (let i = 0; i < numColumns; i++) {
      gridColumnString += `${columnWidth}px `;
    }
    tableElement.current.style.gridTemplateColumns = gridColumnString;
    setTableHeight(tableElement.current.offsetHeight);
  }, []);

  const mouseDown = (index) => {
    setActiveIndex(index);
  };

  const mouseMove = useCallback(
    (e) => {
      const gridColumns = columns.map((col, i) => {
        if (i === activeIndex) {
          const width = e.clientX - col.ref.current.offsetLeft;

          if (width >= minCellWidth) {
            return `${width}px`;
          }
        }
        return `${col.ref.current.offsetWidth}px`;
      });

      tableElement.current.style.gridTemplateColumns = `${gridColumns.join(
        " "
      )}`;
    },
    [activeIndex, columns, minCellWidth]
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  // Demo only
  const resetTableCells = () => {
    tableElement.current.style.gridTemplateColumns = "";
  };

  return (
    <div className="container">
      <div className={`table-wrapper ${scroll ? 'overflow-x-auto' : ''}`} >
        <table className="resizeable-table" ref={tableElement}>
          <thead>
            <tr>
              {columns.map(({ ref, text }, i) => (
                <th ref={ref} key={text}>
                  <span>{text}</span>
                  <div
                    style={{ height: tableHeight }}
                    onMouseDown={() => mouseDown(i)}
                    className={`resize-handle ${
                      activeIndex === i ? "active" : "idle"
                    }`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          {tableContent}
        </table>
       
      </div>
       
      <div className="d-flex justify-content-end">
              <TablePagination data={data} itemsPerPage={10}/>
            </div>
      <button onClick={resetTableCells}>Reset</button>
    </div>
  );
};

export default Table;
