import React, { useState } from 'react'
import DeleteModal from '../Modals/DeleteModal';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DeleteButton = ({id, onDelete, onReloadList}) => {
    const [countdown, setCountdown] = useState(2);
  const [isConfirm, setIsConfirm] = useState(false)
  const [showDeleteConf, setShowDelete] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleChooseDelete = () => {
    setShowDelete(true)
  }

    const handleDeletePost = async (e) => {
        e.preventDefault();
        setLoading(true)
        setIsConfirm(true)
        const result = await onDelete(id);
        setStatus(result.status);
        setMessage(result.message);
        setLoading(false)
        if (result.status) {
          onReloadList()
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
         <Button className='bg-transparent border-0 p-0  my-0 action-btn tb-icon-delete '
            onClick={handleChooseDelete}>
            <FontAwesomeIcon icon={faTrash} className='text-danger action-icon fs-5' />
          </Button>
    </div>
  )
}

export default DeleteButton