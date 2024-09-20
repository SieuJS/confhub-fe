import { useEffect, useRef, useState } from 'react'
import useConference from '../../hooks/useConferences'
import { Col, Container, Row, Spinner, Stack } from 'react-bootstrap'

import InformationPage from '../../components/Informationpage/InformationPage'
import ImportantDatePage from '../../components/Informationpage/ImportantDatePage'
import CallforpaperPage from '../../components/Informationpage/CallforpaperPage'
import Feedbacks from '../../components/Feedbacks/Feedbacks'
import FollowButton from '../../components/Informationpage/FollowButton'
import UpdateNowButton from '../../components/Informationpage/UpdateNowButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom'
import useFollow from '../../hooks/useFollow'
import useAuth from '../../hooks/useAuth'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import SuggestedCarousel from '../../components/SuggestList/SuggestedCarousel'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
import AutoProgressBar from '../../components/ProgressLoading/AutoProgressBar'
const DetailedInformationPage = () => {
    const { t } = useTranslation()
    const {windowWidth} = useScreenSize()
    const { user } = useAuth()
    const { conference, messages, isCrawlingConfs, removeIDfromCrawlings, handleGetOne, getConferenceDate } = useConference()
    const { listFollowed, getListFollowedConferences } = useFollow()
    const [loading, setLoading] = useState(false)
    const conf_id = useParams()

    const [zoom, setZoom] = useState(false);
    const contentRefs = useRef({});
    const [visibleSections, setVisibleSections] = useState([]);
    const [loadingConf, setLoadingConf] = useState(true)
    const [isCrawling, setIsCrawling] = useState(false)
    const [heightHeader, setHeightHeader] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            await handleGetOne(conf_id.id)
            setLoadingConf(false)
        }
        fetchData()
    }, [conf_id])

    useEffect(() => {
        const header = document.getElementById('header');
        setHeightHeader(header?.offsetHeight)
        const crawlingStatus = messages.find(mess => mess.id === conf_id?.id && mess.status !== 'completed' && mess.status !== 'failed');
        
        if (crawlingStatus && crawlingStatus.status !== 'failed') {
                setIsCrawling(true)
        } else {
            setIsCrawling(false)
        }
    }, [conf_id, messages])

    useEffect(() => {

        const handleScroll = () => {
            Object.keys(contentRefs.current).forEach(key => {
                const ref = contentRefs.current[key];
                if (ref) {
                    const top = ref.getBoundingClientRect().top;
                    if (top < window.innerHeight * 0.75) {
                        setVisibleSections(prevVisibleSections =>
                            prevVisibleSections.includes(key) ? prevVisibleSections : [...prevVisibleSections, key]
                        );
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!loading) {
            setZoom(true);
        }
    }, [loading]);

    useEffect(() => {
        const fetchData = async () => {
            await handleGetOne(conf_id.id);
            await getListFollowedConferences()
            setLoading(false)
        }
        if (!conference && conf_id.id) {
            setLoading(true)
            fetchData()
        }
    }, [conference, conf_id.id, listFollowed, user]);


    const renderLocation = (organizations) => {
        const newOrg = organizations.find(org => org.status === "new");
        return newOrg ? newOrg.location : ''
    };
    const getLengthString = (string) => string.length

    const renderName = (name) => {
        // Replace the opening parenthesis with a line break followed by the parenthesis
        name = name.replace(/\(/g, '<br>(');

        // Replace the closing parenthesis with a parenthesis followed by a line break
        name = name.replace(/\)/g, ')<br>');

        return name;
    }
    return (
        <Container className='w-100 h-25 p-0 overflow-x-hidden' fluid>
            {
               isCrawling &&
                <div className="fixed-top px-3 pt-3 text-center fw-bold fs-5 bg-darkcyan-normal border border-3 border-white text-white opacity-75" style={heightHeader ? { top: `${heightHeader}px`, zIndex: '1' } : {}}>
                    <span>
                        {t('message_waiting_update')}
                    </span>
                <AutoProgressBar/>
                </div>
            }

            {
                loadingConf || loading
                    ?
                    <Container fluid className='d-flex flex-column justify-content-center align-items-center p-0 vh-100 bg-blur'>
                        < Spinner size='lg' />
                    </Container>
                    :
                    <>
                        {
                            conference && !loading && Object.prototype.toString.call(conference) === '[object Object]' ?
                                <>
                                  <Stack className={`bg-blur p-5 w-100 d-inline-block text-center text-color-black ${ windowWidth < 768 ? 'vh-0' : (getLengthString(conference.information.name) > 70 ? 'vh-75' : 'vh-100')}`}>
                                        <div className={`${windowWidth > 768 ? 'h-100 p-5' : 'py-5'} ${zoom ? 'zoom-in' : ''}`}>
                                            {
                                                conference.information ?
                                                    <>
                                                        <div className={windowWidth > 768 ? 'px-5': ''}>
                                                            <p className={`text-teal-normal fw-bold mt-5 pt-5 ${windowWidth > 768 ? 'fs-larger px-5' : 'fs-large'}`} dangerouslySetInnerHTML={{ __html: renderName(conference.information.name) }} />
                                                        </div>


                                                        <h3 className='mb-4'>{`(${conference.information.acronym})`}</h3>
                                                        {
                                                            getConferenceDate(conference.organizations) !== '' &&
                                                            <h3 className={`text-yellow d-inline p-1 text-nowrap  ${windowWidth > 768 ? 'fs-larger' : 'fs-large'}`}>

                                                                <FontAwesomeIcon icon={faCalendar} className='mx-3 fs-4' />
                                                                {getConferenceDate(conference.organizations)}
                                                            </h3>
                                                        }
                                                        {renderLocation(conference.organizations) !== '' && (
                                                            <>
                                                                <div className='d-flex justify-content-center align-items-start fs-4 my-2 mt-4 text-teal-dark fw-bold'>
                                                                    <FontAwesomeIcon icon={faLocationPin} className='mx-3 fs-5' />
                                                                    <h3 className='text-teal-black'> {renderLocation(conference.organizations)}</h3>

                                                                </div>


                                                            </>
                                                        )
                                                        }

                                                        <div className='fs-4  my-2'>
                                                            <Col xs={1} className=''>

                                                            </Col>
                                                            <Col xs={3} className='text-start'>

                                                            </Col>
                                                        </div>

                                                        <div className='mt-5 d-flex justify-content-center align-items-center mx-auto'>
                                                            <div className="mx-1">
                                                            <FollowButton listFollowed={listFollowed} onGetListFollow={getListFollowedConferences} />
                                                            </div>
                                                            <div className="mx-1">
                                                            <UpdateNowButton />
                                                            </div>
                                                        </div>

                                                    </>
                                                    : `Not found`
                                            }

                                        </div>

                                    </Stack>

                                    <div
                                        className={`w-100 bg-skyblue-light -normal content ${windowWidth > 768 ? 'p-5' : 'py-5 px-0'} ${visibleSections.includes('infor') ? 'visible' : ''}`}
                                        ref={el => contentRefs.current['infor'] = el}
                                    >
                                        < Row className={`bg-white ${windowWidth > 768 ? 'm-4' :'my-4'}`}>
                                            <Col sm={6} xs={12} className='p-0'>
                                                <InformationPage conference={conference} />
                                            </Col>
                                            <Col sm={6} xs={12} className="p-0" >
                                                <ImportantDatePage conference={conference} />
                                            </Col>
                                        </Row>
                                    </div>
                                    {
                                        conference &&
                                        <>
                                            {
                                                conference.callForPaper && conference.callForPaper !== '' && conference.callForPaper !== 'Not found'
                                                &&
                                                <div className='w-100 bg-skyblue-normal'>
                                                    <Row
                                                        ref={el => (contentRefs.current['cfp'] = el)}
                                                        className={`p-0 content ${visibleSections.includes('cfp') ? 'visible' : ''}`}>
                                                        <CallforpaperPage conference={conference} />
                                                    </Row>
                                                </div>}
                                        </>
                                    }
                                    <Row className={windowWidth > 768 ? 'px-5 mx-5': ''}>
                                        <Feedbacks />
                                    </Row>
                                    <div>
                                        <SuggestedCarousel />
                                    </div>
                                </>
                                :
                                <>
                                    <Container fluid className='d-flex flex-column justify-content-center align-items-center p-0 vh-100 bg-blur'>
                                        <h1>{t('no_conferences')}</h1>

                                    </Container>
                                </>

                        }

                        <ScrollToTopButton />
                    </>
            }

        </Container>
    )
}

export default DetailedInformationPage