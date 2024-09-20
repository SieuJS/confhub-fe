import { useState } from 'react';
import { Form } from 'react-bootstrap';


export const SortFeedbacks = ({ options, onSelect}) => {
  return (
    <div>
      <Form.Select className='border-2' onChange={(e) => onSelect(e.target.value)}>
       {
            options
            &&
            <>
              {options.map(option => (
                <option 
                  key={option.value} 
                  value={option.value}
                  >
                  {option.label}
                </option>
              ))}
            </>
          }
        </Form.Select>
    </div>
  )
}
