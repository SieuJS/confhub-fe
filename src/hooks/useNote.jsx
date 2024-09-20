
import { useAppContext } from '../context/authContext'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useState } from 'react'
import { getNotes } from '../actions/noteAction'

import submission_date_dict from './../data/submission_date_dict.txt?raw'
import camera_ready_dict from './../data/camera_ready_dict.txt?raw'
import notification_date_dict from './../data/notification_date_dict.txt?raw'
import useSessionStorage from './useSessionStorage'
import { capitalizeFirstLetter } from '../utils/formatWord'

const useNote = () => {
  const {state, dispatch} = useAppContext()
  const { user } = useLocalStorage()
  const { token } = useToken()
  const [loading, setLoading] = useState(false)
  const {getDataListInStorage} = useSessionStorage()

  const checkDateTypeWithKeywords = (filekeywords, dateType) => {
    
    const lines = filekeywords.split('\n').map(line => line.trim().toLowerCase());

      const dateTypeFormat = dateType.trim().toLowerCase();
      if (lines.includes(dateTypeFormat)) {
        return true;
      }
      return false;
  };

  const getSubStyle = (conferenceType) => {
    if (checkDateTypeWithKeywords(submission_date_dict, conferenceType)) {
      return 'submission-event';
    }
   if (checkDateTypeWithKeywords(camera_ready_dict, conferenceType)) {
      return 'camera-event';
    }
    if (checkDateTypeWithKeywords(notification_date_dict, conferenceType)) {
      return 'notification-event';
    }
    return 'note-event';
  };

  const toCamelCase = (str) => {
    return str
        .toLowerCase()
        .split('-')
        .map((word, index) => 
            index === 0 
            ? word 
            : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');
};
const extractDataByOrgId = (conferencesList, notesList) => {
  const extractedData = [];

  for (const note of notesList) {
      const extractedItem = {
          id: note.tid,
          conf_id: null,
          name: null,
          note: note.note || null,
          acronym: null,
          start_date: null,
          end_date: null,
          date_type: null,
          location: null,
          subStyle: null,
          allDay: true, // Đánh dấu sự kiện là nguyên ngày
      };

      if (note.ImportantDateDateId) {
          for (const conference of conferencesList) {
              for (const importantDate of conference.importantDates) {
                  if (importantDate.date_id === note.ImportantDateDateId) {
                      extractedItem.acronym = conference.information.acronym;
                      extractedItem.name = conference.information.name;
                      extractedItem.conf_id = conference.id;
                      extractedItem.date_type = capitalizeFirstLetter(importantDate.date_type);
                      extractedItem.start_date = new Date(importantDate.date_value);
                      extractedItem.end_date = new Date(importantDate.date_value); // Chuyển đổi thành đối tượng Date
                      extractedItem.subStyle = getSubStyle(importantDate.date_type);

                      const org = conference.organizations.find(org => org.status === 'new');
                      extractedItem.location = org ? org.location : null;
                  }
              }
          }
      } else if (note.OrganizationOrgId) {
          for (const conference of conferencesList) {
              const organization = conference.organizations.find(org => org.org_id === note.OrganizationOrgId && org.status === 'new');
              if (organization) {
                  extractedItem.acronym = conference.information.acronym;
                  extractedItem.name = conference.information.name;
                  extractedItem.conf_id = conference.id;
                  extractedItem.date_type = 'Conference date';
                  extractedItem.start_date = new Date(organization.start_date);
                  extractedItem.end_date = new Date(organization.end_date); // Chuyển đổi thành đối tượng Date
                  extractedItem.subStyle = 'conference-event';
                  extractedItem.location = organization.location;
              }
          }
      } else {
          extractedItem.date_type = 'Personal note';
          extractedItem.start_date = new Date(note.date_value);
          extractedItem.end_date = new Date(note.date_value); // Chuyển đổi thành đối tượng Date
          extractedItem.subStyle = 'note-event';
      }

      // Kiểm tra xem đã tồn tại object có các thuộc tính giống với object mới không
      const isDuplicate = extractedData.some(item => item.id === extractedItem.id);
      if (!isDuplicate) {
          extractedData.push(extractedItem);
      }
  }

  return extractedData;
};

// Các hàm phụ trợ cần thiết như capitalizeFirstLetter và getSubStyle cần được định nghĩa bên ngoài hoặc nhập vào file này


// Các hàm phụ trợ cần thiết như capitalizeFirstLetter và getSubStyle cần được định nghĩa bên ngoài hoặc nhập vào file này

    
  const getAllNotes = async () => {
    setLoading(true)
    const listFollowed = getDataListInStorage("listFollow")
    if(user || localStorage.getItem('user')){
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
        const response = await fetch(`${baseURL}/note`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenHeader}`
          }
        });
        if (!response.ok) {
          throw new Error(response.message);
        }
        const data = await response.json(); 
        // Sử dụng hàm này để lấy thông tin từ danh sách dựa trên OrganizationOrgId
        const newDataByOrgId = extractDataByOrgId(listFollowed, data.data);
        dispatch(getNotes(newDataByOrgId))
        setLoading(false)
      }
      
  }


  const updateNote = async (id, note) => {
    setLoading(true)
    const updateData = {
      note: note
    }
    if(user || localStorage.getItem('user')){
      const response = await fetch(`${baseURL}/note/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      const data = await response.json();    
      setLoading(false)
      if (!response.ok) {
        throw new Error(response.message);
      }
      else {
        const message = data.message || data.data
        return {status: true, message}
      }
    }
  }

  const addNote = async (note, date_value) => {
    const postData = {
      note: note,
      date_value: date_value
    }
    setLoading(true)
    if(user || localStorage.getItem('user')){
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
        const response = await fetch(`${baseURL}/note`, {
          method: 'Post',
          headers: {
            'Authorization': `Bearer ${tokenHeader}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });
        setLoading(false)
        if (!response.ok) {
          throw new Error(response.message);
        }
        else {
          const data = await response.json();   
          const message = data.message || data.data
          return {status: true, message}
        }
      }
  }
  const deleteNote = async (id) => {
    setLoading(true)
    if(user || localStorage.getItem('user')){
        const response = await fetch(`${baseURL}/note/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        
        const data = await response.json();  
        if (!response.ok) {
          throw new Error(response.message);
        }
        else {
          const message = data.message || data.data
          return {status: true, message}
        }
      }
  }
    return {
        notes: state.notes,
        loading,
        getAllNotes,
        updateNote,
        addNote,
        deleteNote,
        checkDateTypeWithKeywords
    }
  }


  export default useNote