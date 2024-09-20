import  { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import useAdmin from '../../hooks/useAdmin'
import { useNavigate, useParams } from 'react-router-dom'
import DeleteModal from '../Modals/DeleteModal'
import { useTranslation } from 'react-i18next'

const ButtonGroupActive = ({ conference }) => {
    const {t} = useTranslation()
    const { loading, activePost, deactivePost, deletePost, getPendingConfById, getAllPendingConferences } = useAdmin()
    const [loadingActive, setLoadingActive] = useState(false);
    const [loadingDeactive, setLoadingDeactive] = useState(false);
    const [status, setStatus] = useState(null); // null, 'success', 'error'
    const [message, setMessage] = useState('');
    const [isActived, setActived] = useState(false)
    const [isDeleteed, setDeleteed] = useState(false)
    const [loadingConf, setLoadingConf] = useState(true)

    const [showDeleteConf, setShowDelete] = useState(false)
    const [countdown, setCountdown] = useState(2);
    const [isConfirm, setIsConfirm] = useState(false)
    const navigate = useNavigate()
    const id = useParams()
    useEffect(() => {
        const fetchData = async () => {
            await getPendingConfById(id.id)
            setLoadingConf(false)
        }
        if (!conference) {
            fetchData()
        }
        else setLoadingConf(false)
    }, [id])

    useEffect(() => {
        const fetchData = async () => {
            await getPendingConfById(conference.id)
            setLoadingConf(false)
        }
        if (conference) {
            fetchData()
        }
        setTimeout(() => {
            setMessage('');
            setStatus(false);
        }, 5000); // Hide message after 5 seconds
    }, [status]);

    const handleActive = async () => {
        setLoadingActive(true);
        setStatus(null);

        try {
            const response = await activePost(conference.id)
            setLoadingActive(false);
            setStatus(response.status)
            setMessage(response.message || 'Something went wrong!')
            setActived(true)
            setDeleteed(false)
        } catch (error) {
            setStatus('error');
            setMessage('Network error');
        }

    };
    const handleDeactive = async () => {
        setLoadingDeactive(true);
        setStatus(null);

        try {
            const response = await deactivePost(conference.id)
            setLoadingDeactive(false);
            setStatus(response.status)
            setMessage(response.message || 'Something went wrong!')
            setActived(true)
            setDeleteed(false)
        } catch (error) {
            setStatus('error');
            setMessage('Network error');
        }

    };
    const handleClose = () => {
        setShowDelete(false);
        setStatus(null);
        setMessage('');
        setCountdown(3);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsConfirm(true)
        const result = await deletePost(conference.id);
        setStatus(result.status);
        setMessage(result.message);
        if (result.status) {
            getAllPendingConferences()
            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown === 0) {
                        clearInterval(countdownInterval);
                        handleClose();
                        navigate('/admin/conferences_management')
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000); // Giảm mỗi 1 giây
        }
    };

    return (
        <div >
            <div className='mb-1'>
                {status && isActived && message !== '' && (
                    <div className="mt-2 mx-2 text-success">
                        {message}
                    </div>
                )}
                {status && isConfirm && message !== '' && (
                    <div className="mt-2 mx-2 text-success">
                        {message}
                    </div>
                )}
                {status && isDeleteed && message !== '' && (
                    <div className="mt-2 mx-2 text-danger">
                        {message}
                    </div>
                )}
            </div>
            {showDeleteConf &&
                <DeleteModal
                    show={showDeleteConf}
                    onClose={() => setShowDelete(!showDeleteConf)}
                    onConfirm={handleDelete}
                    modalTitle={'conference'}
                    message={message}
                    status={status}
                    loading={loading}
                    countdown={countdown}
                    isConfirm={isConfirm}
                />}
           <div className="d-flex align-items-center custom-active-btn"> 
           {
                (conference || !loadingConf) && (
                    <>
                        {
                            conference?.information?.status ? (
                                <Button
                                    onClick={handleDeactive}
                                    className='mx-3 px-4 bg-teal-normal'
                                >
                                    {loadingDeactive ? (
                                        <Spinner size='sm' />
                                    ) : (
                                        <>
                                           {t('deactive')}
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleActive}
                                    className='mx-3 px-4 bg-darkcyan-normal'
                                    disabled={!conference}
                                >
                                    {loadingActive ? (
                                        <Spinner size='sm' />
                                    ) : (
                                        <>
                                             {t('active')}
                                        </>
                                    )}
                                </Button>
                            )
                        }

                        <Button
                            disabled={!conference}
                            className="mx-3 px-4 bg-red-normal border-light"
                            onClick={handleDelete}
                        >
                            {(loading && isConfirm) ? (
                                <Spinner size='sm' />
                            ) : (
                                <>
                                     {t('delete')}
                                </>
                            )}
                        </Button>
                    </>
                )
            }
           </div>
            
        </div>

    )
}

export default ButtonGroupActive