import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useConference from '../../hooks/useConferences'
import useMessageSocket from '../../hooks/useMessageSocket'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpider } from '@fortawesome/free-solid-svg-icons'
import CircleProgressBar from '../ProgressLoading/CircleProgressBar'
import 'react-circular-progressbar/dist/styles.css';
const UpdateNowButton = ({id}) => {
    const {t} = useTranslation()
    const {messages, crawlNow, removeIDfromCrawlings} = useConference()
    const {handleGetMessageById} = useMessageSocket()
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false)
    const [isCrawling, setIsCrawling] = useState(false)

    useEffect(()=> {
        const crawlingStatus = messages.find(mess => mess.id === id && mess.status !== 'completed');
       // console.log({crawlingStatus, messages, id})
    if (crawlingStatus) {
      setIsCrawling(true)
    } else {
      setIsCrawling(false)
    }

    const message = handleGetMessageById(messages, id);

    if (message) {
      const newProgress = message?.progress?.percentage || 0;
      setProgress(newProgress);
      const timers = [];
      messages.forEach(message => {
          if (message.status === 'completed' || message.status === 'failed') {
              const timer = setTimeout(() => {
                  removeIDfromCrawlings(message.id)
              }, 10000);
              timers.push(timer);
          }
      });

      return () => {
          timers.forEach(timer => clearTimeout(timer));
      };
    }
    },[id, messages])

    const handleClick = async () => {
        setLoading(true);
        try {
    
          const res = await crawlNow(id);
          if (res.status) {
            setLoading(false);
           //  handleAddMessageCrawling()
            setIsCrawling(true)
          }
        } catch (error) {
          console.error('Error:', error);
        }
    
      };
  return (
    <Button 
        onClick={handleClick}
        className='bg-transparent border-0 p-0 my-0 action-btn tb-icon-update'>
            
        {
            !isCrawling ? 
                <FontAwesomeIcon icon={faSpider} className='text-yellow fs-6 action-icon'/>
            :
            <CircleProgressBar progress={progress}/>
        }
    </Button>
  )
}

export default UpdateNowButton