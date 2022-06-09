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
import LoadingBackdrop from './LoadingBackdrop';
import axios from 'axios'


function CSVDropZone() {
  const [csvHeader, setCsvHeader] = React.useState<string[]>([]);
  const [csvData, setCsvData] = React.useState<any>()
  const [sendHeader, setSendHeader] = React.useState<string[]>([])
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [backdropOpen, setBackdropOpen] = React.useState<boolean>(false);
  const [checkBoxData, setCheckBoxData] = React.useState<string[]>(["CSV"]);

  const handleCloseMessage = () => {
    setMessageStatus({ ...messageStatus, open: false })
  }

  const [messageStatus, setMessageStatus] = React.useState<AlertType>({
    open: false,
    type: "success",
    handleClose: handleCloseMessage,
    message: "成功しました。"
  });

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleToggleBackdrop = () => {
    setBackdropOpen(!open);
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    if(acceptedFiles.length > 1){
      setMessageStatus({ open: true, type: 'error',handleClose: handleCloseMessage, message: '同時に加工できるファイルは一つです。' });
    }
    else if(acceptedFiles[0].type !== 'text/csv'){
      setMessageStatus({ open: true, type: 'error',handleClose: handleCloseMessage, message: 'ファイルタイプがCSVではありません。' });
    }
    else {
      readCsv(acceptedFiles[0]).then(header => {
        setCsvHeader(header[0])
      });
      setCsvData(acceptedFiles[0])
      setMessageStatus({ open: true, type: 'success',handleClose: handleCloseMessage, message: 'データセットを押してね！' });
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
    setDialogOpen(true);
  }

  const handleCloseDialogAndSend = () => {
    interface SubmitData {
      header: string[],
      csvData: Blob,
      outputType: string[]
    }
    interface TypeSafeFormData extends FormData {
      append<T extends string | Blob | string[]>(name: keyof SubmitData, value: T, fileName?: string): void;
    }
    var formData = new FormData() as TypeSafeFormData
    formData.append('header', sendHeader)
    formData.append('csvData', csvData, "data.csv")
    formData.append('outputType', checkBoxData)

    setBackdropOpen(true)

    axios.post('http://localhost:8080/makeData', formData)
        .then(res => {
          console.log(res)
          //ダウンロードするCSVファイル名を指定する
          const filename = "download.csv";
          //CSVデータ
          const data = res.data;
          //BOMを付与する（Excelでの文字化け対策）
          const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
          //Blobでデータを作成する
          const blob = new Blob([bom, data], { type: "text/csv" });
          //BlobからオブジェクトURLを作成する
          const url = (window.URL || window.webkitURL).createObjectURL(blob);
          //ダウンロード用にリンクを作成する
          const download = document.createElement("a");
          //リンク先に上記で生成したURLを指定する
          download.href = url;
          //download属性にファイル名を指定する
          download.download = filename;
          //作成したリンクをクリックしてダウンロードを実行する
          download.click();
          //createObjectURLで作成したオブジェクトURLを開放する
          (window.URL || window.webkitURL).revokeObjectURL(url);
        }).catch(e => {
          console.log(e)
        }).finally(() => {
      setMessageStatus({ open: true, type: 'success',handleClose: handleCloseMessage, message: 'データの加工が完了したよ！' });
      setBackdropOpen(false)
        })
    setDialogOpen(false);
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
        open={messageStatus.open}
        handleClose={handleCloseMessage}
        type={messageStatus.type}
        message={messageStatus.message}
        />
      <div>
        <TransferList
          csvHeader={csvHeader}
          setSendHeader={setSendHeader}
          sendButton={submitButtonClick}
        />
      </div>
      <Dialog
        open={dialogOpen}
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
      <LoadingBackdrop
        open={backdropOpen}
        handleClose={handleToggleBackdrop}
        />
    </div>
  )
}

export default CSVDropZone