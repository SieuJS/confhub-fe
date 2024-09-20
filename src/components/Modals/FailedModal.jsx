import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import usePost from '../../hooks/usePost';


function FailedModal({ error, handleCloseForm}) {
  const {status, setStatusPost} = usePost()
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (setStatusPost) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      // Đóng modal sau 5 giây
      setTimeout(() => {
        setStatusPost(false);
        handleCloseForm()
        setCountdown(5); // Reset thời gian đếm ngược
      }, 5000);

      // Hủy bỏ timer khi component unmount
      return () => {
        clearInterval(timer);
      };
    }
  }, [setStatusPost]);

  const handleCloseSuccessModal = () => {
    setStatusPost(false);
    setCountdown(5); // Reset thời gian đếm ngược
  };

  return (
    <div>
       <Modal show={status} onHide={handleCloseSuccessModal}>
      <Modal.Header closeButton>
        <Modal.Title className='text-danger'>Failed</Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-danger'>
        {error}
      </Modal.Body>
      <Modal.Footer>
        
      {status && <p>Auto closing in {countdown} seconds</p>}
      </Modal.Footer>
    </Modal>
    </div>
  );
}

export default FailedModal;
