import { useEffect, useState } from "react";
import useImport from "../../hooks/useImport"
import { ProgressBar } from "react-bootstrap";


const ImportingProgressBar = () => {
  const { isImporting, inProgressLoading } = useImport()

  const [crawlingCount, setCrawlingCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [stoppingCount, setStoppingCount] = useState(0)

  // Tạo hàm để tính phần trăm từng trạng thái
  const calculatePercentage = () => {
    // Khởi tạo biến để tính tổng số lượng từng trạng thái
    let totalCrawling = 0;
    let totalDone = 0;
    let totalWaiting = 0;
    let totalError = 0;
    let totalStopping = 0;
    // Duyệt qua danh sách inProgressLoading và tính tổng số lượng từng trạng thái
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

    // Tính phần trăm từng trạng thái
    const total = inProgressLoading.length;
    const crawlingPercentage = (totalCrawling / total) * 100;
    const donePercentage = (totalDone / total) * 100;
    const pendingPercentage = (totalWaiting / total) * 100;
    const errorPercentage = (totalError / total) * 100;
    const stoppingPercentage = (totalStopping / total) * 100
    // Cập nhật state useState với phần trăm tính được
    setCrawlingCount(crawlingPercentage.toFixed(1));
    setDoneCount(donePercentage.toFixed(1));
    setWaitingCount(pendingPercentage.toFixed(1));
    setErrorCount(errorPercentage.toFixed(1));
    setStoppingCount(stoppingPercentage.toFixed(1))
  };

  useEffect(() => {
    calculatePercentage()
  }, [inProgressLoading])

  return (
    <div className="w-100 mx-2">
        
          <ProgressBar>
        
        <ProgressBar striped animated now={doneCount} label={`${doneCount}%`} className="custom-progress-done" />
        <ProgressBar striped animated now={waitingCount} label={`${waitingCount}%`} className="custom-progress-waiting" />
        <ProgressBar striped animated now={crawlingCount} label={`${crawlingCount}%`} className="custom-progress-crawling" />
        <ProgressBar striped animated now={stoppingCount} label={`${stoppingCount}%`} className="custom-progress-stopping" />
        <ProgressBar striped animated now={errorCount} label={`${errorCount}%`} className="custom-progress-error" />
      </ProgressBar>
    
        
    </div>
  )
}

export default ImportingProgressBar