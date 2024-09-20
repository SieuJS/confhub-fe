

import { Button, Image } from 'react-bootstrap'

import deleteIcon from "../../assets/imgs/del.png";
import RedDeleteIcon from "../../assets/imgs/redDel.png";
import useSearch from "../../hooks/useSearch";
import { findKeyByKeyword, getUniqueConferences,  } from "../../utils/checkFetchedResults";

import { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils/formatWord';
import { useTranslation } from 'react-i18next';
import useFilter from '../../hooks/useFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

const FilterSelected = ({filterSelected, filterSelectedName}) => {
  const {t} = useTranslation()
  const { deleteKeyword, clearKeywords } = useSearch()
  const {extractStars, extractDates} = useFilter()
  const [keywordsSelected, setKeywordsSelected] = useState(null)
  const [total, setTotal] = useState(0)
  useEffect(()=>{
    const uniqueValues = getUniqueConferences(filterSelected)
    setKeywordsSelected(uniqueValues)
    setTotal(uniqueValues.length)
  }, [filterSelected])
  
  const handleDeletekeyword = (keyword) => {
    deleteKeyword(findKeyByKeyword(filterSelected, keyword),keyword, filterSelectedName)
  }
  const handleClearKeyword = () => {
    clearKeywords(filterSelectedName)
  }
 

  const handleRenderKeyword = (keyword) => {
    const { startDate: confStartDate, endDate: confEndDate } = extractDates(keyword);
    if(keyword.includes('Submission Date')){
      return t('submission_date_filter', { startDate: confStartDate, endDate: confEndDate } )
    }
    else if (keyword.includes('Conference Date')){
      return t('conference_date_filter', { startDate: confStartDate, endDate: confEndDate } )
    }
    else if(keyword.includes('Rating')){
      const rate = extractStars(keyword)
      return t('rating_filter', { stars: rate })
    }
    else return capitalizeFirstLetter(keyword)
  }
  return (
    <>
      {
        keywordsSelected !== null && total > 0
          ?
          <div className="d-flex flex-wrap justify-content-start border-1 border border-light-subtle p-3 my-3 rounded-3">
            
            {keywordsSelected.map((keyword, index) => (
              <Button
                onClick={() => handleDeletekeyword(keyword)}
                key={index}
                className="fs-6 text-color-black py-1 px-2 fw-bold border bg-transparent border-secondary rounded-pill d me-3 mb-3 fs-6 d-flex align-items-center"
                >

                <span className='text-nowrap text-truncate'>
                { handleRenderKeyword(keyword)}
                </span>
                  <FontAwesomeIcon icon={faXmarkCircle} className='text-secondary fs-6 mx-1'/>
              </Button>
              ))}
            <Button
              onClick={()=>handleClearKeyword()}
              className="fs-6 py-1 px-2 fw-bold border border-danger bg-white text-red-normal rounded-pill d me-3 mb-3  d-flex align-items-center">

              {t('reset_all')}
              <FontAwesomeIcon icon={faXmarkCircle} className='text-red fs-6 mx-1'/>
            </Button>
          </div>
          :
          <></>

      }
    </>

  );
};

export default FilterSelected;