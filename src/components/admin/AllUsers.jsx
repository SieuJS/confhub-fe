import React from 'react'
import TableRender from './TableRender'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import useAdmin from '../../hooks/useAdmin'
import { useTranslation } from 'react-i18next'

const AllUsers = ({ conferences }) => {
  const {t, i18n} = useTranslation()
  const {users, getUserById} = useAdmin()
  const navigate = useNavigate()

  const handleChooseUser = async (id) => {
    await getUserById(id)
    navigate(`/admin/users_management/userdetail/${id}`)
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
    [i18n.language]
);
  return (
    <div>
    
      <TableRender data={users} columns={columns} />
    </div>
  )
}

export default AllUsers