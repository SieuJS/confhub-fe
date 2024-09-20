import { useEffect, useState } from 'react'
import Select from 'react-select';
import useSearch from '../../hooks/useSearch';
import { FloatingLabel, Form } from "react-bootstrap"
import { useTranslation } from 'react-i18next';


const ChooseFORs = ({ selectedOptions, onChange, requiredFields, isError }) => {
  const {t} = useTranslation()
  const { filterOptions, getOptionsFilter } = useSearch()
  const [options, setOptions] = useState([]);

  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    getOptionsFilter('for')
    if (filterOptions['for']) {
      const originalOptions = filterOptions['for'].map((item, index) => ({
        value: item,
        label: item,
      }));
      setOptions(originalOptions)
    }
  }, [filterOptions])

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid #155D68',
      borderRadius: '4px', // Điều chỉnh độ cong của góc
      boxShadow: state.isFocused ? '0 0 0 0.1rem rgba(76, 139, 245, 0.25)' : null, // Hiệu ứng boxShadow khi focus
      '&:hover': {
        border: '1px solid #155D68', // Điều chỉnh màu và độ dày của border khi hover
      },
    }),
    menuPortal: provided => ({ 
      ...provided, 
      zIndex: 9999,
    }),
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleOnChange = (selectedOptions) => {

    onChange(selectedOptions);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      const newValue = {
        label: inputValue,
        value: inputValue,
      };
      setOptions([...options, newValue]);

      onChange([...selectedOptions, ...[newValue]]);

      setInputValue('');
    }
  };

  const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className='p-2 overflow-y-hidden'>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => { }}
        className='align-self-center me-1'
      />
      <label style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{label}</label>
    </div>
  );

  return (
    <div>

      <Select
        isMulti={true}
        options={options.length > 0 ? options : []}
        value={selectedOptions}
        components={{ Option: CustomOption }}
        onChange={handleOnChange}
        styles={customStyles}
        closeMenuOnSelect={false}
        isSearchable={true}
        placeholder={t('select_field_of_research')}
        required
        menuPortalTarget={document.body}
        maxMenuHeight={200}
      />

        <FloatingLabel controlId="floatingInput" label={`+ ${t('add_new')}`} className='text-center d-flex justify-content-center mt-1'>
          <Form.Control
            type="text"
            placeholder={t('enter_something')}
            value={inputValue}
            name='inputValue'
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={requiredFields?.fieldsOfResearch || !isError ? 'border-blue-normal' : 'border border-danger '}
          />
        </FloatingLabel>
    </div>
  )
}

export default ChooseFORs