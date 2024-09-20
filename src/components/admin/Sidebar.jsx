
import { Container, Stack, Image } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'

import test from '../../assets/imgs/location.png'

import useLocalStorage from '../../hooks/useLocalStorage'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBorderAll, faCircleUser, faFileLines, faTableColumns, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../../hooks/useAuth'


const sidebar = [
  { path: `/admin/dashboard`, title: 'Dashboard', icon: <FontAwesomeIcon icon={faBorderAll} className='mx-2' /> },
  { path: `/admin/conferences_management`, title: 'Conferences', icon: <FontAwesomeIcon icon={faTableColumns} className='mx-2' /> },
  { path: '/admin/users_management', title: 'Users', icon: <FontAwesomeIcon icon={faUsers} className='mx-2' />  },
  { path: '/admin/admin_account', title: 'Admin Account', icon: <FontAwesomeIcon icon={faUser} className='mx-2' />  },
  
]

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [profile, setProfile] = useState(null)
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
  };
  useEffect(()=>{
    if(user){
      setProfile(user)
    }
  },[user])

  return (
    <Container fluid className="my-sidebar" style={{zIndex: "100"}}>
      <button onClick={toggleSidebar} className="btn btn-primary">
                    {isCollapsed ? 'Expand' : 'Collapse'}
                </button>
      <Stack>
        {/* Sidebar */}
        <div className='text-center mt-5 pt-5'>
          <FontAwesomeIcon icon={faCircleUser} className='text-light' style={{fontSize: "100px"}}/>
        </div>
        <div className='text-center mt-2 text-light'>
          <h3 className='text-light'>{user? user.name : ''}</h3>
        </div>
        <Stack md={3} className="fixed-left">
          {
            sidebar.map(link => (
              <NavLink
                key={link.title}
                to={link.path}
                className={
                  location.pathname === link.path
                    ? 'my-sidebar-navlink ps-2 py-3 bg-primary-normal text-color-darker rounded-2'
                    : 'my-sidebar-navlink px-2 py-3 '}
              >

                {link.icon}
                {!isCollapsed && <span>{link.title}</span>}
                
              </NavLink>

            ))
          }
        </Stack>

      </Stack>
    </Container>
  )
}

export default Sidebar