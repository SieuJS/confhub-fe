
import { useLocation, Outlet } from 'react-router-dom'
import usePageNavigation from '../hooks/usePageNavigation'
import Header from '../components/Header/Header'


const MainLayout = () => {
    const location = useLocation()
    usePageNavigation()
  return (
    <div>
        {
            location.pathname === '/login' || location.pathname === '/signup'
            ?
            null
            :
              <Header/>
            
        }
        
        <Outlet/>
    </div>
  )
}

export default MainLayout