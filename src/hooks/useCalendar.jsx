
import { formatDate } from '../utils/formatDate';

const useCalender = () => {
  function getAllDatesInRange(dateRange) {
    const [startDateStr, endDateStr] = dateRange.split(' to ');
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      
      const formated = formatDate(currentDate);
        dates.push(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}
const getDaysInMonth = (month, year) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay(); // Ngày trong tuần của ngày đầu tiên (0-6)
  const daysInMonth = [];


  // Nếu ngày đầu tiên không phải là thứ 2 (Monday), thêm các ngày của tháng trước vào mảng daysInMonth
  if (startingDay !== 1) {
    const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();  
    const daysToAdd = startingDay - 1;

    for (let i = 0; i < daysToAdd; i++) {
      const previousDay = new Date(year, month - 1, lastDayOfPreviousMonth - i);
      daysInMonth.unshift(previousDay);
    }
  }

  // Thêm ngày của tháng hiện tại
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month, i);
    daysInMonth.push(date);
  }
  // Thêm ngày của tháng sau để đảm bảo có đủ 35 ngày
  const remainingDays = 35 - daysInMonth.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthDate = new Date(year, month + 1, i);
    daysInMonth.push(nextMonthDate);
  }

  // Chỉ lấy 35 giá trị
  return daysInMonth.slice(0, 35);
};
  return { 
    getAllDatesInRange,
    getDaysInMonth,
};
}
export default useCalender