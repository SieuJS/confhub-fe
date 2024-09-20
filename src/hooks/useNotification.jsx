// useNotification.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from './useAuth';
import { useAppContext } from '../context/authContext';
import { getNotifications } from '../actions/notiAction';
import useToken from './useToken';
import { baseURL } from './api/baseApi';
import useImport from './useImport';
import useCrawlJob from './useCrawlJob';

const useNotification = () => {
  const [isConnected, setIsConnected] = useState(false);
  const {isImporting} = useImport()
  const {getAllCrawlJobs} = useCrawlJob()
  const { token } = useToken()
  const [loading, setLoading] = useState(false)
  const { state, dispatch } = useAppContext()
  const { user, getCurrentUser, handleIsExpired } = useAuth()
  
  const [id, setId] = useState(null);
  let socketRef = useRef(null);
  
  
  useEffect(() => {
    const userID = JSON.parse(sessionStorage.getItem('user-id'))
    const fetchUserId = async () => {
      try {
        await getCurrentUser()
        if (userID) {
           setId(userID)       
        }
        else {
          const generatedID = generateRandomUserId()
          setId(generatedID)
        }

      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    if(!user){
      fetchUserId()
    } else {
      if(userID){

        setId(userID)
      }
    }

  }, [user]);

  useEffect(() => {
    if (id && !socketRef.current) {
      try {
        socketRef.current = io(`https://conference-searching.onrender.com`, {
          query: {
            "user-id": id
          },
          path: '/socket.io',
          transports: ["websocket", 'polling']
        });

        const socket = socketRef.current;
        socket.on('connect', () => {
          console.log('Connected to socket.io server');
          setIsConnected(true);
          
        const socket_id = socket.id
        //dispatch({ type: 'SET_SOCKET_ID', payload:  socket.id });
        sessionStorage.setItem('socket-id', JSON.stringify(socket_id))
        });

        socket.on('notification', (message) => {
          //console.log('Received notification:', message);
          if (message.id) {
            dispatch({ type: 'ADD_MESSAGE', payload: message });
          }
          dispatch(getAllNotifications());
        });


        socket.on("connect_error", (err) => {
          console.error('Connect error:', err.message);
          console.error('Description:', err.description);
          console.error('Context:', err.context);
        });

        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });

        socket.on('disconnect', () => {
          console.log('Disconnected from socket server');
          setIsConnected(false);
        });
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
      
      return () => {
     
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }

  }, [id, dispatch]);

  useEffect(() => {
    if (!socketRef.current) {
        return;
    }
    const handleJobMessage = (message) => {
     // getAllCrawlJobs()
        if (message.job?.type === 'import conference') {
          dispatch({ type: 'UPDATE_IMPORT_LIST', payload: message });
        }
    };

    socketRef.current.on('job', handleJobMessage);

    return () => {
        socketRef.current?.off('job', handleJobMessage);
    };
}, [isImporting, dispatch]);

  function generateRandomUserId() {
    const prefix = "guest";
    const randomString = Math.floor(100000000000000 + Math.random() * 900000000000000); // Generates a random alphanumeric string
    return prefix + randomString;
  }


  const setMessageNoti = () => {
    dispatch({ type: 'SET_NOTI_MESSAGE_CRAWL', payload: null });
  }


  const getAllNotifications = async () => {
    setLoading(true)
    if (user || localStorage.getItem('user')) {
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      try {
        const response = await fetch(`${baseURL}/notification`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
        });
        const data = await response.json()
        setLoading(false)
        if (response.ok) {
          dispatch(getNotifications(data.data))
        }
        else if (response.status === 401) {
          handleIsExpired(false)
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }
  }

  const getNoticationById = async (unreadNotifications) => {
    if (user || localStorage.getItem('user')) {
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      try {
        for (const noti of unreadNotifications) {
          const response = await fetch(`${baseURL}/notification/${noti.tid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenHeader}`
            },
          });
          if (response.ok) {
            getAllNotifications()
          }
          else if (response.status === 401) {
            handleIsExpired(false)
          }
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }
  }
  return {
    socketRef: socketRef,
    socketID: state.socketID,
    notifications: state.notifications,
    messages: state.messages,
    isConnected: isConnected,
    loading,
    getNoticationById,
    getAllNotifications,
    setMessageNoti
  };
};

export default useNotification;