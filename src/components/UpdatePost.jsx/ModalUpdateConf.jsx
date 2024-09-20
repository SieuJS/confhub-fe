import { useEffect, useState } from 'react';
import { Modal, Button, ButtonGroup, Tabs, Tab, Fade, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select'
import usePost from '../../hooks/usePost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEdit, faXmark } from '@fortawesome/free-solid-svg-icons';
import useSearch from '../../hooks/useSearch';
import Loading from '../Loading';
import { capitalizeFirstLetter } from '../../utils/formatWord';
import { useTranslation } from 'react-i18next';
import useScreenSize from '../../hooks/useScreenSize';

const ModalUpdateConf = ({ conference, show, onClose, onUpdatePost, onModalClick }) => {
  const {t} = useTranslation()
  const {windowWidth} = useScreenSize()
  const { loading, updatePost } = usePost() 
  const [message, setMesage] = useState('')
  const [status, setStatus] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { filterOptions, getOptionsFilter } = useSearch()
  const [isupdateForm, setIsUpdateForm] = useState()
  const [isDuplicate, setIsDuplicate] = useState(false)
  const [tab, setTab] = useState('1')
  const [isOrgDateValid, setIsOrgDateValid] = useState(false)
  const [countdown, setCountdown] = useState(3);
  const [formData, setFormData] = useState({
    callForPaper: conference.callForPaper || "",
    link: conference.information.link || "",
    rank: conference.information.rank || "N/I",
    fieldsOfResearch: Array.from(new Set(conference.information.fieldOfResearch)) || [],
    organizations: conference.organizations.length > 0 ? 
      conference.organizations
        .filter(org => org.status === 'new') // Lọc chỉ lấy những mục có status 'new'
        .map(org => ({
          name: org.name ?? '',
          type: org.type ?? '',
          location: org.location ?? '',
          start_date: org.start_date ?? '',
          end_date: org.end_date ?? ''
        })) :
      [{
        name: '',
        type: '',
        location: '',
        start_date: '',
        end_date: ''
      }],
    importantDates: conference.importantDates.length > 0 ?
      conference.importantDates
        .filter(date => date.status === 'new')
        .map(date => ({
          date_type: date.date_type ?? '',
          date_value: date.date_value ?? ''
        })) :
      [{
        date_type: '',
        date_value: ''
      }],
  });
  

  const [selectedOptions, setSelectedOptions] = useState(Array.from(new Set(conference.information.fieldOfResearch)).map(field => ({
    value: field,
    label: capitalizeFirstLetter(field)
  })));

  useEffect(() => {
    if (!filterOptions['rank'] || !filterOptions['for']) {
      getOptionsFilter('for')
    }
  }, [filterOptions])

  const handleInformationChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleOrganizationChange = (index, key, value) => {
    const updatedFormData = { ...formData };
    // Sao chép tổ chức cần được cập nhật
    const updatedOrganization = { ...updatedFormData.organizations[index] };
    // Cập nhật giá trị của trường dữ liệu cụ thể
    updatedOrganization[key] = value;
    // Cập nhật tổ chức trong mảng organizations
    updatedFormData.organizations[index] = updatedOrganization;
    // Kiểm tra nếu người dùng đang chọn giá trị cho cả end_date và start_date và nó phải thỏa thứ tự trước sau
    if (key === 'end_date' || key === 'start_date') {
      const startDate = formData.organizations[index].start_date;
      const endDate = formData.organizations[index].end_date;

      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        setIsOrgDateValid(true);
      } else {
        setIsOrgDateValid(false);
      }
    }

    updatedFormData.organizations[index] = updatedOrganization;
    setFormData(updatedFormData);
  };



  //important dates
  const handleDateChange = (index, field, value) => {
    const updatedDates = [...formData.importantDates];
    updatedDates[index][field] = value;
    setFormData({ ...formData, importantDates: updatedDates });
  };

  const addDate = () => {
    const newDates = [...formData.importantDates, { date_type: "", date_value: "" }];
    setFormData({ ...formData, importantDates: newDates });
  };

  const removeDate = (index) => {
    const updatedDates = [...formData.importantDates];
    updatedDates.splice(index, 1);
    setFormData({ ...formData, importantDates: updatedDates });
  };

  // Tạo danh sách options từ fieldOfResearch và filterOptions['for']
  const options = [
    ...Array.from(new Set(conference.information.fieldOfResearch)).map(option => ({ value: option, label: option })),
    ...filterOptions['for'].map(option => ({ value: option, label: option }))
  ];

  const handleChangeFieldOfResearch = selectedOptions => {
    setSelectedOptions(selectedOptions);
    setFormData({
      ...formData,
      fieldsOfResearch: selectedOptions.map(option => option.value)
    });
  };

  const handleUpdatePost = async (e) => {
    onModalClick(e)
    setIsUpdateForm(true)

    //kiểm tra location trùng name
    const hasDuplicateNames = formData.organizations.some((org, index) => {
      return formData.organizations.findIndex((item, i) => item.name === org.name && i !== index) !== -1;
    });


    //kiểm tra importantdate trùng date_type
    const seenDateTypes = {};

    const hasDuplicateDateType = formData.importantDates.some(date => {
      if (seenDateTypes[date.date_type]) {
        // Nếu date_type đã xuất hiện trước đó, trả về true
        return true;
      } else {
        // Nếu chưa xuất hiện, đánh dấu là đã xuất hiện
        seenDateTypes[date.date_type] = true;
        return false;
      }
    });
    setIsDuplicate(hasDuplicateNames)
    if (hasDuplicateNames) {
      setErrorMessage('Organization name must be unique!')
      setTab(2)
    }
    else if (hasDuplicateDateType) {
      setErrorMessage('Date type must be unique!')
      setTab(3)
    }
    else {
     // Lưu trữ mảng organizations và importantDates vào biến tạm thời
  const tempOrganizations = [...formData.organizations];
  const tempImportantDates = [...formData.importantDates];

  // Loại bỏ các object rỗng từ mảng organizations
  const filteredOrganizations = formData.organizations.filter(org => (
    org.name !== '' || org.type !== '' || org.location !== '' || org.start_date !== '' || org.end_date !== ''
  ));

  // Loại bỏ các object rỗng từ mảng importantDates
  const filteredImportantDates = formData.importantDates.filter(date => (
    date.date_type !== '' || date.date_value !== ''
  ));

  // Cập nhật formData với mảng organizations và importantDates đã lọc
  const updatedFormData = {
    ...formData,
    organizations: filteredOrganizations,
    importantDates: filteredImportantDates
  };

      const result = await updatePost(updatedFormData, conference.id)
      setMesage(result.message)
      setStatus(result.status)
      onUpdatePost()
      if (result.status) {
        onUpdatePost()
          const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
              if (prevCountdown === 0) {
                clearInterval(countdownInterval);
                onClose(e);
                return 0;
              }
              return prevCountdown - 1;
            });
          }, 1000); // Giảm mỗi 1 giây
      }
      else
      {
        // Nếu gặp lỗi, khôi phục lại mảng organizations như cũ
        setFormData({
      ...formData,
      organizations: tempOrganizations,
      importantDates: tempImportantDates
    });
      }
    }

  }

  const handleSelectTab = (selectIndex) => {
    setTab(selectIndex)
  }

  return (
    <Modal 
    show={show} 
    onHide={onClose} 
    size="lg"
    centered 
    scrollable 
    fullscreen="sm-down"
    >
      
      <Modal.Body onClick={(e) => e.stopPropagation()}style={{ maxHeight: "80vh", overflowY: "auto" }}className='pt-3'>
        <div style={{minHeight: "500px"}}>
          <div className="d-flex justify-content-between align-items-center py-2 mb-3">
            <Modal.Title className='text-center w-100 text-skyblue-dark ps-5'>{`${t('update')} ${t('conference').toLowerCase()}`}</Modal.Title>
            <Button variant="secondary" onClick={onClose} className='bg-transparent border-0'>
              <FontAwesomeIcon icon={faXmark} className='text-secondary fs-3' />
            </Button>
          </div>
          <div className="w-100 py-2">
          </div>
          <Form >
            <Tabs activeKey={tab} transition={Fade} fill onSelect={handleSelectTab} className='fs-5 text-nowrap'>
              <Tab eventKey={`1`} title={t('information')} className='mx-4 pt-5' tabClassName= 'custom-tab-update'>
                <Form.Group as={Row} className='my-3'>
                  <Form.Label column sm="3">{t('name')}: </Form.Label>
                  <Col>
                    <Form.Control type="text" value={conference.information.name} disabled />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className='my-3'>
                  <Form.Label column sm="3">{t('acronym')}: </Form.Label>
                  <Col>
                    <Form.Control type="text" value={conference.information.acronym} disabled />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className='my-3'>
                  <Form.Label column sm="3">Link: </Form.Label>
                  <Col>
                    <Form.Control type="text" value={formData.link} onChange={(e) => handleInformationChange('link', e.target.value)} />
                  </Col>
                </Form.Group>
               
                <Form.Group as={Row} className='my-3'>
                  <Form.Label column sm="3"> {t('field_of_research')}: </Form.Label>
                  <Col>
                    <Select
                      options={options}
                      value={selectedOptions}
                      isMulti
                      onChange={handleChangeFieldOfResearch}
                      menuPosition="fixed"
                    />
                  </Col>
                </Form.Group>
              </Tab>
              <Tab eventKey={`2`} title={t('organization')} className='mx-4' tabClassName= 'custom-tab-update'>
                {formData.organizations.map((org, index) => (
                  <div key={index} className='mt-5'>
                  
                    <Form.Group as={Row} className='my-3'>
                      <Form.Label column sm="3">{t('type')}: </Form.Label>
                      <Col>
                        <Form.Select value={org.type} onChange={(e) => handleOrganizationChange(index, 'type', e.target.value)}>
                          <option value="">{`${t('select')} ${t('type').toLowerCase()}`}...</option>
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                          <option value="hybrid">Hybrid</option>
                        </Form.Select>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='my-3'>
                      <Form.Label column sm="3">{t('location')}: </Form.Label>
                      <Col>
                        <Form.Control type="text" value={org.location} onChange={(e) => handleOrganizationChange(index, 'location', e.target.value)} placeholder={`${t('enter_location_organization')}`} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='my-3'>
                      <Form.Label column sm="3">{t('start_date')}: </Form.Label>
                      <Col>
                        <Form.Control type="date" value={org.start_date} onChange={(e) => handleOrganizationChange(index, 'start_date', e.target.value)} className={isOrgDateValid ? 'border-danger' : ''} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='my-3'>
                      <Form.Label column sm="3">{t('end_date')}: </Form.Label>
                      <Col>
                        <Form.Control type="date" value={org.end_date} onChange={(e) => handleOrganizationChange(index, 'end_date', e.target.value)} className={isOrgDateValid ? 'border-danger' : ''} />
                      </Col>
                    </Form.Group>
                  </div>
                ))}
                {isupdateForm && errorMessage !== '' && <p className='text-center text-warning'>{errorMessage}</p>}
              </Tab>
              <Tab eventKey={`3`} title={t('important_dates')} className='mx-4' tabClassName= 'custom-tab-update'>
                <div className='w-100 d-flex justify-content-end'>
                  <Button variant="secondary" className="mt-3 text-end bg-skyblue-dark border-0" onClick={addDate}>{`${t('add_more_date')}`}</Button>
                </div>
                {formData.importantDates.map((date, index) => (
                  <Form.Group as={Row} key={index} className='my-3 d-flex w-100'>
                   
                    <Col sm='6'>
                    <div className="d-flex justify-content-between align-items-center">
                    <Form.Label>{t('date_type')}:</Form.Label>
                    {
                                                    windowWidth <= 768 &&
                                                    <Button variant="danger" onClick={() => removeDate(index)} className='bg-transparent border-0' title='Delete this date'>
                                                    <FontAwesomeIcon icon={faCircleXmark} className='text-danger' />
                                                  </Button>
                                                }
                    </div>
                     
                      <Form.Control type="text" value={date.date_type} onChange={(e) => handleDateChange(index, 'date_type', e.target.value)} placeholder={t('enter_date_description')} />
                    </Col>
                    <Col >
                      <Form.Label>{t('date')}:</Form.Label>
                      <Form.Control type="date" value={date.date_value} onChange={(e) => handleDateChange(index, 'date_value', e.target.value)} />
                    </Col>
                  {
                    windowWidth > 768 &&
                    <Col sm="1" className='d-flex align-items-end'>
                    <Button variant="danger" onClick={() => removeDate(index)} className='bg-transparent border-0' title='Delete this date'>
                      <FontAwesomeIcon icon={faCircleXmark} className='text-danger' />
                    </Button>
                  </Col>
                  }
                  </Form.Group>
                ))}
                {isupdateForm && errorMessage !== '' && <p className='text-center text-warning'>{errorMessage}</p>}
              </Tab>
              <Tab eventKey={`4`} title="Call For Paper" className='mx-4' tabClassName= 'custom-tab-update'>
                <Form.Group as={Row} className='my-3'>
                  <Form.Label column sm="3">Call for paper: </Form.Label>
                  <Col>
                    <Form.Control type="text" as="textarea" rows={windowWidth > 768 ? 14 : 22} value={formData.callForPaper} onChange={(e) => handleInformationChange('callForPaper', e.target.value)} />
                  </Col>
                </Form.Group>
              </Tab>
            </Tabs>
          </Form>
        </div>
      </Modal.Body>
      {
        isupdateForm && !status && message !== '' && <p className="text-danger text-center">{message}</p>
      }
      <Modal.Footer className='d-flex justify-content-center w-100 text-center' >
        {status && message !== '' ? 
                <div className = {status ? 'text-success' : 'text-danger'}>
                  {status && <div>
                  <span className='text-success'>{t('success')}</span>. {t('closing_countdown', {countdown: countdown})}</div>}
                </div>
                :
                <ButtonGroup>
                <Button onClick={onClose} className='bg-secondary border-light px-5 mx-3 rounded text-light'>
                  {t('cancel')}
                </Button>
                <Button onClick={handleUpdatePost} className='bg-blue-normal border-light px-4 mx-3 rounded d-flex'>
                  {
                    loading
                      ?
                      <Loading onReload={handleUpdatePost} size={'sm'} />
                      :
                      <div>
                        <FontAwesomeIcon icon={faEdit} className='me-2' />
                        {t('update')}
                      </div>
                  }
      
                </Button>
              </ButtonGroup>
        }

       
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUpdateConf;
