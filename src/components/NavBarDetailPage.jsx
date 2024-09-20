import { useEffect, useState } from 'react'
import { Container, Stack, Image, Navbar, Nav, ButtonGroup } from 'react-bootstrap'


import DateIcon from './../assets/imgs/conf_date_white.png'
import LocationDate from './../assets/imgs/location_white.png'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getIdFromPathname } from '../utils/getID'
import useConference from '../hooks/useConferences'
import UpdateNowButton from './InformationPage/UpdateNowButton'
import FollowButton from './InformationPage/FollowButton'

const NavBarDetailPage = () => {
  const { conference, handleGetOne } = useConference()
  const [fetchCount, setFetchCount] = useState(0);
  const { pathname } = useLocation()
  const id = getIdFromPathname(pathname)

  const [navs, setNav] = useState([
    { event: "1", title: "Information", path: `detail/information/${id}` },
    { event: "2", title: "Imoprtant Dates", path: `detail/importantdates/${id}` },
    { event: "3", title: "Call For Paper", path: `detail/callforpaper/${id}` }
  ])

  useEffect(() => {

    window.onscroll = function () { myFunction() };

    var header = document.getElementById("tab-header");
    var sticky = header.offsetTop;

    function myFunction() {
      if (window.scrollY > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    }
  }, [])


  useEffect(() => {
    if (fetchCount < 1) {
      handleGetOne(id)
      // Tăng giá trị fetchCount sau khi fetch
      setFetchCount(fetchCount + 1);
    }
  }, [fetchCount, conference, handleGetOne, id]);
  return (
    <Container className='m-0 w-100 p-0 mw-100 mt-5' fluid>
      <Stack className='bg-blue-normal p-5 w-100 mw-100 text-center text-white top-container'>
        <Stack className='w-50 m-4 d-flex justify-content-center align-items-center align-self-center'>
          {
            conference ?
              <div>
                <span className='fs-3 fw-bold word-break mw-50'>{conference.information.name}</span>
                <div className='d-flex align-items-center my-3 justify-content-center'>
                  <Image width={25} height={25} src={DateIcon} className='me-2' />
                  <span className='fs-5'>
                  From {conference.organizations.length >0 ? conference.organizations[0].start_date : 'N/A'} 
           {` to`} {conference.organizations.length >0 ? conference.organizations[0].end_date : 'N/A'}
                  </span>
                </div>
                <div className='d-flex align-items-center my-3 justify-content-center'>
                  <Image width={25} height={28} src={LocationDate} className='me-2' />
                  <span className='fs-5'>{conference.organizations.length >0 ? conference.organizations[0].location : 'N/A'}</span>
                </div>
              </div>
              :
              <p className="text-white fs-3">No conference available</p>
          }
        </Stack>
      </Stack>

      <Navbar
        id='tab-header'
        className='bg-white text-black tab-header'
      >
        <Container>

          <Nav
            className="me-auto">
            {navs.map((navlink, index) =>
              <NavLink key={index} to={navlink.path}
                className={
                  location.pathname.includes(navlink.path)
                    ? "me-1 py-1 px-3 text-blue-normal border-bottom border-1 border-blue-normal"
                    : "me-1 py-1 px-3 "
                }
              >
                <span>{navlink.title}</span>
              </NavLink>
            )}
          </Nav>
          <ButtonGroup>
            <UpdateNowButton path={conference} />
            <FollowButton conference_id={id} conference={conference} />
          </ButtonGroup>
        </Container>
      </Navbar>
      <Outlet />
    </Container>

  )
}

export default NavBarDetailPage