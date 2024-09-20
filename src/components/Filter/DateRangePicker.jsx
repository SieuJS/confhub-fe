import { useEffect, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Dropdown, Image, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import useSearch from '../../hooks/useSearch';

import dateIcon from '../../assets/imgs/conf_date_light.png'
import { formatLabel } from '../../utils/formatWord';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
const DateRangePicker = ({ label, filter }) => {
  const {t, i18n} = useTranslation()  
  const { addKeywords } = useSearch()
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const years = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - i);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleToggleClick = () => {
    setShowDropdown(!showDropdown);
  };
  const handleStartDateChange = (date) => setStartDate(date);
  const handleEndDateChange = (date) => setEndDate(date);
  
  const handleOptionChange = (option) => {
    const tomorrow = moment().add(1, 'days').toDate();
    let endDate;
    if (option === '1month') {
      endDate = moment(tomorrow).add(1, 'months').toDate();
    } else if (option === '3months') {
      endDate = moment(tomorrow).add(3, 'months').toDate();
    } else if (option === '6months') {
      endDate = moment(tomorrow).add(6, 'months').toDate();
    }
    setStartDate(tomorrow);
    setEndDate(endDate);
  };


  const handleApplyFilter = async () => {    
    let formatStart = moment().endOf('day').toDate()
    let formatEnd = moment().add(1, 'year').endOf('year').toDate();
    if(startDate){
      formatStart = startDate
    }
    if(endDate){
      formatEnd = endDate
    }
    
    const keywordFormat = `${formatLabel(label)}: from ${moment(formatStart).format("yyyy/MM/DD")} to ${moment(formatEnd).format("yyyy/MM/DD")}`         
   // console.log({keywordFormat, startDate, endDate, formatStart, formatEnd})
    addKeywords(filter, label, [keywordFormat])
    setStartDate(null)
    setEndDate(null)
    handleToggleClick()
  };
  return (
    <Dropdown ref={dropdownRef} className="w-100" show={showDropdown} autoClose="false">
      <Dropdown.Toggle 
        onClick={handleToggleClick}
        className="w-100 d-flex justify-content-between align-items-center bg-white border-1 text-color-medium border-primary-normal" 
        id="dropdown-autoclose-true">
        <div className='d-flex align-items-center'>
          <Image src={dateIcon} width={18} className="me-2" />
          <span className="f5">yyyy/mm/dd</span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className='px-2 shadow'>
         
        <Dropdown.Item className='bg-transparent '>

        <Row>
            <Col style={{ zIndex: 1050 }} className='m-1 w-100 p-0'>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="yyyy/MM/dd"
                placeholderText="From"
                yearDropdownItemNumber={15}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                shouldCloseOnSelect
                className='w-100'
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className='p-2 d-flex justify-content-center'>
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className='p-2 rounded-start border-secondary'>
                      {"<"}
                    </button>
                    <select 
                      className='p-2 fs-medium  text-success-emphasis'
                      value={moment(date).year()}
                      onChange={({ target: { value } }) => {
                        changeYear(value);
                        setStartDate(moment(date).year(value).toDate());
                      }}
                    >
                      {years.map((option) => (
                        <option key={option} value={option} className='fs-medium p-2'>
                          {option}
                        </option>
                      ))}
                    </select>
  
                    <select
                     className='p-2 fs-medium text-success-emphasis'
                      value={moment(date).month()}
                      onChange={({ target: { value } }) => {
                        changeMonth(value);
                        setStartDate(moment(date).month(value).toDate());
                      }}
                    >
                      {moment.months().map((option, index) => (
                        <option key={option} value={index} className='fs-medium p-2'>
                          {option}
                        </option>
                      ))}
                    </select>
  
                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}  className='p-2 rounded-end  border-secondary'>
                      {">"}
                    </button>
                  </div>
                )}
              />
            </Col>
            <Col style={{ zIndex: 1050 }} className='m-1 w-100 p-0'>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="yyyy/MM/dd"
                placeholderText="To"
                yearDropdownItemNumber={15}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                shouldCloseOnSelect
                className='w-100'
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className='p-2 d-flex justify-content-center'>
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className='p-2 rounded-start border-secondary'>
                      {"<"}
                    </button>
                    <select 
                      className='p-2 fs-medium  text-success-emphasis'
                      value={moment(date).year()}
                      onChange={({ target: { value } }) => {
                        changeYear(value);
                        setEndDate(moment(date).year(value).toDate());
                      }}
                    >
                      {years.map((option) => (
                        <option key={option} value={option} className='fs-medium p-2'>
                          {option}
                        </option>
                      ))}
                    </select>
  
                    <select
                     className='p-2 fs-medium text-success-emphasis'
                      value={moment(date).month()}
                      onChange={({ target: { value } }) => {
                        changeMonth(value);
                        setEndDate(moment(date).month(value).toDate());
                      }}
                    >
                      {moment.months().map((option, index) => (
                        <option key={option} value={index} className='fs-medium p-2'>
                          {option}
                        </option>
                      ))}
                    </select>
  
                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}  className='p-2 rounded-end border-secondary'>
                      {">"}
                    </button>
                  </div>
                )}
              />
            </Col>
          </Row>
          <Row>
          <Col className='my-1 w-100 p-0 mt-3'>
          <Button className="bg-transparent border-secondary mx-1 text-dark-emphasis" onClick={() => handleOptionChange('1month')}>
              1 {` ${t('next_months')}`}
            </Button>
            <Button className="bg-transparent border-secondary mx-1 text-dark-emphasis" onClick={() => handleOptionChange('3months')}>
              3 {` ${t('next_months')}${i18n.language === 'en' ? 's' :''}`}
            </Button>
            <Button className="bg-transparent border-secondary mx-1 text-dark-emphasis" onClick={() => handleOptionChange('6months')}>
              6 {` ${t('next_months')}${i18n.language === 'en' ? 's' :''}`}
            </Button>
           
            </Col>
          </Row>
        <Dropdown.Divider />
        <ButtonGroup className='top-100 bg-white m-2 d-flex justify-content-center '>
          <Button
            onClick={() => setShowDropdown(false)}
            className=' mx-1 rounded-2 border-0 bg-secondary'>
            {t('cancel')}
          </Button>
          <Button className=' mx-1 rounded-2 border-0 bg-primary-normal' onClick={handleApplyFilter}>
            {t('apply')}
          </Button>
        </ButtonGroup>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

  );
};

export default DateRangePicker;