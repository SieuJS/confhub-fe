import { useEffect, useState } from 'react'
import {Modal, Form, Button, Col, Spinner} from 'react-bootstrap'
import useAuth from '../../hooks/useAuth';
const ChangePasswordModal = ({ show, handleClose, handleShow }) => {
    const { loading, changePassword} = useAuth()
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(false)
    const [isMatch, setMatch] = useState(true)
    const [countdown, setCountdown] = useState(3);
    const [isClickedChange, setClickedChange] = useState(false)

  const handleChangePassword = async () => {    
    setClickedChange(true)
    if (oldPassword === '' || newPassword === '' || confirmNewPassword === '') {
      setMessage('Please enter your password');
      setMatch(false)
    }
    else if (newPassword !== confirmNewPassword) {
      setMessage('Password does not match');
      setMatch(false)
    } 
    else if (newPassword === oldPassword) {
      setMessage(`The new password cannot be the same as the old password.`);
      setMatch(false)
    }
    else {
      const responseData = await changePassword(oldPassword, newPassword)
      
      setMessage(responseData.message)  
      setStatus(responseData.status)
      if(responseData.status) {        
      // Thực hiện xử lý thay đổi mật khẩu ở đây
          setStatus(true)
          setMatch(true)      
          handleShow(true, responseData.message)
          setOldPassword('')
          setConfirmNewPassword('')
          setNewPassword('')
          setClickedChange(false)
          const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
              if (prevCountdown === 3) {
                clearInterval(countdownInterval);
                handleClose();
              }
              return prevCountdown - 1;
            });
          }, 3000);
        }
        else {        
        setMatch(true)      
        setMessage(responseData.message)
      }
    }
  };


  useEffect(()=>{
    setMessage('')
  },[oldPassword, newPassword, confirmNewPassword])
  
    
    return (
      <Modal 
        show={show} 
        onHide={handleClose}
        size='lg'
        centered
        >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100 fw-bold text-color-black">Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='px-5' autoComplete='off'>
            <Form.Group as={Col} className="my-4 d-flex align-items-center">
              <Form.Label column sm="4">Current password:</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                placeholder='Enter current password'
                autoComplete='off'
                autoSave='false'
                className={isClickedChange && isMatch && !status ? 'border border-danger' : 'border-blue-normal'}

                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="my-4 d-flex align-items-center">
              <Form.Label column sm="4">New password:</Form.Label>
              <Form.Control
                type="text"
                value={newPassword}
                autoComplete='new-password'
                placeholder='Enter new password'
                className={isClickedChange && isMatch && !status ? 'border border-danger' : 'border-blue-normal'}
                
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="my-4 d-flex align-items-center">
              <Form.Label column sm="4">Confirm new password:</Form.Label>
              <Form.Control
                type="password"
                value={confirmNewPassword}
                autoComplete='off'
                placeholder='Confirm your new password'
                className={isClickedChange && isMatch && !status ? 'border border-danger' : ' border-blue-normal'}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Form.Group>
            {message !== '' && !status && <p className='text-danger text-center '>{message}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
      
       
       <Button variant="secondary" onClick={handleClose} className='px-3 border border-light'>
          Cancel
        </Button>
        <Button onClick={handleChangePassword} className='bg-primary-dark text-light border border-primary-light px-3'>
          {
            loading?
            <Spinner animation="border" size="sm" />
            :
            'Change Password'
          }
        </Button>
        </Modal.Footer>
       
      </Modal>
    );
  };

export default ChangePasswordModal