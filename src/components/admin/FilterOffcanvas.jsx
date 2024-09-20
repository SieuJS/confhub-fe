import React from 'react'
import { Col, Offcanvas, Row } from 'react-bootstrap'
import DropdownOptions from './DropdownOptions'
import DateRangePicker from '../Filter/DateRangePicker'
import { useTranslation } from 'react-i18next'
import Options from '../Filter/Options'
import AreaFilter from '../Filter/AreaFilter'
import FilterSelected from '../Filter/FilterSelected'
import StarDropdown from '../Filter/StarDropdown'
import InputSearch from './InputSearch'

const FilterOffcanvas = ({showOffcanvas, setShowOffcanvas}) => {
    const {t} = useTranslation()
  return (
    <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)}>
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>Filters</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body className='overflow-y-scroll'>
      {/* Nội dung Offcanvas */}
      <Row>
      <Col xs={12} sm={6} md={3} className="my-2">
          <InputSearch/>
        </Col>
      <Col xs={12} sm={6} md={3} className="my-2">
          <span className="fw-bold text-color-black">{t('field_of_research')}</span>
          <Options label="for" placeholder={t('field_of_research')} />
        </Col>
        <Col xs={12} sm={6} md={3} className="my-2">
          <span className="fw-bold text-color-black">{t('location')}</span>
          <Options label="location" placeholder={t('location')} />
        </Col>
        <Col xs={12} sm={6} md={3} className="my-2">
          <span className="fw-bold text-color-black">{t('region')}</span>
          <AreaFilter/>
        </Col>
       
        <Col xs={12} sm={6} md={3} className="my-2">
          <span className="fw-bold text-color-black">{t('submission_date')}</span>
          <DateRangePicker label="submissionDate" />
        </Col>
        <Col xs={12} sm={6} md={3} className="my-2">
          <span className="fw-bold text-color-black">{t('conference_date')}</span>
          <DateRangePicker label="conferenceDate" />
        </Col>
        <Col xs={12} sm={6} md={3} className="my-2">
          <span className="fw-bold text-color-black">{t('rank')}</span>
          <Options label="rank" placeholder={t('rank')} />
        </Col>
        <Col xs={12} sm={6} md={3} className="my-2">
          <span className="fw-bold text-color-black">{t('source')}</span>
          <Options label="source" placeholder={t('source')} />
        </Col>
        <Col xs={12} sm={6} md={3} className="my-2">
          <span className="fw-bold text-color-black">{t('acronym')}</span>
          <Options label="acronym" placeholder={t('acronym')} />
        </Col>
        <Col xs={12} sm={6} md={3} className="my-2">
          <span className="fw-bold text-color-black">{t('type')}</span>
          <Options label="type" placeholder={t('type')} />
        </Col>
        <Col xs={12} sm={6} md={3} className="my-2">
          <span className="fw-bold text-color-black">{t('rating')}</span>
          <StarDropdown label="rating"/>
        </Col>
      </Row>

      <FilterSelected/>
    </Offcanvas.Body>
  </Offcanvas>

  )
}

export default FilterOffcanvas