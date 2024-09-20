import { useEffect, useState } from 'react'
import { Container, InputGroup, Button, Form, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

import ChangePasswordModal from '../../components/Modals/ChangePasswordModal'
import useLocalStorage from '../../hooks/useLocalStorage'
import useToken from '../../hooks/useToken'
import SuccessfulModal from '../../components/Modals/SuccessModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faLock } from '@fortawesome/free-solid-svg-icons'
const AdminAccount = () => {
  const { updateProfile } = useAuth()
  const [profile, setProfile] = useState([])
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [message, setMessage] = useState('')
  const { user } = useLocalStorage()
  const { token } = useToken()
  useEffect(() => {
    if (user) {
      setProfile([
        { title: "Name", infor: user.name, val: 'name', placeholder: 'username' },
        { title: "Phone", infor: user.phone, val: 'phone', placeholder: 'phone number' },
        { title: "Address", infor: user.address, val: 'address', placeholder: 'your address' },
        { title: "Nationality", infor: user.nationality, val: 'nationality', placeholder: 'your nationality' },
      ])
    }
  }, [user, token,])
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
      setShowModalSuccess(true)
      setMessage('Your information changed')
      // Đóng modal sau 3 giây
      setTimeout(() => {
        //  window.location.reload()
      }, 2000);
    }
    setIsUpdated(false)
  };
  return (
    <Container
      fluid
      className='pt-5' style={{ marginLeft: "350px", marginTop: "60px" }}>
      {
        user
        &&
        <>
          <div className='d-flex justify-content-between align-items-center pe-5'>
            
           
          </div>

          <Form.Group as={Col} className="mb-3 mx-4 d-flex align-items-center">
            <Form.Label column sm="3">
              Email:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={user.email}
              name='email'
              onChange={handleChange}
              className='border-1 border-primary-normal w-25'
              disabled
            />
          </Form.Group>

          <Form.Group as={Col} className="mb-3 mx-4 d-flex align-items-center">
            <Form.Label column sm="3">
              Password:
            </Form.Label>
            <Form.Control
              placeholder='*********'
              type='password'
              className='rounded-2 p-1 text-center border-1 border-primary-normal w-25'
            />
          </Form.Group>


          <Button
            onClick={handleOpenModal}
            className='rounded-2 bg-red-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
            <FontAwesomeIcon icon={faLock} className='me-2' />
            Change password
          </Button>

          {showModalSuccess && <SuccessfulModal message={message} show={showModalSuccess} handleClose={() => setShowModalSuccess(false)} />}
          {showModalChangePassword && <ChangePasswordModal show={showModalChangePassword} handleClose={()=>setShowModalChangePassword(false)} handleShow={handleCheckStatus} />}
          <h4 className='mt-5 mb-4'>Personal Data</h4>
          <Form onSubmit={handleSubmit}>
            {
              profile.map((item, index) => (
                <div key={index}>
                  {
                    item.val !== 'license'
                    &&
                    <Form.Group as={Col} className="mb-3 mx-4 d-flex align-items-center">
                      <Form.Label column sm="3">
                        {item.title}:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={item.infor !== ' ' ? item.infor : item.placeholder}
                        name={item.val}
                        value={item.infor}
                        onChange={handleChange}
                        className='border-1 border-primary-normal'
                      />
                    </Form.Group>
                  }
                </div>
              ))
            }

            <Button
              type="submit"
              disabled={!isUpdated}
              className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
              <FontAwesomeIcon icon={faEdit} className='me-2' />
              Update changes
            </Button>
           <div className='border-5 border-start'>
             <h4>all conference</h4>
           </div>
          </Form>

        </>
      }
    </Container>
  )
}

export default AdminAccount