import React, { useState } from 'react'
import { useAppContext } from '../context/authContext'
import useAuth from './useAuth'
import { baseURL } from './api/baseApi'
import useImport from './useImport'

const useCrawlJob = () => {
    const {state, dispatch} = useAppContext()
    const [loading, setLoading] = useState(false)
    const {deletePendingJobs} = useImport()
    const {user} = useAuth()

    const getFirstPage = async () => {
        try {
            const response = await fetch(`${baseURL}/job?size=1`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await response.json()
            setLoading(false)
            if (response.ok) {
            const maxRecords = data.maxRecords
            return maxRecords
            }   
          } catch (error) {
            throw new Error('Network response was not ok');
          }
    }
    const getAllCrawlJobs = async () => {
        setLoading(true)
        if (user || localStorage.getItem('user')) {
          let storedToken = JSON.parse(localStorage.getItem('token'));
          //const tokenHeader = token ? token : storedToken
          try {
            const maxRecords = await getFirstPage()
            const response = await fetch(`${baseURL}/job?size=${maxRecords}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await response.json()
            setLoading(false)
            if (response.ok) {
              dispatch({type: "SET_CRAWL_JOBS", payload: data.data})
            }
          } catch (error) {
            throw new Error('Network response was not ok');
          }
        }
      }

      const deleteJobByID = async (id) => {
        setLoading(true)
        try {
            // let storedToken = JSON.parse(localStorage.getItem('token'));
            //const tokenHeader = token ? token : storedToken
            // Gửi yêu cầu lấy danh sách feedback đến API
            const response = await fetch(`${baseURL}/job/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Kiểm tra xem kết quả trả về từ API có hợp lệ không
            if (!response.ok) {
              return { status: false, message }                
            }

            // Lấy dữ liệu từ phản hồi và cập nhật state
            const data = await response.json();
            const message = data.message || data.data
            
            setLoading(false)
            return { status: true, message }
        } catch (error) {
            // Nếu có lỗi xảy ra trong quá trình gửi yêu cầu hoặc xử lý dữ liệu, ném ra một lỗi
            throw new Error(`Error fetching feedbacks: ${error.message}`);
        }
    }

      const handleFinishJobs = () => {
        dispatch({type: "SET_IMPORT_LIST", payload: []})
        dispatch({type: "SET_STOP_IMPORTING", payload: false})
        deletePendingJobs()
        getAllCrawlJobs()
      }
  return {
    allCrawlJobs: state.allCrawlJobs,
    loading,
    getAllCrawlJobs,
    handleFinishJobs,
    deleteJobByID
  }
}

export default useCrawlJob