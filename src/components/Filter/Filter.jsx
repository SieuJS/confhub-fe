import { Stack, Form, InputGroup, Button, Image, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import DateRangePicker from "./DateRangePicker";
import AdvancedFilter from "./AdvancedFilter";

import downIcon from '../../assets/imgs/down.png'
import FilterSelected from "./FilterSelected";
import useSearch from "../../hooks/useSearch";
import Options from "./Options";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import useFilter from "../../hooks/useFilter";
import { faCircleChevronDown, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import useScreenSize from "../../hooks/useScreenSize";
import AreaFilter from "./AreaFilter";
import { useAppContext } from "../../context/authContext";

const Filter = ({filter}) => {
  const {state} = useAppContext()
  const { loading: loadingOption, addKeywords, optionsSelected } = useSearch()
  const { loading } = useFilter()
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showIsAvailableAdvancedFilter, setShowIsAvailableAdvancedFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("")
  const { t } = useTranslation()

  const { windowWidth } = useScreenSize()
  const [showAllFilter, setShowAllFilter] = useState(false)


  useEffect(() => {
    setShowAllFilter(windowWidth > 768);
  }, [windowWidth]);

  useEffect(() => {
    if (loading) {
      document.body.style.cursor = 'wait'
    } else {
      { document.body.style.cursor = 'default'; }
    }
    return () => {
      { document.body.style.cursor = 'default'; }
    };
  }, [loading]);

  const handleShowAllFilter = () => {
    setShowAllFilter(!showAllFilter)
  }

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleApplySearch = async () => {
    if (searchInput !== '') {
      addKeywords(filter, "search", [searchInput])
    }
  }
  const handleEnterSearch = (e) => {
    if (e.key === 'Enter') {
      handleApplySearch();
    }
  }

  useEffect(() => {
    if (loadingOption) {
      setShowIsAvailableAdvancedFilter(false)
    }
    else setShowIsAvailableAdvancedFilter(true)
  }, [loadingOption])
  return (
    <Container className="bg-white shadow rounded-4 px-5 pb-4 mb-5">
      <div className="d-flex justify-content-between align-items-center pt-2">
        <div className="d-flex align-items-center mb-1">
          <FontAwesomeIcon icon={faFilter} className="text-color-black fs-5 me-2" />
          <h4 className="mt-2 fs-4">{t('filter')}</h4>
        </div>
        {windowWidth <= 768 && <FontAwesomeIcon icon={faCircleChevronDown} className="text-color-black fs-5 me-2" onClick={handleShowAllFilter} />}
      </div>


      {(windowWidth > 768 || (windowWidth <= 768 && showAllFilter)) &&
        <>
          <Stack className="align-items-start">
            <Row className="justify-content-start ">
              <span className="fw-bold text-color-black fs-6">{t('what_are_you_looking_for')}?</span>
              <InputGroup>
                <InputGroup.Text className="border-0 bg-blue-light">
                  <FontAwesomeIcon icon={faSearch} className="fs-4" onClick={handleApplySearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder={t('search_placeholder')}
                  className=' border-start-0'
                  type="text"
                  value={searchInput}
                  name="searchInput"
                  onChange={handleSearchChange}
                  onKeyDown={handleEnterSearch}
                />
                {
                  windowWidth > 768 &&
                  <Button
                    onClick={handleApplySearch}
                    className="bg-primary-light text-primary-normal fw-bold border-0"
                    disabled={searchInput !== '' ? false : true}
                    title={t('apply_filter_tooltip')}
                  >
                    {t('search_button')}
                  </Button>
                }
              </InputGroup>
            </Row>
            <Row direction="horizontal" className="w-100 d-flex justify-content-center mt-2">
              <Col xs={12} sm={2} md={2} lg={2} className="mt-1">
                <span className="fw-bold text-color-black text-nowrap">{t("field_of_research")}</span>
                <Options filter={filter} label="for" />
              </Col>

              <Col xs={12} sm={2} md={2} lg={2} className="mt-1">
                <span className="fw-bold text-color-black text-nowrap">{t('location')}</span>
                <Options filter={filter} label="location" />
              </Col>
              <Col xs={12} sm={2} md={2} lg={2} className="mt-1">
                <span className="fw-bold text-color-black text-nowrap">{t('region')}</span>
                <AreaFilter filter={filter} />
              </Col>
              <Col xs={12} sm={3} md={3} lg={3} className="mt-1">
                <span className="fw-bold text-color-black text-nowrap">{t('submission_date')}</span>
                <DateRangePicker filter={filter} label="submissionDate" />
              </Col>

              <Col xs={12} sm={3} md={3} lg={3} className="mt-1">
                <span className="fw-bold text-color-black">{t('conference_date')}</span>
                <DateRangePicker filter={filter} label="conferenceDate" />
              </Col>
            </Row>
          </Stack>
          <Button
            disabled={!showIsAvailableAdvancedFilter}
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className="bg-white border-0 text-primary-normal p-0 fw-bold my-3 btn-show-advanced">
            {t('show_more_advanced_search')}
            <Image src={downIcon} width={15}
              className={showAdvancedFilter ? "ms-2 rotate-180" : 'ms-2'} />
          </Button>

          {showAdvancedFilter && <AdvancedFilter filter={filter}/>}
        </>
      }
      <div className="filter-selected overflow-hidden">{optionsSelected && <FilterSelected filterSelected={state[filter]} filterSelectedName={filter}/>}  </div>

    </Container>
  );
};

export default Filter;