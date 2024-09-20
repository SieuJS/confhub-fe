
import { useAppContext } from '../context/authContext'
import { getFollowedConferenceAction } from '../actions/followAction'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useSessionStorage from './useSessionStorage'
import useAuth from './useAuth'
import moment from 'moment'
import usePageNavigation from './usePageNavigation'
const useFollow = () => {
  const { state, dispatch } = useAppContext()
  const { token } = useToken()
  const {updateDataListInStorage} = useSessionStorage()
  const { user } = useLocalStorage()
  const {handleIsExpired} = useAuth()
  const [loading, setLoading] = useState(false);
  const {previousPath} = usePageNavigation()
  const navigate = useNavigate()
  const location = useLocation()
  const updateNewList = (newConferences) => {
    // Tạo một bản sao của state.postedConferences để thực hiện các thay đổi mà không ảnh hưởng đến state gốc
    const updatedConferences = [...state.postedConferences];

    // Lặp qua danh sách hội nghị mới
    newConferences.forEach(newConference => {
      // Kiểm tra xem hội nghị đã tồn tại trong danh sách hay chưa
      const existingConferenceIndex = updatedConferences.findIndex(conference => conference.id === newConference.id);

      if (existingConferenceIndex !== -1) {
        // Nếu hội nghị đã tồn tại, thay thế bằng hội nghị mới
        updatedConferences[existingConferenceIndex] = newConference;
      } else {
        // Nếu hội nghị chưa tồn tại, thêm mới vào danh sách
        updatedConferences.push(newConference);
      }
    });

    return newConferences
  }
  const fetchPage = async (page) => {
    let storedToken = JSON.parse(localStorage.getItem('token'));
    const tokenHeader = token ? token : storedToken
    const response = await fetch(`${baseURL}/follow?page=${page}&size=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenHeader}`
      }
    });
    if (!response.ok) {
      if(response.status === 401){
        handleIsExpired(false)
      }
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const getListFollowedConferences = async () => {
    setLoading(true)
    if (user || localStorage.getItem('user')) {
      try {

        const firstPageData = await fetchPage(1);
        const totalPages = firstPageData.maxPages; // Lấy số lượng trang từ dữ liệu đầu tiên
        const totalConf = firstPageData.maxRecords

        sessionStorage.setItem('totalConfFollow', JSON.stringify(totalConf))
        sessionStorage.setItem('totalPagesFollow', JSON.stringify(totalPages))

       
        updateDataListInStorage("listFollow", firstPageData.data)
        dispatch(getFollowedConferenceAction(firstPageData.data))

        // Fetch remaining pages asynchronously
        for (let i = 2; i <= totalPages; i++) {
          const pageData = await fetchPage(i);
          dispatch(getFollowedConferenceAction(pageData.data))

        }

      } catch (error) {
        setLoading(false);
      }

    }
    setLoading(false);
  }
  const followConference = async (id) => {
    setLoading(true)
    if (user || localStorage.getItem('user')) {
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      try {
        const response = await fetch(`${baseURL}/follow`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
          body: JSON.stringify({ cfp_id: id })
        });

        setLoading(false)
        if (!response.ok) {
          if(response.status === 401){
            handleIsExpired(false)
          }
          throw new Error(response.message);
        }
        else {
          getListFollowedConferences()
          return true
        }
      } catch (error) {
        console.error('Error:', error);
        return false
      }
    }
    else {
      alert('Log in before continuing, please!')
      localStorage.setItem('previousPath', location.pathname);
      navigate('/login')
    }
  }
  const unfollowConference = async (id) => {
    setLoading(true)
    try {
      const response = await fetch(`${baseURL}/follow`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cfp_id: id })
      });
      setLoading(false)
      if (!response.ok) {
        if(response.status === 401){
          handleIsExpired(false)
        }
        return false
      }
      else {
        getListFollowedConferences()
        return true
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const getUpcomingConferences = async (listConferences) => {
    const now = moment();
    const oneMonthFromNow = now.clone().add(1, 'month');
    const backupDataConferences = listConferences.map(conference => ({ ...conference }));
    return await backupDataConferences.filter(conference => {
      // Kiểm tra ngày bắt đầu của tổ chức có status "new"
      const hasUpcomingStartDate = conference.organizations.some(org => {
        if (org.status !== 'new') return false;
        const startDate = moment(org.start_date);
        return startDate.isAfter(now) && startDate.isBefore(oneMonthFromNow);
      });
  
      // Kiểm tra các ngày quan trọng có status "new"
      const hasUpcomingImportantDate = conference.importantDates.some(date => {
        if (date.status !== 'new') return false;
        const importantDate = moment(date.date_value);
        return importantDate.isAfter(now) && importantDate.isBefore(oneMonthFromNow);
      });
  
      return hasUpcomingStartDate || hasUpcomingImportantDate;
    });
  };
  return {
    loading,
    listFollowed: state.listFollowed,
    getListFollowedConferences,
    followConference,
    unfollowConference,
    getUpcomingConferences
  }
}


export default useFollow