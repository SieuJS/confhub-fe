
import { Container, Stack, Image, Offcanvas } from 'react-bootstrap'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import test from './../assets/imgs/location.png'

import avatarIcon from '../assets/imgs/avatar_lg.png'
import useLocalStorage from '../hooks/useLocalStorage'
import { useEffect, useState } from 'react'
import usePageNavigation from '../hooks/usePageNavigation'
import useAuth from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../hooks/useScreenSize'

const sidebar = [
  { path: `/user/account`, title: 'Account', icon: test },
  { path: '/user/followed', title: 'Followed Conferences', icon: test },
  { path: '/user/yourconferences', title: 'Your conferences', icon: test },
  { path: '/user/note', title: 'Note', icon: test },
  { path: '/user/notifications', title: 'Notifications', icon: test },
  { path: '/user/setting', title: 'Setting', icon: test },
]

const Sidebar = () => {
  const {t} = useTranslation()
  const {windowWidth} = useScreenSize()
  const {user: account} = useAuth()
  const {user} = useLocalStorage()
  const location = useLocation()
  usePageNavigation()
  const [profile, setProfile] = useState(null)

  useEffect(()=>{
    if(user){
      setProfile(account)
    }
  },[account])

  return (
    <>
    {
      windowWidth > 768 ?
      <Container fluid className="my-sidebar">
      <Stack>
        {/* Sidebar */}
        <div className='text-center mt-5 pt-5'>
          <Image roundedCircle width={80} height={80} className='mx-auto' src={avatarIcon} />
        </div>
        
        {`${windowWidth}`}
        {
          user
          &&
          <>
          <div className='text-center mt-2 text-light'>
          <h3 className='text-light'>{user.name? user.name : ''}</h3>
        </div>
        <Stack md={3} className="fixed-left">
          {
            sidebar.map(link => (

              <NavLink
                key={link.title}
                to={link.path}
                className={
                  location.pathname === link.path
                    ? 'my-sidebar-navlink ps-2 py-3 fs-6 bg-primary-normal text-color-darker rounded-2'
                    : 'my-sidebar-navlink px-2 py-3 fs-6 '}
              >

                {link.title}
              </NavLink>

            ))
          }
        </Stack>
          </>
        }

      </Stack>
    </Container>
    :
    (
      <>
        <Button onClick={handleShow}>Menu</Button>
        <Offcanvas show={showOffcanvas} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{t('Menu')}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Stack md={3} className="fixed-left">
              {sidebar.map(link => (
                <NavLink
                  key={link.title}
                  to={link.path}
                  className={
                    location.pathname === link.path
                      ? 'my-sidebar-navlink ps-2 py-3 fs-6 bg-primary-normal text-color-darker rounded-2'
                      : 'my-sidebar-navlink px-2 py-3 fs-6 '
                  }
                >
                  {link.title}
                </NavLink>
              ))}
            </Stack>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    )}
  </>
);
    }
    </>
  )
}

export default Sidebar