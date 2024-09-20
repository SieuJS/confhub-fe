import { useEffect, useState } from 'react'
import { Button, Col, Form, Image, Row } from 'react-bootstrap'
import RateConference from './RateConference';
import useLocalStorage from '../../hooks/useLocalStorage';

import AvatarIcon from '../../assets/imgs/avatar.png'
import Loading from '../Loading';
import { useTranslation } from 'react-i18next';
const InputFeedback = ({ defaultValue, onClick, onCheck, id, cfpid, onReloadList }) => {
    const {t} = useTranslation()
    const { user } = useLocalStorage()
    const [feedback, setFeedback] = useState(defaultValue? defaultValue.content:'')
    const [rating, setRating] = useState(defaultValue? defaultValue.rating: 5)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const handleSubmit = async () => {
        setLoading(true)
        if (user || localStorage.getItem('user')) {
            if (feedback !== '') {
                // Gửi feedback qua API ở đây
                const res = await onClick(id, feedback, rating)
               
                setLoading(false)
                // Reset ô nhập feedback sau khi gửi
                if (res.status) {
                    setFeedback('');
                    onReloadList()
                    if(onCheck){
                        onCheck()
                    }
                    setMessage('')
                    setRating(5)
                }
                else {
                    setMessage('Something wrong! Try again or refresh page')
                    setError(true)
                    setLoading(false)
                }
            }
            else {
                setError(true)
                setLoading(false)
            }
        }
        else {
            setLoading(false)
            alert(`${t('pleaseLogInToLeaveFeedback')}`)
        }
    };

    const handleInputChange = (e) => {
        setFeedback(e.target.value)
        setError(false)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setError(false);
        }, 5000);

        // Hủy bỏ timer khi component unmount
        return () => clearTimeout(timer);
    }, [error]); // Chạy effect chỉ một lần khi component mount

    return (
        <div className='w-100 d-flex align-items-center justify-content-start mt-3'>
            <div className='h-100 align-self-start'>
                <Image src={AvatarIcon} className='me-3' width={30} />
            </div>

            <div className='w-100 my-1'>
                <span className=' fw-semibold'>{user && user.name && user.name !== ' ' ? user?.name : user?.email}</span>
                <Form className='my-1'>
                    <Form.Group className=' border rounded'>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={feedback}
                            onChange={e => handleInputChange(e)}
                            placeholder={t('feedbackPlaceholder')}
                            required={true}
                            className={error ? 'border-danger' : 'border-0'}
                        />
                        {error && <p className='text-danger'>{t('input_feedback')}</p>}
                        <Row className="text-end m-2 mx-3 d-flex justify-content-between align-items-center">

                            <Col>
                            <RateConference rating={rating} setRating={setRating} />
                            </Col>
                            <Col >
                                {error && message !== '' && <p className='text-danger'>{message}</p>}
                                {
                                    onCheck && <Button className='bg-secondary border-light mx-2 px-4' onClick={onCheck}>
                                        {t('cancel')}
                                    </Button>
                                }
                                <Button className='bg-primary-dark border-light  px-4' onClick={handleSubmit} title='Post your feedback'>
                                    {
                                        loading ? <Loading size={'sm'}/> : <>{t('post')}</>
                                    }
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>

                </Form>
            </div>
        </div>
    )
}

export default InputFeedback