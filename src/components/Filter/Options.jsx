//lấy dữ liệu từ danh sách để đưa vào dropdown
import { useEffect, useState } from 'react'
import useSearch from '../../hooks/useSearch'

import { capitalizeFirstLetter } from '../../utils/formatWord'
import Select from 'react-select'
import countries from '../../data/countries.json'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../../context/authContext'
const customStyles = {
    menuPortal: (provided) => ({
        ...provided,
        zIndex: 9999, // Đặt giá trị z-index cao để luôn nằm trên các thành phần khác
    }),
    control: (provided, state) => ({
        ...provided,
        cursor: 'pointer',
        border: '1px solid #4EB1A4', // Điều chỉnh màu và độ dày của border khi focus
        borderRadius: '4px', // Điều chỉnh độ cong của góc
        boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(76, 139, 245, 0.25)' : null, // Hiệu ứng boxShadow khi focus
        '&:hover': {
            border: '1px solid #469E92', // Điều chỉnh màu và độ dày của border khi hover
        },
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isFocused ? 'lightgray' : 'white',
        color: state.isFocused ? 'black' : 'gray',
        cursor: 'pointer',
        '&:hover': {
            background: 'lightgray', // Điều chỉnh màu nền khi hover
            color: 'black', // Điều chỉnh màu chữ khi hover
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        display: 'none'
    })
};

const CustomOption = (props) => {
    const { innerProps, label, isSelected, isFocused } = props;
    return (
        <div 
            {...innerProps} 
            className={`d-flex align-items-center justify-content-start ${isFocused ? 'custom-hover' : ''}`}
            style={{ 
                backgroundColor: isFocused ? '#eaf9f3' : isSelected ? '#bcedd8' : 'white', 
                
                cursor: 'pointer' 
            }}
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => null}
                className='ms-2 me-1'
            />
            <span className={`fs-6 p-2 ${isSelected ? 'text-skyblue-dark' : 'text-color-black'}`}>
                {capitalizeFirstLetter(label)}
            </span>
        </div>
    );
};
const MultiValue = ({ index, getValue, ...props }) => {
    const {t, i18n} = useTranslation()
    const maxToShow = 1;
    const overflow = getValue()
      .slice(0, -maxToShow)
      .map((x) => x.label);
  
    return index === getValue().length - maxToShow ? (
        `+ ${overflow.length+1} ${t('option')}${overflow.length !== 0 && i18n.language === 'en' ? "s" : ""}   `
    ) : null;
  };

const Options = ({ label, filter }) => {
    const {state} = useAppContext()
    const { filterOptions, getOptionsFilter, addKeywords, deleteKeyword } = useSearch()
    const [options, setOptions] = useState([])
    const [selectedOptions, setSelectedOptions] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const {t} = useTranslation()

    
    useEffect(() => {
        const fetchOption = async () => {
            await getOptionsFilter(label)
        }
        let transformedOptions = [];
    
            if (label === 'location') {
                transformedOptions = Object.keys(countries)
                    .filter(countryCode => !countries[countryCode].country_name.includes(';'))
                    .map(countryCode => ({
                        value: countryCode,
                        label: countries[countryCode].country_name
                    }));
                setOptions(transformedOptions);
            } else {
                fetchOption()
                if (filterOptions[label]) {
                    transformedOptions = filterOptions[label]
                        .filter(item => !item.includes(';'))
                        .map((item) => ({
                            value: item,
                            label: item,
                        }));
                }
                setOptions(transformedOptions);
            }
    }, [label, filterOptions]);
    


    const handleOptionChange = async (items) => {
        setSelectedOptions(items)
        const itemsValues = items.map(item => item.value);
        const removedOptions = state[filter][label].map(value => ({ value, label: value })).filter(option => !itemsValues.includes(option.value));

        if (removedOptions.length <= 0) {
            addKeywords(filter, label, [items[items.length-1].label])
        }   
        else {  
            deleteKeyword(label, removedOptions[0].label, filter)
        }
    
    }
    const filterOption = (option, searchInput) => {
        const filteredOptions = filterOptionsBySearchTerm(searchInput);
        return filteredOptions.some(filteredOption => filteredOption.value === option.value);
    };
    

    const filterOptionsBySearchTerm = (searchInput) => {
        const searchTermLower = searchInput.toLowerCase();

        if(label === 'location'){
            const valueMatch = Object.entries(countries).filter(([key, value]) => {
                return Object.values(value).some(val => {
                    if (typeof val === 'string') {
                        return val.toLowerCase().includes(searchTermLower);
                    }
                    return false;
                });
            }).map(([key, value]) => ({
                value: key,
                label: `${value.country_name}`,
            }));
    
            return valueMatch
        }else{
            const filteredItems = filterOptions[label].filter(option =>
                option.toLowerCase().includes(searchTermLower)
            ).map(option => ({
                value: option,
                label: option
            }));
            return filteredItems
        }
        
    };
    // Hàm xử lý thay đổi khi người dùng nhập vào ô tìm kiếm
    const handleInputChange = (newValue) => {
        setSearchTerm(newValue);    
    }

    return (
        <div>
            <Select
            isMulti={true}
            options={options}
            value={state[filter][label].map(value => ({ value, label: value }))}
            hideSelectedOptions={false}
            isClearable={false}
            components={{ Option: props => <CustomOption {...props}  />, MultiValue }}
            onChange={handleOptionChange}
            onInputChange={handleInputChange}
            filterOption={filterOption}
            closeMenuOnSelect={true}
            styles={customStyles}
            placeholder={t('all')}
            menuPortalTarget={document.body}
            menuPosition="fixed"
        />
        </div>

    )
}

export default Options
