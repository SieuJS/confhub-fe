import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './custom_translationbutton.css'
import moment from 'moment';
import 'moment/locale/vi'

const TranslationButton = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;


    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
      moment.updateLocale(lng)
      localStorage.setItem('language', lng);
    };
    
  return (
    <div>
      {currentLanguage !== 'en' && (
        <Button className='custom-trans-btn bg-transparent border-secondary text-secondary-emphasis py-0' onClick={() => changeLanguage('en')}>vi</Button>
      )}
      {currentLanguage !== 'vi' && (
        <Button className='custom-trans-btn bg-transparent border-secondary text-warning-emphasis py-0' onClick={() => changeLanguage('vi')}>en</Button>
      )}
    </div>

  )
}

export default TranslationButton