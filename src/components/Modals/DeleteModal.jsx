import { ButtonGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import Loading from '../Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';

const DeleteModal = ({ show, onClose, onConfirm, status, loading, isConfirm, countdown, onModalClick, message }) => {
  const {t} = useTranslation()
  const modalRef = useRef(null);

  return (
    <Modal show={show} onHide={(e)=>onClose(e)} centered>
        <div ref={modalRef} >
          <Modal.Body onClick={(e) => e.stopPropagation()}>
          <div className="d-flex justify-content-between align-items-center py-2 mb-3">
              <Modal.Title className='text-center w-100 text-danger ps-5'>{`${t('delete')} ${t('conference')}`}</Modal.Title>
              <Button variant="secondary" onClick={onClose} className='bg-transparent border-0'>
                <FontAwesomeIcon icon={faXmark} className='text-secondary fs-3' />
              </Button>
            </div>
            <p className="fs-5 fw-bold">{t('confirm_delete')}</p>
            <p>{t('thisActionIsPermanent')}</p>
          </Modal.Body>
          <Modal.Footer>
            {
              isConfirm && !loading
                ?
                <>
                {
                status ? (
                  <div className = {status ? 'text-success' : 'text-danger'}>
                    {status && <div>
                      <span className='text-success'>{t('success')}</span>. {t('closing_countdown', {countdown: countdown})}</div>}
                  </div>
                )
                :
                <div className = {'text-danger'}>
                      <span>{message}</span>. 
                  </div>
                }
                </>
                :
                <ButtonGroup className='w-100'>
                  <Button className='bg-secondary border-light me-2 rounded' onClick={onClose}>
                    {t('cancel')}
                  </Button>
                  <Button className='bg-red-normal border-danger ms-2  rounded' onClick={onConfirm}>
                    {
                      loading
                        ?
                        <Loading />
                        :
                        `${t('delete')}`
                    }
                  </Button>
                </ButtonGroup>
            }
          </Modal.Footer>
        </div>
    </Modal>
  )
}

export default DeleteModal