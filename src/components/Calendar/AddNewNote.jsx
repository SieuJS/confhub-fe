import { useEffect, useState } from 'react'
import { Button, ButtonGroup, Form } from 'react-bootstrap'
import useNote from '../../hooks/useNote';
import Loading from '../Loading';
import { useTranslation } from 'react-i18next';

const AddNewNote = ({ dateClicked, onClose, onBack, onAdd, onReloadList }) => {
  const {t} = useTranslation()
  const { loading, addNote } = useNote()
  const [warning, setWarning] = useState('')
  const [inputvalue, setInputValue] = useState('');
  const [isSubmit, setIsSubmit] = useState(false)
  const [autoClose, setAutoCLose] = useState(3)

  const [message, setMessage] = useState(false)
  const [error, setError] = useState(false)
  const [statusUpdate, setStatusUpdate] = useState(false)
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleButtonClick = () => {
    // Đặt lại giá trị
    setInputValue('');
    // Quay lại item đầu tiên trong carousel
    onBack()
  };

  useEffect(() => {
    if (statusUpdate) {

      const timer = setInterval(() => {
        setAutoCLose(prevCountdown => prevCountdown - 1);
      }, 1000);

      // Đóng modal sau 5 giây
      setTimeout(() => {
        onClose()
        setAutoCLose(2); // Reset thời gian đếm ngược
      }, 2000);

      // Hủy bỏ timer khi component unmount
      return () => {
        clearInterval(timer);
      };
    }
  }, [statusUpdate]);

  const handleAddNew = async () => {
    try {
      if (inputvalue !== '') {
        setIsSubmit(true)
        setWarning('')
        const { status, message } = await addNote(inputvalue, dateClicked)
       
        if (status) {
          setStatusUpdate(status)
          setMessage(message)
          onReloadList()
        }
        else {
          setMessage(message)
          setError(true)
          setInputValue('')
        }
      }
      else setWarning('You should input something!')

    } catch (error) {
      console.error('Error:', error);

    }
  }
  return (
    <div>
      <Form >
        <Form.Group controlId="inputTextArea">
          <Form.Label>{`${t('date')}: ${dateClicked}`}</Form.Label>
          <Form.Control
            as="textarea"
            placeholder={`${t('add_new')} ${t('note').toLowerCase()}`}
            rows={4}
            value={inputvalue}
            onChange={handleChange}
          />
        </Form.Group>


      </Form>
      <div className='my-2'>
        {warning !== '' && <p className="text-warning text-center">{warning}</p>}
        {error && <p className="text-danger text-center">{message}</p>}
        {!error && isSubmit && <p className="text-success text-center">{message}</p>}
        <ButtonGroup className="w-100 my-1">
          <Button className='bg-transparent me-2 rounded text-color-black' onClick={handleButtonClick}>{t('back')}</Button>
          <Button className='bg-primary-normal border-light ms-2 rounded' onClick={handleAddNew}>
            {
              loading ? <Loading size={'sm'}/> : `${t('add_new')}`
            }
          </Button>
        </ButtonGroup>
      </div>
      {statusUpdate && isSubmit &&  <span className='text-success'>{t('success')}{t('closing_countdown', {countdown: autoClose})}</span>}
    </div>
  )
}

export default AddNewNote