import { useEffect, useState } from 'react'
import { Container, Card, Button, Image, Stack } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import { useLocation, useNavigate } from 'react-router-dom'

import { formatDate, getDateValue } from '../../utils/formatDate'

import UnfollowIcon from './../../assets/imgs/unfollow.png'
import FollowIcon from './../../assets/imgs/follow.png'
import TimeIcon from './../../assets/imgs/time.png'
import LocationIcon from './../../assets/imgs/location.png'


import useSearch from '../../hooks/useSearch'
import useConference from '../../hooks/useConferences'
import { getUniqueConferences } from '../../utils/checkFetchedResults'
import useFollow from '../../hooks/useFollow'
import { isObjectInList } from '../../utils/checkExistInList'
import { DropdownSort } from '../DropdownSort'
import { isUpcoming, sortConferences } from '../../utils/sortConferences'
import useAuth from '../../hooks/useAuth'
import ArrowIcon from './../../assets/imgs/arrow.png'

const FetchedResults = () => {
  const { loading } = useAuth()
  const { appliedFilterResult, optionsSelected } = useSearch()
  const { listFollowed, followConference, unfollowConference, getListFollowedConferences } = useFollow()

  const navigate = useNavigate()

  const [page, setPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedConferences, setDisplayedConferences] = useState([]);
  const [copiedConferences, setcopiedConferences] = useState([])
  const usersPerPage = 5;
  const pagesVisited = page * usersPerPage;

  useEffect(() => {
    const sortedConferenecs = sortConferences('Random', appliedFilterResult)
      setDisplayedConferences(sortedConferenecs);
      setcopiedConferences([...sortedConferenecs])

  }, [appliedFilterResult, currentPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleFollow = (id) => {
    followConference(id)
    getListFollowedConferences()
  }

  const handleUnfollow = (id) => {
    unfollowConference(id)
    getListFollowedConferences()
  }

  const chooseConf = (id) => {
    navigate(`/detail/information/${id}`)
  }
  const handleDropdownSelect = (value) => {
    if (value === "Random") {
      sortConferences(value, displayedConferences)
      setDisplayedConferences([...copiedConferences])
    }
    else {
      sortConferences(value, displayedConferences)
    }

  };
  return (
    <Container className='d-flex flex-column align-items-center p-0'>
      <div className="my-3 px-4 d-flex align-items-center justify-content-between w-100">
        <div className="h5 fw-bold">
          Conferences
          <span className='fw-normal'> ({displayedConferences.length}) </span>
        </div>
        <DropdownSort
          options={["Random", "Upcoming", "Name A > Z", "Latest"]}
          onSelect={handleDropdownSelect}
        />
      </div>
      {displayedConferences && displayedConferences.length > 0 ? (
        <>
          {displayedConferences
            .slice(pagesVisited, pagesVisited + usersPerPage)
            .map((conf) => (
              <Card
                                className='my-conf-card'
                                style={{width: "1260px"}}
                                id={conf.id}
                                key={conf.id}>
                                <Stack className='p-0' direction='horizontal'>
                                    <div className='bg-white rounded-4 fw-bolder d-flex align-items-center justify-content-center acronym-container '>
                                        <span className='fw-bold fs-4'>{conf.information.acronym}</span>
                                    </div>

                                    <div className=''>
                                        <Card.Body className='' onClick={() => chooseConf(conf.id)}>
                                            <Card.Title className='text-color-black'>
                                                <Stack direction='horizontal'>
                                                    {isUpcoming(conf.organizations[0].start_date)
                                                        &&
                                                        <div className='bg-yellow-normal text-light p-2 rounded-2 me-2 fs-6 fw-bold'>
                                                            Upcoming
                                                        </div>
                                                    }
                                                    <span className='fw-bold'>{conf.information.name}</span>
                                                </Stack>

                                            </Card.Title>
                                            <Stack direction="horizontal" gap={5}>
                                                <Card.Text className='d-flex align-items-center mb-1'>
                                                    <Image src={TimeIcon} className='me-2' width={18} />
                                                    <label className='conf-data-label'>Submission Date: </label>
                                                    <span className='conf-data'>{getDateValue("submission date", conf.importantDates)}</span>
                                                </Card.Text>

                                                <Card.Text className='d-flex align-items-center mb-1'>
                                                    <Image src={TimeIcon} className='me-2' width={18} />
                                                    <label className='conf-data-label'>Conference Date: </label>
                                                    <span className='conf-data'>
                                                        {conf.organizations[0].start_date}
                                                        <>
                                                            <Image src={ArrowIcon} width={20} className='mx-2' />
                                                        </>
                                                        {conf.organizations[0].end_date}
                                                    </span>
                                                </Card.Text>
                                            </Stack>
                                            <Card.Text className='d-flex align-items-center'>
                                                <Image src={LocationIcon} className='me-2' width={18} />
                                                {conf.organizations[0].location}
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
            ))}
        </>
      ) : (
        <p>No conferences available.</p>
      )}


      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={Math.ceil(displayedConferences.length / usersPerPage)}
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

export default FetchedResults