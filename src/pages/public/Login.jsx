import { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col,  InputGroup } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import Loading from '../../components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
import GoogleLoginButton from '../../components/ButtonLoginWithGoogle/GoogleLoginButton'
const Login = () => {
    const {t} = useTranslation()
    const {windowWidth} = useScreenSize()
    const { loading, handleLogin, message: messageGoogle } = useAuth();
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState(false)
    const [error, setError] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false)
    const [account, setAccount] = useState({
        email: "",
        password: "",
    })
    const [showpassword, setShowPassword] = useState(false)
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
        if (account.password === '') {
            return "Passwords cannot be empty.";
        }
        return null;
    };
    const handleSubmit = async (e) => {
        e.preventDefault()

        setIsSubmit(true)
        const errorMsg = validateForm();
        if (errorMsg) {
            setError(errorMsg);
            return;
        } else {
            setError(null);
            const result = await handleLogin(account.email, account.password)
            
            setStatus(result.status)
            setMessage(result.message)

            if (result.status) {
                setIsSubmit(false)
                handleLogin(account.email, account.password)
            }
        }

    }
    const chooseSignup = () => {
        navigate('/signup')
    }
    const toggleShowPassword = () => {
        setShowPassword(!showpassword);
    };
    return (
        <Container className={` text-center 
                ${windowWidth > 768 ? '100-h min-vh-100 d-flex justify-content-center align-items-center ': 'vh-100 100-h pt-5'}
        `} fluid={true} style={{ backgroundColor: "#C2F1EB" }} >
            <Row className={`bg-white rounded-4 d-flex box-area mx-auto ${windowWidth > 768 ? 'w-75 h-50' : 'h-100'} `}>

                <Col  sm={7} md={7} lg={7} 
                className={`p-1 d-flex flex-column align-items-center justify-content-center bg-skyblue-light
                    ${windowWidth > 768 ? 'rounded-start-4': 'rounded-4'}
                `} >

                    <Form className='w-100 p-5'>
                        <h1 className='mb-4 fw-bold' style={{ fontSize: "30px", color: "#419489" }}>{t('login')}</h1>
                        <GoogleLoginButton/>
                        <div className='d-flex flex-row align-items-center'>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'gray' }} />

                            <div><p className='pt-3 mx-3 text-secondary-emphasis'>{t('or_login_account')}</p></div>

                            <div style={{ flex: 1, height: '1px', backgroundColor: 'gray' }} />
                        </div>
                        <Form.Group className="mb-3 text-start">
                            <Form.Label htmlFor="inputPassword5" style={{ fontSize: "20px", color: "#434343" }}>Email</Form.Label>
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
                        <Form.Group className="mb-4 text-start">
                            <Form.Label htmlFor="inputPassword5" style={{ fontSize: "20px", color: "#434343" }}>{t('password')}</Form.Label>
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
                        
                        {
                            isSubmit && error && <p className="text-warning">{error}</p>
                        }
                        {
                            !status && message !== '' && <p className="text-danger">{message}</p>
                        }

{
                            messageGoogle !== '' && <p className="text-danger">{messageGoogle}</p>
                        }
                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            

                            <Button
                                onClick={handleSubmit}
                                className='border-0 fw-bold rounded-4 p-2'
                                style={{ width: "140px", fontSize: "20px", backgroundColor: "#419489" }}>

                                {
                                    isSubmit && loading ?
                                        <Loading />
                                        :
                                        `${t('login')}`
                                }
                            </Button>
                        </div>
                        <div className="my-3 mx-3 d-flex align-items-center justify-content-center">
                            <span htmlFor="#signup">{t('dont_have_account')}</span>
                            <Button
                                className='bg-transparent border-0 fw-bold p-0 m-0 w-25 text-nowrap'
                                style={{ fontSize: "20px", color: "#419489" }}
                                onClick={chooseSignup}>
                                    {t('signup')}
                            </Button>
                        </div>
                        {
                        windowWidth < 768 &&
                        <div className=' border border-1 p-2 mt-5 border-white rounded-2'>
                        <Link to='/' className=''>  {"<  "}{t('back_to_homepage')}</Link>
                    </div>
                    }
                    </Form>
                    
                </Col>
                {
                    windowWidth > 768 &&
                    <Col className='d-flex flex-column align-items-center justify-content-center rounded-end-4 text-light' style={{ backgroundColor: "#419489" }}>
                    <span className='h1 mb-2'>Welcome Back!</span>
                    <span className='mt-3'>{t('description_login')}</span>

                    <div className=' border border-1 p-2 mt-5 border-white rounded-2'>
                        <Link to='/' className='fs-6 text-light'>  {"<  "}{t('back_to_homepage')}</Link>
                    </div>
                </Col>
                }
               
            </Row>

        </Container>
    )
}

export default Login