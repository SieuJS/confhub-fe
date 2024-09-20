import { useEffect, useState } from "react"
import useSearch from "../../hooks/useSearch"
import { capitalizeFirstLetter } from "../../utils/formatWord"
import useFilter from "../../hooks/useFilter"
import { Button, Col, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"


const PriorityOptions = () => {
  const {t} = useTranslation()
    const { optionsSelected } = useSearch()
    const { resultFilter, priorityKeywords, selectedKeywords, handleKeywordSelection, countMatchingConferences, getCountForSelectedKeyword, extractDates, extractStars } = useFilter()
    const [selected, setSelected] = useState([])
    const [keywordsCount, setKeywordsCount] = useState([])
    const windowWidth = window.innerWidth
    useEffect(() => {
        const values = Object.values(priorityKeywords);
        setSelected(values);
    }, [priorityKeywords])

    useEffect(() => {
        const keywordCount = countMatchingConferences(resultFilter, optionsSelected)
        setKeywordsCount(keywordCount)
    }, [optionsSelected, resultFilter])

    const renderOption = (key, option) => {
        const quantity = getCountForSelectedKeyword(keywordsCount, option, key)
        
        if(key === 'conferenceDate' || key === 'submissionDate'){
          const { startDate: confStartDate, endDate: confEndDate } = extractDates(option);
          return (<>
            {`${t('date_filter', { startDate: confStartDate, endDate: confEndDate } )} (${quantity})`}
          </>)
        }
        else if(key === 'rating'){
          const rate = extractStars(option)
          return(
            <>
             {`${t('rating_filter', { stars: rate })} (${quantity})`}
            </>
          )
        }
        return (
            <>
                {`${capitalizeFirstLetter(option)} (${quantity})`}
            </>
        )
    }
    return (
      <Row className="d-flex align-items-start w-100 justify-content-center">
        
     {/**  <Col sm={2} className="p-0">{Object.keys(selectedKeywords).length > 0 && `Display priority by:` } </Col>*/}
        <Col className="d-flex flex-column w-100 p-0">
          {Object.entries(selectedKeywords).map(([key, valueList]) => (
            <Row key={key} className={`w-100 my-2 align-items-start`}>
              <Col xs={3} sm={2}  className={`p-0 fw-bold text-nowrap ${windowWidth >= 768 ? 'text-end': 'text-start ps-3'}`}>
              {
                key === 'conferenceDate' ? 
                `${t('conference_date')}:`
                :
                key === 'submissionDate' ?
                 `${t('submission_date')}:`
                :
                `${t(key)}: `
              }
              </Col>
              <Col>
                {valueList.map((option, index) => (
                  <span key={index} style={{ marginRight: '5px' }}>
                     <Button
                            key={index}
                            onClick={() => handleKeywordSelection(key, option)}
                            className={`px-2 py-1 border text-teal-normal mx-2 rounded-2 text-nowrap
                            ${selected.includes(option) ? `bg-primary-light border-primary-normal`
                                    : `bg-white border-color-medium`}
                            ${valueList.length >= 3 ? 'my-1' : ''}        
                            `}
                        >
                            {renderOption(key, option)}
                        </Button>
                  </span>
                ))}
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    
    

    )
}

export default PriorityOptions