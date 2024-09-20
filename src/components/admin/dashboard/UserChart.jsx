import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Stack } from 'react-bootstrap'
import { Form } from 'react-router-dom';
import useDashboard from '../../../hooks/useDashboard';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, Tooltip, registerables } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendDown, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

Chart.register(...registerables); // Đăng ký tất cả các thành phần của Chart.js
const UserChart = ({ startDate, endDate }) => {
    const {i18n, t} = useTranslation()
    const { userLog, calculateRatio } = useDashboard()
    const [ratioVisitors, setRatioVisitors] = useState(null)

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'User access',
                data: [],
                fill: false,
                backgroundColor: '',
                borderColor: '',
                borderWidth: 1
            }
        ]
    });

    useEffect(() => {
        const getRatio = async () => {
          //  const ratio = await calculateRatio()
           // console.log({ratio})
           // setRatioVisitors(ratio)
        }
        getRatio()
    }, [])

    useEffect(() => {
        filterData(startDate, endDate)
    }, [userLog, startDate, endDate, i18n.language])

    const filterData = async (start, end) => {
        // Lọc dữ liệu ETL log theo ngày bắt đầu và ngày kết thúc
        // Tạo một bản đồ để lưu trữ ngày và giá trị cao nhất của total_visiters
        const etlMap = new Map();
        // Duyệt qua dữ liệu và lưu lại ngày có total_visiters cao hơn
        userLog.forEach(item => {
            const itemDate = moment(item.time).format('YYYY-MM-DD');
            if (!etlMap.has(itemDate) || etlMap.get(itemDate).total_visiters < item.total_visiters) {
                etlMap.set(itemDate, item);
            }
        });

        // Tạo danh sách các ngày đầy đủ trong khoảng thời gian đã chọn
        const dateRange = [];
        let currentDate = moment(start);
        while (currentDate <= moment(end)) {
            dateRange.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'days');
        }

        // Kết hợp dữ liệu đã lọc với danh sách các ngày đầy đủ, bổ sung các ngày thiếu
        const completeData = dateRange.map(date => {
            const existingItem = userLog.find(item => moment(item.time).format('YYYY-MM-DD') === date);
            return existingItem ? existingItem : { time: date, total_visiters: 0, duration: 0 };
        });

        // Sắp xếp lại danh sách kết hợp theo ngày
        const sortedData = completeData.sort((a, b) => moment(a.time).diff(moment(b.time)));

        // Xác định số lượng khoảng dựa trên tổng số ngày
        const totalDays = sortedData.length;
        let numberOfIntervals = 1;
        if (totalDays <= 10) {
            numberOfIntervals = totalDays; // 1 ngày/1 khoảng
        } else if (totalDays <= 32) {
            numberOfIntervals = 6; // khoảng 4-5 ngày mỗi khoảng
        } else {
            numberOfIntervals = 10; // tùy chỉnh số ngày mỗi khoảng
        }
        const intervalDuration = Math.ceil(totalDays / numberOfIntervals);

        const intervalData = [];
        for (let i = 0; i < numberOfIntervals; i++) {
            const startIdx = i * intervalDuration;
            const endIdx = (i + 1) * intervalDuration;
            const interval = sortedData.slice(startIdx, endIdx);

            const totalVisiters = interval.reduce((sum, item) => sum + item.total_visiters, 0);
            const labelStart = interval.length > 0 ? moment(interval[0].time).format('YYYY/MM/DD') : '';
            const labelEnd = interval.length > 0 ? moment(interval[interval.length - 1].time).format('YYYY/MM/DD') : '';
            let label = ''
            if (numberOfIntervals === sortedData.length) {

                label = `${labelStart}`;
            }
            else label = `${labelStart} - ${labelEnd}`;

            intervalData.push({ label, totalVisiters });
        }

        const labels = intervalData.map(item => item.label);
        const data = intervalData.map(item => item.totalVisiters);
        let sum = 0;
        for (const el of data) {
            sum += el;
        }
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: `${t('total_visitors')} (${sum} ${t('visitors')}${i18n.language === 'en' ? 's' :''})`,
                    data: data,
                    fill: false,
                    backgroundColor: 'rgb(116,189,205)',
                    borderColor: 'rgb(97,158,171)',
                    borderWidth: 2
                }
            ]
        });
    };
    const customTooltip = {
        callbacks: {
            label: function (tooltipItem) {
                return `${t('total_visitors')} (${tooltipItem.raw} ${t('visitors')}${i18n.language === 'en' ? 's' :''})`
            },
        }
    };
    return (
        <div className='rounded mx-3 border border-light shadow-sm p-2 overview-tab'>
            <div className='my-3 ms-3 d-flex justify-content-between'>
                <div className='d-flex align-items-center border-5 border-info border-start '>
                    <h5 className="text-info ms-2 my-0">{t('total_visitors')}</h5>
                    <div className="mx-2">
                        {
                            ratioVisitors &&
                            <>
                                {
                                    ratioVisitors > 0 ?
                                    <div className='text-success'>
                                        {`+${ratioVisitors}%`}
                                        <FontAwesomeIcon icon={faArrowTrendUp} className='mx-1'/>
                                    </div>
                                    :
                                    <div className='text-red-normal'>
                                        {`${ratioVisitors}%`}
                                        <FontAwesomeIcon icon={faArrowTrendDown} className='mx-1'/>
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>


            </div>
            <div>
                {
                    chartData.labels?.length > 0 &&
                    <Bar data={chartData} options={{ plugins: { tooltip: customTooltip } }} />
                }
            </div>
        </div>
    )
}

export default UserChart