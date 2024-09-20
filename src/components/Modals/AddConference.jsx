import { useEffect, useState } from 'react'
import { Button, Col, Form, Image, Modal, Carousel, CarouselItem, Row, ButtonGroup } from 'react-bootstrap'
import AddButtonIcon from './../../assets/imgs/edit.png'
import ChooseFORs from '../Postconference/ChooseFORs';
import usePost from '../../hooks/usePost';
import SuccessfulModal from './SuccessModal';
import LocationInput from '../Postconference/LocationInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import useSearch from '../../hooks/useSearch';
import Loading from '../Loading';
import { useTranslation } from 'react-i18next';
import useScreenSize from '../../hooks/useScreenSize';

const AddConference = ({ show, handleClose, handleCheckStatus, onReloadList }) => {
    const { t } = useTranslation()
    const {windowWidth} = useScreenSize()
    const { loading, postConference, getPostedConferences } = usePost()
    const { filterOptions, getOptionsFilter } = useSearch()

    const [page, setPage] = useState(0)
    const [isPosted, setIsPosted] = useState(false)

    const [message, setMesage] = useState('')
    const [status, setStatus] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [activeAccordionKey, setActiveAccordionKey] = useState([]);

    const [isDuplicate, setIsDuplicate] = useState(false)
    const [isOrgDateValid, setIsOrgDateValid] = useState(false)
    useEffect(() => {
        if (!filterOptions['rank']) {
            getOptionsFilter('for')
        }
    }, [filterOptions])

    const [formData, setFormData] = useState({
        conf_name: '',
        acronym: '',
        callForPaper: '',
        link: '',
        fieldsOfResearch: [],
        organizations: [{
            name: '',
            start_date: null,
            end_date: null,
            type: '',
            location: '',
        }],
        importantDates: [{ date_value: '', date_type: '' }],
    });

    const [requiredFields, setRequiredFields] = useState({
        conf_name: true,
        acronym: true,
        callForPaper: true,
        link: true,
        fieldsOfResearch: true,

    });


    const [invalidDates, setInvalidDates] = useState([]);

    const handleAddDate = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            importantDates: [...prevFormData.importantDates, { date_value: '', date_type: '' }]
        }));
    };

    const handleRemoveDate = (index) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            importantDates: prevFormData.importantDates.filter((_, i) => i !== index)
        }));
    };

    const handleDateChange = (e, index, field) => {
        const { value } = e.target;
        const updatedDates = formData.importantDates.map((date, i) =>
            i === index ? { ...date, [field]: value } : date
        );
        setFormData(prevFormData => ({
            ...prevFormData,
            importantDates: updatedDates
        }));
    };

    const [selectedfieldsOfResearch, setSelectedfieldsOfResearch] = useState([]);

    const handleOrgChange = (index, event) => {
        const { name, value } = event.target;

        // Kiểm tra nếu end_date được chọn trước start_date
        if (name === 'end_date' && formData.organizations[index].start_date && value < formData.organizations[index].start_date) {
            setIsOrgDateValid(true);
        } else {
            setIsOrgDateValid(false);
        }

        const updatedOrganizations = [...formData.organizations];
        updatedOrganizations[index][name] = value;

        setFormData({
            ...formData,
            organizations: updatedOrganizations
        });
    };

    const handlefieldsOfResearchChange = (selectedOption) => {
        setSelectedfieldsOfResearch(selectedOption);
        const selectedValues = selectedOption.map(option =>
            (option.value)
        );

        // Cập nhật formData với giá trị mới
        setFormData({
            ...formData,
            fieldsOfResearch: selectedValues,
        });

    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

    };
    const handleTextAreaKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setFormData((prevData) => ({
                ...prevData,
                callForPaper: prevData.callForPaper + '\n',
            }));
        }
    };
    const handleLocationChange = (orgIndex, location) => {
        setFormData(prevFormData => {
            const updatedOrgs = [...prevFormData.organizations];
            updatedOrgs[orgIndex].location = location;
            return {
                ...prevFormData,
                organizations: updatedOrgs
            };
        });
    };

    const handleClearForm = () => {
        setRequiredFields({
            conf_name: true,
            acronym: true,
            callForPaper: true,
            link: true,
            fieldsOfResearch: true,
        })

        setSelectedfieldsOfResearch([])
    }

    const handleCloseForm = () => {
        handleClose()
        handleClearForm()
        setPage(0)
    }


    //remove function
    const removeEmptyOrganizations = (organizations) => {
        return organizations.filter(org =>
            org.name || org.type || org.location || org.start_date || org.end_date
        );
    };

    const addEmptyOrganizationIfNecessary = (organizations) => {
        return organizations.length > 0 ? organizations : [{
            name: '',
            type: '',
            location: '',
            start_date: '',
            end_date: ''
        }];
    };

    const removeEmptyImportantDates = (importantDates) => {
        return importantDates.filter(date =>
            date.date_type || date.date_value
        );
    };

    const addEmptyImportantDateIfNecessary = (importantDates) => {
        return importantDates.length > 0 ? importantDates : [{
            date_type: '',
            date_value: ''
        }];
    };
    ////


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const newInvalidDates = formData.importantDates.reduce((acc, date, index) => {
            if ((date.date_value === '' && date.date_type !== '') || (date.date_value !== '' && date.date_type === '')) {
                acc.push(index);
            }
            return acc;
        }, []);

        const hasDuplicateNames = formData.organizations.some((org, index) => {
            return formData.organizations.findIndex((item, i) => item.name === org.name && i !== index) !== -1;
        });
        setIsDuplicate(hasDuplicateNames)
        if (hasDuplicateNames) {
            setActiveAccordionKey(2)
        }
        if (newInvalidDates.length > 0) {
            setInvalidDates(newInvalidDates);
        } else {
            const cleanedDates = formData.importantDates.filter(date => date.date_value !== '' && date.date_type !== '');
            setFormData(prevFormData => ({
                ...prevFormData,
                importantDates: cleanedDates
            }));
            setInvalidDates([]);
            // Handle form submission logic here
        }
        let allValid = true
        for (const field in requiredFields) {
            if (formData[field] === '' || formData[field] === undefined || (field === 'fieldsOfResearch' && formData[field].length === 0)) {
                allValid = false;
                requiredFields[field] = false

            } else {
                requiredFields[field] = true
            }
        }
        // Loại bỏ các organizations và importantDates rỗng ban đầu
        const cleanedOrganizations = removeEmptyOrganizations(formData.organizations);
        const cleanedImportantDates = removeEmptyImportantDates(formData.importantDates);

        // Kiểm tra các điều kiện submits
        const updatedFormData = {
            ...formData,
            organizations: cleanedOrganizations,
            importantDates: cleanedImportantDates
        };
        if (allValid) {
            setIsPosted(true)

            const result = await postConference(updatedFormData)
            setMesage(result.message)
            setStatus(result.status)
            if (result.status) {
                setShowSuccessModal(true)
                setIsPosted(false)
                getPostedConferences()
                onReloadList()
                handleCloseForm()
            }
            else {
                // Kiểm tra nếu tất cả các organizations và importantDates đều rỗng thì thêm một object với các giá trị trống
                const finalOrganizations = addEmptyOrganizationIfNecessary(cleanedOrganizations);
                const finalImportantDates = addEmptyImportantDateIfNecessary(cleanedImportantDates);

                setFormData({
                    ...formData,
                    organizations: finalOrganizations,
                    importantDates: finalImportantDates
                });

            }

        }

        else {
            // Kiểm tra nếu tất cả các organizations và importantDates đều rỗng thì thêm một object với các giá trị trống
            const finalOrganizations = addEmptyOrganizationIfNecessary(cleanedOrganizations);
            const finalImportantDates = addEmptyImportantDateIfNecessary(cleanedImportantDates);

            setFormData({
                ...formData,
                organizations: finalOrganizations,
                importantDates: finalImportantDates
            });

            setRequiredFields(requiredFields)
            setPage(0)
        }
    }
    const handleSelect = (selectedIndex) => {
        setPage(selectedIndex);
    };

    
    return (
        <>
            <Modal
                show={show}
                onHide={handleCloseForm}
                size="lg"
                scrollable={true}
                fullscreen="sm-down"
            >

                <Modal.Header closeButton className='fixed'>
                    <Modal.Title className='text-center w-100 text-skyblue-dark'>{t('conference_info')}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>

                    <Form className='form-container' style={{ minHeight: "450px" }}>
                        <div className="modal-scrollable-body">
                            <Carousel activeIndex={page} onSelect={handleSelect} controls={false} interval={null} indicators={false}>
                                <Carousel.Item className='mt-5'>
                                    <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3" xs="12" className='text-nowrap '>
                                            <span className='text-danger'>* </span>{t('name')}:
                                        </Form.Label>
                                        <Col xs="12" sm="9"> 
                                        <Form.Control
                                            type="text"
                                            placeholder={t('enter_conference_name')}
                                            name="conf_name"
                                            value={formData.conf_name}
                                            onChange={handleInputChange}
                                            className={requiredFields.conf_name ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3" xs="12" className='text-nowrap '>
                                            <span className='text-danger'>* </span>{t('acronym')}:
                                        </Form.Label>
                                        <Col xs="12" sm="9"> 
                                        <Form.Control
                                            type="text"
                                            placeholder={t('enter_acronym')} 
                                            name="acronym"
                                            value={formData.acronym}
                                            onChange={handleInputChange}
                                            className={requiredFields.acronym ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3" xs="12" className='text-nowrap '>
                                            <span className='text-danger'>* </span> Link:
                                        </Form.Label>
                                        <Col xs="12" sm="9"> 
                                        <Form.Control
                                            name="link"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            placeholder={t('enter_link')}
                                            className={requiredFields.link ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3 d-flex align-items-start">
                                        <Form.Label column sm="3" xs="12" className='text-nowrap '>
                                            <span className='text-danger'>* </span> {t('field_of_research')}:
                                        </Form.Label>
                                        <Col xs="12" sm="9"> 
                                            <ChooseFORs
                                                selectedOptions={selectedfieldsOfResearch}
                                                onChange={handlefieldsOfResearchChange}
                                                requiredFields={requiredFields}
                                            />
                                        </Col>
                                    </Form.Group>

                                </Carousel.Item>
                                <Carousel.Item>
                                    {
                                        formData.organizations.map((organization, index) => (
                                            <div key={index}>

                                                <Form.Group as={Row} className='my-3'>
                                                    <Form.Label column sm="3" xs="12">{t('type')}: </Form.Label>
                                                    <Col xs="12" sm="9"> 
                                                        <Form.Select value={organization.type} name='type' onChange={(e) => handleOrgChange(index, e)}>
                                                            <option value="">{`${t('select')} ${t('type').toLowerCase()}`}...</option>
                                                            <option value="online">Online</option>
                                                            <option value="offline">Offline</option>
                                                            <option value="hybrid">Hybrid</option>
                                                        </Form.Select>
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className='my-2'>
                                                    <Form.Label column sm="3" xs="12" className='text-nowrap '>{t('location')}: </Form.Label>
                                                    <Col>
                                                        <LocationInput onLocationChange={handleLocationChange} orgIndex={index} />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className='mt-1 mb-3 d-flex w-100'>
                                                    <Col>
                                                        <Form.Label>{t('start_date')}:</Form.Label>
                                                        <Form.Control type="date" value={organization.start_date} name='start_date' onChange={(e) => handleOrgChange(index, e)} className={isOrgDateValid ? 'border-danger' : ''} />

                                                    </Col>
                                                    <Col >
                                                        <Form.Label>{t('end_date')}:</Form.Label>
                                                        <Form.Control type="date" value={organization.end_date} name='end_date' onChange={(e) => handleOrgChange(index, e)} className={isOrgDateValid ? 'border-danger' : ''} />
                                                    </Col>
                                                </Form.Group>

                                            </div>
                                        ))
                                    }
                                </Carousel.Item>
                                <Carousel.Item>
                                    {formData.importantDates.map((date, index) => (
                                        <Form.Group as={Row} key={index} className='my-3 d-flex bg-beige-light '>
                                            <Col sm='6' className='mt-1'>
                                                <div className="d-flex justify-content-between align-items-center">

                                                <Form.Label>{t('date_type')}:</Form.Label>
                                                {
                                                    windowWidth <= 768 &&
                                                    <Button variant="danger" onClick={() => handleRemoveDate(index)} className='bg-transparent border-0' title='Delete this date'>
                                                    <FontAwesomeIcon icon={faCircleXmark} className='text-danger' />
                                                </Button>
                                                }
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    placeholder={t('enter_date_description')} 
                                                    value={date.date_type}
                                                    onChange={(e) => handleDateChange(e, index, 'date_type')}
                                                    className={invalidDates.includes(index) && date.date_type === '' ? 'border-danger' : ''}
                                                />
                                                
                                            </Col>
                                            <Col className='mt-1'>
                                                <Form.Label>{t('date')}:</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={date.date_value}
                                                    onChange={(e) => handleDateChange(e, index, 'date_value')}
                                                    className={invalidDates.includes(index) && date.date_value === '' ? 'border-danger' : ''}
                                                />
                                            </Col>
                                            {
                                                windowWidth > 768 &&
                                                <Col sm='1' className='d-flex align-items-end'>
                                                <Button variant="danger" onClick={() => handleRemoveDate(index)} className='bg-transparent border-0 p-0' title='Delete this date'>
                                                    <FontAwesomeIcon icon={faCircleXmark} className='text-danger' />
                                                </Button>
                                            </Col>
                                            }
                                        </Form.Group>
                                    ))}

                                    <div className='w-100 d-flex justify-content-center'>
                                        <Button variant="primary" onClick={handleAddDate} className='bg-skyblue-dark px-4 py-1 border-light'>
                                            {t('add_more_date')}
                                        </Button>
                                    </div>

                                </Carousel.Item>
                                <CarouselItem>
                                    <Form.Group as={Row} className="mb-3 d-flex align-items-start">

                                        <Form.Label column sm="3" xs="12" className='text-nowrap '> <span className='text-danger'>* </span>Call for paper:</Form.Label>
                                        <Col xs="12" sm="9"> 
                                       <Form.Control
                                            as="textarea"
                                            rows={17}
                                            name="callForPaper"
                                            value={formData.callForPaper}
                                            onChange={handleInputChange}
                                            onKeyDown={handleTextAreaKeyDown}
                                            placeholder={t('enter_call_for_paper')} 
                                            className={requiredFields.callForPaper ? 'border-blue-normal' : 'border border-danger '}
                                        />
                                       </Col>
                                    </Form.Group>
                                </CarouselItem>
                            </Carousel>
                        </div>
                    </Form>
                    {status && isPosted && showSuccessModal && <SuccessfulModal message={message} show={showSuccessModal} handleClose={handleClose} />}
                    {!status && isPosted && <p className="text-danger text-center">{message}</p>}
                    {isPosted && status && <SuccessfulModal handleCloseForm={handleClose} message={message} />}
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-center text-white">
                    <ButtonGroup>
                        <Button
                            onClick={() => setPage((prevIndex) => prevIndex - 1)}
                            disabled={page === 0}
                            className='border-blue-normal text-blue-normal bg-beige-light px-5 mx-3 rounded'>
                            {t('back')}
                        </Button>
                        {
                            page < 3
                                ?
                                <Button onClick={() => setPage((prevIndex) => prevIndex + 1)} className='rounded bg-blue-normal px-5 py-1 mx-3 '>
                                    {t('next')}
                                </Button>
                                :
                                <>
                                    <Button onClick={handleFormSubmit} className='bg-blue-normal px-4 py-1 mx-3 rounded'>
                                        {
                                            loading
                                                ?
                                                <Loading size={'sm'} />
                                                :
                                                <div>
                                                    <Image width={20} height={20} className='me-2' src={AddButtonIcon} />
                                                    {t('submit')}
                                                </div>
                                        }
                                    </Button>
                                </>
                        }
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddConference