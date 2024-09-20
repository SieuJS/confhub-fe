
import { useAppContext } from '../context/authContext'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useEffect, useState } from 'react'
import useAuth from './useAuth'
import { useNavigate } from 'react-router-dom'
import useAdmin from './useAdmin'

const useUserManage = () => {
  const { user } = useLocalStorage()
  const { token } = useToken()
  const {handleIsExpired} = useAuth()
  const {getUserById} = useAdmin()
    const navigate = useNavigate()
  const [loadingActive, setLoadingActive] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (message !== null && message !== undefined) {
          const timer = setTimeout(() => {
            setMessage('');
          }, 3000); // Thời gian mặc định là 3000ms (3 giây)
    
          return () => clearTimeout(timer); // Cleanup timer if value changes or component unmounts
        }
      }, [message]);
    
  const activeUser = async (id) => {
    setLoadingActive(true)

    if (user || localStorage.getItem('user')) {
      const response = await fetch(`${baseURL}/user/${id}/active`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,

          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setLoadingActive(false)
      if (!response.ok) {
        if(response.status === 401){
            handleIsExpired(false)
          }
        throw new Error(response.message);
      }
      else {
        const mess = data.message || data.data
        setMessage(mess)
        await getUserById(id)
        return { status: true, message }
      }
    }
  }

  const deactiveUser = async (id) => {
    setLoadingActive(true)

    if (user || localStorage.getItem('user')) {
      const response = await fetch(`${baseURL}/user/${id}/deactive`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,

          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setLoadingActive(false)
      if (!response.ok) {
        if(response.status === 401){
            handleIsExpired(false)
          }
        throw new Error(response.message);
      }
      else {
        const mess = data.message || data.data
        setMessage(mess)
        await getUserById(id)
        return { status: true, message }
      }
    }
  }
  const deleteUser = async (id) => {
    setLoadingDelete(true)

    if (user || localStorage.getItem('user')) {
      const response = await fetch(`${baseURL}/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,

          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setLoadingDelete(false)
      if (!response.ok) {
        if(response.status === 401){
            handleIsExpired(false)
          }
        throw new Error(response.message);
      }
      else {
        const mess = data.message || data.data
        setMessage(mess)
        const timer = setTimeout(() => {
            navigate('/admin/users_management')
          }, 3000); // Thời gian mặc định là 3000ms (3 giây)
          return () => clearTimeout(timer);
      }
    }
  }
  return {
    message,
    loadingActive,
    loadingDelete,
    activeUser,
    deactiveUser,
    deleteUser
  }
}


export default useUserManage