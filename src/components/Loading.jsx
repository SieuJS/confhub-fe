import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';


function Loading({onReload, size}) {
    const [showReloadMessage, setShowReloadMessage] = useState(false);
    const [showCount, setShowCount] = useState(0);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowCount(prevCount => prevCount + 1);
      }, 3000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [showCount]);
  
    useEffect(() => {
      if (showCount >= 30) {
        setShowReloadMessage(true);
      }
    }, [showCount]);
  
    const handleReload = () => {
      setShowCount(0);
      setShowReloadMessage(false);
      onReload()
    };
  
    return (
      <div className='text-center'>
        {showReloadMessage ? (
          <div>
            <Button className='bg-transparent border-0' onClick={handleReload}>Reload</Button>
          </div>
        ) : (
            <Spinner animation="border" size={size} />
        )}
      </div>
    );
}

export default Loading;