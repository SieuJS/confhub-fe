import { useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import DeleteModal from '../Modals/DeleteModal'


import usePost from '../../hooks/usePost'
import ModalUpdateConf from '../UpdatePost.jsx/ModalUpdateConf'
import { useTranslation } from 'react-i18next'
const ButtonGroupUpdate = ({conference}) => {
    const {t} = useTranslation()
    const [showUpdateConf, setShowUpdate] = useState(false)
    const [showDeleteConf, setShowDelete] = useState(false)
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState(false)
    const {loading, deletePost, getPostedConferences} = usePost()

    const [countdown, setCountdown] = useState(3);
    const [isConfirm, setIsConfirm] = useState(false)
    
    const handleClose = (e) => {
      e.stopPropagation();
        setShowDelete(false);
        setStatus(null);
        setMessage('');
        setCountdown(3);
      };

    const handleDeletePost = async (e) => {
      e.stopPropagation();
        setIsConfirm(true)
        const result = await deletePost(conference?.id);
        setStatus(result.status);
        setMessage(result.message);
        if (result.status) {
          getPostedConferences()
          const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
              if (prevCountdown === 0) {
                clearInterval(countdownInterval);
                handleClose(e);
                return 0;
              }
              return prevCountdown - 1;
            });
          }, 1000); // Giảm mỗi 1 giây
        }
    }
    const handleOpenModalUpdate = (e) => {
      e.stopPropagation(); // Ngăn chặn sự kiện click từ button mở modal lan ra và ảnh hưởng đến sự kiện click của card body
      setShowUpdate(true);
    };
  
    const handleCloseModalUpdate = (e) => {
      e.stopPropagation(); // Ngăn chặn sự kiện click từ button đóng modal lan ra và ảnh hưởng đến sự kiện click của card body
      setShowUpdate(false);
    };
    const handleOpenModalDelete = (e) => {
      e.stopPropagation(); // Ngăn chặn sự kiện click từ button mở modal lan ra và ảnh hưởng đến sự kiện click của card body
      setShowDelete(true);
    };
  

    return (
        <>
          
            <DeleteModal 
            show={showDeleteConf} 
            onClose={handleClose}
            onConfirm={handleDeletePost}
            modalTitle = {'conference'}
            message={message}
            status={status}
            loading={loading}
            countdown={countdown}
            isConfirm={isConfirm}
            />

            {showUpdateConf && 
            <ModalUpdateConf 
                conference={conference}
                show={showUpdateConf}    
                onClose={handleCloseModalUpdate}
                onUpdatePost={getPostedConferences}
                onModalClick={handleOpenModalUpdate}
            />}
            
            <ButtonGroup className='text-end p-0'>
                <Button 
                onClick={handleOpenModalUpdate}
                className='bg-teal-normal border-0 rounded mx-2 px-3' >
                   {t('update')}
                </Button>
                <Button 
                    onClick={handleOpenModalDelete}
                    className='bg-danger border-0 rounded mx-2 px-3 '>
                    {t('delete')}
                </Button>
            </ButtonGroup>
        </>
    )
}

export default ButtonGroupUpdate