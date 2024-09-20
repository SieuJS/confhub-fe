import { useEffect, useState } from 'react'
import { Col, Container, Dropdown, Row } from 'react-bootstrap'
import useSetting from '../../hooks/useSetting'
import { useTranslation } from 'react-i18next'

const CycleButton = () => {
    const {t, i18n} = useTranslation()
    const {getCycleSetting, updateCycleSetting} = useSetting()
    const [settings, setSettings] = useState({
        cycle: 0,
        period: 0
      });

      useEffect(()=>{
        const getData = async () => {
            const updateCycle = await getCycleSetting()
            setSettings({
                ...settings,
                cycle: updateCycle?.cycle || 0,
                period: updateCycle?.period || 0
              });
        }
        getData()
      },[])

     
      const handleUpdate = (e) => {
        const {name, value} = e.target
        if(name === 'cycle'){
            setSettings({
                ...settings,
                cycle: value
              });
              updateCycleSetting(value, settings.period)
        } else {
            setSettings({
                ...settings,
                period: value
              });
              updateCycleSetting(settings.cycle, value)
        }
      }
  return (
    <Dropdown>
    <Dropdown.Toggle className="bg-teal-light border-0 text-color-black fw-medium d-flex align-items-center border mx-1">
      {t('setting')}
    </Dropdown.Toggle>

    <Dropdown.Menu  drop={"start"} style={{ minWidth: '700px' }}>
      <Container>
        <Row className="mb-3">
          <Col lg={7} md={6} xs={6}>
            <strong> {t('label_data_update_cycle')}</strong>
            <p>{t('describe_data_update_cycle')}</p>
          </Col>
          <Col>
            <select name='cycle' value={settings?.cycle} onChange={handleUpdate} className="form-control custom-select">
              <option value=""> {t('select_cycle')}</option>
              {[...Array(7).keys()].map(day => (
                <option key={day + 1} value={day + 1}>
                  {day + 1} {t('day')}{day > 0 && i18n.language === 'en' && 's'}
                </option>
              ))}
            </select>
          </Col>
        </Row>
        <Row>
          <Col lg={7} md={6} xs={6}>
            <strong> {t('period_label')}</strong>
            <p>
              {t('period_description')}
            </p>
          </Col>
          <Col>
            <select name='period' value={settings?.period} onChange={handleUpdate} className="form-control custom-select">
              <option value=""> {t('select_period')}</option>
              {[...Array(24).keys()].map(day => (
                <option key={day + 7} value={day + 7}>
                  {day + 7} {t('day')}{i18n.language === 'en' && 's'}
                </option>
              ))}
            </select>
          </Col>
        </Row>
      </Container>
    </Dropdown.Menu>
  </Dropdown>
  )
}

export default CycleButton