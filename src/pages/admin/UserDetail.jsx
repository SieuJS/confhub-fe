import { faAddressCard, faArrowRightToBracket, faEnvelope, faPhone, faUser, faUserCheck, faUserClock, faUserLock, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import useAdmin from '../../hooks/useAdmin'
import { useNavigate, useParams } from 'react-router-dom'
import usePageNavigation from '../../hooks/usePageNavigation'
import { useTranslation } from 'react-i18next'
import useUserManage from '../../hooks/useUserManage'



const UserDetail = () => {
  const {t} = useTranslation()
  const { loading: loadingUsers, userAccount, users, getAllUsers, getUserById } = useAdmin()
  const {message, loadingActive, loadingDelete, activeUser, deactiveUser, deleteUser} = useUserManage()
  const [displayUser, setUser] = useState(userAccount)
  const navigate = useNavigate()
  const {previousPath} = usePageNavigation()
  const id = useParams()
  useEffect(() => {
    if(users.length === 0 || !users){
      getAllUsers()
    }
  }, [users])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchData = async () => {
      await getAllUsers();
      await getUserById(id.id)

    }
    if (!userAccount || id.id !== userAccount.id || users.length === 0 || !users) {
      fetchData()
    }
  }, [id, userAccount])

  useEffect(()=>{
    const fetchData = async () => {
      await getUserById(id.id)

    }
    fetchData()
  },[users])

  useEffect(()=>{
    setUser(userAccount)
  },[userAccount])

  const handleActive = async (user) => {
    if(user && user.role === 'banned') {
      await activeUser(user.id)
      await getAllUsers();
      await getUserById(id.id)
    }
    else {
      await deactiveUser(user.id)
      await getAllUsers();
      await getUserById(id.id)
    }
  }
  return (
    <Container className=' m-5 pt-5 overflow-x-hidden'>

      <div className="d-flex justify-content-between align-items-center mb-3 content">
        <h4>{t('personalData')}</h4>
      </div>
      {
        loadingUsers
          ?
          <div className="my-3">
            <Spinner  />
          </div>
          :
          <>
            <div className="d-flex justify-content-between">
              <div className='text-teal-dark'>
                {message}
              </div>
            {
                  (previousPath && previousPath.includes('dashboard')) ?
<                 Button className='bg-teal-normal align-item' onClick={() => navigate('/admin/dashboard')}>
                  <FontAwesomeIcon icon={faArrowRightToBracket} className='mx-1 rotate-180' />
                  {t('back_to_dashboard')}
                </Button>
                :
                <Button className='bg-teal-normal' onClick={()=>navigate('/admin/users_management')}>
                <FontAwesomeIcon icon={faArrowRightToBracket} className='mx-1 rotate-180'/>
                {t('back_to_user_management')}
                </Button>
                }
          
          </div>
            {
              userAccount
              &&
              <>
                <Row className='m-3'>
                  <Col className='border rounded-1 p-3 m-2 mx-3' lg={5} md={5} sm={12}>
                    <div className='d-flex align-items-center mb-2'>
                      <FontAwesomeIcon icon={faEnvelope} className='text-primary-normal me-2 fs-5' />
                      <span className='text-color-medium'>Email:</span>
                    </div>
                    <span className='ms-4 text-color-black'>{userAccount.email}</span>
                  </Col>
                  <Col className='border rounded-1 p-3 m-2 mx-3' lg={5} md={5} sm={12}>
                    <div className='d-flex align-items-center mb-2'>
                      <FontAwesomeIcon icon={faUser} className='text-primary-normal me-2 fs-5' />
                      <span className='text-color-medium'>{t('name')}:</span>
                    </div>
                    <span className='ms-4 text-color-black'>{userAccount.name}</span>
                  </Col>
                  <Col className='border rounded-1 p-3 m-2 mx-3' lg={5} md={5} sm={12}>
                    <div className='d-flex align-items-center mb-2'>
                      <FontAwesomeIcon icon={faPhone} className='text-primary-normal me-2 fs-5' />
                      {t('phone')}:
                    </div>
                    <span className='ms-4 text-color-black'>{userAccount.phone}</span>
                  </Col>
                  <Col xs="12" className='border rounded-1 p-3 m-2 mx-3' lg={5} md={5} sm={12}>
                    <div className='d-flex align-items-center mb-2'>
                      <FontAwesomeIcon icon={faAddressCard} className='text-primary-normal me-2 fs-5' />
                      {`${t('address')}/${t('nationality')}`}:
                    </div>
                    <span className='ms-4 text-color-black'>
                      {
                        userAccount.address && userAccount.nationality ?
                         `${userAccount.address} / ${userAccount.nationality}`
                        :
                        userAccount.address ? userAccount.address :
                        userAccount.nationality 

                      }
                    </span>
                  </Col>
                </Row>
              </>
            }
          </>
      }
      <div className='fixed-bottom mt-4  bg-primary-light py-3' style={{ paddingLeft: "10px" }}>
        <Button onClick={()=>handleActive(userAccount)} style={{ marginLeft: "20%" }} className=' bg-blue-dark border-light'>
          {
            loadingActive ?
            <Spinner size='sm'/>
            :
            <>
            <FontAwesomeIcon icon={userAccount?.role === 'banned' ? faUserLock : faUserCheck} className='me-2 ' />
           
          {
            displayUser?.role !== 'banned' ? `${t('deactive')}` : `${t('active')}`
          }
            </>
          }
        </Button>
        <Button className=' mx-4 bg-red-normal border-light' onClick={()=>deleteUser(userAccount.id)}>
         {
          loadingDelete ?
          <Spinner size='sm'/>
          :
          <>
           <FontAwesomeIcon icon={faUserXmark} className='me-2 ' />
           {`${t('delete')} ${t('user').toLowerCase()}`}
          </>
         }
        </Button>
      </div>
      
    </Container>
  )
}

export default UserDetail