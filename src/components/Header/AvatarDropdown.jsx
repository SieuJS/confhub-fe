import { Dropdown, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import avatarIcon from '../../assets/imgs/avatar.png'
import settingIcon from '../../assets/imgs/setting.png'
import logoutIcon from '../../assets/imgs/logout.png'
import useAuth from '../../hooks/useAuth'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
const menu = [
    { path: 'user/account', title: 'Account', icon: avatarIcon, trans: 'account' },
    { path: 'user/setting', title: 'Setting', icon: settingIcon, trans: 'setting' },
]
const AvatarDropdown = () => {
    const { t } = useTranslation()
    const { windowWidth } = useScreenSize()
    const { handleLogout } = useAuth()
    const dropDirection = windowWidth <= 768 ? 'end' : 'bottom';

    return (
        <Dropdown
            drop={dropDirection}
            className='dropdown'
        >
            <Dropdown.Toggle className='noti rounded-pill my-header-bg-icon mx-1 border-0 d-flex align-items-center'>
                <Image src={avatarIcon} width={40} height={34} className=' text-center m-auto' />
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ right: 0, left: 'auto' }}>
                {menu.map((item) => (
                        <Link key={item.path} to={item.path} className="dropdown-item text-color-black d-flex align-items-center">
                            <Image width={20} className="me-2" src={item.icon} />
                            {t(`${item.trans}`)}
                        </Link>
                ))}
                <Dropdown.Item onClick={handleLogout}>
                    <Image width={20} className="me-2" src={logoutIcon} />
                    {t('logout')}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default AvatarDropdown