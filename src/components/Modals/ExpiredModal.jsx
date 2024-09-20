import {useEffect } from 'react';
const ExpiredModal = ({isOpen, onClose}) => {

    useEffect(() => {
        if (isOpen) {
          const timer = setTimeout(() => {
            onClose();
          }, 5000); // Thời gian tự động đóng là 5 giây
    
          // Clear timeout nếu component unmount hoặc isOpen thay đổi
          return () => clearTimeout(timer);
        }
      }, [isOpen, onClose]);

  return (
    <div>
      {isOpen && (
        <div className="popup">
          <span>{`Please log in to access the content`}</span>
        </div>
      )}
    </div>
  );
};

export default ExpiredModal;
