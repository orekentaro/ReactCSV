import * as React from 'react'
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import CustomizedSnackbars, {AlertType} from './CustomizedSnackbars';
import { parse } from 'papaparse'
import TransferList from './TransferList';


function CSVDropZone() {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setStatus({ ...status, open: false })
  }
  const [csvHeader, setCsvHeader] = React.useState<string[]>([]);
  const [csvData, setCsvData] = React.useState<string>()

  const [status, setStatus] = React.useState<AlertType>({
    open: false,
    type: "success",
    handleClose: handleClose,
    message: "成功しました。"
  });

  const onDrop = useCallback((acceptedFiles: any) => {
    if(acceptedFiles.length > 1){
      setStatus({ open: true, type: 'error',handleClose: handleClose, message: '同時に加工できるファイルは一つです。' });
    }
    else if(acceptedFiles[0].type !== 'text/csv'){
      setStatus({ open: true, type: 'error',handleClose: handleClose, message: 'ファイルタイプがCSVではありません。' });
    }
    else {
      readCsv(acceptedFiles[0]).then(header => {
        setCsvHeader(header[0])
      });
      csvToJson(acceptedFiles[0]).then(jsonData => {
        setCsvData(jsonData)
      })
      setStatus({ open: true, type: 'success',handleClose: handleClose, message: 'データセットを押してね！' });
    }
  }, [])

  function readCsv(file: string) {
    return new Promise<string[][]>((resolve, reject) => {
      parse(file, {
        complete: (results: any) => {
          resolve(results.data);
        }
      });
    });
  }

  function csvToJson(file:string){
    return new Promise<string>((resolve) =>{
      parse(file, {
        header: true,
        delimiter:',',
        complete:(json: any) =>{
          resolve(json.data)
        },
      });
    });
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p className="dropzone">ここでドロップしてね ...</p> :
            <p className="dropzone">加工したいCSVをドラッグ&ドロップするか、クリックしてファイルを選択してね！</p>
        }
      </div>
      <CustomizedSnackbars
        open={status.open}
        handleClose={handleClose}
        type={status.type}
        message={status.message}
        />
      <div>
        <TransferList
          csvHeader={csvHeader}
        />
      </div>
    </div>

  )
}

export default CSVDropZone