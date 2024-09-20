import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const InputSearhInList = ({onApplyFilter}) => {
    const {t} = useTranslation()
    const [keyword, setKeyword] = useState('');

    const handleInputChange = (event) => {
      setKeyword(event.target.value);
    };
  
    const handleEnterKeyPress = (event) => {
      if (event.key === 'Enter') {
        // Xử lý khi nhấn phím Enter
        onApplyFilter(keyword)
       
      }
    };
  
    return (
      <InputGroup>
        <InputGroup.Text className='bg-transparent border-end-0'>
          <FontAwesomeIcon icon={faSearch}/>
        </InputGroup.Text>
        <Form.Control
          className=' border-start-0 fs-6'
          type="text"
          placeholder={`${t('search_keyword')}...`}
          value={keyword}
          onChange={handleInputChange}
          onKeyDown={handleEnterKeyPress}
        />
      </InputGroup>
    );
}

export default InputSearhInList