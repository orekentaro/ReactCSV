import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  })

  export type AlertType = {
    open: boolean,
    type: AlertColor,
    handleClose: any,
    message: string
  }

  const CustomizedSnackbars = (props: AlertType) => {
  const { open, handleClose, type, message } = props;
  return(
    <Snackbar
    open={open}
    autoHideDuration={60000}
    onClose={handleClose}>
      <Alert severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default CustomizedSnackbars