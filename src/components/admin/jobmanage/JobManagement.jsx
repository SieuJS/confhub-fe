import React, { useEffect, useMemo, useState } from 'react'
import useCrawlJob from '../../../hooks/useCrawlJob'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import NavigateButton from '../NavigateButton'
import TableRender from '../TableRender'
import DeleteButton from '../DeleteButton'
import { capitalizeFirstLetter } from '../../../utils/formatWord'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import useFilter from '../../../hooks/useFilter'
import InputSearhInList from '../InputSearhInList'

const JobManagement = () => {
  const {t, i18n} = useTranslation()
  const {allCrawlJobs, getAllCrawlJobs, deleteJobByID} = useCrawlJob()
  const [displayConferences, setDisplayedConferences] = useState(allCrawlJobs)
  const {searchInObject} = useFilter()

  useEffect(()=> {
    getAllCrawlJobs()
  },[])

  useEffect(()=>{
    setDisplayedConferences(allCrawlJobs)
  },[allCrawlJobs])

  const handleFilter = (keyword) => {
    const filtered = allCrawlJobs.filter(user => searchInObject(user, keyword));
    //console.log({filtered})
    setDisplayedConferences(filtered);
  }
  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: (row, index) => index + 1,
        id: 'index',
        width: 30,
        disableResizing: true
      },
      {
        Header: t('ID'),
        accessor: '_id',
        id: '_id',
        width: 200,
        Cell: ({ value }) => (
          <div className="text-nowrap">
            {value}
          </div>
        )
      },
      {
        Header: t('type'),
        accessor: 'type',
        id: 'type',
        width: 150,
        Cell: ({ value }) => (
          <div className="text-nowrap">
            {capitalizeFirstLetter(value)}
          </div>
        )
      },
      {
        Header: t('status'),
        accessor: 'status',
        id: 'status',
        width: 100,
        Cell: ({ value }) => (
          <div className={`status-${value?.toLowerCase()} px-3`}>
            {t(value)}
          </div>
        )
      },
      {
        Header: t('created_at'),
        accessor: 'createdAt',
        id: 'createdAt',
        width: 200,
        Cell: ({ value }) => (
          <div className="text-nowrap">
            {moment(value).format('YYYY/MM/DD hh:mm:ss A')}
          </div>
        )
      },
      {
        Header: t('updated_at'),
        accessor: 'updatedAt',
        id: 'updatedAt',
        width: 200,
        Cell: ({ value }) => (
          <div className="text-nowrap">
            {moment(value).format('YYYY/MM/DD hh:mm:ss A')}
          </div>
        )
      },
      {
        Header: t('progress'),
        accessor: 'progress.percentage',
        id: 'progress',
        width: 150,
        Cell: ({ value, row }) => (
          <div className="text-center">
            {row?.original?.status !== 'completed' ? `${value || 0}%` : '100%'}
          </div>
        )
      },
      {
        Header: t('detail'),
        accessor: 'progress.detail',
        id: 'progressDetail',
        width: 300,
        Cell: ({ value }) => (
          <div className="text-nowrap">
            {value || ''}
          </div>
        )
      },
      {
        Header: t('error'),
        accessor: 'error',
        id: 'error',
        width: 300,
        Cell: ({ value }) => (
          <div className="text-nowrap">
            {value}
          </div>
        ),
        disableFilters: false,
      },
      {
        Header: `${t('duration')} (s)`,
        accessor: 'duration',
        id: 'duration',
        width: 150,
        Cell: ({ value }) => {
          const minutes = value ? (value / 1000).toFixed(2) : 0; // Chuyển đổi ms thành phút và làm tròn đến 2 chữ số thập phân
          return (
            <div className="text-nowrap">
              {minutes}
            </div>
          );
        }
      },
      {
        Header: t('action'),
        accessor: 'action',
        id: 'action',
        width: 100,
        Cell: ({ row }) => (
          <>
          <DeleteButton
            id={row.original._id}
            onDelete={deleteJobByID}
            onReloadList={getAllCrawlJobs}
          />
          </>
        )
      }
    ],
    [t, i18n.language, allCrawlJobs]
  );

  return (
    <div className='mt-3 border-top pt-3'>
      <div className='fw-bold fs-5 d-flex justify-content-between align-items-center'>
        <span className='now-wrap'>{t('total_crawl_job')}: {allCrawlJobs.length} </span>
        <div>
          <InputSearhInList onApplyFilter={handleFilter}/>       
        </div>
      </div>

      <TableRender columns={columns} data={displayConferences}/> 
    </div>
  )
}

export default JobManagement