import { useEffect, useState } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import data from '../Filter/options.json'
import { useTranslation } from 'react-i18next';
const LocationInput = ({ onLocationChange, orgIndex }) => {
    const {t} = useTranslation()
    const [formData, setFormData] = useState({
        numberStreet: '',
        stateProvince: '',
        city: '',
        country: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        const { numberStreet, stateProvince, city, country } = formData;
        const locationArray = [numberStreet, stateProvince, city, country].filter(Boolean);
        const location = locationArray.join(", ");
        onLocationChange(orgIndex, location);
    }, [formData]);

    return (
        <>
            <Form.Group as={Row} className="mb-3 d-flex align-items-start">
                <Form.Label column sm="3" xs="12">{t('address')}:</Form.Label>
                <Col xs="12" sm="9"> 
                    <Form.Control
                        type="text"
                        name="numberStreet"
                        value={formData.numberStreet}
                        onChange={handleInputChange}
                        placeholder={t('enter_number_street')}
                        autoComplete="off"
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3 d-flex align-items-start">
                <Form.Label column sm="3">{t('state_province')}:</Form.Label>
                <Col xs="12" sm="9"> 
                    <Form.Control
                        type="text"
                        name="stateProvince"
                        value={formData.stateProvince}
                        onChange={handleInputChange}
                        placeholder={t('enter_state_province')}
                        autoComplete='off'
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3 d-flex align-items-start">
                <Form.Label column sm="3">{t('city')}:</Form.Label>
                <Col xs="12" sm="9"> 
                    <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder={t('enter_city')}
                        autoComplete='off'
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                <Form.Label column sm="3" xs="12">{t('country')}:</Form.Label>
                <Col xs="12" sm="9"> 
                <Form.Select
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    autoComplete='off'
                >
                    <option value="">{t('enter_country')}</option>
                    {
                        data.location.map((r) => (
                            <option value={r.label} key={r.value}>{r.label}</option>

                        ))
                    }
                </Form.Select>
                </Col>
            </Form.Group>
        </>
    );
};

export default LocationInput;
