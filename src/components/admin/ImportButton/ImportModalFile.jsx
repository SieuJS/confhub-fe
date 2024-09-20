import { Button, Modal } from 'react-bootstrap'

import useImport from '../../../hooks/useImport';
import ImportedDataTable from '../ImportedDataTable';
import { useTranslation } from 'react-i18next';
const ImportModalFile = ({show, onHide, closeAllModal}) => {
  const {t} = useTranslation()
    const {getRootProps, getInputProps, isDragActive, fileUploaded} = useImport()
  return (
    <Modal show={show}  onHide={onHide}  dialogClassName="modal-90w modal-90h custom-modal" className="custom-modal">
    <Modal.Header closeButton>
      <Modal.Title>
        {fileUploaded ? `${t('columns')}` :  `${t('upload_data')}`}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className='h-100'>
        <div className={` d-flex  ${fileUploaded ? 'justify-content-center w-100' : 'my-5 justify-content-center'}`}> 
            {
                !fileUploaded ?
                <div {...getRootProps({ className: 'dropzone' })} className='p-5 bg-teal-light rounded text-center'  style={{maxWidth: "500px", minWidth: "100px", cursor: "pointer"}}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>{t('drop_files_here')}...</p>
              ) : (
               <>
                <p className='fs-medium fw-bold'>{t('drops_file_here_or_click')}</p>
                <p className="text-color-medium">{t('csv_xls_files_accepted')}</p>
               </>
              )}
            </div>
            :
            <ImportedDataTable onHide={onHide} closeAllModal={closeAllModal}/>
            }
        </div>
    </Modal.Body>
    </Modal>
  )
}

export default ImportModalFile