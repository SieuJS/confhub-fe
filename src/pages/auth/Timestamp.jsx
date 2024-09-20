
import { Col, Container, Form, Row } from 'react-bootstrap';
import useNote from '../../hooks/useNote';
import useFollow from '../../hooks/useFollow';
import EventCalendar from '../../components/Calendar/EventCalendar';
import UpcomingNote from '../../components/Calendar/UpcomingNote';
import Loading from '../../components/Loading';
import { useTranslation } from 'react-i18next';
import useScreenSize from '../../hooks/useScreenSize';

const Timestamp = () => {
  const {t} = useTranslation()
  const {windowWidth} = useScreenSize()
  const { loading, notes, getAllNotes} = useNote()  
  
  return (
    <Container className={` pt-5  overflow-x-hidden ${windowWidth > 768 ? 'm-5' : 'auth-container'}`}>
        <h4 className='mb-3'>{t('note')}</h4>

        <h6 className=''>{t('note_page_description')}</h6>  
      <Row className='w-100'>
        {
          loading
          ?
          <div className="w-100"></div>
          :          
          <UpcomingNote/>
        }
      </Row>
      <Row className='mt-5'>
        <Col xs="12" lg="9" md="9">          
        {
          loading
          ?
          <Loading onReload={getAllNotes}/>
          :
          <>
          <EventCalendar notes={notes}/>
          </>
        }
        </Col>
        <Col xs="12" lg="3" md="3"  className='ps-3 mb-5'>          
          <div className='ms-1 mt-3'>
            <h5>{t('calendar_notes')}</h5>
            <Row className='align-items-center'>
              <div className="bg-red-normal me-2 my-2 fs-6 rounded-1" style={{width: "20px", height: "20px"}}></div>
              Submission date
            </Row>
            <Row className='align-items-center'>
              <div className="bg-blue-normal me-2 my-2 rounded-1" style={{width: "20px", height: "20px"}}></div>
              Notification date
            </Row>
            <Row className='align-items-center'>
              <div className="bg-teal-normal me-2 my-2 rounded-1" style={{width: "20px", height: "20px"}}></div>
              Camera ready date
            </Row>
            <Row className='align-items-center'>
              <div className="bg-yellow-normal me-2 my-2 rounded-1" style={{width: "20px", height: "20px"}}></div>
              Conference date
            </Row>
            <Row className='align-items-center'>
              <div className="bg-skyblue-normal me-2 my-2 rounded-1" style={{width: "20px", height: "20px"}}></div>
              Your note
            </Row>
          </div> 

        </Col>
      </Row>
    </Container>
  )
}

export default Timestamp