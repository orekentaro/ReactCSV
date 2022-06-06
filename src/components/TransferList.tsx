import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/Send';
import CustomizedSnackbars, {AlertType} from './CustomizedSnackbars';

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

type Props = {
  csvHeader: string[],
  setSendHeader: Function,
  sendButton: Function
}

const TransferList = (props: Props) => {
  const {csvHeader} = props
  const [checked, setChecked] = React.useState<readonly string[]>([]);
  const [left, setLeft] = React.useState<readonly string[]>([]);
  const [right, setRight] = React.useState<readonly string[]>([]);
  const [sendFlag, setSendFlag] = React.useState<boolean>(true);

  const handleClose = () => {
    setStatus({ ...status, open: false })
  }

  const [status, setStatus] = React.useState<AlertType>({
    open: false,
    type: "success",
    handleClose: handleClose,
    message: "必要なカラムを選択して右に送ってね！"
  });

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const sendFlagCheck = () => {
    if(sendFlag){
      setStatus({...status, open: true, message: '選択し終わったら送信ボタンを押してね！'})
      setSendFlag(false)
    }
  }

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
    sendFlagCheck()
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    sendFlagCheck()
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const setData = () => {
    setLeft(csvHeader)
    setRight([])
    setStatus({...status, open:true})
    setSendFlag(true)
  }

  const submitData = () => {
    props.setSendHeader(right)
    props.sendButton()
  }

  const customList = (items: readonly string[]) => (
    <Paper elevation={2} sx={{ width: 400, height: 450, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value: string, index: number) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={items[index]} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <div>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>{customList(left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button 
              sx={{ my: 0.5 }}
              onClick={setData}
              disabled={csvHeader.length === 0}
              variant="contained"
              color="success"
              >
              データセット
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
            <Button 
              variant="contained"
              endIcon={<SendIcon />}
              disabled={right.length === 0}
              onClick={submitData}
              >
              送信
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList(right)}</Grid>
      </Grid>
      <CustomizedSnackbars
        open={status.open}
        handleClose={handleClose}
        type={status.type}
        message={status.message}
        />
    </div>
  );
}

export default TransferList