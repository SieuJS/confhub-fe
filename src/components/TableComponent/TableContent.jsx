import React from "react";
import TablePagination from "./Pagination";

const TableContent = ({ data, accessors }) => {
  return (
    <>
      {
        data && data.length > 0 ?
          <>
            <tbody>
              {data.map((conference, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-primary-light' : 'bg-white'}>
                  {accessors.map((accessor, colIndex) => (
                    <td key={colIndex}>
                      {Array.isArray(conference[accessor]) ? (
                        // Nếu là mảng, render từng phần tử trong mảng
                        conference[accessor].map((item, index) => (
                          <div key={index}>{item.for_name}</div>
                        ))
                      ) : (
                        // Nếu không phải là mảng, kiểm tra accessor có phải là các từ khóa cụ thể
                        (accessor === 'location' || accessor === 'conf_date' || accessor === 'type') ? (
                          // Nếu là location, conf_date, type, render giá trị đơn
                          conference.organizations[0][accessor]
                        ) : (
                          // Nếu không phải là các từ khóa trên, render thông tin không xác định
                           conference[accessor]
                        )
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
          :
          <>
            <span>
              No conferences available
            </span>
          </>
      }
    </>
  );
};

export default TableContent;
