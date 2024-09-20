import { useEffect, useState } from 'react'
import { Container, } from 'react-bootstrap'
import Conference from '../../components/Conference/Conference'
import useFollow from '../../hooks/useFollow'
import useSearch from '../../hooks/useSearch'

import useLocalStorage from '../../hooks/useLocalStorage'
import Loading from '../../components/Loading'


import useFilter from '../../hooks/useFilter'
import Filter from '../../components/Filter/Filter'
import { checkExistValue } from '../../utils/checkFetchedResults'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
import useParamsFilter from '../../hooks/useParamsFilter'

const Followed = () => {
  const { t } = useTranslation()
  const {windowWidth} = useScreenSize()
  const { loading: loadingFollow, listFollowed, getListFollowedConferences } = useFollow()
  const { optionsSelectedFollow } = useSearch()
  const { user } = useLocalStorage()
  const { pageParam, setPage,  addtoParams } = useParamsFilter()
  const { filterConferences } = useFilter()


  const [displayConferences, setDisplayConferences] = useState(listFollowed)

  useEffect(() => {
    getListFollowedConferences()
  }, [])

  useEffect(() => {
    addtoParams(optionsSelectedFollow, pageParam)
  }, [pageParam, optionsSelectedFollow])

  useEffect(() => {
    if (!listFollowed) {
      getListFollowedConferences()
      setDisplayConferences(listFollowed)
    }
  }, [user])

  useEffect(() => {
    const isApliedFilter = checkExistValue(optionsSelectedFollow).some(value => value === true);

    if (isApliedFilter) {

      const filterResult = filterConferences(listFollowed, optionsSelectedFollow)
      setDisplayConferences(filterResult)

    }
    else {
      setDisplayConferences(listFollowed)
    }
    // Tạo query string 
    const queryString = Object.entries(optionsSelectedFollow)
      .filter(([, values]) => values.length > 0)
      .map(([key, values]) => `${key}=${values.join(',')}`)
      .join('&');
    // Lấy phần hash của URL nếu có
    const { hash, pathname } = window.location;
    const newUrl = queryString ? `${pathname}${hash}?${queryString}` : `${pathname}${hash}`;

    // Cập nhật URL
    //window.history.pushState({}, '', newUrl);
  }, [optionsSelectedFollow, listFollowed])

  return (
    <Container className={` pt-5  overflow-x-hidden ${windowWidth > 768 ? 'm-5' : 'auth-container'}`}>
      <div className='d-flex justify-content-between align-items-center'>
        <h4 >{t('followed_conference')}</h4>
      </div>

      {
        !loadingFollow ?
          <>
            {
              listFollowed && listFollowed.length > 0
                ?
                <>

                  <div className='fs-6 my-1 mb-3'>{t('review_followed_conferences')}</div>
                  <Filter filter={'optionsSelectedFollow'}/>

                  <Conference
                    conferencesProp={displayConferences}
                    page={pageParam}
            setPage={setPage}
                    loading={loadingFollow} />
                </>
                :
                <p>{t('no_followed_conferences')}</p>
            }
          </>
          :
          <div className='mt-5'>
            <Loading onReload={getListFollowedConferences} />
          </div>
      }


    </Container>
  )
}

export default Followed