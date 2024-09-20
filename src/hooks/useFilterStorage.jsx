import { useState, useEffect } from 'react';
import { baseURL } from './api/baseApi'
import useSearch from './useSearch';
import useConference from './useConferences';
const useFilterStorage = (key, keyword) => {
    const [data, setData] = useState({});
    const {conferences} = useConference()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalFilterConferences, setTotalFilterConferences] = useState(0)

    const { total, setTotal, extractQuantity } = useSearch()
    const [dataFilters, setDataFilters] = useState(() => {
        const storedDataFilters = sessionStorage.getItem('dataFilters');
        return storedDataFilters ? JSON.parse(storedDataFilters) : {};
    });
    useEffect(() => {
        if (!key || !keyword) return;
        if(key === 'category') {
            const storedDataFilters = sessionStorage.getItem('dataFilters');
            const parsedDataFilters = storedDataFilters ? JSON.parse(storedDataFilters) : {};
            parsedDataFilters[keyword] = [...(parsedDataFilters[keyword] || []), ...conferences];
            sessionStorage.setItem('dataFilters', JSON.stringify(parsedDataFilters));
            return
        }
        const fetchPage = async (page) => {
            
            setLoading(true);
            const listkey = ['location', 'rank', 'for', 'source', 'acronym', 'type'];
            let apiUrl = baseURL;
            if (keyword.includes('Sub')) {
                // Biểu thức chính quy để trích xuất ngày
                const dateRegex = /from (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;

                // Sử dụng biểu thức chính quy để tìm các ngày trong chuỗi
                const match = keyword.match(dateRegex);

                if (match) {
                    const startDate = match[1];
                    const endDate = match[2];
                    apiUrl += `/conference?page=${page}&size=20&subStart=${startDate}&subEnd=${endDate}`;
                }

            }
            else if (keyword.includes('conferenceDate')) {
                // Biểu thức chính quy để trích xuất ngày
                const dateRegex = /from (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;

                // Sử dụng biểu thức chính quy để tìm các ngày trong chuỗi
                const match = keyword.match(dateRegex);

                if (match) {
                    const startDate = match[1];
                    const endDate = match[2];
                    apiUrl += `/conference?page=${page}&size=20&confStart=${startDate}&confEnd=${endDate}`;
                }
            }
            else if (listkey.includes(key)) {
                apiUrl += `/conference?page=${page}&size=20&${key}[]=${keyword}`;
            } 
            else if (key === 'rating') {
                    const match = keyword.match(/\d+/);
                    let rating = 0
                    // Nếu tìm thấy số, trả về giá trị đầu tiên tìm thấy
                    if (match && match.length > 0) {
                        rating = parseInt(match[0]);
                    }
                    apiUrl += `/conference?page=${page}&size=20&${key}[]=${rating}`;
            }
            else {  
                apiUrl += `/conference?page=${page}&size=20&${key}=${keyword}`;
            }

            const response = await fetch(`${apiUrl}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        };


        const fetchAllPages = async () => {
            try {
                const firstPageData = await fetchPage(1);
                setLoading(false)
             
                // Cập nhật dataFilters với trang đầu tiên và lưu vào sessionStorage
                const updatedDataFilters = { ...dataFilters };
                updatedDataFilters[keyword] = firstPageData.data;
                setDataFilters(updatedDataFilters);
                const maxPages = firstPageData.maxPages;
                sessionStorage.setItem('dataFilters', JSON.stringify(updatedDataFilters));
                
                // Fetch remaining pages asynchronously
                for (let i = 2; i <= maxPages; i++) {
                    fetchPage(i).then(pageData => {
                        const storedDataFilters = sessionStorage.getItem('dataFilters');
                        const parsedDataFilters = storedDataFilters ? JSON.parse(storedDataFilters) : {};
                        parsedDataFilters[keyword] = [...(parsedDataFilters[keyword] || []), ...pageData.data];
                        sessionStorage.setItem('dataFilters', JSON.stringify(parsedDataFilters));
                        setDataFilters(parsedDataFilters)
                    });
                }

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchAllPages();
    }, [key, keyword]);

    const clearKeyValues = (keyToClear) => {
        // Cập nhật dataFilters
        const updatedDataFilters = { ...dataFilters };
        const quantity = extractQuantity(keyword)
        setTotal(total - quantity)
        delete updatedDataFilters[keyToClear];
        setDataFilters(updatedDataFilters);
        sessionStorage.setItem('dataFilters', JSON.stringify(updatedDataFilters));
                    

            // Lấy đối tượng hiện tại từ sessionStorage, nếu không có thì gán mặc định là một đối tượng rỗng
        let keywordValuePairs = JSON.parse(sessionStorage.getItem('keywordFilter')) || {};
        // Xóa cặp giá trị từ đối tượng
        delete keywordValuePairs[keyToClear];

        // Lưu đối tượng cập nhật vào sessionStorage
        sessionStorage.setItem('keywordFilter', JSON.stringify(keywordValuePairs));                
    };
    function clearAllKeywords(){
        setDataFilters({});
        sessionStorage.removeItem('dataFilters');
        sessionStorage.removeItem('keywordFilter');
    }


    return {
        data,
        dataFilters,
        loading,
        error,

        setTotalFilterConferences,
        clearKeyValues,
        clearAllKeywords,
    };
};

export default useFilterStorage;
