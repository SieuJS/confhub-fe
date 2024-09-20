import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const NavigateButton = ({conf}) => {
  const scrollPositions = useRef({});
  const navigate = useNavigate()

    const handleChooseCfp = async () => {
        // Lưu vị trí cuộn hiện tại trước khi cập nhật URL
        scrollPositions.current[window.location.pathname + window.location.search] = window.scrollY;
        // Cập nhật URL với trang mới
        const newUrl = new URL(window.location);
       // window.history.pushState({}, '', newUrl);
    
        navigate(`/admin/conferences_management/cfp/${conf?.id}`)
      }


  return (
    <Button className='bg-transparent  p-0 mx-2 my-0 border-0 action-btn tb-icon-view  '
            onClick={handleChooseCfp}
            title='View CFP'
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='text-primary-normal action-icon fs-5' />
          </Button>
  )
}

export default NavigateButton