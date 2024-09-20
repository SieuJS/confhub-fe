import useNote from '../../hooks/useNote'
import { isUpcoming } from '../../utils/sortConferences'
import { Card, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay, faClock, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import CountdownTimer from './CountdownTimer';

const UpcomingNote = () => {
    const { t } = useTranslation()
    const { notes } = useNote()
    const checkRenderEnddate = (start, end) => {
        return end !== null && start !== null && start !== end
    }
    const daysUntilTargetDate = (targetDate) => {
        const today = new Date();
        const daysDifference = Math.floor((new Date(targetDate) - today) / (1000 * 60 * 60 * 24));
        return daysDifference + 1;
    }
    const navigate = useNavigate()

    const handleNavigateUpcomingConference = async (id) => {
        navigate(`/detailed-information/${id}`)
    }

    const sortedNotes = [...notes].sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateA - dateB;
    });

    return (
        <div className='w-100'>
            {notes?.length > 0 &&
                <h5 className='text-danger-emphasis mt-3'>{t('upcoming_note')}</h5>}

            <div className='d-flex overflow-x-auto overflow-y-hidden'>

                {
                    notes &&
                    <>
                        {
                            sortedNotes.map((note, index) => (
                                <>
                                    {
                                        isUpcoming(note.start_date) &&

                                        <Card key={index} className='rounded-2 m-2' style={{ width: "230px", minWidth: "330px" }}>
                                            <Card.Body className='pb-0'>
                                                <div className='d-flex flex-column'>
                                                    <span className='fw-semibold text-teal-normal fs-6'>{`${note.date_type}`}</span>
                                                    <span className='text-truncate d-inline-block fs-medium'>
                                                        {
                                                            `${note.subStyle === 'note-event'
                                                                ? `${t('your_note')}: ${note.note}` : `${t('conference')}: ${note.acronym}`} `
                                                        }
                                                    </span>
                                                </div>
                                                <p className='text-color-black m-0'>
                                                    {
                                                        note.location !== null && note.location !== '' &&

                                                        <>
                                                            <FontAwesomeIcon icon={faLocationPin} className='text-teal-normal' />
                                                            {` ${note.location}`}
                                                        </>
                                                    }

                                                </p>
                                                <div>
                                                        <div>
                                                            {checkRenderEnddate(note.start_date, note.end_date) ?
                                                                <>
                                                                  <div>
                                                                      <FontAwesomeIcon icon={faCalendarDay} className='text-teal-normal me-1' />
                                                                            <span className="text-color-black fw-bold">
                                                                                {moment(note.start_date).format('ddd, YYYY/MM/DD')}
                                                                            </span>
                                                                            <span>{` - `}</span>
                                                                            <span className="text-color-black fw-bold">
                                                                                {moment(note.end_date).format('ddd, YYYY/MM/DD')}
                                                                            </span>
                                                                  </div>
                                                                </>
                                                                :
                                                                <>
                                                                    {
                                                                        note.start_date !== null
                                                                        &&
                                                                        <div className="d-flex flex-column">
                                                                            <span className="text-color-black fw-bold">
                                                                                {moment(note.start_date).format('dddd, YYYY/MM/DD')}
                                                                            </span>
                                                                        </div>
                                                                    }
                                                                </>
                                                            }
                                                        </div>


                                                </div>


                                            </Card.Body>
                                            <Card.Footer className=' bg-skyblue-light d-flex justify-content-between align-items-center'>
                                                <>
                                                    {
                                                        note.start_date !== null &&
                                                        <div className='text-danger fw-semibold m-0 d-flex align-items-center'>
                                                            <FontAwesomeIcon icon={faClock} className='me-2 fs-5' />
                                                            <CountdownTimer targetDate={note.start_date}/>
                                                        </div>
                                                    }
                                                </>
                                                {
                                                    note.conf_id !== null &&
                                                    <Button
                                                        onClick={() => handleNavigateUpcomingConference(note.conf_id)}
                                                        className=' bg-transparent border-0 text-decoration-underline text-skyblue-dark p-0 btn-noti-more'
                                                        title={t('more_details_title')}
                                                    >
                                                        {`${t('more_details')} >`}
                                                    </Button>
                                                }
                                            </Card.Footer>
                                        </Card>
                                    }
                                </>
                            ))
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default UpcomingNote