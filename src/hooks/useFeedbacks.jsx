
import { useAppContext } from '../context/authContext'
import { getFollowedConferenceAction } from '../actions/followAction'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const useFeedback = () => {
  const { state, dispatch } = useAppContext()
  const { user } = useLocalStorage()
  const { token } = useToken()
  const [feedbacks, setFeedbacks] = useState([])
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const getAllFeedbacks = async (id) => {
    setLoading(true)
    try {
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      // Gửi yêu cầu lấy danh sách feedback đến API
      const response = await fetch(`${baseURL}/conference/${id}/feedback`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenHeader}`
        },
      });

      // Kiểm tra xem kết quả trả về từ API có hợp lệ không
      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks');
      }

      // Lấy dữ liệu từ phản hồi và cập nhật state
      const data = await response.json();
      setFeedbacks(data.data.rows);
      setQuantity(data.data.count);
      dispatch({type: "GET_FEEDBACKS", payload: data.data.rows})
      setLoading(false)
    } catch (error) {
      // Nếu có lỗi xảy ra trong quá trình gửi yêu cầu hoặc xử lý dữ liệu, ném ra một lỗi
      throw new Error(`Error fetching feedbacks: ${error.message}`);
    }
  };

  const addFeedback = async (id, content, rating) => {
    const postData = {
      content: content,
      rating: rating
    }
    if (user || localStorage.getItem('user')) {
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      try {
        const response = await fetch(`${baseURL}/conference/${id}/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
          body: JSON.stringify(postData),
        });
        const data = await response.json()        
        const message = data.message || data.data
        setLoading(false)
        if (response.ok) {
          return {status: true, message}
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }
  }
  const updateFeedback = async (id, content, rating) => {
    const postData = {
      content: content,
      rating: rating
    }
    if (user || localStorage.getItem('user') ) {
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      try {
        const response = await fetch(`${baseURL}/feedback/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
          body: JSON.stringify(postData),
        });
        const data = await response.json()        
        const message = data.message || data.data
        setLoading(false)
        if (response.ok) {
          return {status: true, message}
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }
    else {
      alert('Log in before continuing, please!')
      navigate('/login')
    }

  }
  const deleteFeedback = async (id) => {
    setLoading(true)
    if (user || localStorage.getItem('user')) {
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      try {
        const response = await fetch(`${baseURL}/feedback/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
        });
        setLoading(false)
        const data = await response.json()        
        const message = data.message || data.data
        setLoading(false)
        if (response.ok) {
          return {status: true, message}
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  const sortFeedback = (option) => {
    let sortedFeedbacks = [];
    switch (option) {
      case 'ratingAscending':
        sortedFeedbacks = feedbacks.slice().sort((a, b) => a.rating - b.rating);
        break;
      case 'ratingDescending':
        sortedFeedbacks = feedbacks.slice().sort((a, b) => b.rating - a.rating);
        break;
      case 'mostRecent':
        sortedFeedbacks = feedbacks.slice().sort((a, b) => new Date(b.time) - new Date(a.time));
        break;
      case 'oldest':
        sortedFeedbacks = feedbacks.slice().sort((a, b) => new Date(a.time) - new Date(b.time))
        break;
      default:
        sortedFeedbacks = feedbacks;
        break;
    }
    return sortedFeedbacks
  }

  const checkEditFeedback = (theuser) => {
    if(user || localStorage.getItem('user') ){

      return theuser.email===user.email
        
    }
    return  false
  }
  return {
    loading,
    feedbacks: state.feedbacks,
    quantity,
    getAllFeedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    sortFeedback,
    checkEditFeedback
  }
}


export default useFeedback