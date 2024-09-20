
import { useState } from 'react';
import { Button, Carousel, Col, Image, Row } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom/dist';
import AddNewNote from './AddNewNote';

import ArrowIcon from './../../assets/imgs/next.png'
import moment from 'moment';
import useConference from '../../hooks/useConferences';
import { useTranslation } from 'react-i18next';

const ListNotesInModal = ({ show, showDetailModal, setShowDetailModal, setDetailNote, notesList, dateClicked, onDelete, onClose, onReloadList }) => {
  const {t} = useTranslation()
  const { handleGetOne } = useConference()
  const [index, setIndex] = useState(0);
  const navigate = useNavigate()

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const handleMove = () => {
    // Xác định mục sẽ chuyển đến
    const nextIndex = index === 0 ? 1 : 0;
    setIndex(nextIndex);
  };


  const handleShowDetailModal = (note) => {
    setDetailNote(note)
    setShowDetailModal(!showDetailModal)
    onClose()
  }


  const handleGotoCfp = async (id) => {
    await handleGetOne(id)
    navigate(`/detailed-information/${id}`)
  }
  return (
    <Modal show={show} onHide={onClose} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title className='text-center w-100'>{`${t('all_notes_in')} ${moment(dateClicked).format('dddd, YYYY/MM/DD')}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className=' px-5'>
        <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} controls={false} interval={null}>

          <Carousel.Item>
            <div className='d-flex justify-content-between align-items-center my-1 ms-3'>
              <p className="text-primary-normal">{`${notesList.length} ${t('note')}`}</p>
              <Button className='rounded-circle border-light bg-primary-normal fw-bold' onClick={handleMove}>+</Button>
            </div>
            {
              notesList.length > 0 ?
                <>

                  {
                    notesList.map((note, index) => (
                      <div className="d-flex justify-content-between bg-teal-light my-2 border-5 border-start" key={note.conf_id}>
                        <Button
                          onClick={() => handleShowDetailModal(note)}
                          className='w-100  border-0 text-start p-1 rounded mt-1 mb-2 ms-2 px-2 text-color-darker bg-transparent'
                          title='More details about this note'
                        >
                          <Row >
                            <Col xs={2} className='text-color-medium'>{`${t('date_type')}: `}</Col>
                            <Col>{note.date_type}</Col>
                          </Row>
                          {
                            note.subStyle !== 'note-event' &&
                            <Row>
                              <Col xs={2} className='text-color-medium'>
                                {`${t('conference')}: `}
                              </Col>
                              <Col>{note.acronym}</Col>
                            </Row>
                          }
                          <Row>
                            <Col xs={2} className='text-color-medium'>
                              {`${t('note')}: `}
                            </Col>
                            <Col>{note.note && note.note !== 'default' ? note.note : ''}</Col>
                          </Row>
                        </Button>
                        {
                          note.subStyle !== 'note-event' &&
                          <Button
                            className='border-0 bg-transparent '
                            onClick={() => handleGotoCfp(note.conf_id)}
                            title='Click here to go detailed information page'
                          >
                            <Image src={ArrowIcon} width={20} className='rounded-circle border' />
                          </Button>
                        }

                      </div>
                    ))
                  }

                </>
                :
                <><p>{t('no_notes')}</p></>
            }

          </Carousel.Item>

          <Carousel.Item>
            <div>
              <AddNewNote
                dateClicked={dateClicked}
                onClose={onClose}
                onBack={handleMove}
                onReloadList={onReloadList}
              />
            </div>
          </Carousel.Item>
        </Carousel>

      </Modal.Body>
    </Modal>
  )
}

export default ListNotesInModal