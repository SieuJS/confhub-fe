import { baseURL } from './api/baseApi'
import { useState } from 'react'
import useLocalStorage from './useLocalStorage'
import useSessionToken from './useToken'
import { useAppContext } from '../context/authContext'
import { getAllPosted } from '../actions/postAction'
import useAuth from './useAuth'
const usePost = () => {
  const {state, dispatch} = useAppContext()
  const {handleIsExpired} =useAuth()
  const {user} = useLocalStorage()
  const {token} = useSessionToken()
  const [loading, setLoading] = useState(false)


  const fetchPage = async (page) => {
    let storedToken = JSON.parse(localStorage.getItem('token'));
    const tokenHeader = token ? token : storedToken
    const response = await fetch(`${baseURL}/post?page=${page}&size=50`, {
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

const updateNewList = (newConferences)  => {
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
  const getPostedConferences = async () => {
    setLoading(true)
    if(user || localStorage.getItem('user') ){
      try {
        if(state.conferences.length === 0){
          const firstPageData = await fetchPage(1);                
          const totalPages = firstPageData.maxPages; // Lấy số lượng trang từ dữ liệu đầu tiên
          const totalConf = firstPageData.maxRecords

          sessionStorage.setItem('totalConfPost', JSON.stringify(totalConf))
          sessionStorage.setItem('totalPagesPost', JSON.stringify(totalPages))
          const newConferences = updateNewList(firstPageData.data)
          dispatch(getAllPosted(newConferences))
  
          // Fetch remaining pages asynchronously
          for (let i = 2; i <= totalPages; i++) {
              const pageData = await fetchPage(i);
              const newConferences = updateNewList(pageData.data)
              dispatch(getAllPosted(newConferences));
          }
        }
  
        setLoading(false);
    } catch (error) {
        setLoading(false);
    }
     
    }
  }
  const postConference = async (conference) => {
    setLoading(true)
    if(user || localStorage.getItem('user')){
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      if(storedToken){
      try {
        const response = await fetch(`${baseURL}/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
          body: JSON.stringify( conference ),
        });
        const data = await response.json()        
        const message = data.message || data.data
        setLoading(false)
        if (response.ok) {
          return {status: true, message: message}
        }
        else {
          if(response.status === 401){
            handleIsExpired(false)
          }
          return {status: false, message: message}
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
      }
      else return {status: false, message: "Please log in again!"}
    }

  }

  const updatePost = async (conference, id) => {
    setLoading(true)
    if(user || localStorage.getItem('user')){
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      try {
        const response = await fetch(`${baseURL}/post/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
          body: JSON.stringify( conference ),
        });
        const data = await response.json()        
        const message = data.data
        setLoading(false)
        if (response.ok) {
          return {status: true, message}
        }
        else {
          if(response.status === 401){
            handleIsExpired(false)
          }
          return {status: false, message}
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }
  }

  const deletePost = async (id) => {
    setLoading(true)
    if(user || localStorage.getItem('user')){
      try {
        const response = await fetch(`${baseURL}/post/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        const data = await response.json()        
        const message = data.message || data.data
        if (response.ok) {
          setLoading(false)
          return {status: true, message: message}
        }
        else {
          if(response.status === 401){
            handleIsExpired(false)
          }
          return {status: false, message: message}
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }
  }
  return {
    postedConferences: state.postedConferences,
    loading,
    getPostedConferences,
    postConference,
    updatePost,
    deletePost
  }
}


export default usePost