
import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { Button, ButtonGroup } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import DeleteModal from '../Modals/DeleteModal'
import Loading from '../Loading'
import { useEffect } from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faLink, faLocationPin } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const DetailInforNoteModal = ({ show, onClose, note, onDelete, onUpdate, onReloadList }) => {
    const {t} = useTranslation()
    const [isUpdate, setIsUpdate] = useState(false)
    const [warning, setWarning] = useState('')
    const [inputvalue, setInputValue] = useState('');
    const [autoClose, setAutoCLose] = useState(3)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [isInputUpdate, setIsInputUpdate] = useState(false)

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(false)
    const [error, setError] = useState(false)
    const [statusUpdate, setStatusUpdate] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (statusUpdate) {

            const timer = setInterval(() => {
                setAutoCLose(prevCountdown => prevCountdown - 1);
            }, 1000);

            // Đóng modal sau 5 giây
            setTimeout(() => {
                onClose()
                setAutoCLose(4); // Reset thời gian đếm ngược
            }, 3000);

            // Hủy bỏ timer khi component unmount
            return () => {
                clearInterval(timer);
            };
        }
    }, [statusUpdate]);

    const handleGotoCfp = async (id) => {
        navigate(`/detailed-information/${id}`)
    }
    const handleChooseUpdate = () => {
        setIsInputUpdate(!isInputUpdate)
        setWarning('')
    }
    const handleInputChange = (val) => {
        setInputValue(val)
    }
    const handleUpdate = async () => {
        try {
            if (inputvalue !== '') {
                const id = note.id
                setLoading(true)
                setIsUpdate(true)
                setWarning('')
                const { status, message } = await onUpdate(id, inputvalue)
                if (status) {
                    setIsInputUpdate(false)
                    setStatusUpdate(status)
                    setMessage(message)
                    setLoading(false)
                    onReloadList()
                }
                else {
                    setMessage(message)
                    setError(true)
                    setInputValue('')
                }
            }
            else setWarning(`${t('required_note_input')}`)

        } catch (error) {
            console.error('Error:', error);

        }
    }

    const checkRenderEnddate = (start, end) => {
        return end !== null && start !== null && start !== end
    }

    const handleDelete = async () => {
        try {
            setIsUpdate(true)
            const { status, message } = await onDelete(note.id);
            if (status) {
                onReloadList()
                onClose()
            }
            else {
                setMessage(message)
                setError(true)
                setStatusUpdate(false)
                setIsUpdate(false)
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>

            </Modal.Header>
            <Modal.Body>
                <p className="text-teal-normal fw-bold fs-4 my-3">
                    {note.date_type}
                </p>

                {
                    note.subStyle !== 'note-event'
                    &&
                    <div className="my-3 fs-5">
                        <span className="text-color-medium ">{`${t('conference')}: `}</span>
                        <span className='fw-semibold'> {`${note.acronym}`}</span>
                    </div>
                }
                
                {
                    note.location
                        ?
                        <>
                            {
                                note.subStyle !== 'note-event' &&
                                <p className='text-color-black my-3 fs-5'>
                                    <FontAwesomeIcon icon={faLocationPin} className='text-teal-normal me-2' />
                                    {` ${note.location}`}
                                </p>
                            }
                        </>
                        :
                        <p></p>
                }

                <p className='text-color-black my-3 fs-5'>
                    <FontAwesomeIcon icon={faCalendar} className='text-skyblue-dark me-3' />
                    {checkRenderEnddate(note.start_date, note.end_date) ?
                        <>

                            <span className="text-color-black fw-semibold">
                                {moment(note.start_date).format('ddd, YYYY/MM/DD')}
                            </span>
                            <span>{` to `}</span>
                            <span className="text-color-black fw-semibold">
                                {moment(note.end_date).format('ddd, YYYY/MM/DD')}
                            </span>
                        </>
                        :
                        <>
                            {
                                note.start_date !== null
                                &&
                                <span className="text-color-black fw-semibold">
                                    {moment(note.start_date).format('dddd, YYYY/MM/DD')}
                                </span>
                            }
                        </>
                    }


                </p>
                {
                    isInputUpdate ?
                        <>
                            <Form onSubmit={handleUpdate}>
                                <Form.Group className='d-flex align-items-start'>
                                    <Form.Label className='text-nowrap'>{t('note')}:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={note.note}
                                        value={inputvalue}
                                        onChange={(event) => handleInputChange(event.target.value)}
                                        className='border-0 border-bottom ms-3 p-1'
                                        autoFocus={true}

                                        as="textarea"
                                        rows={4}
                                    />
                                </Form.Group>


                            </Form>
                        </>
                        :
                        <>
                            <div className='d-flex '>
                                <span className='text-nowrap'>{t('note')}:</span>
                                <Form.Control
                                    type="text"
                                    placeholder={note.note !== '' && note.note !== 'default' ? note.note : `${t('enter_your_note')}...`}
                                    onClick={handleChooseUpdate}
                                    className='border-0 border-bottom ms-3 p-1'
                                />
                            </div>
                        </>
                }

                {
                    note.subStyle !== 'note-event' &&
                    <p className='text-color-black my-3'>
                    <FontAwesomeIcon icon={faLink} className='text-teal-normal me-2' />
                    <Button
                        onClick={() => handleGotoCfp(note.conf_id)}
                        className='btn-noti-more text-decoration-underline text-primary border-0 bg-transparent p-0 m-0'>
                        {t('more_details')}
                    </Button>
                </p>
                }

                {
                    showConfirmDelete &&
                    <DeleteModal
                        show={showConfirmDelete}
                        onClose={() => setShowConfirmDelete(false)}
                        onConfirm={handleDelete}
                        message={'note'}
                    />
                }
            </Modal.Body>
            <Modal.Footer>
                {warning !== '' && <p className="text-warning text-center">{warning}</p>}
                {error && <p className="text-danger text-center">{message}</p>}
                {!error && isUpdate && <p className="text-success text-center">{message}</p>}
                <ButtonGroup className='w-100'>
                    {
                        isInputUpdate ?
                            <>
                                <Button className='bg-secondary border-light ms-1 rounded' onClick={handleChooseUpdate}>
                                    {t('cancel')}
                                </Button>

                                <Button className='bg-primary-normal border-light ms-1 rounded' onClick={handleUpdate}>
                                    {loading ? <Loading onReload={handleUpdate} /> : 'Submit'}
                                </Button>
                            </>
                            :
                            <>
                                <Button className='bg-red-normal border-light me-1 rounded' onClick={() => setShowConfirmDelete(true)}>
                                    {t('delete')}
                                </Button>
                                <Button className='bg-skyblue-dark border-light ms-1 rounded' onClick={handleChooseUpdate}>
                                    {t('update')}
                                </Button>
                            </>
                    }
                </ButtonGroup>
                {isUpdate && statusUpdate && (
  <div className={statusUpdate ? 'text-success' : 'text-danger'}>
    <span className='text-success'>{t('success')}</span>. {t('closing_countdown', { countdown: autoClose })}
  </div>
)}

            </Modal.Footer>

        </Modal>
    )
}

export default DetailInforNoteModal