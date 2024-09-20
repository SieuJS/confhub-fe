import { faDownload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button} from "react-bootstrap"
import useAdmin from "../../hooks/useAdmin"
import { useTranslation } from "react-i18next"
import useScreenSize from "../../hooks/useScreenSize"

const ExportButton = ({data}) => {
  const {t} = useTranslation()
  
  const {windowWidth} = useScreenSize()
    const {exportToExcel} = useAdmin()
  return (
    <div>
        <Button 
        title="Import data to dashboard"
        onClick={()=>exportToExcel(data)}
        className="bg-teal-light border-0 text-color-black fw-medium d-flex align-items-center border mx-1">
            <FontAwesomeIcon icon={faDownload} className='me-2'/>
            {windowWidth > 768 && `${t('export_file')}`}
        </Button>
     
    </div>
  )
}

export default ExportButton