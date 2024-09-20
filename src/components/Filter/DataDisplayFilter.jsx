import React, { useState } from 'react'
import { Button, Card, Stack } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import useFollow from '../../hooks/useFollow';
import { isUpcoming, sortConferences } from '../../utils/sortConferences';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faHeart, faLocationPin, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { getDateValue } from '../../utils/formatDate';
import { isObjectInList } from '../../utils/checkExistInList';
import { faFill } from '@fortawesome/free-solid-svg-icons/faFill';
const DataDisplayFilter = ({loading, conferencesProp, total, width }) => {
  const {listFollowed, getListFollowedConferences, followConference, unfollowConference} = useFollow()
  const [displayConferences, setDisplayedConferences] = useState([])
  const [copiedConferences, setcopiedConferences] = useState([])

  const [selectOptionSort, setSelectOptionSort] = useState('')
  const navigate = useNavigate()
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 7;
    const pagesVisited = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(conferencesProp.length / itemsPerPage);





    const chooseConf = (id) => {
      navigate(`/detailed-information/${id}`)
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

    if (loading) {
        return <div>Loading data...</div>;
    }
      const changePage = ({ selected }) => {
          setPageNumber(selected);
      };

  return (
    <div>
        {
        conferencesProp
        .slice(pagesVisited, pagesVisited + itemsPerPage)
        .map((conf)=>(
            
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
                              <FontAwesomeIcon icon={faTimesCircle} />
                              <label className='conf-data-label'>Submission Date: </label>
                              <span className='conf-data'>{getDateValue("submission", conf.importantDates)}</span>
                          </Card.Text>

                          <Card.Text className='d-flex align-items-center mb-1'>
                              <FontAwesomeIcon icon={faTimesCircle} />
                              <label className='conf-data-label'>Conference Date: </label>
                              <span className='conf-data'>
                                  {conf.organizations.length > 0 ? conf.organizations[0].start_date : 'N/A'}
                                  <>
                                      {
                                          conf.organizations.length > 0 ?
                                              <>
                                                  {
                                                      conf.organizations[0].end_date &&  <FontAwesomeIcon icon={faArrowAltCircleLeft} />
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
                          <FontAwesomeIcon icon={faLocationPin} />
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
                          <Button className='icon-follow' onClick={() => unfollowConference(conf.id)} title='Unfollow'>
                              <FontAwesomeIcon icon={faHeart} />
                              <span>Unfollow</span>
                          </Button>
                          :
                          <Button className='icon-follow' onClick={() => followConference(conf.id)}>
                               <FontAwesomeIcon icon={faFill} />
                              <span>Follow</span>
                          </Button>
                  }

              </div>

          </Stack>
      </Card>
        ))
    }
    <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={changePage}
                pageRangeDisplayed={4}
                marginPagesDisplayed={1}
                pageCount={pageCount}
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
    </div>
  )
}

export default DataDisplayFilter