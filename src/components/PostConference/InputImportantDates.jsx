import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import useFormDataInput from '../../hooks/useFormDataInput';
import daysToWeeks from 'date-fns/fp/daysToWeeks';

const InputImportantDates = ({ formData, onChange, round }) => {

  const [dates, setDates] = useState([
  
  ]);

  const handleDateChange = (index, e) => {
    const { name, value } = e.target
    const updatedDates = [...dates];
    updatedDates[index].date_value = value ;
    const newDate = {
      date_type: name,
      date_value: value
    }
    setDates(updatedDates);
    onChange(round, newDate)
  };

  
  return (
    <>
      {dates.map((date, index) => (
        <Form.Group as={Row} key={index} className='my-3 d-flex w-100'>

        <Col sm='6'>
          <Form.Label>Date type:</Form.Label>
          <Form.Control type="text" value={date.date_type} onChange={(e) => handleDateChange(index, 'date_type', e.target.value)} placeholder='Submission date, Notification date...' />
        </Col>
        <Col >

          <Form.Label>Date:</Form.Label>
          <Form.Control type="date" value={date.date_value} onChange={(e) => handleDateChange(index, 'date_value', e.target.value)} />
        </Col>
        <Col sm="1" className='d-flex align-items-end'>
          <Button variant="danger" onClick={() => removeDate(index)} className='bg-transparent border-0' title='Delete this date'>
            <FontAwesomeIcon icon={faCircleXmark} className='text-danger' />
          </Button>
        </Col>
      </Form.Group>
      ))}
    </>
  );
};

export default InputImportantDates;
