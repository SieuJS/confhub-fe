import { useEffect, useState } from 'react';
import { baseURL } from './api/baseApi';
const useToken = () => {
  // Kiểm tra xem có dữ liệu người dùng trong localStorage không
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    // Kiểm tra xem có thông tin người dùng trong localStorage không
    const storedtoken = localStorage.getItem('token');
    if(storedtoken === 'undefined'){
      localStorage.clear()
    } else if (storedtoken) {
      setToken(JSON.parse(storedtoken));
    }
  }, []);

  const refreshToken = async (oldToken) => {
    try {
      const response = await fetch(`${baseURL}/user/refreshToken`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${oldToken}`
        }
      });
      if (response.ok) {
        const responseData = await response.data.newAccessToken
        savetokenToLocalStorage(responseData)
      } else {
        const errorData = await response.message
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  // Hàm để lưu thông tin người dùng vào localStorage
  const savetokenToLocalStorage = (tokenData) => {
    localStorage.setItem('token', JSON.stringify(tokenData));
    setToken(tokenData);
  };

  // Hàm để xóa thông tin người dùng khỏi localStorage
  const deletetokenFromLocalStorage = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return {
    token,
    savetokenToLocalStorage,
    deletetokenFromLocalStorage,
    refreshToken
  };
};

export default useToken;