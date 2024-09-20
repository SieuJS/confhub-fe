import React, { useEffect,  useState } from 'react'
import useConference from '../../hooks/useConferences'
import useSuggest from '../../hooks/useSuggest'
import { Button, Carousel } from 'react-bootstrap'
import './custom_suggest.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const TopViewCarousel = () => {
    const {conference, conferences, getAllConferences} = useConference()
    const {findSimilarConferences} = useSuggest()
    const [displayConferences, setDisplayConferences] = useState([])
    const [itemsPerRow, setItemsPerRow] = useState(4); // Số lượng mục trong mỗi hàng
    const [index, setIndex] = React.useState(0);
    const navigate = useNavigate()
    useEffect(()=>{
        const getData = async () => {
            if(conferences.length <= 0){
                await getAllConferences()
                
            }
        }
        getData()
    }, [])
    useEffect(()=>{
        const data = findSimilarConferences(conferences, conference)
        setDisplayConferences(data)
    }, [conference, conferences])

    useEffect(() => {
        const handleResize = () => {
          // Thiết lập số lượng mục trong mỗi hàng dựa trên kích thước cửa sổ
          if (window.innerWidth < 768) {
            setItemsPerRow(1);
          } else if (window.innerWidth < 992) {
            setItemsPerRow(2);
          } else if (window.innerWidth < 1200) {
            setItemsPerRow(3);
          } else {
            setItemsPerRow(4);
          }
        };
    
        // Gọi hàm handleResize khi cửa sổ thay đổi kích thước
        window.addEventListener('resize', handleResize);
        handleResize(); // Gọi lần đầu khi tải trang
    
        // Xóa sự kiện resize khi component bị unmount
        return () => window.removeEventListener('resize', handleResize);
      }, []);
    
      const chooseConf = async (e, id) => {
        e.preventDefault()
        // Lưu vị trí cuộn hiện tại trước khi cập nhật URL
        // Cập nhật URL với trang mới
        navigate(`/detailed-information/${id}`)
        window.location.reload()
    }
  return (
    <div className='mx-5 px-5'>
        {
            (displayConferences || conference) &&
            <>
            <div className="w-100 border-light-emphasis border-bottom my-2 pb-1 fw-medium text-teal-normal fw-bold">
            You may also interested in
        </div>
          <Carousel  controls={false} indicators={false}>
      {displayConferences.reduce((chunks, conf, index) => {
        const chunkIndex = Math.floor(index / itemsPerRow);
        if (!chunks[chunkIndex]) {
          chunks[chunkIndex] = [];
        }

        chunks[chunkIndex].push(conf);

        return chunks;
      }, []).map((chunk, chunkIndex) => (
        <Carousel.Item key={chunkIndex} interval={3000}>
          <div className="d-flex justify-content-around">
            {chunk.map(conf =>{
            
            const activeOrganizations = conf.organizations.filter(org => org.status === 'new');
            return (
              <Button key={conf.id} className="card-suggest text-start bg-white"
                onClick={(e)=>chooseConf(e, conf.id)}
              >
                <div className="card-body-suggest">
                  <p className="card-title-suggest fw-bold text-teal-dark">{conf.information.name}</p>
                 {
                  conf.organizations.length > 0 &&
                  <div className="text-primary-dark fw-bold fs-medium d-flex align-items-center">
                  <FontAwesomeIcon icon={faClock} className='me-2 text-light-emphasis'/>
                  {activeOrganizations.map((org, orgIdx) => (
                    <div key={orgIdx} className='text-light-emphasis'>
                      <span>{moment(org.start_date).format('MMM DD, YYYY')}</span>
                      {org.end_date && <span>{` - ${moment(org.end_date).format('MMM DD, YYYY')}`}</span>}
                    </div>
                  ))}
                
                </div>
                 }
                  <div className="mb-2">
                        <span className="p-1 rounded-pill bg-light text-light-emphasis">{`Rank: ${conf.similar?.rank} ${conf.similar?.source ? `- Source: ${conf.similar?.source}` : ''}`}</span>
                    
                    </div>
                    {conf.similar?.fieldOfResearch?.length > 0 && conf.similar?.fieldOfResearch?.map((field, index) => (
                          <span key={index} className="p-1 rounded-pill bg-light text-light-emphasis overflow-hidden text-truncate">FOR: {field}</span>
                        ))}
                </div>
              </Button>
            )})}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>

            </>
        }
    </div>
  )
}

export default TopViewCarousel