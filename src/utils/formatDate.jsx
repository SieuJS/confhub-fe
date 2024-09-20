import moment from 'moment';
import submission_date_dict from './../data/submission_date_dict.txt?raw'

export function formatDate(inputString) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const date = new Date(inputString);

  // Lấy thông tin ngày, tháng, năm
  const day = ('0' + date.getDate()).slice(-2); // Chắc chắn rằng ngày có 2 chữ số
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Chắc chắn rằng tháng có 2 chữ số
  const year = date.getFullYear();

  // Format lại chuỗi ngày tháng
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function formatDateFilter(date) {
  const originalDateObject = new Date(date);

  const year = originalDateObject.getFullYear();
  const month = String(originalDateObject.getMonth() + 1).padStart(2, '0'); // Thêm '0' trước nếu tháng chỉ có một chữ số
  const day = String(originalDateObject.getDate()).padStart(2, '0'); // Thêm '0' trước nếu ngày chỉ có một chữ số

  const formattedDateString = `${year}-${month}-${day}`;
  return formattedDateString
}

export function getDateValue(date_type, list) {
  const filteredDates = list
    .filter(
      (date) =>
        date.date_type.toLowerCase().includes(date_type) &&
        date.status.toLowerCase() === 'new'
    )
    .map((date) => ({
      ...date,
      date_value: new Date(date.date_value),
    }))
    .sort((a, b) => a.date_value - b.date_value);
  const result = filteredDates.length > 0 ? filteredDates[0].date_value : null;

  // Lấy giá trị ngày gần nhất (nếu có)
  return formatDate(result)
}


export function formatTime(datetime) {
  if (datetime) {

    // Tạo đối tượng Date từ chuỗi ngày giờ
    const dateObject = new Date(datetime);

    // Lấy thông tin ngày, tháng, năm, giờ, phút và giây từ đối tượng Date
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");
    const seconds = String(dateObject.getSeconds()).padStart(2, "0");

    // Định dạng chuỗi ngày giờ theo yêu cầu
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime
  }
  return "NaN";
}

export const  getSubDate = (listImportantDates) => {
  
  const keywords = new Set();
  const lines = submission_date_dict.split('\n');
  for (const line of lines) {
    const words = line.split();
    for (const word of words) {
      keywords.add(word.trim().toLowerCase());
    }
  }

  for (const date of listImportantDates) {
    const dateTypeWords = date.date_type.trim().toLowerCase().split();
    for (const word of dateTypeWords) {
      if (keywords.has(word) && date.status === 'new') {
        const formatDate = moment(date.date_value).format('YYYY/MM/DD')
        return formatDate
      }
    }
  }
  return null
}
