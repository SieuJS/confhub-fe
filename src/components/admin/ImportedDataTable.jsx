import { useEffect, useState } from 'react'
import useImport from '../../hooks/useImport'
import { Button, Carousel, Form, Spinner, Table } from 'react-bootstrap'
import forcode from './../../data/forcode.json'
import useAdmin from '../../hooks/useAdmin'
import ReactPaginate from 'react-paginate'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
const ImportedDataTable = ({ onHide, closeAllModal }) => {
    const { t } = useTranslation()
    const { dataUpload, handleImport, handleShowImportModal, convertCodesToNames, handleIsCrawling } = useImport()
    const [selectedHeaders, setSelectedHeaders] = useState([]);
    const headersNames = ['None', 'Name', 'Acronym', 'Source', 'Rank', 'Field of Research'];
    const [activePage, setActivePage] = useState(0);
    const [warningMessage, setWarningMessage] = useState('')
    const [status, setStatus] = useState(false)
    const [isImported, setIsimported] = useState(false)
    const [formatedData, setFormatedData] = useState([])
    const [formatedHeaders, setFormatedHeaders] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [displayedData, setDisplayedData] = useState(dataUpload.data);
    const [currentPageFormatted, setCurrentPageFormatted] = useState(0)
    // Tính toán phần dữ liệu cho từng trang
    const offsetUpload = currentPage * 5;
    const currentPagedDataUpload = displayedData.slice(offsetUpload, offsetUpload + 5);
    const navigate = useNavigate()


    const offsetFormated = currentPageFormatted * 8;
    const currentPageFormatedData = displayedData.slice(offsetFormated, offsetFormated + 8);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handlePageClickFormatted = (event) => {
        setCurrentPageFormatted(event.selected);
    };


    useEffect(() => {
        setActivePage(0); // Reset active page when data changes
    }, [dataUpload]);

    const handleNext = () => {
        let isFailed = false;
        let newWarningMessage = '';

        // Kiểm tra xem selectedHeaders có chứa tất cả các header bắt buộc không
        const requiredHeaders = ['Name', 'Acronym', 'Source', 'Rank', 'Field of Research'];
        const isMissingHeader = requiredHeaders.some(headerName => {
            return !selectedHeaders.some(header => header !== undefined && header.name === headerName);
        });

        if (selectedHeaders.length !== 0 && !isMissingHeader) {
            const selectedCol = selectedHeaders.filter(header => header !== undefined && header.name !== 'None');
            const newData = dataUpload.data.map(row => {
                let newRow = [];
                selectedHeaders.forEach(header => {
                    if (header && header.name === 'Field of Research') {
                        const fieldOfResearchCodes = row.filter((value, index) => selectedHeaders.some(h => h && h.order === index && h.name === 'Field of Research'));
                        const fieldOfResearchNames = fieldOfResearchCodes.map(code => {
                            if (code !== '') {
                                const mapping = forcode.find(mapping => mapping.code === code);

                                if (mapping) {
                                    return mapping.code;
                                } else {
                                    newWarningMessage = t('checkForColumnCode', { code: `${code}` });
                                    isFailed = true;
                                    return ''; // or another value when mapping not found
                                }
                            }
                        });
                        
                        newRow.push(fieldOfResearchNames.join('; '));
                    } else {
                        if (header && header.name !== 'None') {
                            newRow.push(row[header.order]);
                        }
                    }
                });

                // Validate 'Source' column
                const sourceIndex = selectedHeaders.findIndex(header => header && header?.name === 'Source');
                if (sourceIndex !== -1 && !/CORE20/.test(row[sourceIndex])) {
                    newWarningMessage = t('sourceColumnWrong')
                    isFailed = true;
                }

                // Validate 'Acronym' column
                const acronymIndex = selectedHeaders.findIndex(header => header && header.name === 'Acronym');
                if (acronymIndex !== -1 && row[acronymIndex].length >= 20) {
                    newWarningMessage = t('acronymColumnWrong');
                    isFailed = true;
                }

                return newRow;
            });

            const uniqueColumnNames = [...new Set(selectedCol.map(header => header.name))];
            const uniqueData = newData.map(list => {
                const uniqueSet = new Set();
                list.forEach(item => {
                    const trimmedItem = item.trim();
                    if (trimmedItem !== "" && !uniqueSet.has(trimmedItem)) {
                        uniqueSet.add(trimmedItem);
                    }
                });
                return Array.from(uniqueSet);
            });

            setFormatedHeaders(Array.from(uniqueColumnNames));
            setFormatedData(uniqueData);
            setDisplayedData(uniqueData)
            if (!isFailed && warningMessage === '') {
                setActivePage(activePage + 1);
            } else {
                setWarningMessage(newWarningMessage);
                setTimeout(() => {
                    setWarningMessage('');
                }, 5000);
            }
        } else {
            setWarningMessage(t('selectColumns'));
            setTimeout(() => {
                setWarningMessage('');
            }, 5000);
        }
    };



    const handleSelectHeader = (selectedHeader, index) => {
        const newSelectedColumns = [...selectedHeaders];
        newSelectedColumns[index] = { order: index, name: selectedHeader };
        setSelectedHeaders(newSelectedColumns);
    };
    const handleImportFile = async () => {
        setIsimported(true)
        handleIsCrawling(true)
        handleImport(formatedData, formatedHeaders)
        
        navigate('/admin/import_conference')
        closeAllModal()
        handleShowImportModal(false)
    }

    const renderTableHeader = (headersName, isSelect) => {
        return (
            <tr>
                {headersName.map((header, index) => (
                    <th key={index} >
                        {
                            isSelect ?
                                <Form.Select
                                    value={selectedHeaders[index]?.name || ''}
                                    onChange={(e) => handleSelectHeader(e.target.value, index)}
                                    className='fw-bold'
                                    style={{width: "auto"}}
                                >
                                    <option value="" disabled>{t('selectHeader')}</option>
                                    {headersNames.map((name, i) => (
                                        <option
                                            key={i}
                                            value={name}
                                            disabled={selectedHeaders.some(column => column?.name === name && name !== 'Field of Research' && name !== 'None')}
                                        >
                                            {name}
                                        </option>
                                    ))}
                                </Form.Select>
                                :
                                <div>
                                    {header}
                                </div>
                        }
                    </th>
                ))}
            </tr>
        );
    };
    const renderTableBody = (tableData) => {
        // Sắp xếp các hàng dựa trên số lượng cột không rỗng
        const sortedTableData = [...tableData].sort((a, b) => {
            const nonEmptyCountA = a.filter(cell => cell !== null && cell !== undefined && cell !== '').length;
            const nonEmptyCountB = b.filter(cell => cell !== null && cell !== undefined && cell !== '').length;
            return nonEmptyCountB - nonEmptyCountA;
        });

        // Tìm số cột tối đa trong dữ liệu
        const maxColumns = Math.max(...sortedTableData.map(row => row.length));

        // Render các hàng
        return sortedTableData.map((row, rowIndex) => {
            // Tạo hàng mới với các giá trị tương ứng với thứ tự các cột đã chọn
            const renderRow = [...row];

            // Nếu hàng chưa đủ số lượng cột, thêm các ô trống
            while (renderRow.length < maxColumns) {
                renderRow.push('');
            }


            return (
                <tr key={rowIndex}>
                    {renderRow.map((cell, cellIndex) => (
                        <td key={`${rowIndex}-${cellIndex}`} className=''>
                            {typeof cell === 'string' ? convertCodesToNames(cell) : cell}
                        </td>
                    ))}
                </tr>
            );
        });
    };


    return (
        <div className='w-100'>
            <Carousel activeIndex={activePage} onSelect={() => { }} controls={false} interval={null} indicators={false}>

                <Carousel.Item key={1}>
                   <div className="overflow-y-auto" style={{maxHeight: "75%"}}>
                   <Table striped bordered hover responsive>
                        <thead>
                            {renderTableHeader(dataUpload.headers, true)}
                        </thead>
                        <tbody>
                            {renderTableBody(currentPagedDataUpload, currentPage)}
                        </tbody>
                    </Table>
                   </div>
                    <ReactPaginate
                        nextLabel=">"
                        previousLabel="<"
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(displayedData.length / 5)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}  
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        breakLinkClassName="page-link"
                    />

                </Carousel.Item>
                <Carousel.Item key={2}>
                    <div className="mh-75">
                    <Table striped bordered hover responsive>
                        <thead>
                            {renderTableHeader(formatedHeaders, false)}
                        </thead>
                        <tbody>
                            {renderTableBody(currentPageFormatedData, currentPageFormatted)}
                        </tbody>
                    </Table>
                    </div>
                    <ReactPaginate
                        nextLabel=">"
                        previousLabel="<"
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(currentPageFormatedData.length / 8)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClickFormatted}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        breakLinkClassName="page-link"
                    />
                </Carousel.Item>

            </Carousel>

            <div className="d-flex justify-content-end align-items-center fs-5">
                {!isImported && warningMessage !== '' && (
                    <div className="text-warning-emphasis">
                        {warningMessage}
                    </div>)
                }
                {
                    isImported && status && warningMessage !== '' &&
                    <div className="text-success">
                        {warningMessage}
                    </div>
                }
                {
                    isImported && !status && warningMessage !== '' &&
                    <div className="text-danger ">
                        {warningMessage}
                    </div>
                }

                <Button
                    disable={activePage === 0 ? true : false}
                    onClick={() => setActivePage(0)}
                    className='bg-secondary text-white mx-2 px-4 border-light text-nowrap'
                >
                    {t('back')}
                </Button>
                {
                    activePage === 1 ?
                        <Button
                            className='bg-primary-normal text-white mx-2 px-4 border-light'
                            onClick={handleImportFile}>
                           
                           {t('import_file')}                        </Button>
                        :
                        <Button
                            className='bg-primary-normal text-white mx-2 px-4 border-light text-nowrap'
                            onClick={handleNext}>{t('next')}</Button>
                }
            </div>
        </div>
    );
}

export default ImportedDataTable