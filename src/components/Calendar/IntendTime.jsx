
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import useImport from '../../hooks/useImport';
import { Spinner } from 'react-bootstrap';

const IntendTime = ({totalConferences}) => {
    const {isImporting} = useImport()
    const {t} = useTranslation()
    const [completionTime, setCompletionTime] = useState('');


    // Tính toán thời gian trung bình xử lý 1 conference là 3.5 phút
    const averageTimePerConf = 2 * 60 * 1000; // 3.5 phút * 60 giây
    const totalTime = totalConferences * averageTimePerConf;

    useEffect(() => {
        const currentTime = moment();
        const estimatedCompletionTime = currentTime.add(totalTime, 'milliseconds');
        const formattedTime = estimatedCompletionTime.format('hh:mm A');
        setCompletionTime(formattedTime);
    }, [totalConferences, totalTime, isImporting]);


    return (
        <div className='text-nowrap'>
            {
                isImporting ?
                <>
                {`${t('expect_time')}: `}<span className="text-darkcyan-normal fs-5">{completionTime}</span>
                </>
                :
                <>
                    {`${t('expect_time')}: `}
                    <Spinner animation='grow' size='sm'/>
                </>
            }
        </div>
    );
}

export default IntendTime