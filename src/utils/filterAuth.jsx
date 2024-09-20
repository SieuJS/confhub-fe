const filterListbyCondition = (conferences, listOptions) => {
    // Duyệt qua từng thuộc tính trong filters 
    const filteredConferences = conferences.filter(conference => {
        if (listOptions.submissionDate.length > 0) {
            // Xử lý trường hợp submissionDate
            const dateRegex = /(\d{2}\/\d{2}\/\d{4})/g;
            const dateString = listOptions.submissionDate[0]; // Lấy chuỗi từ listOptions
            const matches = dateString.match(dateRegex);

            if (matches && matches.length >= 2) {
                const startDate = new Date(matches[0]);
                const endDate = new Date(matches[1]);
                const subDates = conference.importantDates.filter(date => date.date_type === 'sub');
                // Lấy ra các giá trị date_value từ các object có date_type là 'sub'
                const subDateValues = subDates.map(date => date.date_value);
                const subDate = new Date(subDateValues[0]);

                // Kiểm tra xem subDate có nằm trong khoảng startdate và enddate không
                const isWithinRange = subDate >= startDate && subDate <= endDate;
                return isWithinRange;

            }
        }
        else if (listOptions.date.length > 0) {
            //xử lý trường hợp conf date
            const dateRegex = /(\d{2}\/\d{2}\/\d{4})/g;
            const dateString = listOptions.date[0]; // Lấy chuỗi từ listOptions
            const matches = dateString.match(dateRegex);
            if (matches && matches.length > 0) {
                const filterDate = new Date(conference.organizations[0].conf_date);
                const startDate = new Date(matches[0]);
                const endDate = new Date(matches[1]);
                // So sánh xem filterDate có nằm trong khoảng từ startDate đến endDate không
                const isWithinRange = filterDate >= startDate && filterDate <= endDate;
                return isWithinRange;
            }
        }
        else if (listOptions.rating.length > 0) {
            const extractedRating = parseInt(listOptions.rating[0].match(/\d+/));
            const avgRating = conference.rating.avgRating;
            return extractedRating < avgRating;
        }
        else {
            const arrayKey = ['fieldOfResearch', 'importantDates', 'organizations', 'type', 'location',]
            return Object.keys(listOptions).some(filterKey => {
                if (listOptions[filterKey].length > 0) {
                    let formatKey = filterKey
                    let formatFilterOptions = listOptions[filterKey]
                    let conferenceValue = ''
                    if (filterKey === '')
                    if (arrayKey.includes(filterKey)) {
                        if (filterKey === 'fieldOfResearch') {
                            conferenceValue = conference[formatKey]['for_name']
                        }
                        else if (filterKey === 'importantDates') {
                            const subDates = conference.importantDates.filter(date => date.date_type === 'sub');
                            // Lấy ra các giá trị date_value từ các object có date_type là 'sub'
                            const subDateValues = subDates.map(date => date.date_value);
                        }
                        else {
                            if (filterKey === 'type') {
                                conferenceValue = conference.organizations[0].type
                            }
                            else if (filterKey === 'location') {
                                conferenceValue = conference.organizations[0].location
                            }
                        }
                    }
                    else if (filterKey === 'search') {
                        formatKey = 'name'
                        formatFilterOptions = listOptions[filterKey].map(value => value.toUpperCase())
                    }
                    else if(filterKey === 'category') return true
                    else conferenceValue = conference[formatKey];
                    // Chuyển cả hai chuỗi về cùng một kiểu chữ (chữ thường)
                    const formatFilterOptionsLower = formatFilterOptions.map(option => option.toLowerCase());
                    const conferenceValueLower = conferenceValue.toLowerCase();

                    // So sánh chuỗi đã chuyển đổi
                    const isEqual = formatFilterOptionsLower.includes(conferenceValueLower);
                    return formatFilterOptionsLower.includes(conferenceValueLower)
                }

            });
        }
    });
    return filteredConferences;

};

export { filterListbyCondition };
