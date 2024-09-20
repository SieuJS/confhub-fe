import  { useEffect, useState } from 'react'
import {Image } from 'react-bootstrap'

import useSearch from '../../hooks/useSearch'

import starIcon from '../../assets/imgs/star.png'
import unstarIcon from '../../assets/imgs/unstar.png'

import Select from 'react-select'
import { useTranslation } from 'react-i18next'
const rating = [1, 2, 3, 4, 5]
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
};
const CustomOption = ({ innerProps, label, isSelected }) => {
  const renderStars = (numStars) => {
    const stars = [];
    for (let i = 1; i <= numStars; i++) {
      stars.push(<Image key={i} src={starIcon} width={16} className='mx-1' />);
    }
    for (let i = numStars + 1; i <= 5; i++) {
      stars.push(<Image key={i} src={unstarIcon} width={16} className='mx-1' />);
    }
    return stars;
  };

  return (
    <div {...innerProps} className='d-flex align-items-start'>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => { }}
        className='m-2'
      />
      <label style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
        {renderStars(label)}
      </label>
    </div>
  );
}

const StarDropdown = ({ label, filter }) => {
  const { filterOptions, addKeywords } = useSearch()
  const [tranformOptions, setTranformOptions] = useState([])
  const {t} = useTranslation()

  useEffect(() => {
    let transformedState = []
    if (filterOptions !== null) {
      transformedState = rating.map((item, index) => ({
        value: index + 1,
        label: item,
      }));

    }
    setTranformOptions(transformedState);
  }, []);
  const handleOptionChange = async (item) => {
    const rating = item[0].value
    const formatKeyword = `Rating from ${rating}*`
    addKeywords(filter, label, [formatKeyword] )
  };
  return (
    <div>
      <Select
        styles={customStyles}
        isMulti={true}
        options={tranformOptions}
        value
        components={{ Option: CustomOption }}
        onChange={handleOptionChange}
        closeMenuOnSelect={true}
        placeholder={t('all')}
        menuPortalTarget={document.body}
        menuPosition='fixed'
      />
    </div>
  )
}

export default StarDropdown