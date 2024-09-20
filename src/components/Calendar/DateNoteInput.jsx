import { useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { ButtonGroup, Button, Form, Spinner } from 'react-bootstrap';

import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import useCalender from '../../hooks/useCalendar';
import useNote from '../../hooks/useNote';
const AddNote = ({ onClose, dateClicked }) => {
  // State để lưu trữ giá trị "note" và "date_value"
  const [note, setNote] = useState('');
  const { addNote, getAllNotes } = useNote()
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [status, setStatus] = useState(false)
  const [countdown, setCountdown] = useState(5); // Số giây đếm ngược
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closingOverlay, setClosingOverlay] = useState(false);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (isSubmitting && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      if (!isSubmitting) {
        setIsSubmitting(false)
        setMessage('');
        setStatus(false);
        setError(false);
        setStatus(false)
      }
    }
  }, [countdown, isSubmitting]);
  // Sử dụng useEffect để kiểm soát việc đóng overlay khi countdown kết thúc
  useEffect(() => {
    if (countdown === 0 && closingOverlay) {
      // Khi countdown kết thúc và biến state đóng overlay được đặt, đóng overlay
      onClose(false);
    }
  }, [countdown, closingOverlay]);

  // Hàm xử lý khi submit form
  const handleSubmit = async () => {
    
    setIsSubmitting(true)
    try {
      setLoading(true)
      const date_value = dateClicked
      const result = await addNote(note, date_value);
      if (result.new_note) {
        setIsSubmitting(false)
        getAllNotes()
        setLoading(false)
        setMessage('Note added successfully. Auto close in ');
        setStatus(true)
        setCountdown(3); // Khởi động lại đếm ngược
        // Đặt biến state để không đóng overlay ngay lập tức
        setClosingOverlay(true);
      } else {
        setLoading(false)
        setIsSubmitting(false)
        setMessage(result.message);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
    }
  };
  return (
    <Form onSubmit={handleSubmit} className='text-center'>
      <Form.Group className='text-start'>
        <Form.Label>Date: </Form.Label>
        <Form.Control
          disabled
          placeholder={dateClicked}
        />
      </Form.Group>
      <Form.Group className="mb-1 text-start">

        <Form.Label>Note:</Form.Label>
        <Form.Control
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your note"
          as="textarea" rows={3}
          className={error && 'border-danger'}
        />
      </Form.Group>
      {
        error &&
        <span className="text-danger">{message}</span>
      }
      {
        status &&
        <span className="text-success">{message} {countdown}</span>
      }
      <ButtonGroup className='top-100 w-100 bg-white px-2 py-2'>
        <Button
          onClick={() => onClose(false)}
          className='w-50 me-2 rounded-2 border-0 bg-secondary'>
          Cancel
        </Button>
        {
          !loading && !isSubmitting?
          <Button className='w-50 rounded-2 border-0 bg-primary-normal' onClick={handleSubmit}>
          Add
        </Button>
        :
        <Button className='w-50 rounded-2 border-0 bg-primary-normal' disabled>
          <Spinner animation="border"  size="sm" />;
        </Button>
        }
      </ButtonGroup>
    </Form>

  );
};

export default AddNote;