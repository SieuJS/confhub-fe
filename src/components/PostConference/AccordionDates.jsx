import React, { useEffect, useState } from 'react';
import { Accordion, Button, Card, Col, Form, Image } from 'react-bootstrap';
import CustomAccordionDates from './CustomAccordionDates';
import useAccordionDates from '../../hooks/useAccordionDates';
import InputImportantDates from './InputImportantDates';
import useFormDataInput from '../../hooks/useFormDataInput';

import DeleteIcon from './../../assets/imgs/del.png'
const AccordionDates = ({ items, formData, onChangeImportantDates, onChangeOrganizations, onAddItem, onDeleteItem }) => {
    const { message, error, addItem, deleteItem, toggleItem, openItemIndex } = useAccordionDates()
    
    
    return (
        <Accordion defaultActiveKey="1" className='h-100'>
            {items.map((item, index) => (

                <Card key={item.id} className='border-0 w-100'>
                    {/* Render CustomToggle cho mỗi item */}
                    {items.length > 1 && (
                        <div className='d-flex align-items-center justify-content-center'>
                            <CustomAccordionDates
                                eventKey={item.id}
                                onClick={() => toggleItem(item.id)}
                            >
                                {item.title}
                            </CustomAccordionDates>
                            <Button 
                                className='ms-3 bg-transparent border-0' 
                                onClick={() => { onDeleteItem(index) }}
                                title='Delete this round'
                            >
                                <Image src={DeleteIcon} width={18} />
                            </Button>
                        </div>

                    )}
                    <Accordion.Collapse eventKey={item.id} in={openItemIndex === item.id}>
                        <Card.Body>
                            <InputImportantDates
                                formData={formData}
                                onChange={onChangeImportantDates}
                                round={openItemIndex}
                            />
                            <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">Conference date:</Form.Label>
                                From
                                <Form.Control
                                    type="date"
                                    name="start_date"
                                    value={formData.organizations[0]?.start_date || ''}
                                    onChange={onChangeOrganizations}
                                    placeholder="Select conference start date..."
                                    className="mx-2 border-blue-normal"
                                />
                                to
                                <Form.Control
                                    type="date"
                                    name="end_date"
                                    value={formData.organizations[0]?.end_date || ''}
                                    onChange={onChangeOrganizations}
                                    placeholder="Select conference start date..."
                                    className="ms-2 border-blue-normal"
                                />
                            </Form.Group>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            ))}
            {
                error && <p className='text-warning text-center'>{message}</p>
            }
            <Button onClick={onAddItem} className='mt-4 w-100 text-color-darker bg-primary-light border-primary-normal'>Add round</Button>
        </Accordion>    
    );
};

export default AccordionDates;
