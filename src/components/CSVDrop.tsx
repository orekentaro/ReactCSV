import * as React from 'react'
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert'

function CSVDropZone() {

  type alertType = {
    open: boolean,
    type: AlertColor,
    message: string
  }

  const [status, setStatus] = React.useState<alertType>({
    open: false,
    type: "success",
    message: "成功しました。"
  });

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
    ) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    })

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      setStatus({ ...status, open: false })
  }

  const onDrop = useCallback((data: any) => {
    // Do something with the files
    if(data[0].type !== 'text/csv'){
      console.log('OK')
      setStatus({ open: true, type: 'error', message: 'ファイルタイプがCSVではありません。' });
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
      <Snackbar
        open={status.open}
        autoHideDuration={60000}
        onClose={handleClose}>
          <Alert onClose={handleClose} severity={status.type} sx={{ width: '100%' }}>
            {status.message}
          </Alert>
      </Snackbar>
    </div>
  )
}

export default CSVDropZone