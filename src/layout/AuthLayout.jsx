import { Outlet, useNavigate } from "react-router-dom";

import { Container } from "react-bootstrap";
import Sidebar from "../components/Sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBookBookmark, faCalendarMinus, faFileLines, faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import usePageNavigation from "../hooks/usePageNavigation";
export const AuthLayout = () => {
  const {user} = useAuth()
  const {previousPath} = usePageNavigation()
  const navigate = useNavigate()
  const protectedPaths = [
    '/user/account',
    '/user/followed',
    '/user/yourconferences',
    '/user/note',
    '/user/notifications',
    '/user/setting',
  ];

  useEffect(()=>{
    if(!user){
      if(protectedPaths.includes(previousPath)){
        navigate('/')
      }
      else navigate(previousPath)
    }
  }, [user])

  const sidebar = [
    { path: `/user/account`, title: 'account', icon: <FontAwesomeIcon icon={faUser} className="me-2"/> },
    { path: '/user/followed', title: 'followed_conference', icon: <FontAwesomeIcon icon={faBookBookmark}className="me-2"/> },
    { path: '/user/yourconferences', title: 'your_conferences', icon: <FontAwesomeIcon icon={faFileLines}className="me-2"/>},
    { path: '/user/note', title: 'note', icon: <FontAwesomeIcon icon={faCalendarMinus}className="me-2"/> },
    { path: '/user/notifications', title: 'notifications', icon: <FontAwesomeIcon icon={faBell}className="me-2"/> },
    { path: '/user/setting', title: 'setting', icon: <FontAwesomeIcon icon={faGear}className="me-2"/> },
  ]

 

  
  return (
    <Container className="d-flex w-100 h-100 mw-100 p-0">
      <Sidebar sidebar={sidebar}/>
      <Outlet/>
    </Container>
  )
};
