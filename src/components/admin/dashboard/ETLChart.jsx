import moment from 'moment';
import { useEffect, useRef, useState } from 'react'
import useDashboard from '../../../hooks/useDashboard';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './custom_dashboard.css'
import { useTranslation } from 'react-i18next';
import useScreenSize from '../../../hooks/useScreenSize';
Chart.register(...registerables);

const ETLChart = ({ startDate, endDate }) => {
    const {t, i18n} = useTranslation()
    const { etlLog } = useDashboard()
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Crawl Processes',
                data: [],
                duration: [],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                tension: 0.4 // smooth curve
            }
        ]
    });

    useEffect(() => {
        filterData(startDate, endDate)
    }, [etlLog, startDate, endDate, i18n.language])


    const filterData = async (start, end) => {
        // Lọc dữ liệu ETL log theo ngày bắt đầu và ngày kết thúc
        // Tạo một bản đồ để lưu trữ ngày và giá trị cao nhất của total_etl_processes
        const etlMap = new Map();
        // Duyệt qua dữ liệu và lưu lại ngày có total_etl_processes cao hơn
        etlLog.forEach(item => {
            const itemDate = moment(item.time).format('YYYY-MM-DD');
            if (!etlMap.has(itemDate) || etlMap.get(itemDate).total_etl_processes < item.total_etl_processes) {
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
            const existingItem = etlLog.find(item => moment(item.time).format('YYYY-MM-DD') === date);
            return existingItem ? existingItem : { time: date, total_etl_processes: 0, duration: 0 };
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

            const totalProcesses = interval.reduce((sum, item) => sum + item.total_etl_processes, 0);
            const totalDuration = interval.reduce((sum, item) => sum + item.duration, 0);
            const labelStart = interval.length > 0 ? moment(interval[0].time).format('YYYY/MM/DD') : '';
            const labelEnd = interval.length > 0 ? moment(interval[interval.length - 1].time).format('YYYY/MM/DD') : '';
            let label = ''
            if (numberOfIntervals === sortedData.length) {

                label = `${labelStart}`;
            }
            else label = `${labelStart} - ${labelEnd}`;

            intervalData.push({ label, totalProcesses, totalDuration });
        }

        const labels = intervalData.map(item => item.label);
        const data = intervalData.map(item => item.totalProcesses);
        const durations = intervalData.map(item => item.totalDuration);
        let sum = 0;
        for (const el of data) {
            sum += el;
        }
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: `${t('crawl_processes')} (${sum} ${t('run')}${i18n.language === 'en' ? 's' :''})`,
                    data: data,
                    duration: durations,
                    fill: false,
                    backgroundColor: 'rgba(247,220,11)',
                    borderColor: 'rgb(255,195,0)',
                    borderWidth: 2
                }
            ]
        });
    };


    const customTooltip = {
        callbacks: {
            label: function (tooltipItem) {
                return `${t('crawl_processes')} (${tooltipItem.raw} ${t('run')}${i18n.language === 'en' ? 's' :''})`
            },
            afterLabel: function (tooltipItem) {
                const index = tooltipItem.dataIndex;
                const duration = tooltipItem.dataset.duration[index];
                return `${t('duration')}: ` + duration + ' ms';
            },
        }
    };
    return (
        <div className='rounded mx-3 border border-light shadow-sm p-2 overview-tab'>
            <div className='border-5 border-warning border-start py-0  my-3 ms-3 d-flex justify-content-between'>
                <div>
                    <h5 className="text-yellow ms-2 my-0">{t('crawl_log')}</h5>
                </div>
            </div>
            <div>
                {
                    chartData.labels?.length > 0 &&
                    <Line 
                        data={chartData} 
                        options={{ 
                            plugins: { tooltip: customTooltip },
                        }} 
                    />
                }
            </div>
        </div>
    )
}

export default ETLChart