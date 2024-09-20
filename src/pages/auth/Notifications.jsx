import { useEffect, useState } from 'react'
import { Button, Container, Row } from 'react-bootstrap'
import useNotification from '../../hooks/useNotification'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../../hooks/useLocalStorage'
import Loading from '../../components/Loading'
import ReactPaginate from 'react-paginate'
import useConference from '../../hooks/useConferences'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons'
const Notifications = () => {
  const {t} = useTranslation()
  const { user } = useLocalStorage()
  const {handleGetOne} = useConference()
  const { loading, notifications, getAllNotifications, getNoticationById } = useNotification()
  const [currentPage, setCurrentPage] = useState(0);
  const [notificationsPerPage] = useState(7);
  const navigate = useNavigate()

  useEffect(() => {
    getAllNotifications()
  }, [])

  useEffect(() => {
    if (!notifications) {
      getAllNotifications()
    }
  }, [user])

  const makeDateBold = (dateStr) => {
    return `<strong>${moment(dateStr).format('YYYY/MM/DD')}</strong>`;
  };
  // Tính toán index của thông báo đầu tiên và cuối cùng của mỗi trang
  const indexOfLastNotification = (currentPage + 1) * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const splitNotificationMessage = (message) => {
    const parts = message.split('. ');
    const firstPart = parts[0];
    const secondPart = parts.slice(1).join('. '); // Nối lại các phần còn lại, phòng trường hợp thông báo có nhiều hơn một dấu chấm
    const secondPartWithBoldDate = secondPart.replace(/"\d+\/\d+\/\d+"/g, makeDateBold); // In đậm ngày
    return { firstPart, secondPart: secondPartWithBoldDate };
  };
  const processMessage = (message) => {
    // Tách dữ liệu từ message sử dụng biểu thức chính quy
    const regex = /"(.*?)"/g;
    let match;
    let parts = [];
    while ((match = regex.exec(message)) !== null) {
      parts.push(match[1]);
    }

    // Xử lý từng loại thông báo dựa trên từng phần từ
    if (message.includes('[UPDATED]')) {
      const [conferenceName, startDate, endDate, location, type] = parts;
      return t('updatedConferenceDetails', { conferenceName, startDate, endDate, location, type });
    } else if (message.includes('[NEW]')) {
      const [conferenceName, submissionDeadline] = parts;
      return t('updatedPaperDeadline', { conferenceName, submissionDeadline });
    } else if (message.includes('[DELETE]')) {
      const [conferenceName, submissionDeadline] = parts;
      return t('cancelledSubmissionDeadline', { conferenceName, submissionDeadline });
    } else if (message.includes('[UPCOMING]')) {
      const [conferenceName, startDate, endDate] = parts;
      return t('upcomingConference', { conferenceName, startDate, endDate });
    }
    else {
      return message; // Trả về thông báo không được hỗ trợ nếu không khớp với bất kỳ mẫu nào
    }
  };

  const handleViewMore = async (noti) => {
    await getNoticationById([noti])
    navigate(`/detailed-information/${noti.Follow.CallForPaperCfpId}`)
  }
  return (
    <Container className=' m-5 pt-5  overflow-x-hidden'>
      <h4 className='mb-4'>{t('notifications')}</h4>
      <p className='fs-medium'>{t('all_notifications_here')}</p>

      {
        loading
          ?
          <>
            <Loading onReload={getAllNotifications} />
          </>
          :
          <>
            {
              currentNotifications.map((noti, index) => {
                const { firstPart, secondPart } = splitNotificationMessage(noti.message);
                return (
                  <Row key={index} className={`py-4 rounded-2 my-4 me-3 noti-wrapper ${noti.read_status ? ' bg-light' : 'bg-skyblue-light'}`}>
                    <div className="d-flex align-items-start ">
                      <FontAwesomeIcon icon={faCircle} className={`me-2 mt-2 ${noti.read_status ? 'text-secondary' : ' text-darkcyan-normal'}`}/>
                    <div>
                      <span className={`fw-semibold fs-5  ${noti.read_status ? 'text-secondary' : ' text-darkcyan-normal'}`}>{firstPart}</span>
                      <div className={`fs-5 ${noti.read_status ? 'text-secondary' : ' text-darkcyan-normal'}`} dangerouslySetInnerHTML={{ __html: secondPart }}></div>
                      <div className="d-flex justify-content-between align-items-center">
                      <div className='text-color-medium fs-5  text-nowrap'>
                        {`${t('updated_in')} ${moment(noti.ctime).format('YYYY/MM/DD HH:mm')}`}
                      </div>
                      <Button
                        disabled={noti.Follow.CallForPaperCfpId !== 'null' ? false : true}
                        onClick={() => handleViewMore(noti)}
                        className=" d-flex justify-content-end bg-transparent text-teal-normal text-decoration-underline border-0 btn-noti-more text-nowrap"
                        title='Go to detailed information page'
                      >
                        {
                          noti.Follow.CallForPaperCfpId !== 'null'
                            ?
                            `${t('more_details')}`
                            :
                            `You've unfollowed this conference.`
                        }
                      </Button>
                    </div>
                    </div>
                    
                    </div>
                    

                   
                  </Row>
                )
              })
            }

<ReactPaginate
              pageCount={Math.ceil(notifications.length / notificationsPerPage)}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
              onPageChange={handlePageClick}
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
              breakLabel="..."
              nextLabel=">"
              previousLabel="<"
            />
          </>
      }
    </Container>
  )
}

export default Notifications