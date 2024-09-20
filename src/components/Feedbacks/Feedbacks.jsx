
import AllFeedbackOfConf from "./AllFeedbackOfConf"
import { useTranslation } from "react-i18next"


const Feedbacks = () => {
  const {t} =useTranslation()
  return (
    <div className='mt-5 pt-3 pb-5 w-100 border-1 border-top'>
      <span className='fs-5 fw-bold'>{t('feedback')}</span>
     
      <AllFeedbackOfConf/>
    </div>
  )
}

export default Feedbacks