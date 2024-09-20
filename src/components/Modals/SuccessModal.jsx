import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';


function SuccessfulModal({ message, show, handleClose, onModalClick }) {

  const [countdown, setCountdown] = useState(1);

  useEffect(() => {
    if (show) {
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
  }, [show]);

  const handleCloseSuccessModal = () => {
    setCountdown(2); // Reset thời gian đếm ngược
  };

  return (
    <div>
      <Modal show={show} onHide={handleCloseSuccessModal} centered>       
        <Modal.Body onClick={(e) => e.stopPropagation()} >
        <div className="d-flex justify-content-between align-items-center py-2 mb-3">
          <Modal.Title className='text-center w-100 text-success ps-5'>Success</Modal.Title>
          <Button variant="secondary" onClick={handleClose} className='bg-transparent border-0'>
            <FontAwesomeIcon icon={faXmark} className='text-secondary fs-3' />
          </Button>
        </div>
          <span className='text-success'> {message}</span>
        </Modal.Body>
        <Modal.Footer onClick={(e) => e.stopPropagation()} >

          {show && <p>Auto closing in {countdown} seconds</p>}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SuccessfulModal;
