//lấy dữ liệu từ danh sách để đưa vào dropdown
import React, { useEffect, useState } from 'react'
import useSearch from '../../hooks/useSearch'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import Select from 'react-select'
import data from '../Filter/options.json'
const owner = ["Crawler", "User"]
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
    const maxToShow = 1;
    const overflow = getValue()
      .slice(0, -maxToShow)
      .map((x) => x.label);
  
    return index === getValue().length - maxToShow ? (
        `+ ${overflow.length+1} option${overflow.length !== 0 ? "s" : ""} selected`
    ) : null;
  };
const DropdownOptions = ({ label, placeholder }) => {
    const { optionsSelected, filterOptions, getOptionsFilter, addKeywords, deleteKeyword } = useSearch()
    const [options, setOptions] = useState([])
    const [selectedOptions, setSelectedOptions] = useState(optionsSelected[label].map(value => ({ value, label: value })))

    const handleOptionChange = async (items) => {
        setSelectedOptions(items)
        const itemsValues = items.map(item => item.value);
        const removedOptions = selectedOptions.filter(option => !itemsValues.includes(option.value));

        if (removedOptions.length <= 0) {
            addKeywords(label, [items[items.length-1].label])
        } 
        else {
            deleteKeyword(label, removedOptions[0].label)
        }
    
    }

    useEffect(() => {
        const staticValue = ["location", "type", "category", "owner"]
        if (staticValue.includes(label)) {
            if(label === "owner"){
                let transformedOptions = []
                transformedOptions = owner.map((item) => ({
                    value: item,
                    label: item,
                }));
                setOptions(transformedOptions)
            }
            setOptions(data[label])
            getOptionsFilter(label)
        }
        else {
            let transformedOptions = []
            if (filterOptions[label]) {
                transformedOptions = filterOptions[label].map((item) => ({
                    value: item,
                    label: item,
                }));
            }
            setOptions(transformedOptions)
        }
    }, []);

    return (
        <div>
            <Select
                isMulti={true}
                options={options}
                value={optionsSelected[label].map(value => ({ value, label: value }))}
                hideSelectedOptions={false}
                isClearable={false}
                components={{ Option: props => <CustomOption {...props} selectedOptions={optionsSelected[label]} /> , MultiValue }}
                onChange={handleOptionChange}
                closeMenuOnSelect={true}
                styles={customStyles}
                placeholder="All"
                menuPortalTarget={document.body}
                menuPosition="fixed"
            />
        </div>

    )
}

export default DropdownOptions
