import { useEffect, useState } from 'react'
import { Container, Form, Col, Spinner } from 'react-bootstrap'
import useSetting from '../../hooks/useSetting'
import useLocalStorage from '../../hooks/useLocalStorage'
import Loading from '../../components/Loading'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
import { faTruckMonster } from '@fortawesome/free-solid-svg-icons'


const Setting = () => {
  const { t, i18n } = useTranslation()
  const { windowWidth } = useScreenSize()
  const { settings, loading, getAllSetting, updateSetting } = useSetting()
  const [displaySetting, setDisplaySetting] = useState([])
  const { user } = useLocalStorage()
  const [selectedOption, setSelectedOption] = useState(0);
  const [switchValue, setSwitchValue] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false)

  useEffect(() => {
    if (!settings) {
      getAllSetting()
    }
  }, [user])

  useEffect(() => {
    getAllSetting()
  }, [])

  useEffect(() => {
    setDisplaySetting(settings)
  }, [settings])


  const handleChangeSelect = async (e, setting) => {
   
    setLoadingUpdate(true)
    setSwitchValue(setting.tid);
    await updateSetting(e.target.name, setting.status, e.target.value)
    await getAllSetting()
    setLoadingUpdate(false)
  };

  const handleChangeSwitch = async (e, setting) => {
    setLoadingUpdate(true)
    setSwitchValue(setting.tid);
    await updateSetting(e.target.name, e.target.checked, setting.value)
    await getAllSetting()
    setLoadingUpdate(false)
  };


  const order = ["AUTO_ADD_EVENT_TO_SCHEDULE", "CHANGE_AND_UPDATE", "YOUR_UPCOMING_EVENT", "DATA_UPDATE_CYCLE", "CANCELLED_EVENT"];

  return (
    <Container className={` pt-5  overflow-x-hidden ${windowWidth > 768 ? 'm-5' : 'auth-container'}`}>
      <h4 className=''>{t('setting')}</h4>
      <h6 className='text-color-darker mb-2'>{t('how_would_you_like_to_receive_notifications')}</h6>


      {
        loading && !loadingUpdate ?
          <Loading />
          :
          <>
            {settings ?
              <>
                <Form>
                  {order.map((name, index) => {
                    const setting = displaySetting[name];
                    if (setting?.name === 'DATA_UPDATE_CYCLE' || setting?.name === 'CANCELLED_EVENT') return null;

                    return (
                      <Form.Group key={setting?.tid} className="w-100 my-2 ps-3 pe-5 d-flex align-items-start justify-content-space">
                        <Form.Label column sm="6" className='pe-5 me-5'>
                          <div className='fw-bold text-color-black'>{t(setting?.label)}</div>
                          <div className="text-color-medium">{t(setting?.describe)}</div>
                        </Form.Label>
                        <Col sm="2"
                          className={`ms-3 d-flex  align-items-center justify-content-between px-2 py-1 rounded-2
                          ${setting?.name === 'YOUR_UPCOMING_EVENT' ? 'border border-secondary' : ''}
                          ${!setting?.status ? 'bg-light-gray' : ''}
                          `}>


                          {switchValue === setting?.tid && loadingUpdate ? (
                            <>
                              {
                                setting?.name === '' ?
                                <Spinner animation="border" size="sm" className="text-teal-normal" />
                                :
                                <div className="loading-custom bg-light bg-gradient rounded-2 w-100 p-3"></div>
                              }
                            </>
                          ) : (
                            <>
                              {
                                setting?.name === "YOUR_UPCOMING_EVENT" ?
                                  <Form.Select
                                    disabled={!setting?.status}
                                    className='pe-1 border p-1 rounded-2 text-body'
                                    style={{cursor: "pointer"}}
                                    defaultValue={setting?.value}
                                    value={setting?.value}
                                    id={setting?.tid}
                                    name={setting?.name}
                                    onChange={(e) => handleChangeSelect(e, setting)}>
                                    {Array.from({ length: 28 }, (_, i) => i + 3).map((num) => (
                                      <option key={num} value={num}>
                                        {`${num} ${t('day').toLowerCase()}${i18n.language === 'en' ? 's' : ''}`}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  :
                                  <div></div>
                              }
                              <Form.Check
                                type="switch"
                                id={setting?.tid}
                                checked={setting?.status}
                                name={setting?.name}
                                className={`ms-3 ${setting?.value ? 'checked' : ''}`}
                                onChange={(e) => handleChangeSwitch(e, setting)}
                              />
                            </>

                          )}
                        </Col>
                      </Form.Group>
                    );
                  })}

                </Form>
              </>
              :
              <p>Something wrong! Please reload page</p>
            }
          </>
      }
    </Container>
  )
}

export default Setting