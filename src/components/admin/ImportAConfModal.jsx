import { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row, ButtonGroup } from 'react-bootstrap'
import ChooseFORs from '../Postconference/ChooseFORs';

import { useTranslation } from 'react-i18next';
import useScreenSize from '../../hooks/useScreenSize';
import useSearch from '../../hooks/useSearch';
import useImport from '../../hooks/useImport';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const ImportAConfModal = ({ show, handleClose, handleCheckStatus, onReloadList }) => {
    const { t } = useTranslation()
    const { windowWidth } = useScreenSize()
    const {handleImportAConf} = useImport()
    const { filterOptions, getOptionsFilter } = useSearch()

    const ranks = ['A*', 'A', 'B', 'C']

    useEffect(() => {
        getOptionsFilter('for')
        getOptionsFilter('rank')
    }, [filterOptions])

    const [formData, setFormData] = useState({
        title: "",
        acronym: "",
        source: "",
        rank: "",
        PrimaryFoR: []
    });
    const [errors, setErrors] = useState({});


    const [selectedfieldsOfResearch, setSelectedfieldsOfResearch] = useState([]);

    const handlefieldsOfResearchChange = (selectedOption) => {
        setSelectedfieldsOfResearch(selectedOption);
        const selectedValues = selectedOption.map(option =>
            (option.value)
        );

        // Cập nhật formData với giá trị mới
        setFormData({
            ...formData,
            PrimaryFoR: selectedValues,
        });

    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.title) newErrors.title = true;
        if (!formData.acronym) newErrors.acronym = true;
        if (!formData.source) newErrors.source = true;
        if (!formData.rank) newErrors.rank = true;
        if (formData.PrimaryFoR.length === 0) newErrors.PrimaryFoR = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCloseForm = () => {
        handleClose()
    }




    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // All fields are valid, proceed with form submission
            handleImportAConf(formData)
            handleClose()
        } else {
            console.log('Form has errors:', errors);
        }
    }
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
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3" xs="12" className='text-nowrap '>
                                    <span className='text-danger'>* </span>{t('name')}:
                                </Form.Label>
                                <Col xs="12" sm="9">
                                    <Form.Control
                                        type="text"
                                        placeholder={t('enter_conference_name')}
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={errors.title ? 'border border-danger' : 'border-blue-normal'}
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
                                        className={errors.acronym ? 'border border-danger' : 'border-blue-normal'}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3" xs="12" className='text-nowrap '>
                                    <span className='text-danger'>* </span> {t('rank')}:
                                </Form.Label>
                                <Col xs="12" sm="9">
                                    <Form.Select
                                        name="rank"
                                        value={formData.rank}
                                        onChange={handleInputChange}
                                        placeholder={t('enter_rank')}
                                        className={errors.rank ? 'border border-danger' : 'border-blue-normal'}
                                        required
                                    >
                                        <option value="">Select a rank</option>
                                        {ranks.map(rank => (
                                            <option key={rank} value={rank}>{rank}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3" xs="12" className='text-nowrap '>
                                    <span className='text-danger'>* </span> {t('source')}: {`${errors.source}`}
                                </Form.Label>
                                <Col xs="12" sm="9">
                                    <Form.Select
                                        name="source"
                                        value={formData.source}
                                        onChange={handleInputChange}
                                        placeholder={t('select_source')}
                                        className={errors.source ? 'border border-danger' : 'border-blue-normal'}
                                        required
                                    >
                                        <option value="">{t('select_source')}</option>
                                        {['CORE2021', 'CORE2022', 'CORE2023'].map(rank => (
                                            <option key={rank} value={rank}>{rank}</option>
                                        ))}
                                    </Form.Select>
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
                                        errors={errors}
                                        isError={errors.PrimaryFoR ? true : false}
                                    />
                                </Col>
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-center text-white">
                    <ButtonGroup>
                        <Button
                            onClick={handleClose}
                            className='border-blue-normal text-blue-normal bg-beige-light px-5 mx-3 rounded'>
                            {t('cancel')}
                        </Button>
                        <Button onClick={handleFormSubmit} className='bg-blue-normal px-4 py-1 mx-3 rounded'>
                            <FontAwesomeIcon icon={faEdit} className='text-white mx-1'/>
                            {t('submit')}
                        </Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ImportAConfModal