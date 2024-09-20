import { useState } from 'react';
import { Form, InputGroup} from 'react-bootstrap';
import useSearch from '../../hooks/useSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';



function InputSearch({filter}) {
  const {t} = useTranslation()
  const [keyword, setKeyword] = useState('');
  const {addKeywords} = useSearch()
  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Xử lý khi nhấn phím Enter

      addKeywords(filter, 'search', [keyword])
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

export default InputSearch;
