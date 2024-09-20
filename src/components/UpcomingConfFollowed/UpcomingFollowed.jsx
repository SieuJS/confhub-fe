import React, { useEffect, useState } from 'react'
import useFollow from '../../hooks/useFollow';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './custom_carousel_upcoming.css'
const UpcomingFollowed = () => {
    const {listFollowed, getUpcomingConferences, getListFollowedConferences} = useFollow()
    const [displayConferences, setDisplayConferences] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
      const getData = async () => {
          const data = await getUpcomingConferences(listFollowed)
            setDisplayConferences(data)

      }
      getData()
    }, [listFollowed])
    
    const [prevIndex, setPrevIndex] = useState(displayConferences.length - 1);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    useEffect(() => {
        // Tự động chuyển từ sau mỗi 3 giây
        const interval = setInterval(() => {
            setCurrentWordIndex(prevIndex =>
            prevIndex === displayConferences.length - 1 ? 0 : prevIndex + 1
          );
        }, 3000);
    
        return () => clearInterval(interval);
      }, []); // Chỉ gọi useEffect khi component mount lần đầu
  return (
    <div className="sliding-words">
        alo
    {displayConferences.map((conf, index) => (
      <span
        key={index}
        className={`word ${index === currentWordIndex ? 'active' : ''}`}
      
      >
        {conf.information?.name}
      </span>
    ))}
  </div>
  )
}

export default UpcomingFollowed