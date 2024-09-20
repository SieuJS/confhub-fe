import { faArrowCircleDown, faChevronDown, faCircle, faSortDown, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Button, Carousel, Dropdown, OffcanvasHeader } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useNotification from '../../hooks/useNotification'
import useAuth from '../../hooks/useAuth'

const OffcanvasHeaderRes = ({onClose, notifications, onReloadlist, onReadStatus}) => {
  const { t } = useTranslation()
  const {user, handleLogout} = useAuth()
  const [activePage, setActivePage] = useState(0)
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    onReloadlist()
  }, [])

  useEffect(() => {
    const hasUnreadNotifications = notifications.some(notification => !notification.read_status);
    setHasNewNotification(hasUnreadNotifications)
  }, [notifications]);
  const handleSelect = (selectedIndex) => {
    setActivePage(selectedIndex);
  };

  const handleNavigate = (path) => {
    onClose()
    if(user){
      navigate(path)
    } else navigate('./login')
  }

  const handleLogoutAcc = () => {
    onClose()
    handleLogout()
  }
  
  const handleClickMessage = async (noti) => {
    if (!user) {
      alert('Please login before continue!')
      onClose();
      navigate('/login')
    }
    else {
      await onReadStatus([noti])
      
      navigate(user ? '/user/notifications' : 'login')
      onClose()
    }
  }
  const handleViewAll = async () => {
    onClose(  )
    const unreadNotifications = notifications.filter(notification => !notification.read_status);

    await onReadStatus(unreadNotifications)
    navigate(user ? '/user/notifications' : 'login')
  }
  const splitNotificationMessage = (message) => {
    const parts = message.split('. ');
    const firstPart = parts[0];
    const secondPart = parts.slice(1).join('. '); // Nối lại các phần còn lại, phòng trường hợp thông báo có nhiều hơn một dấu chấm

    return { firstPart, secondPart };
  };
  return (
    <Carousel className='px-5 h-100'
      interval={null}
      activeIndex={activePage}
      onSelect={handleSelect}
      indicators={false}
      controls={false}>
        
      <Carousel.Item className='h-100'>
        <div className='d-flex flex-column align-items-end px-5'>
          <div className='d-flex flex-column w-100'>
          <div to='./' className=' my-3 h2 text-teal-dark' onClick={()=>handleNavigate('./')}>
            {t('home')}
          </div>
          <div
          onClick={()=>setShowDropdown(!showDropdown)}
          className=' my-3 h2 text-teal-dark d-flex align-items-center'>
            {t('conference')}
            <FontAwesomeIcon icon={faChevronDown} className={`rotate-toggle-button mx-5 fs-4 ${showDropdown ? 'rotated' : ''}`}/>
          </div>
          {
            showDropdown &&
            <div className='ms-3 text-teal-dark h3 text-decoration-underline '>
             <div className='mb-2' onClick={() => handleNavigate('/user/followed')}>{t('followed_conference')}</div>
             <div className='my-2' onClick={() => handleNavigate('/user/yourconferences')}>{t('your_conferences')}</div>
            </div>
          }
          <div className=' my-3 h2 text-teal-dark' onClick={()=>handleNavigate('./')}>
            {t('note')}
          </div>
          
          <div className=' my-3 h2 text-teal-dark' onClick={()=>handleNavigate('./user/account')}>
            {t('account')} <span className="mx-1 text-teal-dark fs-3">{`(${user?.name})`}</span>
          </div>

          <div
            className='my-3 h2 text-teal-dark'
            onClick={()=>setActivePage(1)}
          >
            {t('notifications')}
          </div>
          <div
            className='my-3 h2 text-teal-dark'
            onClick={()=>handleNavigate('./user/setting')}
          >
            {t('setting')}
          </div>
          {
            user ?
            <div
            className='my-3 h2 text-red-normal'
            onClick={handleLogoutAcc}
          >
            {t('logout').toUpperCase()}
          </div>
          :
          <div
          className='my-3 h2 text-red-normal'
          onClick={()=>handleNavigate('./login')}
        >
          {t('login').toUpperCase()}
        </div>
          }
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item className='h-100'>
        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 999 }} className="w-100 d-flex align-items-center justify-content-between">
          <span className='h2 text-teal-normal'>{t('notifications')}</span>
          <FontAwesomeIcon 
            icon={faXmarkCircle} 
            className='text-secondary fs-3'
            onClick={()=>setActivePage(0)}
          />
        </div>

        <div className='overflow-auto' style={{ maxHeight: 'calc(100vh - 200px)', marginTop: '60px', marginBottom: '60px' }}>
              {notifications.length > 0 ? (
                notifications.map((noti, index) => {
                  const { firstPart, secondPart } = splitNotificationMessage(noti.message);
                  return (
                      <div className='d-flex' key={index}   onClick={() => handleClickMessage(noti)}>
                        <div className='me-2 '>
                          <FontAwesomeIcon icon={faCircle} style={{ height: "8px" }} className={`${noti.read_status ? 'text-teal-normal' : 'text-danger'}`} />
                        </div>
                        <div>
                          <div className={`${noti.read_status ? 'text-secondary' : 'text-color-black'}`}>
                            <div className='fw-bold notification-message'>{firstPart}</div>
                            <span className='notification-message'>{secondPart}</span>
                          </div>
                        </div>
                      </div>
                  );
                })
              ) : (
                <p>{t('no_notifications')}</p>
              )}
             
            </div>
          
       
            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 999 }}>
            <Button onClick={handleViewAll} className='fw-bold text-nowrap fw-normal text-center w-100 text-color-darker bg-transparent border-0'>
              {t('view_all_notifications')} {"  >"}
            </Button>
        </div>
      </Carousel.Item>
    </Carousel>
  )
}

export default OffcanvasHeaderRes