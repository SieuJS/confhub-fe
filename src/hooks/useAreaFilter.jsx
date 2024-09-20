
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/authContext';
import countries from  './../data/countries.json'
import { useTranslation } from 'react-i18next';

const useAreaFilter = () => {
  const {state, dispatch} = useAppContext()
  const {t} =useTranslation()
  const navigate = useNavigate()

  const containsVietnamese = (str) => {
    const vietnamesePattern = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    return vietnamesePattern.test(str);
  };
  
  const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();
  };
  
  const checkForCountryInText = (text) => {
    if (!text || text === undefined || text === '') {
      return '';
    }
  
    const normalizedText = containsVietnamese(text) ? text.toLowerCase() : normalizeString(text);
  
    for (const key in countries) {
      const country = countries[key];
      const valuesToCheck = [
        country.country_name,
        country.country_name_full,
      ];
  
      const found = valuesToCheck.some(value => normalizedText.includes(containsVietnamese(value) ? value.toLowerCase() : normalizeString(value)));
      
      if (found) {
        return country.country_name;
      }
    }
  
    return '';
  };

      const setUserLocation = (location) => {
        dispatch({type: "SET_USER_LOCATION", payload: location})
      }

      const handleNavigateAccount = () => {
        alert(t('pls_login_to_use_area_filter'))
        navigate('/user/account')
      }
      const handleNavigateLogin = () => {
        alert(t('pls_login_to_use_this_feature'))
        navigate('/login')
      }
  return {
    userLocation: state.userLocation,
    setUserLocation,
    checkForCountryInText,
    handleNavigateAccount,
    handleNavigateLogin
  }
}

export default useAreaFilter