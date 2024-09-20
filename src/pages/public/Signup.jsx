import { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col, InputGroup } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import Loading from '../../components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'

const Signup = () => {
    const {t} = useTranslation()
    const {windowWidth} = useScreenSize()
    const { loading, handleRegister, handleLogin } = useAuth()
    const [account, setAccount] = useState({
        email: "",
        password: "",
        confirm: "",
    })
    const [showpassword, setShowPassword] = useState(false)
    const [showpConfirmassword, setShowConfirmPassword] = useState(false)
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState(false)
    const [error, setError] = useState(null);
    const [isSignup, setIsSignup] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        if (message !== null && message !== undefined) {
          const timer = setTimeout(() => {
            setMessage('');
          }, 5000); 
    
          return () => clearTimeout(timer); // Cleanup timer if value changes or component unmounts
        }
      }, [message]);
    const handleInputChange = (event) => {
        const value = { ...account, [event.target.name]: event.target.value }
        setAccount(value)
    }
    const validateForm = () => {
        for (let key in account) {
          if (!account[key]) {
            return `${key} cannot be empty.`;
          }
        }
        if (account.password !== account.confirm) {
          return "Passwords do not match.";
        }
        return null;
      };
    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSignup(true)

        const errorMsg = validateForm();
        if (errorMsg) {
        setError(errorMsg);
        return;
        } else {
        setError(null);
        
        const result = await handleRegister(account.email, account.password, account.phone)
        
        setStatus(result.status)
        setMessage(result.message)

        if(result.status){
            setIsSignup(false)
            handleLogin(account.email, account.password)            
        }
        }

    }
    const chooseLogin = () => {
        navigate('/login')
    }
    const toggleShowPassword = () => {
        setShowPassword(!showpassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showpConfirmassword);
    };
    return (
        <Container className={` text-center 
            ${windowWidth > 768 ? '100-h min-vh-100 d-flex justify-content-center align-items-center ': 'vh-100 100-h pt-5'}
    `} fluid={true} style={{ backgroundColor: "#C2F1EB" }} >
            <Row className={`bg-white rounded-4 d-flex box-area mx-auto ${windowWidth > 768 ? 'w-75 h-50' : 'h-100'} `}>
             {
                windowWidth > 768 &&
                <Col sm={4} xs={12} className='d-flex flex-column align-items-center justify-content-center rounded-start-4 text-light' style={{ backgroundColor: "#419489" }}>
                <span className='h1 fw-bold my-2'>Hello!</span>
                <span className='w-75 fs-5'>{t('description_signup')}</span>
                <div className=' border border-1 p-2 mt-5 border-white rounded-2'>
                    <Link to='/' className='fs-6 text-light'>  {"<  "}{t('back_to_homepage')}</Link>
                </div>
            </Col>
             }
                 <Col 
                className={`p-1 d-flex flex-column align-items-center justify-content-center bg-skyblue-light
                    ${windowWidth > 768 ? 'rounded-start-4': 'rounded-4 pt-5 w-100'}
                `} >

                    <Form className='w-100 p-5  '> 
                        <h1 className='mb-4 fw-bold' style={{ fontSize: "30px", color: "#419489" }}>{t('create_account')}</h1>
                        
                    
                        
                        <Form.Group className="mb-3 text-start">
                            <Form.Label htmlFor="inputPassword5" className='text-color-black'>Email</Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                value={account.email}
                                placeholder="name@example.com"
                                onChange={handleInputChange}
                                required
                                className="border-0 shadow-sm rounded-2 px-3 py-2"
                            />
                        </Form.Group>
                       
                        <Form.Group className="my-3 text-start">
                            <Form.Label htmlFor="inputPassword5" className='text-color-black'>{t('password')}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showpassword ? "text" : "password"}
                                    value={account.password}
                                    name="password"
                                    placeholder={t('password')}
                                    onChange={handleInputChange}
                                    required
                                    className="border-0 shadow-sm rounded-start-2 px-3 py-2"

                                />
                                <InputGroup.Text onClick={toggleShowPassword} className='border-0 bg-white rounded-end shadow-sm '>
                                    {showpassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                </InputGroup.Text>

                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="my-3 mb-4 text-start">
                            <Form.Label htmlFor="inputPassword5" className='text-color-black'>{t('confirm_password')}</Form.Label>
                          
                             <InputGroup>
                                <Form.Control
                                    type={showpConfirmassword ? "text" : "password"}
                                    value={account.confirm}
                                    name="confirm"
                                    placeholder={t('confirm_password')}
                                    onChange={handleInputChange}
                                    required
                                    className="border-0 shadow-sm rounded-start-2 px-3 py-2"

                                />
                                <InputGroup.Text onClick={toggleShowConfirmPassword} className='border-0 bg-white rounded-end shadow-sm'>
                                    {showpConfirmassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                </InputGroup.Text>

                            </InputGroup>
                        </Form.Group>
                        {
                            !status && message !== '' && <p className="text-danger">{message}</p>
                        }
                        <Button
                            onClick={handleSignup}
                            className='border-0 fw-bold rounded-3 p-2'
                            style={{ width: "140px", fontSize: "20px", backgroundColor: "#419489" }}>
                            {
                                loading
                                    ?
                                    <Loading />
                                    :
                                   `${t('signup')}`                            }
                        </Button>
                        <div className="my-3  mx-5 d-flex align-items-center justify-content-center text-nowrap">
                            <span htmlFor="#signup">{t('already_have_account')}</span>
                            <Button
                                className='bg-transparent border-0 fw-bold'
                                style={{ fontSize: "20px", color: "#419489" }}
                                onClick={chooseLogin}>
                                <span>{t('login')}</span>
                            </Button>
                        </div>
                       
                    </Form>
                    {
                        windowWidth < 768 &&
                        <div className=' border border-1 p-2 mt-5 border-white rounded-2'>
                        <Link to='/' className=''>  {"<  "}{t('back_to_homepage')}</Link>
                    </div>
                    }
                </Col>

            </Row>
        </Container>
    )
}

export default Signup