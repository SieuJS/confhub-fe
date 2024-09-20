import React from 'react'
import useImport from '../../hooks/useImport'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

const ImportingFilter = () => {
  const { t } = useTranslation()
  const { inProgressLoading, filterConferencesByStatus } = useImport()
  const options = ['done', 'crawling', 'waiting', "stopping", "error"]
  const getStatusClass = (option) => {
    switch (option) {
      case 'waiting':
        return 'option-waiting';
      case 'crawling':
        return 'option-crawling';
      case 'done':
        return 'option-done';
      case 'error':
        return 'option-error';
      case 'stopping':
        return 'option-stopping';
      default:
        return '';
    }
  };
  return (
    <div>
      {
        options.map((opt, index) => (
          <Button
            key={index}
            className={`border-light px-3 mx-3 bg-light`}
          >
            <FontAwesomeIcon icon={faCircle} className={`${getStatusClass(opt)} mx-2`} style={{ width: "10px" }} />
            <span className='text-dark-emphasis fw-bold'>{t(opt)}</span>
          </Button>
        ))
      }
    </div>
  )
}

export default ImportingFilter