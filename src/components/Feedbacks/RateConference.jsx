import { useState } from 'react';
import starIcon from '../../assets/imgs/filled_star_yellow.png'
import unstarIcon from '../../assets/imgs/unfill_star_yellow.png'
import { Col, Image, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
function RateConference({rating, setRating}) {
    const {t} = useTranslation()
    const [hoverValue, setHoverValue] = useState(0);

    const handleStarClick = (value) => {
        setRating(value === rating ? 0 : value);
    };

    const handleStarHover = (value) => {
        setHoverValue(value);
    };

    return (
        <Row className='d-flex align-items-center justify-content-start'>
            
            <Col className='text-start p-0'>
            <span className='me-2 text-nowrap'>{t('how_would_you_rate_this_conference')} {rating}/5*</span>
            </Col>
           <Col className=' ms-3 text-start p-0'>
           {[1, 2, 3, 4, 5].map((index) => (
                <Image
                    key={index}
                    src={index <= (hoverValue || rating) ? starIcon : unstarIcon}
                    style={{ cursor: "pointer" }}
                    width={20}
                    height={20}
                    onMouseEnter={() => handleStarHover(index)}
                    onMouseLeave={() => handleStarHover(0)}
                    onClick={() => handleStarClick(index)}
                    className='mx-1'
                />
            ))}
           </Col>
        </Row>
    );
}

export default RateConference;
