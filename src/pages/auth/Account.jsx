import { useEffect, useState } from 'react'
import { Container, Button, Form, Col, Spinner, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

import ChangePasswordModal from '../../components/Modals/ChangePasswordModal'

import useToken from '../../hooks/useToken'
import SuccessfulModal from '../../components/Modals/SuccessModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiamondTurnRight, faEdit, faLock } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'

const Account = () => {
  const {t} = useTranslation()
  const {windowWidth} = useScreenSize()
  const { loading,user, updateProfile, getCurrentUser } = useAuth()
  const [profile, setProfile] = useState([])
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const { token } = useToken()
  useEffect(() => {
    if (user) {
      setProfile([
        { title: "name", infor: user.name, val: 'name', placeholder: 'username' },
        { title: "address", infor: user.address, val: 'address', placeholder: 'your address' },
        { title: "phone", infor: user.phone, val: 'phone', placeholder: 'your phone' },
        { title: "nationality", infor: user.nationality, val: 'nationality', placeholder: 'your nationality' },
      ])
    }
  }, [user, token])
  //profile 
  const [isUpdated, setIsUpdated] = useState(false)

  //change password
  const [showModalChangePassword, setShowModalChangePassword] = useState(false);

  const handleOpenModal = () => setShowModalChangePassword(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevState) =>
      prevState.map((item) => (item.val === name ? { ...item, infor: value } : item))
    );
    setIsUpdated(true)
  };

  const handleCheckStatus = (status, messageSuccess) => {
    if (status) {
      setMessage(messageSuccess)
      setShowModalChangePassword(false)
      setShowModalSuccess(true)

    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = profile.reduce((acc, item) => {
      acc[item.val] = item.infor ?? '';
      return acc;
    }, {});
    // Gửi formData đến API tại đây
    const response = await updateProfile(formData)
    if (response) {
      setStatus(true)
      setMessage('Your information changed')
      getCurrentUser()
      // Đóng modal sau 3 giây
      setTimeout(() => {
        
        setMessage('')
      }, 2000);
    }
    setIsUpdated(false)
  };
  return (
<Container className={` pt-5  overflow-x-hidden ${windowWidth > 768 ? 'm-5' : 'auth-container'}`}>
      {
        user
        &&
        <>
            <div className='d-flex justify-content-between align-items-center'>
        <h4 className='mb-4'>{t('account')}</h4>
        {user.role === "admin" &&
          <Link to="/admin/dashboard" className='p-1 shadow-sm bg-beige-light border border-darkcyan-normal rounded text-darkcyan-normal d-flex align-items-center justify-content-center'>
            <span>{t('goToDashboard')}</span>
            <FontAwesomeIcon icon={faDiamondTurnRight} className='mx-1' />
          </Link>
        }
      </div>
      <Form autoComplete='off'>
        <Form.Group as={Row} className="mb-3 mx-4 d-flex align-items-center">
          <Form.Label column sm="3" xs="12">
            {t('email')}:
          </Form.Label>
          <Col sm="6" xs="12">
          <Form.Control
            type="text"
            placeholder={user.email}
            name='email'
            onChange={handleChange}
            className='border-1 border-primary-normal'
            disabled
          />
          </Col>
        
        </Form.Group>

        <Form.Group as={Row} className="mb-3 mx-4 d-flex align-items-center">
          <Form.Label column sm="3" xs="12">
            {t('password')}:
          </Form.Label>
          <Col sm="6" xs="12">
          <Form.Control
            placeholder='*********'
            type='password'
             className='border-1 border-primary-normal'
            onClick={handleOpenModal}
            title={t('clickToChangePassword')}
          />
          </Col>
        
        </Form.Group>
      </Form>

      <Button
        title={t('clickToChangePassword')}
        onClick={handleOpenModal}
        className='rounded-2 bg-red-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
        <FontAwesomeIcon icon={faLock} className='me-2' />
        {t('changePassword')}
      </Button>

      {showModalSuccess && <SuccessfulModal message={message} show={showModalSuccess} handleClose={() => setShowModalSuccess(false)} />}
      {showModalChangePassword && <ChangePasswordModal show={showModalChangePassword} handleClose={() => setShowModalChangePassword(false)} handleShow={handleCheckStatus} />}
      
      <h4 className='mt-5 mb-4'>{t('personalData')}</h4>
      <Form onSubmit={handleSubmit}>
        {profile.map((item, index) => (
          <div key={index}>
            {item.val !== 'license' &&
              <Form.Group as={Row} className="mb-3 mx-4 d-flex align-items-center">
                <Form.Label column sm="3" xs="12">
                  {t(item.title)}:
                </Form.Label>
                <Col sm="6" xs="12">
                  <Form.Control
                    type="text"
                    placeholder={item.infor !== ' ' ? item.infor : item.placeholder}
                    name={item.val}
                    value={item.infor}
                    onChange={handleChange}
                    className='border-1 border-primary-normal'
                  />
                </Col>
              </Form.Group>
            }
          </div>
        ))}

        <div className='d-flex align-items-center '>
          <Button
            type="submit"
            disabled={!isUpdated}
            className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 '>
            <FontAwesomeIcon icon={faEdit} className='me-2' />
            {loading ? <Spinner size='sm' /> : t('updateInformation')}
          </Button>
          {status && message !== '' && <p className="text-success mx-4">{t('successMessage')}</p>}
        </div>
      </Form>

        </>
      }
    </Container>
  )
}

export default Account