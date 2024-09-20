import { useEffect, useRef, useState } from 'react'
import useConference from '../../hooks/useConferences'
import useSuggest from '../../hooks/useSuggest'
import { Button, Carousel, Col, Container, Row } from 'react-bootstrap'
import './custom_suggest.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faClock } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'

const SuggestedCarousel = () => {
  const { conference, conferences, getAllConferences } = useConference()
  const {windowWidth} = useScreenSize()
  const { findSimilarConferences } = useSuggest()
  const [displayConferences, setDisplayConferences] = useState([])
  const carouselRef = useRef(null); // Ref cho Carousel
  const navigate = useNavigate();
  const {t} = useTranslation()

  useEffect(() => {
    const getData = async () => {
      if (conferences.length <= 0) {
        await getAllConferences()

      }
    }
    getData()
  }, [])

  useEffect(() => {
    const data = findSimilarConferences(conferences, conference)
    setDisplayConferences(data)
  }, [conference, conferences])

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev(); // Gọi phương thức prev của Carousel
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next(); // Gọi phương thức next của Carousel
    }
  };
  const chooseConf = async (e, id) => {
    e.preventDefault()
   
    // Cập nhật URL với trang mới
    navigate(`/detailed-information/${id}`)
    window.location.reload()
  }
  // Hàm render danh sách hội nghị thành các items chứa 4 hội nghị mỗi item
  const renderConferenceItems = () => {
    const items = [];
    const step = windowWidth <= 768 ? 1 : 3;
    for (let i = 0; i < displayConferences.length; i += step) {
      const conferenceSlice = displayConferences.slice(i, i + step);
      items.push(
        <Carousel.Item key={i}>
          <Row className=''>
            {conferenceSlice.map(conf => (
              <Col key={conf.id} className=' fw-bold border mx-2 p-2 rounded bg-beige-light overflow-hidden'>
                <Button key={conf.id} className="text-start bg-transparent border-0"
                  onClick={(e) => chooseConf(e, conf.id)}
                >
                    <p className={`fw-bold text-teal-dark ${windowWidth > 768 ? 'card-title-suggest' : 'text-nowrap text-truncate p-0 m-0'}`}>{conf.information.name}</p>
                    {
                      conf.organizations.length > 0 &&
                      <div className="text-primary-dark fw-bold fs-medium d-flex align-items-center">
                        <FontAwesomeIcon icon={faClock} className='me-2 text-light-emphasis' />
                        {conference.organizations.filter(org => org.status === 'new').map((org, orgIdx) => (
                          <div key={orgIdx} className='text-light-emphasis'>
                            <span>{moment(org.start_date).format('MMM DD, YYYY')}</span>
                            {org.end_date && <span>{` - ${moment(org.end_date).format('MMM DD, YYYY')}`}</span>}
                          </div>
                        ))}

                      </div>
                    }
                    <div className="mb-2">
                      <span className="p-1 rounded-pill bg-light text-light-emphasis">{`${t('rank')}: ${conf.similar?.rank} ${conf.similar?.source ? `- Source: ${conf.similar?.source}` : ''}`}</span>

                    </div>
                    {conf.similar?.fieldOfResearch?.length > 0 && conf.similar?.fieldOfResearch?.map((field, index) => (
                      <span key={index} className="p-1 rounded-pill bg-light text-light-emphasis overflow-hidden text-truncate">FOR: {field}</span>
                    ))}
                </Button>
              </Col>
            ))}
          </Row>
        </Carousel.Item>
      );
    }
    return items;
  };

  return (
    <Container className='bg-light p-2 text-dark bg-opacity-25'>
      <div className="d-flex justify-content-between align-items-center w-100 my-2">
        <span className={`'text-darkcyan-normal fw-bold ${windowWidth > 768 ? 'h5': 'h6'}`}>{t('interestedIn')}</span>
        <div className='d-flex'>
          <Button variant="primary" className="rounded-circle bg-primary-normal border-light mx-1" onClick={handlePrev}>
            <FontAwesomeIcon icon={faChevronLeft} className='fs-5' />
          </Button>
          <Button variant="primary" className="rounded-circle bg-primary-normal border-light mx-1" onClick={handleNext}>
            <FontAwesomeIcon icon={faChevronRight} className='fs-5' />
          </Button>
        </div>
      </div>

      {displayConferences.length > 0 ? (
        <Carousel controls={false} interval={4000} fade={false} ref={carouselRef} indicators={false}>
          {renderConferenceItems()}
        </Carousel>
      ) : (
        <div>Loading...</div>
      )}

    </Container>
  );
}

export default SuggestedCarousel