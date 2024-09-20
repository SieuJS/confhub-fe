import { useEffect, useRef, useState } from 'react'
import { Container, Card, Button, Stack, Row, Col, Image, Spinner } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

import useFollow from '../../hooks/useFollow'

import useSearch from '../../hooks/useSearch'
import { DropdownSort } from '../DropdownSort'
import { isUpcoming, sortByFollow, sortConferences } from '../../utils/sortConferences'

import { getSubDate } from '../../utils/formatDate'
import ButtonGroupUpdate from '../Postconference/ButtonGroupUpdate'
import { useNavigate } from 'react-router-dom'
import useConference from '../../hooks/useConferences'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faLocationPin } from '@fortawesome/free-solid-svg-icons'
import UnFollowIcon from './../../assets/imgs/unfollow.png'
import FollowIcon from './../../assets/imgs/follow.png'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import PriorityOptions from '../Filter/PriorityOptions'
import LoadingConferences from './LoadingConferences'
import useAuth from '../../hooks/useAuth'
import ExpiredModal from '../Modals/ExpiredModal'
import useParamsFilter from '../../hooks/useParamsFilter'
import ScrollToTopButton from '../ScrollToTopButton'
import { checkExistValue } from '../../utils/checkFetchedResults'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'

const Conference = ({ conferencesProp, loading, page, setPage, isPost }) => {
    const { t } = useTranslation()
    const { windowWidth } = useScreenSize()
    const { selectOptionSort, getStartEndDate, handleSelectOptionSort } = useConference()
    const { listFollowed, followConference, unfollowConference } = useFollow()
    const { optionsSelected } = useSearch()
    const [selected, setSelected] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()
    const [showPopupFollow, setShowPopupFollow] = useState(false)
    const [followedIds, setFollowedIds] = useState(new Set());
    const [pageDisplay, setPageDisplay] = useState(page)
    const [displayConferences, setDisplayedConferences] = useState(conferencesProp)
    const [loadingMap, setLoadingMap] = useState({});
    const scrollPositions = useRef({});
    const itemsPerPage = 7;
    let pageCount = Math.ceil(conferencesProp.length / 7)


    useEffect(() => {
        setPageDisplay(page)
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [page])

    useEffect(() => {
        const idsSet = new Set(listFollowed.map(item => item.id));
        setFollowedIds(idsSet);
    }, [listFollowed]);

    useEffect(() => {
        if (page > pageCount) {
            setPageDisplay(0)
        }
        setDisplayedConferences(conferencesProp)
    }, [conferencesProp, listFollowed])

    useEffect(() => {
        const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);
        setSelected(isApliedFilter)
    }, [optionsSelected])

    useEffect(() => {
        //sắp xếp list
        if (selectOptionSort === "random") {
            setDisplayedConferences(conferencesProp)
        }
        else if (selectOptionSort === "followed") {

            if (user) {
                const sortedByFollow = sortByFollow(conferencesProp, listFollowed)
                setDisplayedConferences(sortedByFollow)
            }
            else {
                setShowPopupFollow(true)
            }
        }
        else {
            const sortedConferences = sortConferences(selectOptionSort, [...conferencesProp])
            setDisplayedConferences(sortedConferences)
        }
    }, [selectOptionSort])


    // Hàm để tách acronym
const splitAcronym = (acronym) => {
    // Tách nội dung trong và ngoài ngoặc
     // Trường hợp có dấu ngoặc đơn
     if (acronym.includes('(') && acronym.includes(')')) {
        const regex = /\((.*?)\)/;
        const match = acronym.match(regex);
        if (match) {
          const insideParentheses = match[0].trim();
          const outsideParentheses = acronym.replace(match[0], '').trim();
          return { top: outsideParentheses, bottom: insideParentheses };
        }
      }
      
      // Trường hợp có dấu cách và dấu "-"
      if (acronym.includes('-')) {
        const parts = acronym.split('-');
        if (parts.length > 1) {
          const top = parts[0].trim();
          const bottom = parts[1].trim();
          return { top, bottom };
        }
      }
      
      // Trường hợp mặc định
      return { top: acronym, bottom: '' };
};

    const isFollowed = (itemId) => {
        return followedIds.has(itemId);
    };

    const handleFollow = async (event, id) => {
        event.stopPropagation();
        setLoadingMap((prevLoadingMap) => ({
            ...prevLoadingMap,
            [id]: true, // Đặt trạng thái loading của nút vừa nhấn thành true
        }));

        if (event.defaultPrevented) return  // Exits here if event has been handled
        event.preventDefault()
        const status = await followConference(id)
        setLoadingMap((prevLoadingMap) => ({
            ...prevLoadingMap,
            [id]: false, // Đặt trạng thái loading của nút vừa nhấn thành true
        }));
    }


    const handleUnfollow = async (event, id) => {
        event.stopPropagation();
        setLoadingMap((prevLoadingMap) => ({
            ...prevLoadingMap,
            [id]: true, // Đặt trạng thái loading của nút vừa nhấn thành true
        }));

        if (event.defaultPrevented) return  // Exits here if event has been handled
        event.preventDefault()
        const status = await unfollowConference(id)
        setLoadingMap((prevLoadingMap) => ({
            ...prevLoadingMap,
            [id]: false, // Đặt trạng thái loading của nút vừa nhấn thành true
        }));
    }


    const handlePageClick = async (pagenumber) => {
        setPage(pagenumber)
        // Cuộn lên đầu danh sách khi chuyển trang
        const element = document.getElementById('conferences-render');
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const chooseConf = async (e, id) => {
        e.preventDefault()
        // Lưu vị trí cuộn hiện tại trước khi cập nhật URL
        scrollPositions.current[window.location.pathname + window.location.search] = window.scrollY;
     
        navigate(`/detailed-information/${id}`)
    }


    const handleDropdownSelect = (value) => {
        //setPage(0)
        handleSelectOptionSort(value)
    };

    const getLengthString = (string) => string.length

    const renderSizeAcronym = (acronym) => {
        const length = getLengthString(acronym)
        if(length <= 6) {
            return 1.5
        } else if (length > 10) {
            return 0.9
        
        }  else if (length > 6) {
            return 1.2
        } 
         else {
            return 1.25
        }
    }
    const renderLocation = (organizations) => {
        const newOrg = organizations.find(org => org.status === "new");
        return newOrg ? newOrg.location : ''
    };

    if (loading) {
        return (
            <Container fluid className='d-flex flex-column align-items-center vh-100 p-0 overflow-hidden'>
                <LoadingConferences />
            </Container>
        )
    }
    return (
        <Container id='conferences-render' className='d-flex flex-column align-items-center p-0 conference-container'>
            <ScrollToTopButton />
            <div className=" header-conference-container d-flex justify-content-between">
                <div className="fs-3 fw-bold ms-4 mt-2 text-nowrap">
                    {`${conferencesProp.length} ${t('conferences')}`}
                </div>
                <DropdownSort
                    onSelect={handleDropdownSelect}
                    options={["random", "followed", "upcoming", "nameAz", "latest"]}
                />
            </div>
            <Row className='w-100 justify-content-start'>
                {
                    selected &&
                    <>
                        <Col xs={12} sm={2} className='d-flex align-items-start justify-content-end p-0 pt-2 priority-title'>
                            {t('displayPriorityBy')}:
                        </Col>
                        <Col className='d-flex align-items-start'>
                            <PriorityOptions />
                        </Col>
                    </>
                }

            </Row>

            <ExpiredModal onClose={() => setShowPopupFollow(false)} isOpen={showPopupFollow} />

            {
                conferencesProp && !loading
                    ?
                    <>
                        {
                            displayConferences
                                .slice(pageDisplay * itemsPerPage, (pageDisplay + 1) * itemsPerPage)
                                .map((conf) => (
                                    <Card key={conf.id} className='my-conf-card' id={conf.id} onClick={(e) => chooseConf(e, conf.id)} >
                                        <Card.Body className='p-0   '>
                                            <Row className='overflow-hidden'>
                                                {
                                                    windowWidth > 768 ?
                                                        <Col lg={2} sm={2} md={2}>
                                                            <div className="acronym-container text-center d-flex align-items-center justify-content-center bg-white border border-teal-light rounded-4 text-nowrap">
                                                                <span className={`fw-bold text-nowrap`} style={{fontSize: `${renderSizeAcronym(conf.information.acronym)}rem`}}>
                                                                    {splitAcronym(conf.information.acronym).top}
                                                                    {splitAcronym(conf.information.acronym).bottom && <span className="d-block fs-6">{splitAcronym(conf.information.acronym).bottom}</span>}
                                                                </span>
                                                            </div>
                                                        </Col>
                                                        :
                                                        null
                                                }

                                                <Col lg={10} sm={9} md={10}>
                                                    <div className='fw-bold d-flex align-items-center justify-content-start my-1'>
                                                        {/* acronym */}
                                                        {
                                                            windowWidth <= 768 ?
                                                                <Col lg={2} sm={2} md={2}>
                                                                    <div className="conf-tag text-nowrap p-1 px-2 rounded-2 me-2 fs-5 fw-bold text-center align-items-center justify-content-center bg-white border border-teal-light  text-nowrap">
                                                                        <span className={`fw-bold text-nowrap ${getLengthString(conf.information.acronym) > 6 ? 'fs-5' : 'fs-4'}`}>{conf.information.acronym}</span>
                                                                    </div>
                                                                </Col>
                                                                :
                                                                null
                                                        }
                                                        {/* Status */}
                                                        {conf.information.source === 'ConfHub' && isPost && (
                                                            <div className={`conf-tag text-nowrap p-1 px-2 rounded-2 me-2 fs-5 fw-bold ${conf.information.status ? 'bg-skyblue-normal' : 'bg-secondary text-light'}`}>
                                                                {conf.information.status ? ` ${t('active')}` : ` ${t('deactive')}`}
                                                            </div>
                                                        )}

                                                        {/* Upcoming */}
                                                        {conf.organizations.length > 0 && isUpcoming(conf.organizations[0].start_date) && conf.information.status && (
                                                            <div className='conf-tag bg-yellow-normal text-light p-1 px-2 rounded-2 me-2 fs-5 fw-bold text-nowrap'>
                                                                {t('upcoming')}
                                                            </div>
                                                        )}

                                                        {/* Source */}
                                                        {conf.information.source === 'ConfHub' && (
                                                            <div className='conf-tag bg-skyblue-dark text-light p-1  px-2 rounded-2 me-2 fs-5 fw-bold'>
                                                                CONFHUB
                                                            </div>
                                                        )}

                                                        {conf.information.source !== 'ConfHub' && (
                                                            <div className='conf-tag bg-blue-dark text-light p-1 px-2 rounded-2 me-2 fs-5 fw-bold'>
                                                                {conf?.information?.source}
                                                            </div>
                                                        )}

                                                        {/* Name */}
                                                        <span className='fw-bold fs-5 text-justify text-color-darker overflow-hidden text-nowrap text-truncate' style={{ maxWidth: 'calc(100% - 100px)' }}>
                                                            {conf.information.name}
                                                        </span>
                                                    </div>
                                                    <Row >
                                                        {

                                                            getSubDate(conf.importantDates) &&
                                                            <Col xs={12} sm={12} md={5}>
                                                                <Card.Text className='d-flex align-items-center mb-1 text-secondary-emphasis'>
                                                                    <FontAwesomeIcon icon={faClock} className='me-2 fs-6' />
                                                                    <label className='fs-5  text-nowrap'>{t('submission_date')}: </label>
                                                                    <span className='fs-5 fw-bold text-nowrap'>
                                                                        {getSubDate(conf.importantDates)}
                                                                    </span>
                                                                </Card.Text>
                                                            </Col>

                                                        }

                                                       

                                                            {
                                                                getStartEndDate(conf.organizations)
                                                                &&
                                                                <Col xs={12} lg={7} md={7} sm={7} className='text-truncate'>
                                                                <Card.Text className='d-flex align-items-center mb-1 text-secondary-emphasis'>
                                                                    <FontAwesomeIcon icon={faClock} className='me-2 fs-6 ' />
                                                                    <label className='fs-5 text-nowrap'>{t('conference_date')}: </label>
                                                                    <span className='fs-5 fw-bold text-nowrap'>

                                                                        <>
                                                                            {getStartEndDate(conf.organizations)}

                                                                        </>

                                                                    </span>
                                                                </Card.Text>
                                                                
                                                        </Col>
                                                            }



                                                        {
                                                            !getSubDate(conf.importantDates) && !getStartEndDate(conf.organizations)
                                                            &&
                                                            <>
                                                                <Col>
                                                                    <Card.Text className='d-flex align-items-center mb-1 text-secondary-emphasis'>
                                                                        <label className='fs-5 text-nowrap'>{t('rank')}: </label>
                                                                        <span className='fs-5  fw-bold text-nowrap'>
                                                                            <>
                                                                                {conf.information.rank}
                                                                            </>
                                                                        </span>
                                                                    </Card.Text>
                                                                </Col>
                                                                <Col>
                                                                    <Card.Text className='d-flex align-items-center mb-1 text-secondary-emphasis'>
                                                                        <label className='fs-5  text-nowrap'>{t('source')}: </label>
                                                                        <span className='fs-5  fw-bold text-nowrap'>
                                                                            <>
                                                                                {conf.information.source}
                                                                            </>
                                                                        </span>
                                                                    </Card.Text>
                                                                </Col>
                                                            </>
                                                        }
                                                    </Row>
                                                    <Row className="w-100 d-flex align-items-center justify-content-between">
                                                        <Col xs={12} lg={8} sm={8} md={8}>
                                                            {
                                                                renderLocation(conf.organizations) ?
                                                                    <span className='d-flex align-items-center mt-2 fs-5 text-secondary-emphasis text-justify text-nowrap text-truncate overflow-hidden' >
                                                                        <FontAwesomeIcon icon={faLocationPin} className='me-2 fs-6' />
                                                                        {renderLocation(conf.organizations)}
                                                                    </span>
                                                                    :
                                                                    <Card.Text className='d-flex align-items-center fs-5 mt-2 text-color-black'>

                                                                    </Card.Text>
                                                            }
                                                        </Col>

                                                        <Col xs={12} lg={4} sm={4} className='justify-content-end d-flex p-0'>
                                                            {
                                                                isPost
                                                                    ?
                                                                    <>
                                                                        <div className='d-flex justify-content-end'>
                                                                            <ButtonGroupUpdate conference={conf} />
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {
                                                                            isFollowed(conf.id)
                                                                                ?
                                                                                <Button
                                                                                    className='icon-follow text-nowrap border border-primary-light'
                                                                                    onClick={(event) => handleUnfollow(event, conf.id)}
                                                                                    title={t('unfollow')}
                                                                                    disabled={loadingMap[conf.id]}>
                                                                                    {
                                                                                        loadingMap[conf.id] ? <Spinner size={'sm'} /> :
                                                                                            <>
                                                                                                <Image src={FollowIcon} width={17} className='me-2' />
                                                                                                <span className='fs-5'>{t('followed')}</span>
                                                                                            </>
                                                                                    }
                                                                                </Button>
                                                                                :
                                                                                <Button
                                                                                    title={t('follow')}
                                                                                    className='icon-follow text-nowrap border border-primary-light'
                                                                                    onClick={(event) => handleFollow(event, conf.id)}
                                                                                    disabled={loadingMap[conf.id]}
                                                                                >
                                                                                    {
                                                                                        loadingMap[conf.id] ? <Spinner size={'sm'} /> :
                                                                                            <>
                                                                                                <Image src={UnFollowIcon} width={17} className='me-2' />
                                                                                                <span className='fs-5'>{t('follow')}</span>
                                                                                            </>
                                                                                    }

                                                                                </Button>
                                                                        }
                                                                    </>
                                                            }
                                                        </Col>
                                                    </Row>
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className='mx-2 d-flex flex-wrap w-100'>
                                                            {
                                                                conf.matchingKeywords &&

                                                                <>
                                                                    {Object.entries(conf.matchingKeywords).map(([key, keywords], index) => (
                                                                        <div key={index} className='bg-skyblue-light px-2 py-1 rounded mx-1 my-1'>
                                                                            {capitalizeFirstLetter(key)}: {keywords.map(k => capitalizeFirstLetter(k)).join(', ')}
                                                                        </div>
                                                                    ))}
                                                                </>
                                                            }
                                                        </div>

                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))
                        }
                    </>
                    :
                    <>
                        <p className='my-5'>No conferences available</p>
                    </>
            }


            <Row>
                <Col>

                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        previousLabel="<"
                        onPageChange={(e) => handlePageClick(e.selected)}
                        forcePage={pageDisplay}
                        pageRangeDisplayed={4}
                        marginPagesDisplayed={1}
                        pageCount={pageCount}
                        renderOnZeroPageCount={null}
                        containerClassName="justify-content-center pagination"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        activeClassName="active"
                        disabledClassName="disabled"
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default Conference