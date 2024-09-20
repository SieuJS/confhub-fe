import { useState } from 'react';
import { Card, Container, Stack, Image, Button, Carousel, Row, Col } from 'react-bootstrap';

import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import UnfollowIcon from './../assets/imgs/unfollow.png'
import FollowIcon from './../assets/imgs/follow.png'
import TimeIcon from './../assets/imgs/time.png'
import LocationIcon from './../assets/imgs/location.png'
import PrevIcon from './../assets/imgs/control_prev.png'
import NextIcon from './../assets/imgs/control_next.png'
const test = [
    {
        con_id: 1,
        acronym: "KDD",
        con_name: "ACM International Conference on Knowledge Discovery and Data Mining",
        location: "Vietnam",
        update_time: "22/11/2023",
        follow: false,

    }, {
        con_id: 2,
        acronym: "KDD",
        con_name: "ACM International Conference on Knowledge Discovery and Data Mining",
        location: "Vietnam",
        update_time: "22/11/2023",
        follow: true,

    },
    {
        con_id: 3,
        acronym: "KDD",
        con_name: "ACM International Conference on Knowledge Discovery and Data Mining",
        location: "Vietnam",
        update_time: "22/11/2023",
        follow: false,

    },
    {
        con_id: 4,
        acronym: "KDD",
        con_name: "ACM International Conference on Knowledge Discovery and Data Mining",
        location: "Vietnam",
        update_time: "22/11/2023",
        follow: true,
    },
    {
        con_id: 5,
        acronym: "KDD",
        con_name: "ACM International Conference on Knowledge Discovery and Data Mining",
        location: "Vietnam",
        update_time: "22/11/2023",
        follow: false,

    },

]


const properties = {
    prevArrow: <Button className='bg-transparent border-0'>
        <Image src={PrevIcon} style={{ width: "15zpx" }} fluid />
    </Button>,

    nextArrow: <Button className='bg-transparent border-0 ms-2'>
        <Image src={NextIcon} style={{ width: "15px" }} />
    </Button>
}
const SlideConferences = ({showSlideShow, setShowSlideShow}) => {
    const [listEvents, setListEvents] = useState(test)
    
    const onClickFollow = () => {

    }
    return (
        <Container className='mt-4 border-0 rounded-4 p-4 bg-blue-light mx'  >

            <Stack direction='horizontal'>
                <span className='p-0 fw-bold fs-4 text-color-black me-auto'>Popular conferences</span>
                <Button 
                    onClick={()=>setShowSlideShow(!showSlideShow)}
                    className='bg-transparent rounded-circle text-color-medium border-color-medium'>X
                </Button>
            </Stack>

            <Slide slidesToScroll={2} slidesToShow={2} indicators={false} autoplay={false} {...properties}
                className='bg-primary mt-4'>
                {
                    listEvents.map((conf) => (
                        <Row key={conf.con_id}>
                            <Col xs={3} className='d-flex justify-content-center'>
                                <div 
                                    style={{width: "50px", height: "50px"}}
                                    className='p-1 border border-1'
                                >
                                    {conf.acronym}
                                </div>
                            </Col>
                            <Col xs={9}>
                                <div className='d-flex align-items-center mb-1 w-100 fs-6 text-color-back fw-bold' >
                                    {conf.con_name}
                                </div>
                            </Col>
                        </Row>
                    ))
                }
            </Slide>
        </Container>
    )
}

export default SlideConferences