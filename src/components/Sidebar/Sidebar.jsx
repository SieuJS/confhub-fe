
import { Container, Stack, Image, Button, Offcanvas } from 'react-bootstrap'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import useLocalStorage from '../../hooks/useLocalStorage'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleRight, faArrowCircleLeft, faArrowCircleRight} from '@fortawesome/free-solid-svg-icons'
import './custom_sidebar.css'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'

const Sidebar = ({sidebar}) => {
  const {t} = useTranslation()
  const {windowWidth} = useScreenSize()
  const { user } = useLocalStorage()
  const location = useLocation()
  const [profile, setProfile] = useState(null)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate()
  const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
  };
  useEffect(()=>{
    if(user){
      setProfile(user)
    }
  },[user])

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);
  const isPathInSidebar = sidebar.some(link => location.pathname.includes(link.path));

  const renderSidebarContent = () => (
    <Stack >
      {!isCollapsed && (
        <Button
          className="bg-transparent border-0 d-flex justify-content-center p-0 w-100"
          title="CONFHUB"
          onClick={() => navigate('/')}
        >
          <h2 className="text-white text-center my-2">CONFHUB</h2>
        </Button>
      )}
      <Stack md={3} className="fixed-left mt-5 mb-auto ">
        {sidebar.map(link => (
          <NavLink
            key={link.title}
            to={link.path}
            className={
              location.pathname.includes(link.path)
                ? 'my-sidebar-navlink ps-2 py-3 bg-primary-normal text-color-darker rounded-2'
                : 'my-sidebar-navlink px-2 py-3'
            }
          >
            {link.icon}
            {!isCollapsed && <span>{t(link.title)}</span>}
          </NavLink>
        ))}
      </Stack>
     {
      windowWidth > 768 &&
      <div className="d-flex justify-content-center">
      <button
        onClick={toggleSidebar}
        className="w-100 bg-teal-dark text-white border-0 p-2 position-absolute"
        style={{ bottom: '0px', height: '40px' }}
      >
        {isCollapsed ? <FontAwesomeIcon icon={faArrowAltCircleRight} /> : <FontAwesomeIcon icon={faArrowCircleLeft} />}
      </button>
    </div>
    
     }
    </Stack>
  );
  return (
    <>
    {windowWidth > 768 ? (
      <div className={`my-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {renderSidebarContent()}
      </div>
    ) : (
      isPathInSidebar && (
        <>
          <Button className='offcanvas-button-custom p-0' onClick={handleShow}>
            <FontAwesomeIcon icon={faArrowCircleRight}/>
          </Button>
          <Offcanvas show={showOffcanvas} onHide={handleClose} className='bg-darkcyan-dark'>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className='bg-darkcyan-dark'></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="offcanvas-body-custom bg-darkcyan-dark">
              {renderSidebarContent()}
            </Offcanvas.Body>
          </Offcanvas>
        </>
      )
    )}
  </>
);
}

export default Sidebar