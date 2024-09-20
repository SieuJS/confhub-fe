import { useEffect, useState } from "react"

import { useAppContext } from "../context/authContext"

import { baseURL } from "./api/baseApi"
import { getAllConf, getOneConf } from "../actions/confAction"
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import useAuth from "./useAuth"
import useLocalStorage from "./useLocalStorage"
const useConference = () => {
  const { state, dispatch } = useAppContext()
  const { user } = useAuth()
  const [quantity] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {token} = useLocalStorage()
  const [selectOptionSort, setSelectOptionSort] = useState('Random') //Random: sort by follow
  const [displaySortList, setDisplaySortConf] = useState([])
  const [showNoti, setShowNoti] = useState(false)

  useEffect(() => {
    setDisplaySortConf(state.conferences)
  }, [selectOptionSort])

  const handleSelectOptionSort = (option) => {
    setSelectOptionSort(option)
  }

  const getAllConferences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/conference?status=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      dispatch(getAllConf(data.data));
      setLoading(false);
      return data
    } catch (error) {
      setError(error);
    }
  }



  const handleGetOne = async (id) => {
    try {
      if(user || localStorage.getItem('user')){
        
        let storedToken = JSON.parse(localStorage.getItem('token'));
        const tokenHeader = token ? token : storedToken
        const response = await fetch(`${baseURL}/conference/${id}`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenHeader}`
          }
        });
        const data = await response.json();
        //Gửi action để cập nhật state
        dispatch(getOneConf(data.data));
      }
      else {
        const response = await fetch(`${baseURL}/conference/${id}`,{
          method: 'GET',
          
        });
        const data = await response.json();
        //Gửi action để cập nhật state
        dispatch(getOneConf(data.data));
      }

    } catch (error) {

      console.error('Error fetching data:', error);
    }
  }

  const crawlNow = async (id) => {
    try {
    //  console.log({ user })
      addIDCrawling(id)
    
      // Tạo headers cho request
      const headers = {
        'Content-Type': 'application/json',
      };
    

      const socket_id = JSON.parse(sessionStorage.getItem('socket-id'))
      
        const response = await fetch(`${baseURL}/conference/${id}/updateNow`, {
          method: 'PUT',    
          headers: headers,     
          body: JSON.stringify({socketID: socket_id})
        });
      //console.log(response)
      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();

      return { status: true, message: data.message };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { status: false, message: error.message };
    }
  };

  const addIDCrawling = (id) => {
    const currentTime = new Date().getTime();
    const conf = {
      id: id,
      status: true, // hoặc false tùy thuộc vào logic của bạn
      timestamp: currentTime,
    };
    dispatch({type: "ADD_ID_CRAWLING", payload: conf});
  };

  const removeIDfromCrawlings = (id) => {
    dispatch({type: "REMOVE_ID_CRAWLING", payload: id});
  }

  const checkUrl = async (url) => {
    if (url !== ' ' && url !== '') {
      return true
    }
    else return false
  };


  const getConferenceDate = (organizations) => {
    if (organizations?.length > 0) {

      // Khởi tạo biến để lưu trữ ngày bắt đầu và kết thúc
      let startDate = null;
      let endDate = null;
      // Lặp qua danh sách organizations để tìm ngày bắt đầu và kết thúc với status là "new"
      organizations.forEach(org => {
        if (org.status === "new") {
          startDate = org.start_date;
          endDate = org.end_date;
        }
      });
      const formattedDateStartDate = moment(startDate).format('ddd, YYYY/MM/DD');
      const formattedDateEndDate = moment(endDate).format('ddd, YYYY/MM/DD');

      // Xác định dateRange dựa trên giá trị của startDate và endDate
      let dateRange = '';
      if (startDate) {
        if (endDate) {
          if (moment(startDate).isAfter(endDate)) {
            dateRange = `${formattedDateStartDate}`;
          } else {
            dateRange = `${formattedDateStartDate} to ${formattedDateEndDate}`;
          }
        } else {
          dateRange = `${formattedDateStartDate}`;
        }
      }
      return dateRange
    }
    else return ''
  }

  const getStartEndDate = (organizations) => {
    if (organizations.length > 0) {

      // Khởi tạo biến để lưu trữ ngày bắt đầu và kết thúc
      let startDate = null;
      let endDate = null;
      // Lặp qua danh sách organizations để tìm ngày bắt đầu và kết thúc với status là "new"
      organizations.forEach(org => {
        if (org.status === "new") {
          startDate = org.start_date;
          endDate = org.end_date;
        }
      });
      const formattedDateStartDate = moment(startDate).format('YYYY/MM/DD');
      const formattedDateEndDate = moment(endDate).format('YYYY/MM/DD');

      // Xác định dateRange dựa trên giá trị của startDate và endDate
      if (startDate) {
        if (endDate && moment(startDate).isAfter(endDate)) {
          return (
            <span>
              {formattedDateStartDate}
            </span>
          )
        }
        else if (endDate) {
          return (
            <span>
              {formattedDateStartDate} <FontAwesomeIcon icon={faArrowRight} /> {formattedDateEndDate}
            </span>
          )

        } else {
          return (
            <span>
              {formattedDateStartDate}
            </span>
          )
        }
      }

    }
    else return null
  }

  const getLocation = (organizations) => {
    // Sử dụng find để tìm đối tượng đầu tiên có status là "new" và location khác null
    const newOrg = organizations.find(org => org.status === "new" && org.location !== null);

    // Nếu tìm thấy đối tượng thỏa mãn, trả về location của nó, ngược lại trả về null
    return newOrg ? newOrg.location : '';
  }

  const getUserConferences = (listConf) =>{
    const filteredConferences = listConf.filter(conference => conference?.information?.source === "ConfHub");
    
    return filteredConferences
  }

  return {
    conferences: state.conferences,
    conference: state.conference,
    quantity: quantity,
    loading,
    error: error,
    selectOptionSort,
    displaySortList,
    messages: state.messages,
    getAllConferences,
    handleGetOne,
    getConferenceDate,
    getStartEndDate,
    getLocation,
    handleSelectOptionSort,
    crawlNow,
    checkUrl,
    showNoti, setShowNoti,
    isCrawlingConfs: state.isCrawlingConfs,
    addIDCrawling,
    removeIDfromCrawlings,
    getUserConferences
  }
}

export default useConference