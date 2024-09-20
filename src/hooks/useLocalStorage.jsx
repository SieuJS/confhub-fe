import { useEffect, useState } from 'react';
import { useAppContext } from '../context/authContext';

const useLocalStorage = () => {
  const {state, dispatch} = useAppContext()
  // Kiểm tra xem có dữ liệu người dùng trong localStorage không
  const [user, setUser] = useState(null);

  useEffect(() => {

    // Kiểm tra xem có thông tin người dùng trong localStorage không
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedData = JSON.parse(storedUser)
//console.log({parsedData})
        setUser(parsedData)
        saveUserToLocalStorage(parsedData )
      dispatch({type: 'LOGIN_SUCCESS', payload: JSON.parse(storedUser)})
  
    }
    
  }, []);

  // Hàm để lưu thông tin người dùng vào localStorage
  const saveUserToLocalStorage = (userData, callback) => {
    localStorage.setItem('user', JSON.stringify(userData));
   // dispatch({type: 'LOGIN_SUCCESS', payload: userData})
    setUser(userData);
    callback && callback(userData); // Call the callback if provided
    return userData;
  };

  // Hàm để xóa thông tin người dùng khỏi localStorage
  const deleteUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user-id');
    setUser(null);
    dispatch({type: 'LOGOUT_USER'})
  };

  const getItemInLocalStorage = (storedName) => {
    const storageData = localStorage.getItem(storedName); // Lấy dữ liệu từ sessionStorage dựa trên storageName
    return storageData ? JSON.parse(storageData) : null; 
  }
  
  const updateUserInStorage = (updateData) => {
    // Tạo một object mới chứa các thông tin cập nhật
    const updatedUser = {
      ...user, // Giữ nguyên các trường khác không cần cập nhật
      ...updateData, // Cập nhật thông tin mới
    };
    // Lưu object mới vào localStorage
    setUser(updatedUser)
  //  dispatch({type: 'LOGIN_SUCCESS', payload: updatedUser})
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return {
    user: state.user,
    saveUserToLocalStorage,
    deleteUserFromLocalStorage,
    updateUserInStorage,
    getItemInLocalStorage
  };
};

export default useLocalStorage;