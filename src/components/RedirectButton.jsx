
import { Button, OverlayTrigger, Tooltip, Image } from 'react-bootstrap';

import ViewMoreIcon from './../assets/imgs/view_page.png'
import { useTranslation } from 'react-i18next';
const RedirectButton =  (conference) => {
   const {t} = useTranslation()
    const aFunc = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve("resolved");
          }, 500);
        });
      }
    
      const bFunc = (externalUrl) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(externalUrl);
          }, 500);
        });
      }

    const handleRedirect = async () => {
       
        const externalUrl = conference.conference.information['link']
        // Thay thế URL bằng địa chỉ của trang web mà bạn muốn chuyển hướng đến
        await aFunc().then(async () => {
            await bFunc(externalUrl).then((externalUrl) => {
                if(externalUrl) {
                    window.open(externalUrl, '_blank');
                }
            });
        });
    };
    return (
        <Button
        className='bg-transparent border border-2 d-flex align-items-center justify-content-between text-color-black'
        onClick={handleRedirect}
        title={t('view_more_title')}
    >
        {t('view_more')}
        <Image src={ViewMoreIcon} width={18} className='ms-2'/>
    </Button>

    );
};

export default RedirectButton;
