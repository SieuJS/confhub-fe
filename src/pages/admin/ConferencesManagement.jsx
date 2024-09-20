import { useState, useEffect, useRef } from 'react'
import { Container, ButtonGroup, Button, Row, Col, Tabs, Tab } from 'react-bootstrap'

import InputSearch from '../../components/admin/InputSearch'
import Filter from '../../components/admin/Filter'
import useConference from '../../hooks/useConferences'
import { sortConferences } from '../../utils/sortConferences'
import { DropdownSort } from '../../components/DropdownSort'
import Loading from '../../components/Loading'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

import useSearch from '../../hooks/useSearch'
import { checkExistValue } from '../../utils/checkFetchedResults'
import useFilter from '../../hooks/useFilter'
import FilterSelected from '../../components/Filter/FilterSelected'

import AllConferences from '../../components/admin/AllConferences'
import PendingCFPs from '../../components/admin/PendingCFP'
import './../../components/admin/custom_import.css'
import useAdmin from '../../hooks/useAdmin'
import ImportButton from '../../components/admin/ImportButton/ImportButton'
import ExportButton from '../../components/admin/ExportButton'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
import FilterOffcanvas from '../../components/admin/FilterOffcanvas'
import { useAppContext } from '../../context/authContext'
import CycleButton from '../../components/admin/CycleButton'

const ConferencesManagement = () => {
  const { state } = useAppContext()
  const { t } = useTranslation()
  const { windowWidth } = useScreenSize()
  const { optionsSelectedAdmin } = useSearch()
  const {
    priorityKeywords,
    filterConferences } = useFilter()

  const [showFilter, setShowFilter] = useState(false)
  const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false)
  const { loading: loadingConf, conferences, selectOptionSort, handleSelectOptionSort, getAllConferences, getUserConferences } = useConference()
  const { allcolumns, pendingConferences, getAllPendingConferences } = useAdmin()
  const [key, setKey] = useState('allconf');
  const [displayConferences, setDisplayedConferences] = useState([])
  const [conferencesList, setConferenceList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await getAllConferences();
      await getAllPendingConferences();
      setLoading(false);
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (key === 'allconf') {
      setDisplayedConferences(conferences);
      setConferenceList(conferences)
    } else if (key === 'userowner') {
      const byUsers = getUserConferences(conferences)
      setDisplayedConferences(byUsers);
      setConferenceList(byUsers)
    } else if (key === 'pending') {
      setDisplayedConferences(pendingConferences);
      setConferenceList(pendingConferences)
    }
  }, [key, conferences, pendingConferences]);



  useEffect(() => {
    const isApliedFilter = checkExistValue(optionsSelectedAdmin).some(value => value === true);

    if (isApliedFilter) {

      const filterResult = filterConferences(conferencesList, optionsSelectedAdmin)
      //const sortConferences = sortConferencesByPriorityKeyword(filterResult, priorityKeywords)
      setDisplayedConferences(filterResult)
    }
    else {
      setDisplayedConferences(conferencesList)
    }

  }, [optionsSelectedAdmin, conferencesList, priorityKeywords])


  useEffect(() => {
   //console.log({selectOptionSort})
    //sắp xếp list
    if (selectOptionSort === "random") {
      setDisplayedConferences(conferencesList)
    }
    else {
      const sortedConferences = sortConferences(selectOptionSort, [...conferencesList])
      setDisplayedConferences(sortedConferences)

     // console.log({ selectOptionSort, sortedConferences })
    }
  }, [selectOptionSort])


  const handleDropdownSelect = (value) => {
    handleSelectOptionSort(value)
  };


  const tabContentRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (tabContentRef.current) {
        tabContentRef.current.style.minHeight = `${window.innerHeight - tabContentRef.current.getBoundingClientRect().top - 20}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container className={` pt-5 overflow-hidden ${windowWidth > 768 ? 'm-5 my-sidebar-content' : 'auth-container'}`}>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className='fs-3'>{t('conference_management')}</h4>
        <ButtonGroup>
          <CycleButton/>
            <ImportButton />
          <ExportButton data={displayConferences} headers={allcolumns} />

        </ButtonGroup>
      </div>

      <div className='p-3 bg-white rounded'>
        <div className="pb-3 border-bottom border-primary-light">

          <Row>
            <Col>
              <label className='me-2'>{t('total_conferences')}:</label>
              <span className='me-2 fw-semibold'>{displayConferences.length}</span>
            </Col>
          </Row>

        </div>

        <Row md={4} className='justify-content-end my-2 mb-3'>
          <Col xs={12}><InputSearch filter={'optionsSelectedAdmin'}/></Col>
          <Col md='auto'>
            {/* Button hiển thị trên màn hình desktop (lg và lớn hơn) */}
            <Button
              className={`rounded-1 d-lg-block d-none border-primary-normal ${showFilter ? 'bg-beige-normal text-teal-normal' : 'bg-white text-color-black'}`}
              onClick={() => setShowFilter(!showFilter)}
            >
              <FontAwesomeIcon icon={faFilter} className='mx-1' />
              {t('filter')}
            </Button>



          </Col>
          <Col md='auto' className='d-flex justify-content-end my-xs-2'>
            {/* Button hiển thị trên màn hình điện thoại (sm và nhỏ hơn) */}
            <Button
              className={`rounded-1 mx-2 py-1 d-lg-none border-primary-normal ${showFilter ? 'bg-beige-normal text-teal-normal' : 'bg-white text-color-black'}`}
              onClick={() => setShowFilterOffcanvas(!showFilter)}
            >
              <FontAwesomeIcon icon={faFilter} className='mx-1' />
              {t('filter')}
            </Button>
            <DropdownSort
              onSelect={handleDropdownSelect}
              options={["random", "upcoming", "nameAz", "latest"]}
            />
          </Col>
        </Row>

        {showFilter && <Filter filter={'optionsSelectedAdmin'} />}
        {showFilterOffcanvas && <FilterOffcanvas showOffcanvas={showFilterOffcanvas} setShowOffcanvas={() => setShowFilterOffcanvas(!showFilterOffcanvas)} />}
        <FilterSelected filterSelectedName={'optionsSelectedAdmin'} filterSelected={state['optionsSelectedAdmin']} />
        {
          loadingConf && loading ?
            <div className="my-4">
              <Loading />
            </div>
            :
            <Tabs
              id="controlled-tab-table"
              activeKey={key}
              onSelect={(k) => setKey(k)}
            >
              <Tab eventKey="allconf" title={`${t('all')} ${t('conferences')}`} className='pt-2' tabClassName='custom-tab-update'>
                <div ref={tabContentRef} className='overflow-y-auto' >
                  <AllConferences conferences={displayConferences} isDeleteIcon={true} onReloadList={getAllConferences}/>
                </div>
              </Tab>
              <Tab eventKey="userowner" title={`${t('userowner')}`} className='pt-2' tabClassName='custom-tab-update'>
                <div ref={tabContentRef} className='overflow-y-auto' >
                  <AllConferences conferences={displayConferences} isDeleteIcon={true} onReloadList={getAllConferences}/>
                </div>
              </Tab>
              <Tab eventKey="pending" title={t('pending')} className='pt-2' tabClassName='custom-tab-update'>
                <div ref={tabContentRef}>
                  <PendingCFPs conferences={displayConferences} onReloadList={getAllPendingConferences}/>
                </div>
              </Tab>
            </Tabs>

        }



      </div>
    </Container>
  )
}

export default ConferencesManagement