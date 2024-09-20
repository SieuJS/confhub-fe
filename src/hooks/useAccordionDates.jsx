import { useEffect, useState } from 'react';
import useFormDataInput from './useFormDataInput';

const useAccordionDates = () => {
  const [items, setItems] = useState([
    { id: 1, title: 'Round 1', content: 'Content 1' },
]);
  const [openItemIndex, setOpenItemIndex] = useState(items[0]?.id || null);
  const [separatedDates, setSeparatedDates] = useState({})
  const [isCheckUpdateAcc, setCheckUpdateAcc] = useState(false)
  const [dateListByRound, setDateListByRound] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const checkAddItem = () => {
    const firstRound = dateListByRound[1]; // Lấy danh sách các ngày của round đầu tiên
    if (firstRound && firstRound.length > 0) { // Kiểm tra xem round đầu tiên có tồn tại và có phần tử nào không
        return firstRound[0].date_value !== ''; // Trả về true nếu date_value của phần tử đầu tiên không rỗng, ngược lại trả về false
    }
    return false; // Nếu round đầu tiên không tồn tại hoặc không có phần tử, trả về false
}

  const addItem = () => {
    const newItem = {
      id: `${items.length + 1}`,
      title: `Round ${items.length + 1}`,
      isOpen: false,
    };
    if(checkAddItem()){
      setItems(prevItems => [...prevItems, newItem]);
      setOpenItemIndex(newItem.id);
    }
    else{
      setError(true)
      setMessage('Please input dates for Round 1!')
      // Thiết lập thời gian tồn tại của error và message
      setTimeout(() => {
        setError(null);
        setMessage(null);
    }, 5000); // 5 giây
    }
  };

  const deleteItem = (indexToRemove) => {
    if(indexToRemove>0){
      setItems((prevItems) =>
        prevItems.filter((item, index) => index !== indexToRemove)
      );
    }

  }
  const toggleItem = (index) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  // Hàm để thêm một ngày vào round cụ thể
  const addDateToRound = (round, date) => {
    // Tạo một bản sao của dateListByRound để tránh ghi đè trực tiếp lên state
    const updatedDateListByRound =JSON.parse(JSON.stringify(dateListByRound));

    // Kiểm tra xem round đã tồn tại trong danh sách chưa
    if (Object.prototype.hasOwnProperty.call(updatedDateListByRound, round)) {
      // Nếu round đã tồn tại, kiểm tra xem date_type đã tồn tại trong mảng ngày của round hay không
      const existingIndex = updatedDateListByRound[round].findIndex(existingDate => existingDate.date_type === date.date_type);
      if (existingIndex !== -1) {
        // Nếu tồn tại, thay thế giá trị của ngày đó
       
        updatedDateListByRound[round][existingIndex] = date;
      } else {
        // Nếu không tồn tại, thêm ngày vào mảng tương ứng
        updatedDateListByRound[round].push(date);
      }
    } else {
      // Nếu chưa tồn tại, tạo một mảng mới để lưu ngày
        updatedDateListByRound[round] = [date];
    }
 // Tìm và cập nhật item có id tương ứng với round
 const updatedItems = items.map(item => {
  if (item.id === round) {
    return { ...item, data: updatedDateListByRound };
  }
  return item;
});

    setItems(updatedItems);
    // Cập nhật state với giá trị mới
    setDateListByRound(updatedDateListByRound);
    setItems(updatedItems);
    setCheckUpdateAcc(true)
  };

  
  // Hàm để gộp tất cả các ngày từ mỗi round thành một danh sách duy nhất
  const mergeDatesByRound = () => {
    const mergedDates = [];
    // Duyệt qua từng round trong dateListByRound
    for (const round in dateListByRound) {
      if (Object.prototype.hasOwnProperty.call(dateListByRound, round)) {
        // Lặp qua mỗi ngày trong round
        dateListByRound[round].forEach(date => {
          // Thay đổi date_type cho từng ngày
          const newDateType = `Round ${round} - ${date.date_type}`;
          // Thêm ngày mới với date_type đã thay đổi vào danh sách cuối cùng
          mergedDates.push({ ...date, date_type: newDateType });
        });
      }
    }
    return mergedDates;
  };
  
  const separateDatesByRound = (importantDates) => {
   
        const updatedDates = importantDates.map(date => {
            
            if (date.status === 'new') {
              const oldDate = separatedDates.find(d => d.status === 'old' && d.date_type === date.date_type);
              if (oldDate) {
                date.date_value_old = oldDate.date_value;
              }
            }
            return date;
          }).filter(date => date.status !== 'old'); // bỏ ngày old
    return updatedDates;
};
  return { 
    items, 
    openItemIndex,
    isCheckUpdateAcc,
    message,
    error,
    addItem, 
    toggleItem,
    deleteItem,
    addDateToRound,
    mergeDatesByRound,
    separateDatesByRound,
    setCheckUpdateAcc
   };
};

export default useAccordionDates;
