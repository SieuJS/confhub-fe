import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'

const CircleProgressBar = ({progress}) => {
  return (
       <>
        <CircularProgressbar 
            value={progress} 
            maxValue={100} 
            text={`${progress}%`} 
            strokeWidth={12}
            styles={buildStyles({
                textSize: '30px',
                pathColor: `#FFB13B`,
                textColor: '#FFB13B',
            })}
        />;
       </>
  )
}

export default CircleProgressBar