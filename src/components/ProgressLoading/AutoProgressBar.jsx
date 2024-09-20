import { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import useConference from '../../hooks/useConferences';
import useMessageSocket from '../../hooks/useMessageSocket';
import { useParams } from 'react-router-dom';

const AutoProgressBar = () => {
  const {messages} = useConference()
  const {handleGetMessageById} = useMessageSocket()
  const [progress, setProgress] = useState(0);
  const id = useParams()

  useEffect(() => {
    const message = handleGetMessageById(messages, id.id);

    if (message) {
      const newProgress = message?.progress?.percentage || 0;
      setProgress(newProgress);
    }
  }, [messages, id, handleGetMessageById]);


  return (
    <div className="my-3">
      <ProgressBar animated now={progress} label={`${progress}%`} className='custom-progress'/>
    </div>
  );
};

export default AutoProgressBar;
