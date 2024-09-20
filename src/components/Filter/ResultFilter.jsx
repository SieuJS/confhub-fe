import { useEffect, useState } from 'react'
import { Container, Card, Button, Image, Stack } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

import UnfollowIcon from './../../assets/imgs/unfollow.png'
import FollowIcon from './../../assets/imgs/follow.png'
import TimeIcon from './../../assets/imgs/time.png'
import LocationIcon from './../../assets/imgs/location.png'
import { useNavigate } from 'react-router-dom'
import useConference from '../../hooks/useConferences'
import useFollow from '../../hooks/useFollow'
import { isObjectInList } from '../../utils/checkExistInList'

import useSearch from '../../hooks/useSearch'
import { DropdownSort } from '../DropdownSort'
import { isUpcoming, sortByFollow, sortConferences } from '../../utils/sortConferences'

import ArrowIcon from './../../assets/imgs/arrow.png'
import Loading from '../Loading'
import { getDateValue } from '../../utils/formatDate'
import useLocalStorage from '../../hooks/useLocalStorage'

const ResultFilter = ({ conferencesProp, width }) => {
    const { listFollowed, followConference, unfollowConference, getListFollowedConferences } = useFollow()
    const { resultFilter, appliedFilterResult, optionsSelected, getOptionsFilter } = useSearch()
    const {handleGetList} = useConference()
    const {user} = useLocalStorage()
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [fetchCount, setFetchCount] = useState(0);
    const [selectOptionSort, setSelectOptionSort] = useState('')
    const [copiedConferences, setcopiedConferences] = useState([])
    const [displayConferences, setDisplayedConferences] = useState([])
    const [loading, setLoading] = useState(false)
    const usersPerPage = 7;
    const pagesVisited = page * usersPerPage;
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            getListFollowedConferences()
            setLoading(false)
            
            if(conferencesProp.length ===0 || !conferencesProp){
                await handleGetList()
            }

        }

        if (fetchCount < 1) {
            fetchData()
            setFetchCount(fetchCount + 1);
        }
        setLoading(false)
        
        
        const sortedByFollow = sortByFollow(conferencesProp, listFollowed)
        setDisplayedConferences([...sortedByFollow])
        setcopiedConferences([...sortedByFollow])
    }, [fetchCount, conferencesProp, page, optionsSelected, listFollowed, resultFilter]);
    
    const handlePageClick = (event) => {
        setPage(event.selected)
        // Cuộn lên đầu danh sách khi chuyển trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const chooseConf = (id) => {
        navigate(`/detail/information/${id}`)
    }

    const handleFollow = (id) => {
        if(user){

            followConference(id)
            getListFollowedConferences()
    
        }
        else navigate('/login')
    }

    const handleUnfollow = (id) => {
        if(user){

            unfollowConference(id)
            getListFollowedConferences()
        }
        else navigate('/login')
    }

    const handleDropdownSelect = (value) => {
        setSelectOptionSort(value);
        if (value === "Random") {
            setDisplayedConferences([...copiedConferences])
        }
        else {
            const sortedConferences = sortConferences(value, displayConferences)
            setDisplayedConferences(sortedConferences)
        }

    };
    const getLengthString = (string) => string.length
    return (
        <Container className='d-flex flex-column align-items-center p-0'>

            <div className="mb-3 px-4 d-flex align-items-center justify-content-between w-100">
                <div className="h5 fw-bold">
                    Conferences
                    <span className='fw-normal'> ({displayConferences.length}) </span>
                </div>
                <DropdownSort
                    options={["Random", "Upcoming", "Name A > Z", "Latest"]}
                    onSelect={handleDropdownSelect}
                />
            </div>

            {
                displayConferences && displayConferences.length > 0
                    ?

                    (displayConferences
                        .slice(pagesVisited, pagesVisited + usersPerPage)
                        .map(conf => (
                            <Card
                                className='my-conf-card'
                                style={{ width: `${width}px` }}
                                id={conf.id}
                                key={conf.id}>
                                <Stack className='p-0' direction='horizontal'>
                                    <div className='bg-white rounded-4 fw-bolder d-flex align-items-center justify-content-center acronym-container '>
                                        <span className={`fw-bold ${getLengthString(conf.information.acronym) > 6 ? 'fs-6' : 'fs-4'}`}>{conf.information.acronym}</span>
                                    </div>

                                    <div className=''>
                                        <Card.Body className='' onClick={() => chooseConf(conf.id)}>
                                            <Card.Title className='text-color-black'>
                                                <div className='fw-bold d-flex align-items-start'>
                                                    {
                                                        conf.organizations.length > 0 &&
                                                        <>
                                                            {isUpcoming(conf.organizations[0].start_date)
                                                                &&
                                                                <div className='bg-yellow-normal text-light p-2 rounded-2 me-2 fs-6 fw-bold'>
                                                                    Upcoming
                                                                </div>
                                                            }
                                                        </>
                                                    }
                                                    <span className='fw-bold fs-5 text-justify'>{conf.information.name}</span>
                                                </div>

                                            </Card.Title>
                                            <Stack direction="horizontal" gap={5}>
                                                <Card.Text className='d-flex align-items-center mb-1'>
                                                    <Image src={TimeIcon} className='me-2' width={18} />
                                                    <label className='conf-data-label'>Submission Date: </label>
                                                    <span className='conf-data'>{getDateValue("submission", conf.importantDates)}</span>
                                                </Card.Text>

                                                <Card.Text className='d-flex align-items-center mb-1'>
                                                    <Image src={TimeIcon} className='me-2' width={18} />
                                                    <label className='conf-data-label'>Conference Date: </label>
                                                    <span className='conf-data'>
                                                        {conf.organizations.length > 0 ? conf.organizations[0].start_date : 'N/A'}
                                                        <>
                                                            {
                                                                conf.organizations.length > 0 ?
                                                                    <>
                                                                        {
                                                                            conf.organizations[0].end_date && <Image src={ArrowIcon} width={20} className='mx-2' />
                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {`N/A`}
                                                                    </>
                                                            }
                                                        </>
                                                        {conf.organizations.length > 0 ? conf.organizations[0].end_date : 'N/A'}
                                                    </span>
                                                </Card.Text>
                                            </Stack>
                                            <Card.Text className='d-flex align-items-center'>
                                                <Image src={LocationIcon} className='me-2' width={18} height={20} />
                                                {conf.organizations.length > 0 ? (
                                                    // Nếu location không null, hiển thị giá trị của nó
                                                    <>{conf.organizations[0].location || 'Updating...'}</>
                                                ) : (
                                                    // Nếu location null, hiển thị 'updating'
                                                    <>Updating</>
                                                )}
                                            </Card.Text>
                                        </Card.Body>

                                        {
                                            isObjectInList(conf.id, listFollowed)
                                                ?
                                                <Button className='icon-follow' onClick={() => handleUnfollow(conf.id)} title='Unfollow'>
                                                    <Image src={FollowIcon} className='me-2' width={18} />
                                                    <span>Unfollow</span>
                                                </Button>
                                                :
                                                <Button className='icon-follow' onClick={() => handleFollow(conf.id)}>
                                                    <Image src={UnfollowIcon} className='me-2 ' width={18} />
                                                    <span>Follow</span>
                                                </Button>
                                        }

                                    </div>

                                </Stack>
                            </Card>
                        ))
                    )
                    :
                    <>
                        <Loading  onReload={handleGetList}/>
                    </>
            }
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={Math.ceil(displayConferences.length / usersPerPage)}
                previousLabel="<"
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
                disabledClassName="disabled"
            />
        </Container>
    )
}

export default ResultFilter