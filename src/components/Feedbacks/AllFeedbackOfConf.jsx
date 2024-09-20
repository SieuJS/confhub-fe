import { useEffect, useState } from 'react'
import useFeedback from '../../hooks/useFeedbacks'
import useConferences from '../../hooks/useConferences'
import { SortFeedbacks } from './SortFeedbacks'
import { Button, Image, Spinner } from 'react-bootstrap'

import starIcon from '../../assets/imgs/star.png'
import unstarIcon from '../../assets/imgs/unstar.png'

import EditIcon from '../../assets/imgs/edit_green.png'
import DeleteIcon from '../../assets/imgs/delete_bin.png'
import InputFeedback from './InputFeedback'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'

const AllFeedbackOfConf = () => {
  const {t} = useTranslation()
  const {windowWidth} = useScreenSize()
  const {handleGetOne} = useConferences()
  const { loading, feedbacks, addFeedback, getAllFeedbacks, updateFeedback, deleteFeedback, sortFeedback, checkEditFeedback } = useFeedback()
  const [idEdit, setIdEdit] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null);
  const [displayFeedback, setDisplayfeedback] = useState([])
  const [isDeleteNote, setDeleteNote] = useState(null)
  const [loadingDel, setLoadingDel] = useState(false)
  const id = useParams()

  useEffect(() => {
    getAllFeedbacks(id.id);
  }, [id]);

  useEffect(() => {
    setDisplayfeedback(feedbacks);
  }, [feedbacks]);

  const options = [
    { value: 'ratingAscending', label: t('rating_ascending') },
    { value: 'ratingDescending', label: t('rating_descending') },
    { value: 'mostRecent', label: t('most_recent') },
    { value: 'oldest', label: t('oldest') },
  ];
  // Hàm xử lý khi người dùng chọn một tùy chọn từ dropdown
  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };
  const handleChooseFeedback = (e, index) => {
    setIdEdit(feedbacks[index].tid)
  }

  const handleDeleteFeedback = async (tid) => {
    setLoadingDel(true)
    setDeleteNote(tid)
    await deleteFeedback(tid)
    await getAllFeedbacks(id.id)
    await handleGetOne(id.id)
    setLoadingDel(false)
  }
  useEffect(() => {
    const handleSortFeedback = async () => {
      const sorted = await sortFeedback(selectedOption)
      setDisplayfeedback(sorted)
    }
    handleSortFeedback()
  }, [selectedOption])

  const renderUser = (user) => {
    const displayName = user.name.trim() ? user.name : user.email;

    return displayName
  }

  const handleReloadPage = async () => {    
    await getAllFeedbacks(id.id)
    await handleGetOne(id.id)
  }
  return (
    <div className=''>
      <InputFeedback onClick={addFeedback} id={id.id} onReloadList={handleReloadPage} />
      <div className={`d-flex align-items-center justify-content-between border-bottom 
          ${windowWidth > 768 ? 'mt-4 ms-5 pb-2 mb-5': 'mt-2 m-0 '}
        `}>
        <p className="fw-bold">{displayFeedback.length} {t('feedback')}</p>
        <SortFeedbacks options={options} onSelect={handleSelectOption} />
      </div>

      <div className='px-5 overflow-y-scroll overflow-x-hidden' style={{maxHeight: "500px"}}>
        <div className="">
        {
          feedbacks ?
            <>
              {
                displayFeedback.map((feedback, index) => (
                  <div className="p-3 m-1 mt-4 rounded shadow-sm w-100 border-2 border-secondary" key={feedback.tid}>
                    <div className="d-flex justify-content-between align-items-center bg-primary-light p-2 rounded">
                      <span className="fw-bold m-0">{
                        renderUser(feedback.User)} wrote:</span>
                       <span className='fw-semibold'>{moment(feedback.time).format('YYYY/MM/DD hh:mm')}</span>
                    </div>
                    <div key={index}>
                      {[...Array(5)].map((_, starIndex) => (
                        <span key={starIndex}>
                          {starIndex < feedback.rating ? (
                            <Image src={starIcon} width={16} height={16} className='mx-1' />
                          ) : (
                            <Image src={unstarIcon} width={16} height={16} className='mx-1' />
                          )}
                        </span>
                      ))}
                    </div>
                    {
                      feedback.tid !==idEdit &&
                      <div className="p-2 text-justify">
                      {feedback.content}
                    </div>
                    }
                    {
                      checkEditFeedback(feedback.User) &&
                      <>
                        {feedback.tid === idEdit ? (
                          <InputFeedback
                            defaultValue={feedback}
                            onClick={updateFeedback}
                            onCheck={() => setIdEdit(false)}
                            id={idEdit}
                            cfpid={id.id}
                            onReloadList={handleReloadPage}
                            loading={loading}
                          />
                        ) : (
                          <>
                            <div className="d-flex justify-content-end align-items-center">
                              <Button className='bg-transparent border-0' onClick={(e) => handleChooseFeedback(e, index)}><Image src={EditIcon} width={20} /></Button>

                              {
                                isDeleteNote === feedback.tid && loadingDel ?
                                <Spinner sm={'sm'}/>
                                :
                                <Button className='bg-transparent border-0'>
                                <Image src={DeleteIcon} className='mx-1' width={20} onClick={() => handleDeleteFeedback(feedback.tid)} />
                              </Button>
                              }

                            </div>
                          </>
                        )}
                      </>
                    }
                  </div>
                ))
              }

            </>
            :
            <><p></p></>
        }
        </div>
      </div>
    </div>
  )
}

export default AllFeedbackOfConf