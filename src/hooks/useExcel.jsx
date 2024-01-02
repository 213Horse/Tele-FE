import * as XLSX from 'xlsx';
import { useState, useEffect, useCallback } from 'react';

export function useExcel() {
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);
  const [openExcel, setOpenExcel] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const fileType = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const handleFile = useCallback(
    (e) => {
      let selectedFile = e.target.files[0];
      if (selectedFile) {
        if (selectedFile && fileType.includes(selectedFile.type)) {
          let reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile);
          reader.onload = (e) => {
            setExcelFileError(null);
            setExcelFile(e.target.result);
          };
        } else {
          setExcelFileError('Vui lòng chọn file excel');
          setExcelFile(null);
        }
      } else {
        console.log('Chọn file');
      }
    },
    [excelFile],
  );

  useEffect(() => {
    setOpenExcel(false);
    if (excelFile) {
      const workbook = XLSX.read(excelFile, {
        type: 'buffer',
      });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      setExcelData(data);
      setOpenExcel(true);
    }
  }, [excelFile]);

  return [
    handleFile,
    excelFileError,
    excelData,
    setExcelFile,
    setOpenExcel,
    openExcel,
    excelFile,
    setExcelData,
  ];
}
