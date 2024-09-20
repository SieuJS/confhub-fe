import { useEffect, useState } from 'react'
import { Navbar, Container, Nav, Button, Dropdown, Offcanvas } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import useLocalStorage from '../../hooks/useLocalStorage'
import usePageNavigation from '../../hooks/usePageNavigation'
import HeaderNoti from '../Notifications/HeaderNoti'

import LoginExpiredModal from '../Modals/LoginExpiredModal'
import useAuth from '../../hooks/useAuth'
import AvatarDropdown from './AvatarDropdown'
import useNotification from '../../hooks/useNotification'
import { getNotifications } from '../../actions/notiAction'

import MessagesUpdateNow from './MessagesUpdateNow'
import TranslationButton from '../TranslationButton/TranslationButton'

import './custom_header.css'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import OffcanvasHeaderRes from './OffcanvasHeaderRes'

const Header = () => {
  const { t } = useTranslation()
  const { windowWidth } = useScreenSize()
  const { isLogin } = useAuth()
  const { user } = useLocalStorage();
  const navigate = useNavigate()
  const { goToPreviousPage } = usePageNavigation()
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation()
  const [activeKey, setActiveKey] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { notifications, getAllNotifications, getNoticationById } = useNotification()

  useEffect(() => {
    // getCurrentUser()
    getNotifications()
    if (user === null) {
      navigate('/')
    }
    const event = new KeyboardEvent('keydown', {
      key: 'r',
      ctrlKey: true, // hoặc metaKey: true nếu bạn đang sử dụng trên MacOS
    });

    goToPreviousPage(event);
  }, [])

  const handleSelect = (eventKey) => {
    setActiveKey(eventKey);
  };

  const handleNavigateLogin = () => {
    localStorage.setItem('previousPath', location.pathname);
    navigate('/login')
  }
  const checkExpired = () => {
    if (user) {
      return !isLogin
    } else {
      return false
    }
  }

  const handleNavigateLink = (path) => {
    if(user) {
      navigate(path)
    } else {
      
      localStorage.setItem('previousPath', location.pathname);
      navigate('/login')
    }
  }

  const handleOffcanvasClose = () => setShowOffcanvas(false);
  const handleOffcanvasShow = () => setShowOffcanvas(true);
  const navLinks = (
    <>
      <Nav.Link
        as={Link}
        to="/"
        title="Homepage"
        className={`d-flex align-items-center mx-md-4 text-nowrap text-color-black fs-6 fw-bold header-title ${location.pathname === '/' ? 'border-3 border-bottom border-secondary' : ''}`}
      >
        {t('home')}
      </Nav.Link>
      <Dropdown
        onMouseLeave={() => setShowDropdown(false)}
        onMouseEnter={() => setShowDropdown(true)}
        onClick={() => setShowDropdown(!showDropdown)}
        show={showDropdown}
      >
        <Dropdown.Toggle
          className={`d-flex align-items-center mx-md-4 px-0 rounded-0 text-center text-color-black fs-6 fw-bold  bg-transparent border-0 header-title ${location.pathname.includes('/followed') || location.pathname.includes('/your') ? 'text-center border-3 border-bottom border-secondary' : ''}`}
        >
          {t('conference')}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item className="fs-6" onClick={() => handleNavigateLink('/user/followed')}>{t('followed_conference')}</Dropdown.Item>
          <Dropdown.Item className="fs-6" onClick={() => handleNavigateLink('/user/yourconferences')}>{t('your_conferences')}</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Nav.Link
        as={Link}
        to={user ? '/user/note' : '/login'}
        title="Timestamp"
        className={`d-flex align-items-center mx-md-4 text-nowrap text-color-black fs-6 fw-bold text-center header-title ${location.pathname.includes('/note') ? 'border-3 border-bottom border-secondary' : ''}`}
      >
        {t('note')}
      </Nav.Link>
      <Nav.Item className="d-flex align-items-center mx-2">
        <TranslationButton />
      </Nav.Item>
      {
        user ?
          <Nav.Item className="d-flex align-items-center">
            <HeaderNoti notifications={notifications} onReadStatus={getNoticationById} onReloadlist={getAllNotifications} />
          </Nav.Item>
          :
          null
      }

      <Nav.Item className="d-flex align-items-center">
        {user ? (
          <AvatarDropdown />
        ) : (
          <Button className="bg-red-normal border-0 px-4 rounded-5 fw-bold fs-5 text-nowrap" onClick={handleNavigateLogin}>
            {t('login').toUpperCase()}
          </Button>
        )}
      </Nav.Item>
    </>
  );
  return (
    <Navbar expand="md" id="header" className=" fixed-top px-5 shadow-sm bg-white">
      <LoginExpiredModal show={checkExpired()} />
      <Container className="d-flex justify-content-between align-items-center w-100 px-sm-2">
        <Navbar.Brand className="my-header-brand me-auto me-md-0">
          <Link to="/" className="text-teal-dark fs-4 fw-bold" title="Homepage">
            ConfHub
          </Link>
        </Navbar.Brand>
        {windowWidth <= 768 ? (
          <>
            <Button variant="primary" onClick={handleOffcanvasShow} className='bg-white border px-3'>
              <FontAwesomeIcon icon={faBars} className='text-secondary' />
            </Button>
            <Offcanvas show={showOffcanvas} onHide={handleOffcanvasClose} placement='end' className='bg-darkcyan-dark'>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>{t('ConfHub')}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <OffcanvasHeaderRes onClose={() => setShowOffcanvas(false)} notifications={notifications} onReadStatus={getNoticationById} onReloadlist={getAllNotifications} />
              </Offcanvas.Body>
            </Offcanvas>
          </>
        ) : (
          <div onSelect={handleSelect} className="d-flex">
            {navLinks}
          </div>
        )}

      </Container>
      <MessagesUpdateNow />
    </Navbar>
  )
}

export default Header