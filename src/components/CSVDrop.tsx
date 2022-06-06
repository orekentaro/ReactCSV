import * as React from 'react'
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import CustomizedSnackbars, {AlertType} from './CustomizedSnackbars';
import { parse } from 'papaparse'
import TransferList from './TransferList';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function CSVDropZone() {
  const handleClose = () => {
    setStatus({ ...status, open: false })
  }
  const [csvHeader, setCsvHeader] = React.useState<string[]>([]);
  const [csvData, setCsvData] = React.useState<any>()
  const [sendHeader, setSendHeader] = React.useState<string[]>([])
  const [open, setOpen] = React.useState<boolean>(false);
  const [checkBoxData, setCheckBoxData] = React.useState<string[]>(["CSV"]);

  const [status, setStatus] = React.useState<AlertType>({
    open: false,
    type: "success",
    handleClose: handleClose,
    message: "成功しましたrea。"
  });

  const handleCloseDialog = () => {
    setOpen(false);
  };

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
      setCsvData(acceptedFiles[0])
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

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const submitButtonClick = () => {
    setOpen(true);
  }

  const handleCloseDialogAndSend = () => {
    console.log(sendHeader)
    console.log(csvData)
    console.log(checkBoxData)
    setOpen(false);
    setCheckBoxData(['CSV'])
  }

  const clickCsvCheck = () => {
    checkBoxResult('CSV')
  }

  const clickJsonCheck = () => {
    checkBoxResult('JSON')
  }

  const checkBoxResult = (dataStyle: string) => {
    if (!checkBoxData.includes(dataStyle)){
      checkBoxData.push(dataStyle)
    } else {
      setCheckBoxData(checkBoxData.filter((element) => element !== dataStyle ))
    }
  }

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
          setSendHeader={setSendHeader}
          sendButton={submitButtonClick}
        />
      </div>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"どの形式のデータで出力しますか？"}
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                defaultChecked
                onChange={clickCsvCheck}
                />
              } label="CSV"/>
            <FormControlLabel control={
              <Checkbox
                onChange={clickJsonCheck}
              />
              } label="JSON"/>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button onClick={handleCloseDialogAndSend} autoFocus>
            送信
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CSVDropZone