import * as React from 'react'
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import CustomizedSnackbars, {AlertType} from './CustomizedSnackbars';
import Papa, { parse } from 'papaparse'


function CSVDropZone() {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setStatus({ ...status, open: false })
  }
  const [parsedCsvData, setParsedCsvData] = React.useState([]);

  const [status, setStatus] = React.useState<AlertType>({
    open: false,
    type: "success",
    handleClose: handleClose,
    message: "成功しました。"
  });

  const onDrop = useCallback((acceptedFiles: any) => {
    // if(acceptedFiles[0].type !== 'text/csv'){
    //   setStatus({ open: true, type: 'error',handleClose: handleClose, message: 'ファイルタイプがCSVではありません。' });
    // } else {
    // }
    readCsv(acceptedFiles[0]).then(res => {
      console.log(res);
    });
  }, [])

  function readCsv(file: string) {
    return new Promise<string>((resolve, reject) => {
      parse(file, {
        complete: (results: any) => {
          resolve(results.data);
        }
      });
    });
  }


  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p className="dropzone">ここでドロップしてね ...</p> :
          <p className="dropzone">加工したいCSVをドラッグ&ドロップするか、クリックしてファイルを選択してね！</p>
      }
      <CustomizedSnackbars
      open={status.open}
      handleClose={handleClose}
      type={status.type}
      message={status.message}
      />
    </div>
  )
}

export default CSVDropZone