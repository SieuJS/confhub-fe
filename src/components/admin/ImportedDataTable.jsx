import { useEffect, useState } from 'react';
import useImport from '../../hooks/useImport';
import { Button, Carousel, Form, Table } from 'react-bootstrap';
import forcode from './../../data/forcode.json';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ImportedDataTable = ({ onHide, closeAllModal }) => {
    const { t } = useTranslation();
    const { dataUpload, handleImport, handleShowImportModal, convertCodesToNames, handleIsCrawling } = useImport();
    const [selectedHeaders, setSelectedHeaders] = useState([]);
    const headersNames = ['None', 'Name', 'Acronym', 'Source', 'Rank', 'Field of Research'];
    const [activePage, setActivePage] = useState(0);
    const [warningMessage, setWarningMessage] = useState('');
    const [isImported, setIsimported] = useState(false);

    // Sử dụng state riêng biệt cho dữ liệu gốc và đã format
    const [originalData, setOriginalData] = useState([]);
    const [formatedData, setFormatedData] = useState([]);
    const [formatedHeaders, setFormatedHeaders] = useState([]);

    // Sử dụng state riêng biệt cho phân trang của mỗi trang
    const [currentPageOriginal, setCurrentPageOriginal] = useState(0);
    const [currentPageFormatted, setCurrentPageFormatted] = useState(0);

    const navigate = useNavigate();

    // Tính toán phần dữ liệu cho từng trang
    const offsetUpload = currentPageOriginal * 5;
    const currentPagedDataUpload = originalData.slice(offsetUpload, offsetUpload + 5);

    const offsetFormated = currentPageFormatted * 8;
    const currentPageFormatedData = formatedData.slice(offsetFormated, offsetFormated + 8);

    const handlePageClickOriginal = (event) => {
        setCurrentPageOriginal(event.selected);
    };

    const handlePageClickFormatted = (event) => {
        setCurrentPageFormatted(event.selected);
    };

    useEffect(() => {
        setActivePage(0);
        setOriginalData(dataUpload.data);
    }, [dataUpload]);

    const handleNext = () => {
        let isFailed = false;
        let newWarningMessage = '';

        const requiredHeaders = ['Name', 'Acronym', 'Source', 'Rank', 'Field of Research'];
        const isMissingHeader = requiredHeaders.some(headerName => {
            return !selectedHeaders.some(header => header !== undefined && header.name === headerName);
        });

        if (selectedHeaders.length !== 0 && !isMissingHeader) {
            const selectedCol = selectedHeaders.filter(header => header !== undefined && header.name !== 'None');
            const newData = originalData.map(row => {
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
                                    return ''; 
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

                const sourceIndex = selectedHeaders.findIndex(header => header && header?.name === 'Source');
                if (sourceIndex !== -1 && !/CORE20/.test(row[sourceIndex])) {
                    newWarningMessage = t('sourceColumnWrong');
                    isFailed = true;
                }

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
        setIsimported(true);
        handleIsCrawling(true);
        handleImport(formatedData, formatedHeaders);
        navigate('/admin/import_conference');
        closeAllModal();
        handleShowImportModal(false);
    };

    const renderTableHeader = (headersName, isSelect) => {
        return (
            <tr>
                {headersName.map((header, index) => (
                    <th key={index}>
                        {isSelect ? (
                            <Form.Select
                                value={selectedHeaders[index]?.name || ''}
                                onChange={(e) => handleSelectHeader(e.target.value, index)}
                                className='fw-bold'
                                style={{ width: "auto" }}
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
                        ) : (
                            <div>{header}</div>
                        )}
                    </th>
                ))}
            </tr>
        );
    };

    const renderTableBody = (tableData, currentPage, pageCount) => {
        return tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`}>
                        {typeof cell === 'string' ? convertCodesToNames(cell) : cell}
                    </td>
                ))}
            </tr>
        ));
    };

    return (
        <div className='w-100'>
            <Carousel activeIndex={activePage} onSelect={() => { }} controls={false} interval={null} indicators={false}>
                {/* Trang hiển thị dữ liệu gốc */}
                <Carousel.Item key={1}>
                    <div className="overflow-y-auto" style={{ maxHeight: "75%" }}>
                        <Table striped bordered hover responsive>
                            <thead>
                                {renderTableHeader(dataUpload.headers, true)}
                            </thead>
                            <tbody>
                                {renderTableBody(currentPagedDataUpload, currentPageOriginal, Math.ceil(originalData.length / 5))}
                            </tbody>
                        </Table>
                    </div>
                    <ReactPaginate
                        nextLabel=">"
                        previousLabel="<"
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(originalData.length / 5)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClickOriginal}
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

                {/* Trang hiển thị dữ liệu đã format */}
                <Carousel.Item key={2}>
                    <div className="mh-75">
                        <Table striped bordered hover responsive>
                            <thead>
                                {renderTableHeader(formatedHeaders, false)}
                            </thead>
                            <tbody>
                                {renderTableBody(currentPageFormatedData, currentPageFormatted, Math.ceil(formatedData.length / 8))}
                            </tbody>
                        </Table>
                    </div>
                    <ReactPaginate
                        nextLabel=">"
                        previousLabel="<"
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(formatedData.length / 8)}
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
                    <div className="text-warning-emphasis">{warningMessage}</div>
                )}
                {isImported && warningMessage !== '' && (
                    <div className={status ? "text-success" : "text-danger"}>
                        {warningMessage}
                    </div>
                )}

                <Button
                    disabled={activePage === 0}
                    onClick={() => setActivePage(0)}
                    className='bg-secondary text-white mx-2 px-4 border-light text-nowrap'
                >
                    {t('back')}
                </Button>
                {activePage === 1 ? (
                    <Button
                        className='bg-primary-normal text-white mx-2 px-4 border-light'
                        onClick={handleImportFile}
                    >
                        {t('import_file')}
                    </Button>
                ) : (
                    <Button
                        className='bg-primary-normal text-white mx-2 px-4 border-light text-nowrap'
                        onClick={handleNext}
                    >
                        {t('next')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ImportedDataTable;