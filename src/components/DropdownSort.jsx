import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';

export const DropdownSort = ({ onSelect, options }) => {
  const {t} = useTranslation()
  const [selectedOption, setSelectedOption] = useState('random');
  
  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };
  return (
    <Dropdown>
      <Dropdown.Toggle className='bg-transparent border-primary-normal text-dropdown-toggle fs-6'>
        <span className='fw-semibold'>{t('sort_by')}:</span> {`  ${t(selectedOption)}` || 'random'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {
          options
          &&
          <>
            {options.map(option => (
              <Dropdown.Item key={option} onClick={() => handleSelect(option)} className='fs-6'>
                {t(option)}
              </Dropdown.Item>
            ))}
          </>
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}
