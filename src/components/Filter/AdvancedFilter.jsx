
import { Row, Col } from 'react-bootstrap'
import Options from './Options'
import StarDropdown from './StarDropdown'
import { useTranslation } from 'react-i18next'

const AdvancedFilter = ({filter}) => {
  const { t } = useTranslation()
  return (
    <Row className="w-100">
      <Col xs={12} sm={2} md={2} lg={2} className="mt-1 p-0 col-half-offset">
        <span className="fw-bold text-color-black">{t("rank")}</span>
        <Options filter={filter} label="rank" />
      </Col>
      <Col xs={12} sm={2} md={2} lg={2} className="mt-1 p-0 col-half-offset">
        <span className="fw-bold text-color-black">{t("source")}</span>
        <Options filter={filter} label="source" />
      </Col>
      <Col xs={12} sm={2} md={2} lg={2} className="mt-1 p-0 col-half-offset">
        <span className="fw-bold text-color-black">{t("acronym")}</span>
        <Options filter={filter} label="acronym" />
      </Col>
      <Col xs={12} sm={2} md={2} lg={2} className="mt-1 p-0 col-half-offset">
        <span className="fw-bold text-color-black">{t("rating")}</span>
        <StarDropdown filter={filter} label="rating" />
      </Col>
      <Col xs={12} sm={2} md={2} lg={2} className="mt-1 p-0 col-half-offset">
        <span className="fw-bold text-color-black">{t("type")}</span>
        <Options filter={filter} label="type" />
      </Col>
    </Row>
  )
}

export default AdvancedFilter