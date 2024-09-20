import useAuth from '../../hooks/useAuth'
import { Button, ButtonGroup, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import {  useNavigate } from 'react-router-dom'

const LoginExpiredModal = ({show}) => {
  const {handleLogout, isLogin, handleIsExpired} = useAuth()

  const navigate = useNavigate()

  const handleLoginClick = async () => {    
    await handleLogout()
    handleIsExpired(false)
    navigate('/login')
  }
  const handleContinue = async () => {
    await handleLogout()
    handleIsExpired(false)
  }
  
  const handleHide = async () => {
    await handleLogout()
    handleIsExpired(true)
  }
  return (
    <Modal show={show} onHide={handleHide} centered>
        <Modal.Header closeButton className='border-0'>
          <Modal.Title className='text-color-black w-100 align-items-center'>
            <FontAwesomeIcon icon={faTriangleExclamation} className='text-yellow me-3 '/>
            Your session has expired
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Please log in again to continue using the app
        </Modal.Body> 
        <Modal.Footer className='border-0'>
         <ButtonGroup>
          
         <Button
         onClick={handleContinue}
          className='bg-white border-primary-normal text-color-black rounded mx-2 px-4 fw-semibold'>
            No, continue
          </Button>
         <Button
         onClick={handleLoginClick}
          className='bg-primary-dark border-primary-light px-4 rounded fw-semibold mx-2'>
            Login
          </Button>
         </ButtonGroup>
        </Modal.Footer>
      </Modal>
  )
}

export default LoginExpiredModal