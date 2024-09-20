import { useEffect, useState } from 'react'
import useConference from '../../hooks/useConferences'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const MessagesUpdateNow = () => {
    const { t } = useTranslation()
    const { messages, removeIDfromCrawlings } = useConference()
    const [popupheight, setPopupheight] = useState(null)
    const [completedMessages, setCompletedMessages] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const completed = messages.filter(message => message.status === 'completed' || message.status === 'failed');
        setCompletedMessages(completed);
        const timers = [];
        const message_popup = document.getElementById('message-popup');
        setPopupheight(message_popup?.clientHeight)
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
    }, [messages])


    const handleNavigate = (id) => {
        navigate(`/detailed-information/${id}`)
        window.location.reload()
    }


    if (messages?.length === 0) {
        return null
    }
    const getMessageClassName = (status) => {
        switch (status) {
            case 'completed':
                return 'message-popup-success';
            case 'failed':
                return 'message-popup-failed';
            default:
                return '';
        }
    };
    return (
        <div className='mt-5'>
            {
                completedMessages?.map((message, index) => (
                    <div key={message?.id} id="message-popup"
                        className={`message-popup ${getMessageClassName(message?.status)}`}
                        style={popupheight ? { top: `${popupheight * (index + 1)}px` } : {}}
                    >
                        <div className='message-name overflow-hidden fw-bold px-3'>
                            {`${message?.name} `}

                        </div>
                        <div className='d-inline-block'>
                            {
                                message?.status === "completed" && message?.error ? `${t('hasBeenUpdated')}`
                                    :
                                    `${t('cannotBeCrawledRightNow')}`

                            }
                            {
                                message?.status === "completed" &&
                                <Button
                                    onClick={() => handleNavigate(message?.id)}
                                    className='text-decoration-underline bg-transparent border-0 p-0 ps-1'>
                                    {t('clickToViewDetails')}
                                </Button>
                            }
                        </div>



                    </div>
                ))
            }

        </div>
    )
}

export default MessagesUpdateNow