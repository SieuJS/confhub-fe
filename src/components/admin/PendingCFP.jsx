import React, { useRef, useState } from 'react'
import TableRender from './TableRender'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import moment from 'moment'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import DeleteModal from '../Modals/DeleteModal'
import { useNavigate } from 'react-router-dom'
import useAdmin from '../../hooks/useAdmin'
import { useTranslation } from 'react-i18next'

const PendingCFPs = ({conferences}) => {
  const {t, i18n} = useTranslation()
    const scrollPositions = useRef({});
    const [showDeleteConf, setShowDelete] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const {loading, deletePost, getAllPendingConferences} = useAdmin()
  const [countdown, setCountdown] = useState(2);
  const [isConfirm, setIsConfirm] = useState(false)
  const [confDel, setConfDel] = useState(null)
  const navigate = useNavigate()
  
  const handleChooseDelete = (conf) => {
    setConfDel(conf)
    setShowDelete(true)
  }

  const handleDeletePost = async (e) => {
    e.preventDefault();    
    setIsConfirm(true)
    const result = await deletePost(confDel.id);
    setStatus(result.status);
    setMessage(result.message);
    if (result.status) {
      getAllPendingConferences()
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(countdownInterval);
            handleClose();
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000); // Giảm mỗi 1 giây
    }
  }
  
  const handleClose = () => {
    setShowDelete(false);
    setStatus(null);
    setMessage('');
    setCountdown(3);
  };
  const handleChooseCfp = async (conf) => {
    // Lưu vị trí cuộn hiện tại trước khi cập nhật URL
    scrollPositions.current[window.location.pathname + window.location.search] = window.scrollY;
    // Cập nhật URL với trang mới
    const newUrl = new URL(window.location);
    //window.history.pushState({}, '', newUrl);

    navigate(`/admin/conferences_management/cfp/${conf.id}`)
  }


  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: (row, index) => index + 1,
        id: 'index',
        width: 40,
        disableResizing: true
      },
      {
        Header: t('name'),
        accessor: 'information.name',
        id: 'name',
        width: 400
      },
      {
        Header:t('acronym'),
        accessor: 'information.acronym',
        width: 100,
        id: 'acronym',
        disableResizing: true
      },
      {
        Header:t('source'),
        accessor: 'information.source',
        id: 'source',
        width: 100,
        disableResizing: true
      },
      {
        Header:t('rank'),
        accessor: 'information.rank',
        id: 'rank',
        width: 150,
        disableResizing: true
      },
      {
        Header:t('field_of_research'),
        id: 'for',
        accessor: (row) => {
          const remainingItems = row.information?.fieldOfResearch.slice(1).map((item, index) => (
            <div key={index}>{item}</div>
          ));
          return (
            <div>
              {row.information?.fieldOfResearch[0]}
              {
                row.information?.fieldOfResearch.length > 1
                &&
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-for`}>
                      {
                        remainingItems
                      }
                    </Tooltip>
                  }
                >
                  <span className='text-decoration-underline mx-1' style={{ cursor: 'pointer' }}>
                    +{row.information?.fieldOfResearch.length - 1} field
                  </span>
                </OverlayTrigger>
              }
            </div>
          );
        },
      },
      {
        Header:t('location'),
        id: 'location',
        accessor: (row) => {
          const newOrganizations = row.organizations.filter(org => org.status === 'new');
          
          if (newOrganizations.length > 0) {
            return capitalizeFirstLetter(newOrganizations[0].location);
          } else {
            return ''; // Hoặc giá trị mặc định khác nếu không có tổ chức nào có status là "new"
          }
        },
        width: 200
      },
      {
        Header:t('type'),
        id: 'type',
        accessor: (row) => {
          const newOrganizations = row.organizations.filter(org => org.status === 'new');
          if (newOrganizations.length > 0) {
            return capitalizeFirstLetter(newOrganizations[0].type);
          } else {
            return ''; // Hoặc giá trị mặc định khác nếu không có tổ chức nào có status là "new"
          }
        },
        width: 100,
        disableResizing: true
      },
      // Định nghĩa cột "Conference date"
      {
        Header:t('conference_date'),
        accessor: (row) => {
          const newOrganizations = row.organizations.filter(org => org.status === 'new');
          if (newOrganizations.length > 0) {
            const startDate = newOrganizations[0].start_date;
            const endDate = newOrganizations[0].end_date;
            return endDate ? `${moment(startDate).format('YYYY/MM/DD')} - ${moment(endDate).format('YYYY/MM/DD')}` : startDate;
          } else {
            return ''; // Hoặc giá trị mặc định khác nếu không có tổ chức nào có status là "new"
          }
        },
        id: 'imporatant, date',
        width: 200
      },
      {
        Header:t('important_dates'),
        id: 'important_dates',
        accessor: (row) => {
          // Lọc và sắp xếp các ngày có status 'new' theo ngày
  const newDates = row.importantDates.filter(date => date.status === 'new');
  const sortedDates = newDates.sort((a, b) => {
    return new Date(a.date_value) - new Date(b.date_value);
  });
          return (
          <div>
          
          {sortedDates.length > 1 && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-for-${row.id}`} >
                  <ul className="list-unstyled">
                    {sortedDates.map(date => (
                      <li key={date.date_id} className="d-flex align-items-center justify-content-start text-nowrap">
                        <span className="date-type">{date.date_type} {`(${moment(date.date_value).format('yyyy/MM/DD')})`}</span>
                      </li>
                    ))}
                  </ul>
                </Tooltip>
              }
            >
             <span className='text-decoration-underline mx-1' style={{ cursor: 'pointer' }}>
            +{newDates.length} {t('date', { count: newDates.length })}
          </span>
            </OverlayTrigger>
          )}
        </div>)
        }
      },
      {
        Header:t('action'),
        id: 'action',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className='fixed-column p-0 d-flex align-items-center justify-content-center'>
            <Button className='bg-transparent  p-0 mx-2 my-0 border-0 action-btn tb-icon-view  '
              onClick={() => handleChooseCfp(row.original)}
              title='View CFP'
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='text-primary-normal action-icon' />
            </Button>

            <Button className='bg-transparent border-0 p-0  my-0 action-btn tb-icon-delete '
              onClick={() => handleChooseDelete(row.original)}>
              <FontAwesomeIcon icon={faTrash} className='text-danger action-icon' />
            </Button>


          </div>
        ),
        disableResizing: true,
      },

    ],
    [i18n.language]
  );
  return (
    <div>
         {showDeleteConf &&
          <DeleteModal
            show={showDeleteConf}
            onClose={() => setShowDelete(!showDeleteConf)}
            onConfirm={handleDeletePost}
            modalTitle={'conference'}
            message={message}
            status={status}
            loading={loading}
            countdown={countdown}
            isConfirm={isConfirm}
          />}
    <TableRender data={conferences} columns={columns} />
    </div>
  )
}

export default PendingCFPs