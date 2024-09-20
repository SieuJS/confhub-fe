import { useEffect, useState } from 'react'

import useSearch from './useSearch'
import { useAppContext } from '../context/authContext'
import useNote from './useNote'

import submission_date_dict from './../data/submission_date_dict.txt?raw'
import moment from 'moment'
import countries from './../data/countries.json'
import useAreaFilter from './useAreaFilter'
const useFilter = () => {
  const { state, dispatch } = useAppContext()
  const { optionsSelected } = useSearch()
  const { checkDateTypeWithKeywords } = useNote()
  const [loading, setLoading] = useState(false)
  const { userLocation } = useAreaFilter()
  const [priorityKeywords, setPriorityKeywords] = useState({});
  const [selectedKeywords, setSelectedKeywords] = useState({});

  useEffect(() => {
    let updatedPriorityKeywords = { ...state.priorityKeywords };
    // Lặp qua từng key trong optionsSelected
    Object.entries(optionsSelected).forEach(([key, keywords]) => {
      // Nếu danh sách keywords có nhiều hơn 1 phần tử hoặc key chưa tồn tại trong updatedPriorityKeywords
      if (keywords.length > 0 || !updatedPriorityKeywords[key]) {
        updatedPriorityKeywords[key] = keywords[keywords.length - 1]; // Thêm key vào updatedPriorityKeywords với giá trị cuối cùng trong danh sách
      }
    });

    // Kiểm tra nếu priority keyword hiện tại đã bị xóa khỏi optionsSelected
    Object.entries(updatedPriorityKeywords).forEach(([key, priorityKeyword]) => {
      // Nếu optionsSelected vẫn chứa key và priorityKeyword không nằm trong danh sách keywords của key đó
      if (!optionsSelected[key] && !optionsSelected[key].includes(priorityKeyword)) {
        updatedPriorityKeywords[key] = optionsSelected[key][optionsSelected[key].length - 1]; // Cập nhật priorityKeyword mới là giá trị cuối cùng trong danh sách keywords của key
      }
    });

    // Xóa các keys có chỉ một keyword
    Object.keys(updatedPriorityKeywords).forEach(key => {
      if (optionsSelected[key].length < 1) {
        delete updatedPriorityKeywords[key]; // Xóa key nếu chỉ có một keyword trong danh sách
      }
    });

    // Cập nhật state và dispatch action mới
    setPriorityKeywords(updatedPriorityKeywords);
    dispatch({ type: 'SET_PRIORITY_KEYWORD', payload: updatedPriorityKeywords })
  }, [optionsSelected]);





  useEffect(() => {
    let keywordsWithMultipleOptions = {};

    Object.entries(optionsSelected).forEach(([key, keywords]) => {
      if (keywords.length > 0) {
        if (key === 'conferenceDate' || key === 'submissionDate') {
          const fromIndex = keywords[0].indexOf("from");
          const extractedString = keywords[0].substring(fromIndex);
          keywordsWithMultipleOptions[key] = [extractedString]
        }
        else keywordsWithMultipleOptions[key] = keywords;
      }
    });
    setSelectedKeywords(keywordsWithMultipleOptions);
  }, [optionsSelected])



  const handleKeywordSelection = (key, selectedValue) => {
    //choose priority keyword
    setPriorityKeywords({
      ...priorityKeywords,
      [key]: selectedValue
    });

    dispatch({
      type: 'SET_PRIORITY_KEYWORD', payload: {
        ...state.priorityKeywords,
        [key]: selectedValue
      }
    })
  };


  const getCountForSelectedKeyword = (countlist, keyword, key) => {
    // Xử lý các từ khóa đặc biệt như "conference date" hoặc "submission date"

    if (key === 'conferenceDate' || key === 'submissionDate') {
      for (const [keyCount, value] of Object.entries(countlist)) {

        if (keyCount.includes(keyword)) {
          return value
        }
      }
    } else {
      // Trường hợp thông thường
      return countlist[keyword.toLowerCase()]
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

  const getTotalConfFilter = () => {
    const savedTotalPages = localStorage.getItem('totalConf');
    return savedTotalPages ? parseInt(savedTotalPages, 10) : 0;
  }
  const getTotalPages = () => {
    const savedTotalPages = localStorage.getItem('totalConf');
    return savedTotalPages ? parseInt(savedTotalPages, 10) : 0;
  }

  const extractDates = (str) => {
    const regex = /from\s+(\d{4}\/\d{2}\/\d{2})\s+to\s+(\d{4}\/\d{2}\/\d{2})/;
    const matches = str.match(regex);
    if (matches && matches.length === 3) {
      return { startDate: matches[1], endDate: matches[2] };
    }
    return { startDate: '', endDate: '' };
  };

  // Hàm để trích xuất số sao từ chuỗi đánh giá
  const extractStars = (str) => {
    const regex = /(\d+)\*/;
    const matches = str.match(regex);
    if (matches && matches.length === 2) {
      return matches[1];
    }
    return '';
  };

  const containsVietnamese = (str) => {
    const vietnamesePattern = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    return vietnamesePattern.test(str);
  };
  
  const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();
  };
  

  const isLocationMatch = (location, keyword) => {
    const locationLower = location ? location.toLowerCase().trim() : '';
    const keywordLower = keyword ? keyword.toLowerCase().trim() : '';

  // Nếu location không tồn tại hoặc rỗng, trả về false
  if(!location || location === '') {
      return false;
    }

    // Lấy phần từ sau dấu phẩy để so sánh với country code
    const locationParts = locationLower.split(',').map(part => part.trim());
    const locationAfterComma = locationParts.length > 1 ? locationParts[locationParts.length - 1] : locationParts[0];

    // Loại bỏ các dấu chấm và dấu ngoặc trong locationAfterComma
    const cleanedLocationAfterComma = locationAfterComma.replace(/[.()]/g, '').trim();

    // Kiểm tra nếu location chứa keyword hoặc keyword chứa location
    if (cleanedLocationAfterComma === keywordLower) {
      return true;
    }

    const normalizedLocationAfterComma = containsVietnamese(location) ? cleanedLocationAfterComma : normalizeString(cleanedLocationAfterComma);
  const normalizedKeyword = containsVietnamese(keyword) ? keyword : normalizeString(keyword);

  // Kiểm tra nếu locationAfterComma khớp với bất kỳ giá trị nào trong countries
  const isMatch = Object.values(countries).some(country => {
    const countryLower2 = country.country_code2.toLowerCase();
    const countryLower3 = country.country_code3.toLowerCase();
    const countryNameLower = normalizeString(country.country_name);
    const countryNameFullLower = normalizeString(country.country_name_full);

    // Kiểm tra locationAfterComma có chứa country code ở phần từ sau dấu phẩy không
    const locationContainsCountryCode = (
      (cleanedLocationAfterComma.endsWith(countryLower2) && cleanedLocationAfterComma.length <= countryLower2.length + 2) ||
      (cleanedLocationAfterComma.endsWith(countryLower3) && cleanedLocationAfterComma.length <= countryLower3.length + 2)
    );

    // Kiểm tra location và keyword có khớp với bất kỳ giá trị country name nào không
    const locationMatches = (
      normalizedLocationAfterComma.includes(countryNameLower) ||
      normalizedLocationAfterComma.includes(countryNameFullLower) ||
      countryNameLower.includes(normalizedLocationAfterComma) ||
      countryNameFullLower.includes(normalizedLocationAfterComma)
    );

    const keywordMatches = (
      normalizedKeyword.includes(countryNameLower) ||
      normalizedKeyword.includes(countryNameFullLower) ||
      countryNameLower.includes(normalizedKeyword) ||
      countryNameFullLower.includes(normalizedKeyword)
    );
   
    return (locationContainsCountryCode || locationMatches) && keywordMatches;
  });

  return isMatch;
  };



  const isLocationAndContinentMatch = (location, keyword) => {
    const locationLower = location ? location.toLowerCase().trim() : '';
    const keywordLower = keyword.toLowerCase().trim();

    // Nếu location không tồn tại hoặc rỗng, trả về false
    if (!location || location === '') {
      return false;
    }

    // Tách lấy phần từ sau dấu phẩy cuối cùng trong location
    const locationParts = locationLower.split(',').map(part => part.trim());
    const locationAfterComma = locationParts.length > 1 ? locationParts[locationParts.length - 1] : locationParts[0];

    // Loại bỏ các dấu chấm và dấu ngoặc trong locationAfterComma
    const cleanedLocationAfterComma = locationAfterComma.replace(/[.()]/g, '').trim();

    const normalizedLocationAfterComma = containsVietnamese(location) ? cleanedLocationAfterComma : normalizeString(cleanedLocationAfterComma);
    const normalizedKeyword = containsVietnamese(keyword) ? keyword : normalizeString(keyword);

    // Tìm country trong danh sách countries thỏa mãn location
    const matchingCountry = Object.values(countries).find(country => {
      const countryLower2 = country.country_code2.toLowerCase();
      const countryLower3 = country.country_code3.toLowerCase();
      const countryNameLower = country.country_name.toLowerCase();
      const countryNameFullLower = country.country_name_full.toLowerCase();

      // Kiểm tra cleanedLocationAfterComma có chứa country code ở phần từ sau dấu phẩy không
      const locationContainsCountryCode = (
        normalizedLocationAfterComma === countryLower2 ||
        normalizedLocationAfterComma === countryLower3
      );

      // Kiểm tra location có khớp với bất kỳ giá trị country name nào không
      const locationMatches = (
        normalizedLocationAfterComma === countryNameLower ||
        normalizedLocationAfterComma === countryNameFullLower
      );
      return locationContainsCountryCode || locationMatches;
    });

    // Nếu không tìm thấy quốc gia phù hợp, trả về false
    if (!matchingCountry) {
      return false;
    }

    // Kiểm tra continent của matchingCountry với keyword
    const continentLower = matchingCountry.continent_name.toLowerCase();
    const continentMatches = (
      continentLower.includes(keywordLower) ||
      keywordLower.includes(continentLower)
    );
    return continentMatches;
  };


  const filterConferences = (listConferences, keywordSelected) => {
    setLoading(true);
    let results = [];
    const backupDataConferences = listConferences.map(conference => ({ ...conference }));
    backupDataConferences.forEach(conference => {
      let matchKeywords = {}; // Object to store matching keywords for each key

      let isOverallMatch = true;

      // Iterate through each category in keywordSelected
      for (const [key, keywords] of Object.entries(keywordSelected)) {
        if (keywords.length > 0) {
          const lowerKeywords = keywords.map(keyword => keyword.toLowerCase());
          let isCategoryMatch = false;

          lowerKeywords.forEach(keyword => {
            let isMatch = false;
            switch (key) {

              case 'location': {
                isMatch = conference.organizations.some(org => {
                  if (org.status === "new") {
                    return isLocationMatch(org.location, keyword);
                  }
                });

                break;
              }


              case 'rank': {
                isMatch = conference.information?.rank?.toLowerCase() === keyword.toLowerCase();
                break;
              }

              case 'for': {
                isMatch = conference.information?.fieldOfResearch?.some(field => field?.toLowerCase().includes(keyword));
                break;
              }

              case 'source': {
                isMatch = conference.information?.source?.toLowerCase().includes(keyword);
                break;
              }

              case 'acronym': {
                isMatch = conference.information?.acronym?.toLowerCase().includes(keyword);
                break;
              }

              case 'type': {
                isMatch = conference.organizations?.some(org => org.type?.toLowerCase().includes(keyword));
                break;
              }
              case 'owner': {
                isMatch = conference.information?.owner?.toLowerCase().includes(keyword);
                break;
              }
              case 'region': {
                let continent = ['asia', 'south america', 'europe', 'oceania', 'north america', 'africa']
                const user_location = userLocation?.toLowerCase()
                if (keyword === 'local') {
                  isMatch = conference.organizations.some(org => {
                    if (org.status === "new") {
                      return isLocationMatch(org.location, user_location);
                    }
                  });
                }
                else if (continent.includes(keyword)) {
                  isMatch = conference.organizations.some(org => {
                    if (org.status === "new") {
                      return isLocationAndContinentMatch(org.location, keyword);
                    }
                  });
                }
                else {
                  isMatch = !conference.organizations.some(org => {
                    if (org.status === "new") {
                      return isLocationMatch(org.location, user_location);
                    }
                  });
                }
                break;
              }
              case 'conferenceDate': {
                const matchDates = keyword.match(/from\s+(\d{4}\/\d{2}\/\d{2})\s+to\s+(\d{4}\/\d{2}\/\d{2})/)
                if (matchDates) {
                  const startDate = new Date(matchDates[1]);
                  const endDate = new Date(matchDates[2]);
                  isMatch = conference.organizations?.some(org => {
                    const orgStart = new Date(org.start_date);
                    const orgEnd = new Date(org.start_date);
                    if (orgStart >= startDate && orgEnd <= endDate && org.status === "new") {
                      return true
                    }
                    return false
                  });
                }
                break;
              }

              case 'submissionDate': {
                const matchSubDates = keyword.match(/from\s+(\d{4}\/\d{2}\/\d{2})\s+to\s+(\d{4}\/\d{2}\/\d{2})/)
                if (matchSubDates) {
                  const startDate = new Date(matchSubDates[1]);
                  const endDate = new Date(matchSubDates[2]);
                  isMatch = conference.importantDates?.some(date => {
                    const dateValue = new Date(date.date_value);
                    if (checkDateTypeWithKeywords(submission_date_dict, date.date_type) &&
                      dateValue >= startDate && dateValue <= endDate &&
                      date.status === "new") {
                      matchKeywords[key] = [`${date.date_type} (${moment(date.date_value).format('YYYY/MM/DD')})`]
                      return true
                    }
                    return false
                  });
                }
                break;
              }

              case 'search': {
                isMatch = searchInObject(conference, keyword);
                break;
              }

              case 'impactfactor': {
                isMatch = conference.information?.impactfactor?.toLowerCase().includes(keyword);
                break;
              }

              case 'rating': {
                const matchRating = keyword.match(/\d+/);
                if (matchRating) {
                  const threshold = parseFloat(extractStars(keyword))

                  isMatch = conference.information?.rating >= threshold;
                }
                break;
              }

              case 'category': {
                isMatch = true
                break;
              }

              default:
                break;
            }

            if (isMatch) {
              if (!matchKeywords[key]) matchKeywords[key] = [];
              if (key !== 'submissionDate') {

                if (key === 'conferenceDate') {
                  const match = keywords[0].match(/from\s+(\d{4}\/\d{2}\/\d{2})\s+to\s+(\d{4}\/\d{2}\/\d{2})/)
                  const extractKeyword = match ? match[0] : '';
                  matchKeywords[key].push(extractKeyword);
                }
                else matchKeywords[key].push(keyword);
              }

              isCategoryMatch = true;
            }
          });

          if (!isCategoryMatch) {
            isOverallMatch = false;
            break;
          }
        }
      }

      if (isOverallMatch) {
        conference.matchingKeywords = matchKeywords;
        results.push(conference);
      }
    });

    setLoading(false);
    dispatch({ type: 'SET_SEARCH_RESULT', payload: results })
    return results;
  };


  const sortConferencesByPriorityKeyword = (conferences, prioritySelectedKeywords) => {

    // Sắp xếp hội nghị dựa trên priorityKeywords
    return conferences.sort((a, b) => {
      const priorityKeys = Object.keys(prioritySelectedKeywords);

      // Kiểm tra xem hội nghị có thỏa mãn tất cả các từ khóa ưu tiên không
      const aMatchAllKeywords = priorityKeys.every(key =>
        a.matchingKeywords[key] && a.matchingKeywords[key].includes(prioritySelectedKeywords[key].toLowerCase())
      );
      const bMatchAllKeywords = priorityKeys.every(key =>
        b.matchingKeywords[key] && b.matchingKeywords[key].includes(prioritySelectedKeywords[key].toLowerCase())
      );

      if (aMatchAllKeywords && !bMatchAllKeywords) {
        return -1;
      } else if (!aMatchAllKeywords && bMatchAllKeywords) {
        return 1;
      } else if (aMatchAllKeywords && bMatchAllKeywords) {
        return 0;
      } else {
        // Nếu không thể thỏa mãn tất cả, ưu tiên sắp xếp theo key và keyword được thêm vào trước trong priorityKeywords
        for (const key of priorityKeys) {
          const aMatchKeyword = a.matchingKeywords[key] && a.matchingKeywords[key].includes(prioritySelectedKeywords[key].toLowerCase());
          const bMatchKeyword = b.matchingKeywords[key] && b.matchingKeywords[key].includes(prioritySelectedKeywords[key].toLowerCase());

          if (aMatchKeyword && !bMatchKeyword) {
            return -1;
          } else if (!aMatchKeyword && bMatchKeyword) {
            return 1;
          }
        }

        return 0;
      }
    });
  };


  const extractDateRangeFromKeyword = (keyword) => {
    const match = keyword.match(/from\s+(\d{4}\/\d{2}\/\d{2})\s+to\s+(\d{4}\/\d{2}\/\d{2})/);
    return match ? match[0] : null;
  };

  const countMatchingConferences = (listConferences, keywordSelected) => {
    let keywordCounts = {}; // Object to store counts of matching conferences for each keyword

    // Initialize keywordCounts with 0 for each keyword in keywordSelected
    Object.values(keywordSelected).forEach(keywords => {
      keywords.forEach(keyword => {
        keywordCounts[keyword.toLowerCase()] = 0;
      });
    });

    listConferences.forEach(conference => {
      // Iterate through each keyword in keywordSelected
      for (const [key, keywords] of Object.entries(keywordSelected)) {
        if (keywords.length > 0 && key in conference.matchingKeywords) {
          const lowerKeywords = keywords.map(keyword => keyword.toLowerCase());
          const matchingKeywords = conference.matchingKeywords[key].map(mKeyword => mKeyword.toLowerCase());

          lowerKeywords.forEach(keyword => {
            if (key === 'conferenceDate') {

              const extractedRange = extractDateRangeFromKeyword(keyword);

              if (extractedRange && matchingKeywords[0].includes(extractedRange)) {
                keywordCounts[keyword]++;
              }
            } else if (key === 'submissionDate') {
              if (matchingKeywords.length > 0) {
                keywordCounts[keyword]++;
              }
            } else {
              // Check if keyword is included in matchingKeywords
              if (matchingKeywords.includes(keyword)) {
                // Increment keyword count
                keywordCounts[keyword]++;
              }
            }
          });
        }
      }
    });

    return keywordCounts;
  };

  

  return {
    loading,
    selectOptionFilter: state.optionFilter,
    inputFilter: state.inputFilter,
    resultInputFilter: state.resultKeywordFilter,
    selectedKeywords,
    priorityKeywords: state.priorityKeywords,
    resultFilter: state.resultFilter,
    getTotalConfFilter,
    getTotalPages,
    filterConferences,
    sortConferencesByPriorityKeyword,
    handleKeywordSelection,
    countMatchingConferences,
    setSelectedKeywords,
    getCountForSelectedKeyword,
    extractStars,
    extractDates,
    searchInObject
  }
}

export default useFilter