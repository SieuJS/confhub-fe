import { Col, Row } from "react-bootstrap"
import Options from "./Options"
import DateRangePicker from "./DateRangePicker"

const HeaderFilter = () => {
  return (
         <Row className=" ps-4 pe-3 py-3">
       {/* <Col>
          <span className="fw-bold text-color-black">Category</span>
          <Options label={"category"}/>
        </Col>* */}
        <Col >
          <span className="fw-bold text-color-black">Location</span>
          <Options label={"location"}/>
        </Col>
        <Col>
          <span className="fw-bold text-color-black">Submission date</span>
          <DateRangePicker label={"submissionDate"}/>
        </Col>
        <Col>
          <span className="fw-bold text-color-blackcolor-black">Conference date</span>
          <DateRangePicker label={"conferenceDate"}/>
        </Col>
        <Col>
                <span className="fw-bold text-color-black">Rank</span>
                <Options label={"rank"}/>
            </Col>
            <Col>
                <span className="fw-bold text-color-black text-nowrap">Field of research</span>
                <Options label={"for"} />
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Source</span>
                <Options label={"source"} />
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Acronym</span>
                <Options label={"acronym"} />
            </Col>
            {<Col>
                <span className="fw-bold text-color-black">Type</span>
                <Options label={"type"} />
            </Col>}
      </Row>
  )
}

export default HeaderFilter