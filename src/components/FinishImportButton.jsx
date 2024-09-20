import React from 'react'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import useCrawlJob from '../hooks/useCrawlJob'

const FinishImportButton = () => {
    const {t} = useTranslation()
    const {handleFinishJobs} = useCrawlJob()
  return (
    <Button onClick={handleFinishJobs} className='px-2 py-1 bg-primary-normal border-light text-nowrap'>
        {t('done')}
    </Button>
  )
}

export default FinishImportButton