import React from 'react'
import { Dropdown, Image } from 'react-bootstrap'

const items = [
  {id: "1", value: 1, title: "Upcoming"},
  {id: "2", value: 2, title: "Name A-Z"},
  {id: "3", value: 3, title: "Latest"},
]
const SortBy = () => {
  return (
    <Dropdown>
    <Dropdown.Toggle className='bg-white text-color-black'>
      Sort by
      <Image src/>
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {
        items.map((item, index)=>(
          <Dropdown.Item key={index} className='fs-6'>{item.title}</Dropdown.Item>
        ))
      }
    </Dropdown.Menu>
  </Dropdown>
  )
}

export default SortBy