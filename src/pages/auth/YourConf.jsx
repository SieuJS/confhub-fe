import { useEffect, useState } from 'react'
import { Container, Button } from 'react-bootstrap'

import AddConference from '../../components/Modals/AddConference'
import usePost from '../../hooks/usePost'
import Conference from '../../components/Conference/Conference'

import SuccessfulModal from '../../components/Modals/SuccessModal'
import { checkExistValue } from '../../utils/checkFetchedResults'

import useSearch from '../../hooks/useSearch'
import useFilter from '../../hooks/useFilter'
import Loading from '../../components/Loading'
import Filter from '../../components/Filter/Filter'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import useParamsFilter from '../../hooks/useParamsFilter'

const YourConf = () => {
  const {t} = useTranslation()
  const {windowWidth} = useScreenSize()
  const [showAddForm, setShowAddForm] = useState(false)
  const { optionsSelectedOwn } = useSearch()
  const { loading: loadingPost, postedConferences, getPostedConferences } = usePost()
  const { filterConferences } = useFilter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [displayConferences, setDisplayConferences] = useState(postedConferences)
  const { pageParam, setPage,  addtoParams } = useParamsFilter()
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      await getPostedConferences()
      setLoading(false)
    }
    fetchData()
    setDisplayConferences(postedConferences)
  }, [])
  useEffect(() => {
    addtoParams(optionsSelectedOwn, pageParam)
  }, [pageParam, optionsSelectedOwn])

  useEffect(() => {
    setDisplayConferences(postedConferences)
  }, [postedConferences])

  useEffect(() => {
    const isApliedFilter = checkExistValue(optionsSelectedOwn).some(value => value === true);

    if (isApliedFilter) {

      const filterResult = filterConferences(postedConferences, optionsSelectedOwn)
      setDisplayConferences(filterResult)

    }
    else {
      setDisplayConferences(postedConferences)
    }
    
  }, [optionsSelectedOwn, postedConferences])

  const handleCheckStatus = (status, messageSuccess) => {
    setMessage(messageSuccess)
    if (status) {
      setShowAddForm(false);
      setShowSuccess(true)

    }
  }

  const handleClose = () => setShowAddForm(false);
  const handleShow = () => setShowAddForm(true);

  return (
    <Container className={` pt-5  overflow-x-hidden ${windowWidth > 768 ? 'm-5' : 'auth-container'}`}>

      <div className='d-flex align-items-center justify-content-between pe-5 mb-4 text-nowrap'>
        <h4 className='mb-2'>{t('your_conferences')}</h4>
        <Button
          className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-3 text-nowrap'
          onClick={handleShow}>
          <FontAwesomeIcon icon={faPlus} className='mx-1'/>
          {
            windowWidth > 768 && `${t('add_new')}`
          }
        </Button>
      </div>
      <AddConference 
      show={showAddForm} 
      handleClose={handleClose} 
      handleCheckStatus={handleCheckStatus} 
      onReloadList={getPostedConferences} />
      {showSuccess && <SuccessfulModal message={message} show={showSuccess} handleClose={() => setShowSuccess(false)} />}
      {
        loading && loadingPost ?
          <div className='mt-5'>
            <Loading onReload={getPostedConferences} />
          </div>
          :
          <>
            {
              postedConferences && postedConferences.length > 0 && !loadingPost ?
                <>
                <h6>{t('conference_list_description')}</h6>
                  <Filter filter={'optionsSelectedOwn'}/>
                  <Conference
                    conferencesProp={displayConferences}
                    page={pageParam}
                    setPage={setPage}
                    isPost={true}
                    loading={loadingPost}
                  />
                </>
                : <p>{t('no_posted_conferences')}</p>
            }
          </>
      }

    </Container>
  )
}

export default YourConf