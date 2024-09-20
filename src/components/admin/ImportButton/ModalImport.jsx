import { faFile, faFileArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import usePost from '../../../hooks/usePost'
import AddConference from '../../Modals/AddConference'
import SuccessfulModal from '../../Modals/SuccessModal'
import useImport from '../../../hooks/useImport'
import ImportModalFile from './ImportModalFile'
import { useTranslation } from 'react-i18next'
import ImportAConfModal from '../ImportAConfModal'

const ModalImport = ({show, onHide}) => {
  const {t} = useTranslation()
    const {showImportModal, setShowImportModal} = useImport()
    const [showAddForm, setShowAddForm] = useState(false)
  const { getPostedConferences } = usePost()
  const [showSuccess, setShowSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const handleCheckStatus = (status, messageSuccess) => {
    setMessage(messageSuccess)
    if (status) {
      setShowAddForm(false);
      setShowSuccess(true)

    }
  }

  const handleClosePost = () => {
    setShowAddForm(false)
    onHide()
  };
  const handleShowPost = () => setShowAddForm(true);
  const hanleCloseAll = () => {
    onHide()
    setShowImportModal(false)
  }
  return (
    <Modal show={show}  onHide={onHide} fullscreen="sm-down">
    <Modal.Header closeButton className='border-0'>    
    </Modal.Header>
    <Modal.Body className='pb-5'>
    <ImportAConfModal show={showAddForm} handleClose={handleClosePost} handleCheckStatus={handleCheckStatus} onReloadList={getPostedConferences} />
      {showSuccess && <SuccessfulModal message={message} show={showSuccess} handleClosePost={() => setShowSuccess(false)} />}
      {showImportModal &&  <ImportModalFile show={showImportModal} onHide={()=>setShowImportModal(false)} closeAllModal={()=>hanleCloseAll()}/>}
      <div className="text-center text-teal-dark h4 fw-bold">
        {`${t('import_file')} ${t('conference').toLowerCase()}`}
      </div>
      <div className="d-flex justify-content-center align-items-center p-5">
        <Button
        onClick={handleShowPost}
         className='text-center p-4 rounded border-teal-light shadow-sm bg-skyblue-light mx-3'
            style={{minWidth: "160px", minHeight: "200px"}}>
            <FontAwesomeIcon icon={faFile} className='h1 text-primary'/>
            <div className='text-primary'> {t('post_conference')}</div>
        </Button>
        <Button
        onClick={()=>setShowImportModal(true)}
         className='text-center p-4 rounded border-teal-light shadow-sm bg-skyblue-light mx-3'
        style={{minWidth: "160px", minHeight: "200px", maxHeight: '200px'}}>
            <FontAwesomeIcon icon={faFileArrowUp} className='h1 text-primary'/>
            <div className='text-primary'>{`${t('import_file')} ${t('conferences')}`}</div>
        </Button>
      </div>

      <div className="text-center text-darkcyan-normal px-5">
       {t('choose_option_add_import')}
      </div>
    </Modal.Body>
    </Modal>
  )
}

export default ModalImport