import { useEffect, useState } from "react";
import useImport from "../../hooks/useImport";
import { ProgressBar } from "react-bootstrap";

const ImportingProgressBar = () => {
  const { inProgressLoading } = useImport();

  const [crawlingCount, setCrawlingCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [stoppingCount, setStoppingCount] = useState(0);

  // Tạo hàm để tính phần trăm từng trạng thái
  const calculatePercentage = () => {
    let totalCrawling = 0;
    let totalDone = 0;
    let totalWaiting = 0;
    let totalError = 0;
    let totalStopping = 0;

    inProgressLoading.forEach(item => {
      switch (item.status) {
        case 'processing':
          totalCrawling++;
          break;
        case 'completed':
          totalDone++;
          break;
        case 'waiting':
          totalWaiting++;
          break;
        case 'failed':
          totalError++;
          break;
        case 'stopping':
          totalStopping++;
          break;
        default:
          break;
      }
    });

    const total = inProgressLoading.length;
    
    // Tránh chia cho 0 nếu total = 0
    const crawlingPercentage = total > 0 ? (totalCrawling / total) * 100 : 0;
    const donePercentage = total > 0 ? (totalDone / total) * 100 : 0;
    const pendingPercentage = total > 0 ? (totalWaiting / total) * 100 : 0;
    const errorPercentage = total > 0 ? (totalError / total) * 100 : 0;
    const stoppingPercentage = total > 0 ? (totalStopping / total) * 100 : 0;

    setCrawlingCount(crawlingPercentage.toFixed(1));
    setDoneCount(donePercentage.toFixed(1));
    setWaitingCount(pendingPercentage.toFixed(1));
    setErrorCount(errorPercentage.toFixed(1));
    setStoppingCount(stoppingPercentage.toFixed(1));
  };

  useEffect(() => {
    calculatePercentage();
  }, [inProgressLoading]);

  return (
    <div className="w-100 mx-2">
      <ProgressBar>
        <ProgressBar 
          striped 
          animated 
          now={doneCount} 
          label={`${doneCount}%`} 
          className="custom-progress-done" 
        />
        <ProgressBar 
          striped 
          animated 
          now={waitingCount} 
          label={`${waitingCount}%`} 
          className="custom-progress-waiting" 
        />
        <ProgressBar 
          striped 
          animated 
          now={crawlingCount} 
          label={`${crawlingCount}%`} 
          className="custom-progress-crawling" 
        />
        <ProgressBar 
          striped 
          animated 
          now={stoppingCount} 
          label={`${stoppingCount}%`} 
          className="custom-progress-stopping" 
        />
        <ProgressBar 
          striped 
          animated 
          now={errorCount} 
          label={`${errorCount}%`} 
          className="custom-progress-error" 
        />
      </ProgressBar>
    </div>
  );
};

export default ImportingProgressBar;