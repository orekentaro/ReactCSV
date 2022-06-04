import * as React from 'react'
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import CustomizedSnackbars, {AlertType} from './CustomizedSnackbars';

function CSVDropZone() {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setStatus({ ...status, open: false })
  }

  const [status, setStatus] = React.useState<AlertType>({
    open: false,
    type: "success",
    handleClose: handleClose,
    message: "成功しました。"
  });

  const onDrop = useCallback((data: any) => {
    // Do something with the files
    if(data[0].type !== 'text/csv'){
      console.log('OK')
      setStatus({ open: true, type: 'error',handleClose: handleClose, message: 'ファイルタイプがCSVではありません。' });
    }
  }, [])

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