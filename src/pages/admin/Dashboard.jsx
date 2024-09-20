import { faArrowRight, faFileContract, faSpider, faSquareUpRight, faUserClock, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import useDashboard from '../../hooks/useDashboard'
import useConference from '../../hooks/useConferences'
import useAdmin from '../../hooks/useAdmin'
import UserChart from '../../components/admin/dashboard/UserChart'
import { Button, Col, Row } from 'react-bootstrap'
import moment from 'moment'
import ETLChart from '../../components/admin/dashboard/ETLChart'
import AllConferences from '../../components/admin/AllConferences'
import AllUsers from '../../components/admin/AllUsers'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
import DashboardLoading from '../../components/ProgressLoading/DashboardLoading'
const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const {windowWidth} = useScreenSize()
  const { etlLog, currentUsers,
    startDate, endDate, handleEndDateChange, handleStartDateChange, resetDates,
    getCurrentUser, getEtlLog, getUserLog, getLatestAccessInfo } = useDashboard()
  const [filterType, setFilterType] = useState('weekly'); // Default to weekly filter
  const { conferences, getAllConferences } = useConference()
  const { users, getAllUsers } = useAdmin()
  const [latesDateETL, setLatestDateETL] = useState({ date: '', totalCrawls: 0 });
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const start = moment().subtract(6, 'days').format('YYYY-MM-DD')
      const end = moment().format('YYYY-MM-DD')

      handleStartDateChange(start)
      handleEndDateChange(end)

      await getCurrentUser()
      await getEtlLog(start, end)
      await getUserLog(start, end)
      await getAllConferences()
      await getAllUsers()
      setLoading(false)
    }
    fetchData()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      await getCurrentUser()
    };

    // Gọi fetchData ngay lần đầu tiên
    fetchData();

    // Thiết lập interval để gọi fetchData sau mỗi 5 phút
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000); // 5 phút

    // Xóa interval khi component unmount để tránh memory leak
    return () => clearInterval(interval);
  }, []); // useEffect chỉ chạy 1 lần khi mount, với dependencies là []

  useEffect(() => {
    const latestetlLog = getLatestAccessInfo(etlLog);
    setLatestDateETL(latestetlLog);
  }, [etlLog])

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    resetDates(type);
  };
  return (
    <div className='my-sidebar-content bg-light'>
      {
        loading ?
          <DashboardLoading />
          :
          <>
            <div className="mx-5 my-3 p-5 bg-white border-bottom rounded-1">
              <div className='border-5 border-teal-normal border-start py-0  my-3 ms-3'>
                <h4 className="text-teal-normal ms-2">{t('overview')}</h4>
              </div>
              <Row className="d-flex justify-content-start align-items-center">
                <Col className="rounded mx-2 border border-light shadow-sm p-2">
                  <div className='p-1 rounded shadow-sm d-inline'>
                    <FontAwesomeIcon icon={faFileContract} className='text-teal-normal' />
                  </div>
                  <div className="text-light-emphasis fw-bold mt-3 me-5">{t('total_conferences')}</div>
                  <div className='d-flex align-items-center'>
                    <h3 className=" fw-bold me-1"> {conferences.length}</h3>
                    <span className='text-light-emphasis'>{`  ${t('conference').toLowerCase()}${conferences.length > 1 && i18n.language === 'en' ? 's' : ''}`}</span>
                  </div>
                </Col>
                <Col className="rounded mx-2 border border-light shadow-sm p-2 overview-tab">
                  <div className='p-1 rounded shadow-sm d-inline'>
                    <FontAwesomeIcon icon={faUsers} className='text-info' />

                  </div>
                  <div className="text-light-emphasis fw-bold mt-3 me-5">{t('total_user_accounts')}</div>
                  <div className='d-flex align-items-center'>
                    <h3 className=" fw-bold me-1"> {users.length}</h3>
                    <span className='text-light-emphasis'>{`  ${t('user').toLowerCase()}${currentUsers.length > 1 && i18n.language === 'en' ? 's' : ''}`}</span>
                  </div>
                </Col>
                <Col className="rounded mx-2 border border-light shadow-sm p-2 overview-tab">
                  <div className='p-1 rounded shadow-sm d-inline'>
                    <FontAwesomeIcon icon={faUserClock} className='text-primary' />
                  </div>
                  <div className="text-light-emphasis fw-bold mt-3 me-5">{t('user_logging')}</div>
                  <div className='d-flex align-items-center'>
                    <h3 className=" fw-bold me-1"> {currentUsers.length}</h3>
                    <span className='text-light-emphasis'>{`  ${t('visitors').toLowerCase()}${currentUsers.length > 1 && i18n.language === 'en' ? 's' : ''}  (*${t('updated_every_5m')})`}</span>
                  </div>
                </Col>
                <Col className="rounded mx-2 border border-light shadow-sm p-2 overview-tab">
                  <div className='p-1 rounded shadow-sm d-inline'>
                    <FontAwesomeIcon icon={faSpider} className='text-warning' />
                  </div>
                  <div className="text-light-emphasis fw-bold mt-3 me-5">{t('latest_date_crawl')}</div>
                  <div className='d-flex align-items-center'>
                    <h3 className=" fw-bold me-1"> {latesDateETL?.totalCrawls}</h3>
                    <span className='mx-1 text-light-emphasis'>{`${t('run')}${latesDateETL?.totalCrawls > 1 && i18n.language === 'en' ? 's' : ''}`}</span>
                    <span className='fw-bold text-light-emphasis'>{` ${t('in')} ${latesDateETL?.date !== '' && moment(latesDateETL.date).format('YYYY/MM/DD')}`}</span>
                  </div>

                </Col>
              </Row>
            </div>

            {/**Charts go here */}
            <div className=''>
            

              <Row className='align-items-center bg-white d-flex justify-content-between align-items-center rounded bg-beige-light px-5 mx-5 pt-5'>
                <Col xs="12" sm="6" md="6" className='my-1'>
                <div className="mx-1 fw-bold fs-large text-light-emphasis">
                {
                  startDate && endDate &&
                  <>
                    {moment(startDate).locale(i18n.language).format('Do MMMM YYYY')}
                    {` - ${moment(endDate).format('Do MMMM, YYYY')}`}
                  </>
                }
              </div>
                </Col>
                <Col xs="12" sm="6" md="6" className='d-flex p-0 justify-content-end my-1'>
                {
                  filterType === 'pickDate' && windowWidth > 768 &&
                  (<div className="d-flex justify-content-center align-items-center  etl-filter-date-input-wrapper text-nowrap">

                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className='text-darkcyan-normal rounded border-1 border-primary-normal p-1'
                    />
                    <FontAwesomeIcon icon={faArrowRight} className='mx-2' />
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={endDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className='text-darkcyan-normal rounded border-1 border-primary-normal p-1'
                    />

                  </div>)
                }
                <Button
                  onClick={() => handleFilterTypeChange('pickDate')}
                  className={`rounded-pill  fw-bold btn-custom-etl-filter border-0 text-nowrap  
                      ${filterType === 'pickDate' ? 'bg-beige-normal text-teal-normal' : 'bg-white text-light-emphasis'}
                      ${windowWidth > 768 ? 'p-2 px-3': 'p-1 px-2'}
                      `}
                >
                  {t('pick_date')}
                </Button>
                <Button
                  onClick={() => handleFilterTypeChange('weekly')}
                  className={`rounded-pill  fw-bold btn-custom-etl-filter border-0 text-nowrap  
                    ${filterType === 'weekly' ? 'bg-beige-normal text-teal-normal' : 'bg-white text-light-emphasis'}
                    ${windowWidth > 768 ? 'p-2 px-3': 'p-1 px-2'}
                    `}
                >
                  {t('weekly')}
                </Button>
                <Button
                  onClick={() => handleFilterTypeChange('monthly')}
                  className={`rounded-pill  fw-bold btn-custom-etl-filter border-0 text-nowrap  
                    ${filterType === 'monthly' ? 'bg-beige-normal text-teal-normal' : 'bg-white text-light-emphasis'}
                    ${windowWidth > 768 ? 'p-2 px-3': 'p-1 px-2'}
                    `}
                >
                  {t('monthly')}
                </Button>
                </Col>

              </Row>
              {
                  windowWidth < 768 && filterType === 'pickDate' &&
                  (<div className="d-flex justify-content-center align-items-center  etl-filter-date-input-wrapper text-nowrap">

                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className='text-darkcyan-normal rounded border-1 border-primary-normal p-1'
                    />
                    <FontAwesomeIcon icon={faArrowRight} className='mx-2' />
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={endDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className='text-darkcyan-normal rounded border-1 border-primary-normal p-1'
                    />

                  </div>)
                }
            </div>

            <div className='mx-5 p-5 pb-0 bg-white chart-wrapper'>
              <div className='chart-container'>
                <ETLChart startDate={startDate} endDate={endDate} />
              </div>
              <div className='chart-container'>
                <UserChart startDate={startDate} endDate={endDate} />
              </div>
            </div>

            <div className='mx-5 mb-3 my-3 p-5 bg-white rounded-1'>
              <div className='mb-3 ms-3 d-flex justify-content-between align-items-center'>
                <div className='border-5 border-teal-normal border-start'>
                  <h4 className="fs-4 text-darkcyan-normal ms-2 my-0">{`${t('all')} ${t('conferences')}`}</h4>
                </div>
                <Button
                  onClick={() => navigate('/admin/conferences_management')}
                  className='d-flex justify-content-center align-items-center bg-teal-normal text-nowrap fs-5'>
                  {t('showall')}
                  <div className="rounded-2 px-2 bg-teal-normal">
                    <FontAwesomeIcon icon={faSquareUpRight} />
                  </div>
                </Button>
              </div>
              <AllConferences conferences={conferences} />
            </div>
            <div className='mx-5 my-3 p-5 bg-white rounded-1'>
              <div className='mb-3 ms-3 d-flex justify-content-between align-items-center'>

                <div className='border-5 border-darkcyan-normal border-start'>
                  <h4 className="fs-4 text-darkcyan-normal ms-2 my-0">{`${t('all')} ${t('users')}`}</h4>
                </div>
                <Button
                  onClick={() => navigate('/admin/users_management')}
                  className='d-flex justify-content-center align-items-center bg-darkcyan-normal text-nowrap fs-5'>
                  {t('showall')}
                  <div className="rounded-2 px-2 bg-darkcyan-normal">
                    <FontAwesomeIcon icon={faSquareUpRight} />
                  </div>
                </Button>
              </div>
              <AllUsers />
            </div>
          </>
      }
    </div>
  )
}

export default Dashboard