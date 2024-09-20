
import { useAppContext } from '../context/authContext'
import { baseURL } from './api/baseApi'
import { useEffect, useRef, useState } from 'react'
import moment from 'moment'


const useDashboard = () => {
  const { state, dispatch } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)
  useEffect(() => {
    if(startDate && endDate && (startDate !== startDateRef.current || endDate !== endDateRef.current)){
      getEtlLog(startDate, endDate);
      getUserLog(startDate, endDate)
    }
    //
}, [startDate, endDate]);

  const getUserLog = async (start, end) => {
    try {
      const response = await fetch(`${baseURL}/dashboard/userLog?begin=${start}&end=${end}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json()
      dispatch({type: "SET_USER_LOG", payload: data.logs})
    } catch (error) {
      console.log({ error })
    }
  }

  const getEtlLog = async (start, end) => {
    try {
      const response = await fetch(`${baseURL}/dashboard/etlLog?begin=${start}&end=${end}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json()
      startDateRef.current = start
      endDateRef.current = end
      dispatch({type: "SET_ETL_LOG", payload: data.logs})
    } catch (error) {
      console.log({ error })
    }
  }


  const getCurrentUser = async () => {
    try {
      const response = await fetch(`${baseURL}/dashboard/currentUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json()
      dispatch({type: "SET_CURRENT_USER", payload: data.userIDs})
    } catch (error) {
      console.log({ error })
    }
  }


function getLatestAccessInfo(logs) {
    if (logs.length === 0)  return { date: '', totalCrawls: 0 };

    const validLogs = logs.filter(log => log.total_etl_processes !== 0);
    if (validLogs.length === 0) return { date: '', totalCrawls: 0 };

    // Sắp xếp validLogs theo thời gian từ mới nhất đến cũ nhất
    validLogs.sort((a, b) => new Date(b.time) - new Date(a.time));

    const latestLog = validLogs[0];
    const latestDate = latestLog.time;
    const totalCrawls = latestLog.total_etl_processes;
    return { date: latestDate, totalCrawls };
}



const handleStartDateChange = (date) => {
  setStartDate(date);
};

const handleEndDateChange = (date) => {
  setEndDate(date);
};

// Reset dates based on filter type
const resetDates = (filterType) => {
  if (filterType === 'weekly') {
      setStartDate(moment().subtract(6, 'days').format('YYYY-MM-DD'));
      setEndDate(moment().format('YYYY-MM-DD'));
  } else if (filterType === 'monthly') {
      setStartDate(moment().subtract(1, 'month').format('YYYY-MM-DD'));
      setEndDate(moment().format('YYYY-MM-DD'));
  }
};



const  getTwoWeekRange = async () => {
  // Lấy ngày hôm qua
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

  // Lấy ngày bắt đầu và kết thúc của tuần hiện tại và tuần trước đó
  const startOfThisWeek = moment(yesterday).startOf('isoWeek').format('YYYY-MM-DD');
  const startOfLastWeek = moment(startOfThisWeek).subtract(1, 'weeks').format('YYYY-MM-DD');


  try {
    const response = await fetch(`${baseURL}/dashboard/userLog?begin=${startOfLastWeek}&end=${yesterday}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json()
    const logs = data.logs
    return logs
  } catch (error) {
    console.log({ error })
  }
}

const filterAndSortLogs = async () => {
  const logs = await getTwoWeekRange();
  
  // Lọc logs trong khoảng 2 tuần trở lại từ hôm nay
   // Tạo một bản đồ để lưu trữ ngày và giá trị cao nhất của total_visiters
   const etlMap = new Map();
   // Duyệt qua dữ liệu và lưu lại ngày có total_visiters cao hơn
   logs.forEach(item => {
       const itemDate = moment(item.time).format('YYYY-MM-DD');
       if (!etlMap.has(itemDate) || etlMap.get(itemDate).total_visiters < item.total_visiters) {
           etlMap.set(itemDate, item);
       }
   });

   // Sắp xếp lại danh sách kết hợp theo ngày
   const sortedData = logs.sort((a, b) => moment(a.time).diff(moment(b.time)));
  return sortedData;
}


const calculateRatio = async () => {
  // Lấy ngày hôm qua
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

  // Lấy ngày bắt đầu và kết thúc của tuần hiện tại và tuần trước đó
  const startOfThisWeek = moment(yesterday).startOf('isoWeek').format('YYYY-MM-DD');
  const endOfThisWeek = moment(yesterday).endOf('isoWeek').format('YYYY-MM-DD');
  const startOfLastWeek = moment(startOfThisWeek).subtract(1, 'weeks').format('YYYY-MM-DD');
  const endOfLastWeek = moment(startOfThisWeek).subtract(1, 'days').format('YYYY-MM-DD');
  const logs = await filterAndSortLogs(startOfLastWeek, endOfThisWeek);
  
  // Tạo các tập hợp để kiểm tra và bổ sung ngày thiếu
  const daysThisWeek = new Set();
  const daysLastWeek = new Set();

  // Tạo đối tượng để lưu logs với ngày có total_visitors cao hơn nếu có ngày trùng
  const filteredLogs = {};

  // Lọc và xử lý dữ liệu logs
  logs.forEach(log => {
    const logDate = log.time;
    const visitors = log.total_visiters;

    if (moment(logDate).isBetween(startOfThisWeek, endOfThisWeek, null, '[]')) {
      if (!filteredLogs[logDate] || filteredLogs[logDate].total_visitors < visitors) {
        filteredLogs[logDate] = log;
      }
    } else if (moment(logDate).isBetween(startOfLastWeek, endOfLastWeek, null, '[]')) {
      if (!filteredLogs[logDate] || filteredLogs[logDate].total_visitors < visitors) {
        filteredLogs[logDate] = log;
      }
    }
  });

  // Bổ sung ngày thiếu cho tuần này
  for (let i = 0; i < 7; i++) {
    const day = moment(startOfThisWeek).add(i, 'days').format('YYYY-MM-DD');
    daysThisWeek.add(day);
    if (!filteredLogs[day]) {
      filteredLogs[day] = { time: day, total_visiters: 0 };
    }
  }

  // Bổ sung ngày thiếu cho tuần trước
  for (let i = 0; i < 7; i++) {
    const day = moment(startOfLastWeek).add(i, 'days').format('YYYY-MM-DD');
    daysLastWeek.add(day);
    if (!filteredLogs[day]) {
      filteredLogs[day] = { time: day, total_visiters: 0 };
    }
  }

  // Tính tổng số visitors cho mỗi tuần
  let totalVisitorsThisWeek = 0;
  let totalVisitorsLastWeek = 0;

  Object.values(filteredLogs).forEach(log => {
    const logDate = log.time;
    const visitors = log.total_visiters;
    if (daysThisWeek.has(logDate)) {
      totalVisitorsThisWeek += visitors;
    } else if (daysLastWeek.has(logDate)) {
      totalVisitorsLastWeek += visitors;
    }
  });
  
  // Tính tỷ lệ tăng/giảm so với tuần trước
  let percentageChange = 0;
  if (totalVisitorsLastWeek !== 0) {
    percentageChange = ((totalVisitorsThisWeek - totalVisitorsLastWeek) / totalVisitorsLastWeek) * 100;
  }
  const ratio = percentageChange.toFixed(2);
  return ratio;

};



  return {
    userLog: state.userLog,
    etlLog: state.etlLog,
    currentUsers: state.currentUsers,
    loading,
    startDate, endDate,
    handleStartDateChange,
    handleEndDateChange,
    resetDates,
    calculateRatio,
    getCurrentUser,
    getEtlLog,
    getUserLog,
    getLatestAccessInfo
  }
}


export default useDashboard