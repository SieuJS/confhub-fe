
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useConference from '../../hooks/useConferences';
import { useTranslation } from 'react-i18next';
import useScreenSize from '../../hooks/useScreenSize';
import useMessageSocket from '../../hooks/useMessageSocket';
const UpdateNowButton = () => {
  const { t } = useTranslation()
  const id = useParams()
  const { windowWidth } = useScreenSize()
  const { message: messageNoti, messages, conference, crawlNow } = useConference()
  const { handleAddMessageCrawling } = useMessageSocket()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(false)
  const [isCrawling, setIsCrawling] = useState(false)


  useEffect(() => {
    const crawlingStatus = messages.find(mess => mess.id === id?.id && mess.status !== 'completed');
    
    if (crawlingStatus) {
      setIsCrawling(true)
    } else {
      setIsCrawling(false)
    }
  }, [id, messageNoti, messages])

  const handleClick = async () => {
    setLoading(true);
    try {

      const res = await crawlNow(conference.id);
      setStatus(res.status);
      if (res.status) {
        setLoading(false);
     //   handleAddMessageCrawling({ id: conference.id })
        setIsCrawling(true)
      }
    } catch (error) {
      console.error('Error:', error);
    }

  };



  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id={'tooltip-bottom'}>
          {t('updateTooltip')}
        </Tooltip>
      }
    >
      <Button
        className={`text-nowrap rounded-5 fw-semibold border-0 bg-danger text-white fs-5
          ${!status ? 'bg-danger' : 'bg-danger border-2 border-warning'} 
        ${windowWidth > 768 ? ' mt-2 px-5 py-3 mx-2' : 'p-2'} `}
        onClick={handleClick}
        disabled={loading || isCrawling}
      >
        {loading ? (
          <Spinner size='sm' title={t('waitMessage')} />
        ) : (
          <>
            {isCrawling ? (
              <>
                <Spinner as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  className='me-1'
                  title={t('waitMessage')}
                />
                {t('waitMessage')}
              </>
            ) : (
              t('updateButton')
            )}
          </>
        )}
      </Button>
    </OverlayTrigger>

  );
};

export default UpdateNowButton;
