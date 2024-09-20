import React from 'react'
import { Col, Form } from 'react-bootstrap'

const InputOrgOnlineHybrid = () => {
    return (
        <Form.Group as={Col} className="mb-3 d-flex align-items-center">
            <Form.Label column sm="3"><span className='text-danger'>* </span>Code {`(optional)`}:</Form.Label>
            
            <Form.Control
                type="date"
                name="start_date"
                value={formData.organizations[0]?.start_date || ''}
                onChange={onChangeOrganizations}
                placeholder="Select conference start date..."
                className="mx-2"
            />
            to
            <Form.Control
                type="date"
                name="end_date"
                value={formData.organizations[0]?.end_date || ''}
                onChange={onChangeOrganizations}
                placeholder="Select conference start date..."
                className="ms-2"
            />
        </Form.Group>
    )
}

export default InputOrgOnlineHybrid