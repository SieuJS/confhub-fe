
import {  Row, Col } from 'react-bootstrap';
import DropdownOptions from './DropdownOptions';
import DateRangePicker from '../Filter/DateRangePicker';
import { useTranslation } from 'react-i18next';
import Options from '../Filter/Options';
import AreaFilter from '../Filter/AreaFilter';
import StarDropdown from '../Filter/StarDropdown';


function Filter({filter}) {
  const {t} = useTranslation()
  return (
    <div className='shadow p-3 border rounded mb-2'>
      <Row>
        <Col><span className="fw-bold text-color-black">{t('location')}</span><Options label="location" filter={filter}/></Col>
        <Col><span className="fw-bold text-color-black">{t('region')}</span><AreaFilter filter={filter}/></Col>
        <Col><span className="fw-bold text-color-black">{t('field_of_research')}</span><Options label="for" filter={filter}/></Col>
        <Col><span className="fw-bold text-color-black">{t('submission_date')}</span><DateRangePicker label="submissionDate" filter={filter}/></Col>
        <Col><span className="fw-bold text-color-black">{t('conference_date')}</span><DateRangePicker label="conferenceDate" filter={filter}/></Col>
      </Row>
      {/* Hàng 2 */}
      <Row className='my-2'> 
        <Col><span className="fw-bold text-color-black">{t('rank')}</span><Options label="rank" filter={filter} /></Col>
        <Col><span className="fw-bold text-color-black">{t('source')}</span><Options label="source" filter={filter}/></Col>
        <Col><span className="fw-bold text-color-black">{t('acronym')}</span><Options label="acronym" filter={filter}/></Col>
        <Col><span className="fw-bold text-color-black">{t('type')}</span><Options label="type" filter={filter} /></Col>
        <Col><span className="fw-bold text-color-black">{t('rating')}</span><StarDropdown label="rating"filter={filter} /></Col>
      </Row>
    </div>
  );
}

export default Filter;
