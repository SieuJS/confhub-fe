import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button, Offcanvas } from 'react-bootstrap'

const OffcanvasNoti = ({show, onClose}) => {
    
  return (
    <div>
        <Button>
            <FontAwesomeIcon icon={faBell}/>
        </Button>
        <Offcanvas show={show} onHide={onClose}>
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>Offcanvas</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      Some text as placeholder. In real life you can have the elements you
      have chosen. Like, text, images, lists, etc.
    </Offcanvas.Body>
  </Offcanvas>
    </div>
  )
}

export default OffcanvasNoti