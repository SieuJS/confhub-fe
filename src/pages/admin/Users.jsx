import React, { useState, useEffect } from 'react'
import { Container, ButtonGroup, Button,  Row, Col } from 'react-bootstrap'

import Loading from '../../components/Loading'
import TableRender from '../../components/admin/TableRender'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import useFilter from '../../hooks/useFilter'
import { useNavigate } from 'react-router-dom'
import useAdmin from '../../hooks/useAdmin'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
import InputSearhInList from '../../components/admin/InputSearhInList'
const Users = () => {
  const {t, i18n} = useTranslation()
  const {windowWidth} = useScreenSize()
  const navigate = useNavigate()
  const {loading:loadingUsers, users, getAllUsers, getUserById} = useAdmin()
  const [displayUsers, setDisplayedUsers] = useState(users)
  const {searchInObject} = useFilter()

  useEffect(()=>{
    getAllUsers()
  }, [])
  useEffect(() => {
    if(users.length === 0 || !users){
      getAllUsers()
    }
    setDisplayedUsers(users)
  }, [users])

 



  const handleChooseUser = async (id) => {
    await getUserById(id)
    navigate(`/admin/users_management/userdetail/${id}`)
  }

  const handleFilter = (keyword) => {
    const filtered = users.filter(user => searchInObject(user, keyword));
    //console.log({filtered})
    setDisplayedUsers(filtered);
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({row})=>(
          <div className='fixed-column p-0 d-flex align-items-center justify-content-center'>
          <Button className='bg-transparent  p-0 mx-2 my-0 border-0 action-btn tb-icon-view  '
            onClick={() => handleChooseUser(row.original.id)}
            title='View user'
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='text-primary-normal action-icon' />
            </Button>
        </div>
        ),
        id: 'index',
        width: 50,
        disableResizing: true
      },
      {
        Header: t('status'),
        accessor: "status",
        Cell: ({row})=>(
          <div className='fixed-column p-0 d-flex align-items-center justify-content-center'>
            {
              row.original.role === 'banned' ?
              `${t('banned')}`
              :
              `${t('no_banned')}`
            }
        </div>
        ),
        id: 'status',
        disableResizing: true
      },
      {
        Header: t('name'),
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: t('address'),
        accessor: "address",
      },
      {
        Header: t('nationality'),
        accessor: "nationality",
      },
       
    ],
    [i18n]
);
  return (
    <Container className={` pt-5  overflow-x-hidden ${windowWidth > 768 ? 'm-5' : 'auth-container'}`}>


      <div className="d-flex justify-content-between align-items-center mb-3 ">
        <h4 className='fs-3'>{t('Users')}</h4>
        <ButtonGroup>
          
        </ButtonGroup>
      </div>

      <div className='p-3 bg-white rounded overflow-x-hidden'>
        <div className="pb-3 border-bottom border-primary-light">

          <Row>
            <Col>
              <label className='me-2'>{t('total_user_accounts')}:</label>
              <span className='me-2 fw-semibold'>{users.length}</span>
            </Col>
        
          </Row>

        </div>

        <Row md={4} className='justify-content-end my-2 mb-3'>
          <Col><InputSearhInList onApplyFilter={handleFilter}/></Col>
        
          <Col md='auto'>
       
          </Col>
        </Row>
        
        
        {
          loadingUsers ?
          <div className="my-4">
            <Loading/>
          </div>
          :
          <TableRender data={displayUsers} columns={columns}/>
        }

      </div>
      
    </Container>
  )
}

export default Users