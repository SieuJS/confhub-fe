import React, { useState } from 'react'
import { Accordion, Button, Card, Col, Form } from 'react-bootstrap';
function InputOrganizations() {
  const [organizations, setOrganizations] = useState([
    {
      name: "",
      type: "",
      location: "",
      start_date: "",
      end_date: ""
    }
  ]);

  const handleAddOrganization = () => {
    setOrganizations([...organizations, { 
      name: "",
      type: "",
      location: "",
      start_date: "",
      end_date: ""
    }]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newOrganizations = [...organizations];
    newOrganizations[index][name] = value;
    setOrganizations(newOrganizations);
  }
  return (
    <Form>
      <Accordion>
      {organizations.map((organization, index) => (
        <Card key={index}>
          <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
            Organization {index + 1}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={index.toString()}>
            <Card.Body>
              <Form.Group controlId={`name${index}`} as={Col} className="mb-3 d-flex align-items-start">
                <Form.Label column sm="3">Event name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={organization.name}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </Form.Group>
              <Form.Group controlId={`type${index}`} as={Col} className="mb-3 d-flex align-items-start">
                <Form.Label column sm="3">Type:</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  value={organization.type}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </Form.Group>
              <Form.Group controlId={`location${index}`} as={Col} className="mb-3 d-flex align-items-start">
                <Form.Label column sm="3">Location:</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={organization.location}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </Form.Group>
              {/* Add other form fields for start_date, end_date */}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
      <Button onClick={handleAddOrganization}>Add Organization</Button>
    </Form>
  );
}

export default InputOrganizations
