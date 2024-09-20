
import { faFileImport } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button} from "react-bootstrap"
import useImport from "../../../hooks/useImport"
import ModalImport from "./ModalImport"
import { useTranslation } from "react-i18next"
import useScreenSize from "../../../hooks/useScreenSize"

const ImportButton = () => {
  const {t} = useTranslation()
  const {windowWidth} = useScreenSize()
  const { showOptionImportModal, setOptionShowImportModal, } = useImport()

  return (
    <div>
        <Button 
        title="Import data to dashboard"
        onClick={()=>setOptionShowImportModal(true)}
        className="bg-teal-light border-0 text-color-black fw-medium d-flex align-items-center border mx-2">
            <FontAwesomeIcon icon={faFileImport} className='me-2'/>
            {windowWidth > 768 && `${t('import_file')}`}
           
        </Button>
      {showOptionImportModal && <ModalImport show={showOptionImportModal} onHide={()=>setOptionShowImportModal(false)}/>}
      
    </div>
  )
}

export default ImportButton