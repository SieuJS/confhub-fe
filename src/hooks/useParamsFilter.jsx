import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/authContext';
import queryString from 'query-string';
import { addFilter } from '../actions/filterActions';

const useParamsFilter = () => {
  const {state, dispatch} = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()

useEffect(() => {
  const search = location.search;
  const queryLocation = queryString.parse(search);

  //console.log({optionsSelected, search, queryLocation})
  let filterList = ''
  if(location.pathname.includes('followed')){
    filterList = 'optionsSelectedFollow'
  } else if(location.pathname.includes('yourconferences')){
    filterList = 'optionsSelectedOwn'
  } else filterList = 'optionsSelected'
  
  // Kiểm tra nếu location.search không có giá trị
  if (search) {
    Object.entries(queryLocation).forEach(([key, value]) => {
      if (key === 'page') {
        setPage(parseInt(value - 1)); //set page
      } else {
        const keywords = value.split(',').map(keyword => keyword.trim());
        keywords.forEach(keyword => {
        dispatch(addFilter(filterList, key, [keyword]))
        })
      }
    });
  }
}, []);


  const setPage = (page) => {
    dispatch({type: "SET_PARAMS", payload: page})
  }

  const addtoParams = (optionsSelected, pagenumber) => {
    const copiedPageNumber = pagenumber
    const paramsFilter = {};
      // Thêm các key và giá trị từ optionsSelected vào paramsFilter
      for (const key in optionsSelected) {
          if (Object.prototype.hasOwnProperty.call(optionsSelected, key) && optionsSelected[key].length > 0) {
              paramsFilter[key] = optionsSelected[key];
          }
      }
       // Tạo URL mới
       const queryFilter = new URLSearchParams(paramsFilter).toString()
       const newUrl = `?page=${copiedPageNumber + 1}&${queryFilter}`;
       //window.history.pushState({}, '', newUrl);
       navigate(newUrl)

    // Chuyển hướng đến URL 
}

  return { 
    paramsFilter: state.paramsFilter,
    pageParam: state.pageParam,
    setPage,
    addtoParams
   };
};

export default useParamsFilter;
