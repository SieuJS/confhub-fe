import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Button, Image } from 'react-bootstrap';
import googleIcon from './../../assets/imgs/google.png'
import { useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


const GoogleLoginButton = () => {
    const { t } = useTranslation()
    const { loginWithGoogle, handleMessageLoginGoogleBanned } = useAuth()
    const location = useLocation()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const refreshToken = urlParams.get('refreshToken');
    
    if (refreshToken) {
      loginWithGoogle(refreshToken)
    } else {
      const message = urlParams.get('message');
      handleMessageLoginGoogleBanned(message)
      console.error('Refresh token not found.');
    }
  }, [location.search]);
    
    const handleLoginWithGoogle = () => {
      //  window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Fhttp://localhost:5000%2Fauth%2Fgoogle%2Fcallback&scope=profile%20email&client_id=540405177648-0tcg4ln5cq08l8nu797d52bt7n5i8ged.apps.googleusercontent.com';
       window.location.href =  'http://localhost:5000/auth/google';
       
    }

    return (
        <Button 
        onClick={handleLoginWithGoogle}
        className='border-0 w-100 p-2 rounded-3' style={{ backgroundColor: "#E8F1F3", color: "#434343" }}>
            <Image src={googleIcon} width={20} className="me-2 fw-bold" />
            {t('login_google')}
        </Button>
    );
};

export default GoogleLoginButton;
