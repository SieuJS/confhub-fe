import { useEffect, useState } from 'react';

const useFormDataInput = () => {
    const [formData, setFormData] = useState();
    const [selectedFieldOfResearch, setSelectedFieldOfResearch] = useState([]);                                                                                                                                                                                                                                                                                                                                                                                                                   
   
    const [isRound, setIsRound] = useState(false)
    const [importantDates, setImportantDates] = useState([
        { date_type: 'submission date', date_value: '' },
        { date_type: 'camera ready', date_value: '' },
        { date_type: 'registration date', date_value: '' },
        { date_type: 'notification date', date_value: '' },
    ]);
    const [requiredFields, setRequiredFields] = useState({
        conf_name: true,
        acronym: true,
        callForPaper: true,
        link: true,
        rank: true,
        organization: {
            type: true,
            location: true,
            conf_date: true,
        },
        fieldOfResearch: true,
        important_date: [
            { date_type: 'Submission date', date_value: true },
            { date_type: 'Camera ready', date_value: true },
            { date_type: 'Registration date', date_value: true },
            { date_type: 'Notification date', date_value: true },
        ],
    })
  

    const handleOrganizationChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            organization: {
                ...prevFormData.organization,
                [name]: value,
            },
        }));
        setRequiredFields((prevFormData) => ({
            ...prevFormData,
            organization: {
                ...prevFormData.organization,
                [name]: true,
            },
        }));
    };

    const handleFieldOfResearchChange = (selectedOption) => {
        setSelectedFieldOfResearch(selectedFieldOfResearch)
        const selectedValues = selectedOption.map(option => ({
            for_name: option.value
        }));
        setFormData({
            ...formData,
            fieldOfResearch: selectedValues,
        });
        setRequiredFields({
            ...formData,
            fieldOfResearch: true,
        });
    };

    const resetForm = () => {
        setFormData({
            conf_name: '',
            acronym: '',
            callForPaper: '',
            link: '',
            rank: '',
            source_name: '',
            fieldOfResearch: [],
            organization: {
                start_date: '',
                end_date: '',
                type: '',
                location: '',
            },
            important_date: [],
        });
        setRequiredFields({
            conf_name: true,
            acronym: true,
            callForPaper: true,
            link: true,
            rank: true,
            source_name: true,
            organization: {
                type: true,
                location: true,
                start_date: true,
                end_date: true
            },
            fieldOfResearch: true,
            important_date: [
                { date_type: 'submission date', date_value: true },
                { date_type: 'camera ready', date_value: true },
                { date_type: 'camera ready', date_value: true },
                { date_type: 'notification date', date_value: true },
            ],
        })

        setSelectedFieldOfResearch([])
    };

    return {
        formData,
        selectedFieldOfResearch,
        importantDates,
        requiredFields,
        isRound,
        setRequiredFields,
        handleOrganizationChange,
        handleFieldOfResearchChange,
        resetForm,
        setIsRound
    };
};

export default useFormDataInput;
