import {Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/authContext";
import { Container } from "react-bootstrap";
import Sidebar from "../components/Sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll, faFileUpload, faTableColumns, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import usePageNavigation from "../hooks/usePageNavigation";
import { useEffect } from "react";

// ...


export const AdminLayout = () => {
  const {t} = useTranslation()
  const {user} = useAuth()
  const {previousPath} = usePageNavigation()
  const navigate = useNavigate()
  const protectedadminPaths = [
   '/admin/dashboard',
   '/admin/conferences_management',
   '/admin/users_management',
   '/admin/import_conference'
  ]
  const protectedPaths = [
    '/user/account',
    '/user/followed',
    '/user/yourconferences',
    '/user/note',
    '/user/notifications',
    '/user/setting',
  ];
//{ path: '/admin/admin_account', title: 'Admin Account', icon: <FontAwesomeIcon icon={faUser} className='me-2' />  },
const sidebar = [
  { path: `/admin/dashboard`, title: t('Dashboard'), icon: <FontAwesomeIcon icon={faBorderAll} className='me-2' /> },
  { path: `/admin/conferences_management`, title: t('Conferences'), icon: <FontAwesomeIcon icon={faTableColumns} className='me-2' /> },
  { path: '/admin/users_management', title: t('Users'), icon: <FontAwesomeIcon icon={faUsers} className='me-2' /> },
  { path: '/admin/import_conference', title: t('import_file'), icon: <FontAwesomeIcon icon={faFileUpload} className='me-2' /> },
];
useEffect(()=>{
    if(!user){
      if(protectedPaths.includes(previousPath) || protectedadminPaths.includes(previousPath)){
        navigate('/')
      }
      else navigate(previousPath)
    }
    else {
      if(user.role !== 'admin'){
        if(protectedPaths.includes(previousPath) || protectedadminPaths.includes(previousPath)){
          navigate('/')
        }
        else navigate(previousPath)
      }
    }
  }, [user])
  return (
    <Container className="d-flex w-100 mw-100 p-0">
          <Sidebar sidebar={sidebar}/>
          <Outlet/>
    </Container>
  )
};