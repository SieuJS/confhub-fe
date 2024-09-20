import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/custom.css'
import './assets/styles/custom_color.css'
import './assets/styles/custom_animation.css'
import './assets/styles/responsive.css'
import './assets/styles/bootstrap_responsive.css'
import './i18n'; // Import cấu hình i18n
import { HashRouter} from 'react-router-dom'

import MainLayout from './layout/MainLayout.jsx'
import { AppContextProvider } from './context/authContext.jsx'
import RoutesApp from './routes/RouteApp.jsx'
import Footer from './components/Footer/Footer.jsx'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import useScreenSize from './hooks/useScreenSize.jsx'

function App() {
  const { i18n } = useTranslation();
  useScreenSize()
  useEffect(() => {
    // Kiểm tra xem localStorage đã lưu ngôn ngữ hay chưa
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      // Nếu đã có, set ngôn ngữ cho i18n từ localStorage
      i18n.changeLanguage(storedLanguage);
    } else {
      // Nếu chưa có, lưu ngôn ngữ mặc định vào localStorage và set cho i18n
      const defaultLanguage = i18n.language; // Lấy ngôn ngữ mặc định từ i18n
      localStorage.setItem('language', defaultLanguage);
      i18n.changeLanguage(defaultLanguage);
    }
  }, [i18n]);
  return (
    <AppContextProvider>
      <HashRouter>
        <MainLayout />
        <RoutesApp/>
        <Footer/>
      </HashRouter>
    </AppContextProvider>
  )
}

export default App
