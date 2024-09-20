import { useEffect, useRef, useState } from 'react';
import { Container, Button, Carousel, Row, Col } from 'react-bootstrap';

import 'react-slideshow-image/dist/styles.css';

import useSuggest from '../hooks/useSuggest';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faClock, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SlideShow = () => {
    const { getTopViewList } = useSuggest()
    const [displayConferences, setDisplayConferences] = useState([])
    const carouselRef = useRef(null); // Ref cho Carousel
    const scrollPositions = useRef({});
    const navigate = useNavigate()
    const {t} = useTranslation()

     // State để lưu trữ kích thước hiện tại của màn hình
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Sử dụng useEffect để cập nhật state khi kích thước màn hình thay đổi
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTopViewList()
            setDisplayConferences(data)
        }
        fetchData()
    }, [])
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
        // Lưu vị trí cuộn hiện tại trước khi cập nhật URL
        scrollPositions.current[window.location.pathname + window.location.search] = window.scrollY;
        // Cập nhật URL với trang mới
        const newUrl = new URL(window.location);
       // window.history.pushState({}, '', newUrl);
        navigate(`/detailed-information/${id}`)

    }
   
  // Render phần tử một lần khi màn hình nhỏ hơn 768px
  const renderOneAtATime = windowWidth <= 768;
    // Hàm render danh sách hội nghị thành các items chứa 4 hội nghị mỗi item
    const renderConferenceItems = () => {
        const items = [];
        const step = renderOneAtATime ? 1 : 3;
        for (let i = 0; i < displayConferences.length; i += step) {
            const conferenceSlice = displayConferences.slice(i, i + step);
            items.push(
                <Carousel.Item key={i}>
                    <Row className="d-flex flex-wrap p-1" style={{minHeight: '183px'}}>
                        {conferenceSlice.map(conference => (
                            <Col key={conference.id} className=' fw-bold border mx-2 p-2 rounded bg-beige-light'>
                                <Button onClick={(e) => chooseConf(e, conference.id)} className='bg-transparent border-0 text-start'>
                                    <div className="text-body-secondary fs-6 fw-bold">
                                        {`${conference.information.source} - ${t('rank')}: ${conference.information.rank}`}
                                    </div>
                                    <div className='card-title-suggest fw-bold text-teal-dark'>{conference.information.name}</div>
                                    <div></div>
                                    {
                                        conference.organizations.length > 0 &&
                                        <div className="text-primary-dark fw-bold fs-medium d-flex align-items-center">
                                            <FontAwesomeIcon icon={faClock} className='me-2 text-success-emphasis' />
                                            {conference.organizations.filter(org => org.status === 'new').map((org, orgIdx) => (
                                                <div key={orgIdx} className='text-light-emphasis'>
                                                    <span>{moment(org.start_date).format('MMM DD, YYYY')}</span>
                                                    {org.end_date && <span>{` - ${moment(org.end_date).format('MMM DD, YYYY')}`}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                      {
                                        conference.organizations.length > 0 &&
                                        <div className="text-primary-normal fw-bold fs-medium d-flex align-items-start">
                                            <FontAwesomeIcon icon={faLocationPin} className='me-2 text-success-emphasis' />
                                            {conference.organizations.filter(org => org.status === 'new').map((org, orgIdx) => (
                                                <div key={orgIdx} className='text-light-emphasis card-title-suggest'>
                                                    <span>{org.location !== '' ? org.location : ''}</span>
                                                </div>
                                            ))}
                                        </div>
                                    }
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
        <Container className='bg-light p-2 text-dark bg-opacity-25 p-2'>
          <div className="d-flex justify-content-between align-items-center w-100 my-2">
            <span className='fs-large text-darkcyan-normal fw-bold'>{t('highest_views')}</span>
          <div>
          <Button variant="primary" className="rounded-circle bg-primary-normal border-light mx-2" onClick={handlePrev}>
                <FontAwesomeIcon icon={faChevronLeft} className='fs-5'/>
            </Button>
            <Button variant="primary" className="rounded-circle bg-primary-normal border-light mx-2" onClick={handleNext}>
            <FontAwesomeIcon icon={faChevronRight} className='fs-5'/>
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

export default SlideShow