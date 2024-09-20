import { useState, useCallback } from 'react';
import { baseURL } from './api/baseApi'
import { useAppContext } from '../context/authContext';
import useSessionStorage from './useSessionStorage';

const useSearchKeyword = () => {
    const { state, dispatch } = useAppContext()
    const { getDataListInStorage } = useSessionStorage()
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const removeIndexFromKeyword = (keyword) => {
        // Tìm vị trí dấu mở ngoặc trong chuỗi
        const openParenIndex = keyword.lastIndexOf('(');

        // Nếu không tìm thấy dấu mở ngoặc hoặc nằm ở vị trí cuối cùng của chuỗi
        // thì trả về chính chuỗi ban đầu
        if (openParenIndex === -1 || openParenIndex === keyword.length - 1) {
            return keyword;
        }

        // Loại bỏ phần số thứ tự và khoảng trắng ở cuối
        return keyword.substring(0, openParenIndex).trim();
    };

    const generateURL = (criteria) => {
        let url = `${baseURL}/conference?`;
        const listkey = ['location', 'rank', 'for', 'source', 'acronym', 'type'];
        for (const key in criteria) {
            const values = criteria[key];

            if (values.length > 0) {
                if (listkey.includes(key)) {
                    values.forEach((value) => {
                        const keyword = removeIndexFromKeyword(value)
                        url += `&${key}[]=${keyword}`;
                    });
                } else if (key === 'conferenceDate') {
                    // Biểu thức chính quy để trích xuất ngày
                    const dateRegex = /from (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;

                    // Sử dụng biểu thức chính quy để tìm các ngày trong chuỗi
                    const match = values[0].match(dateRegex);

                    if (match) {
                        const startDate = match[1];
                        const endDate = match[2];
                        url += `&confStart=${startDate}&confEnd=${endDate}`;
                    }
                    else if (key === 'submissionDate') {
                        // Biểu thức chính quy để trích xuất ngày
                        const dateRegex = /from (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;

                        // Sử dụng biểu thức chính quy để tìm các ngày trong chuỗi
                        const match = values[0].match(dateRegex);

                        if (match) {
                            const startDate = match[1];
                            const endDate = match[2];
                            url += `&subStart=${startDate}&subEnd=${endDate}`;
                        }
                    }
                }
                else if (key === 'rating') {
                    values.forEach((value) => {

                        const match = value.match(/\d+/);
                        let rating = 0
                        // Nếu tìm thấy số, trả về giá trị đầu tiên tìm thấy
                        if (match && match.length > 0) {
                            rating = parseInt(match[0]);
                        }
                        url += `&${key}=${rating}`;
                    });
                }
                else {
                    values.forEach((value) => {
                        const keyword = removeIndexFromKeyword(value)
                        url += `&${key}=${keyword}`;
                    });
                }
            }
        }

        return url;
    };
    const searchKeywordByPage = useCallback(async (page, apiUrl) => {

        try {
            const response = await fetch(`${apiUrl}&page=${page}&size=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data
        } catch (error) {
            setError(error);
        }
    }, []);

    const fetchAllPages = async (url) => {
        setLoading(true)
        dispatch({ type: "SEARCH_KEYWORD", payload: [] })
        try {
            const firstPageData = await searchKeywordByPage(1, url);
            const totalConf = firstPageData.maxRecords
            const totalPages = Math.ceil(totalConf / 7);
            setLoading(false)
            
            const commonElements = [];
            const newList = [];
            const listFollowed = getDataListInStorage("listFollow")

            const idSet = new Set(listFollowed.map(item => item.id));

            // Lặp qua từng phần tử trong list
            for (const item of firstPageData.data) {
                if (idSet.has(item.id)) {
                    commonElements.push(item); // Nếu có, đẩy vào mảng commonElements
                } else {
                    newList.push(item); // Nếu không, đẩy vào mảng newLis
                }
            }

            localStorage.setItem('totalConferencesSearch', JSON.stringify(totalConf))
            localStorage.setItem('totalPagesConferencesSearch', JSON.stringify(totalPages))
            dispatch({ type: "SEARCH_KEYWORD", payload: newList })


            // Fetch remaining pages asynchronously
           // for (let i = 2; i <= maxPages; i++) {
           //     const pageData = await searchKeywordByPage(i, url);

           //     dispatch({ type: "SEARCH_KEYWORD", payload: pageData.data })
        //    }

            setLoading(false);


        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    
    const removeKeyword = (key, keyword) => {
        const valueKeyword = removeIndexFromKeyword(keyword)
        const list = state.resultFilter

        const filteredConferences = list.filter(obj => searchInObject(obj, valueKeyword));

        if (filteredConferences.length > 0) {
            const idsToRemove = new Set(filteredConferences.map(item => item.id));
            const updatedNewList = state.resultFilter.filter(item => !idsToRemove.has(item.id));
            dispatch({ type: "SET_SEARCH_RESULT", payload: updatedNewList })
            const totalConf = updatedNewList.length
            const totalPages = Math.ceil(totalConf / 7);
            localStorage.setItem('totalConferencesSearch', JSON.stringify(totalConf))
            localStorage.setItem('totalPagesConferencesSearch', JSON.stringify(totalPages))

        }
    };
    const searchInObject = (obj, keyword) => {
        keyword = keyword.toLowerCase();
        if (typeof obj === 'string') {
            return obj.toLowerCase().includes(keyword);
        }

        if (Array.isArray(obj)) {
            return obj.some(item => searchInObject(item, keyword));
        }

        if (typeof obj === 'object' && obj !== null) {
            return Object.values(obj).some(value => searchInObject(value, keyword));
        }

        return false;
    }
    return {
        loading,
        error,
        resultFilter: state.resultFilter,
        searchKeywordByPage,
        fetchAllPages,
        generateURL,
        removeKeyword,
    };
};

export default useSearchKeyword;
