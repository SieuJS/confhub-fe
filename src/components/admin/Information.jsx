import { Col, Row } from 'react-bootstrap'
import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import ImportantDatePage from '../Informationpage/ImportantDatePage'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const Information = ({ conference }) => {
  const { t } = useTranslation()
  const { getConferenceDate } = useConference()

  const renderFieldOfResearch = (fieldOfResearch) => {
    if (fieldOfResearch?.length === 0) {
      return null
    }

    if (Array.isArray(fieldOfResearch)) {
      // Trường là một danh sách
      const uniqueValues = Array.from(new Set(fieldOfResearch));
      return uniqueValues.map((item, index) => (
        <div key={index} className='my-1'>{item}</div>
      ));
    } else {
      // Trường là một giá trị đơn
      return <div>{fieldOfResearch}</div>;
    }
  };
  const renderLocation = (organizations) => {
    const newOrg = organizations?.find(org => org.status === "new");
    return newOrg ? newOrg.location : ''
  };

  const renderType = (organizations) => {
    const newOrg = organizations?.find(org => org.status === "new");
    return newOrg ? newOrg.type : null
  };
  return (
    <div className='p-2 p-md-5 p-lg-5 m-0 pt-0'>

      <Row>
        <Col className='mt-5'>
          <div className='fs-4 fw-bold'>
            <span className='fs-3 fw-bold text-teal-normal'>
              <FontAwesomeIcon icon={faCircleInfo} className='me-1' /> {t('conference_info')}
            </span>
          </div>
          <div className='fw-bold fs-large mt-2 py-2'>{conference?.information?.name}</div>
          <div className='my-2'>
            <Row key="acronym" className='py-3 ps-4'>
              <Col xs={4} className='d-flex align-items-center p-0'>{t('acronym')}:</Col>
              <Col className='fw-bold fs-large'>{conference.information.acronym}</Col>
            </Row>

            <Row key="category" className='py-3 ps-4'>
              <Col xs={4} className='d-flex align-items-center p-0'>{t('category')}:</Col>
              <Col className='fw-bold fs-large'>{t('conference')}</Col>
            </Row>
            <Row key="source" className='py-3 ps-4'>
              <Col xs={4} className='d-flex align-items-center p-0'>{t('source')}:</Col>
              <Col className='fw-bold fs-large'>{conference.information.source}</Col>
            </Row>
            <Row key="link" className='py-2 ps-4'>
              <Col xs={4} className='d-flex align-items-center p-0 '>Link:</Col>
              <Col className='fw-bold fs-large'>{conference?.information?.link}</Col>
            </Row>

            <Row key="type" className='py-3 ps-4'>
              <Col xs={4} className='d-flex align-items-center p-0'>{t('type')}:</Col>
              <Col className='fw-bold fs-large'>
                {capitalizeFirstLetter(renderType(conference.organizations))}
              </Col>
            </Row>

            <Row key="location" className='py-3 ps-4'>
              <Col xs={4} className='d-flex align-items-start p-0'>{t('location')}:</Col>
              <Col className='fw-bold fs-large'>
                {renderLocation(conference.organizations)}
              </Col>
            </Row>
            <Row key="conference-date" className='py-3 ps-4'>
              <Col xs={4} className='d-flex align-items-start p-0'>{t('conference_date')}:</Col>
              <Col className='fw-bold fs-large'>
                {getConferenceDate(conference.organizations)}
              </Col>
            </Row>
            <Row key="rating" className='py-3 ps-4'>
              <Col xs={4} className='d-flex align-items-center p-0'>{t('rating')}:</Col>
              <Col className='fw-bold fs-large'>
              {`${conference?.information?.rating ? `${parseFloat(conference.information?.rating?.toFixed(2))}*` : ''}`}
               

              </Col>
            </Row>
            <Row key="field-of-research" className={`py-3 ps-4 pe-1`}>
              <Col xs={4} className='d-flex align-items-start p-0'>{t('field_of_research')}:</Col>
              <Col className='fw-bold fs-large'>
                {renderFieldOfResearch(conference.information.fieldOfResearch)}
              </Col>
            </Row>
          </div>
        </Col>
        <Col>
          <ImportantDatePage conference={conference} />
        </Col>
      </Row>
    </div>
  )
}


export default Information