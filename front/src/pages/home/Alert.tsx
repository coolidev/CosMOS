import { forwardRef, ReactElement, Ref, FC } from 'react';
import {
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Slide,
  makeStyles,
  Theme,
  colors
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiBackdrop-root': {
      backgroundColor: colors.grey[800]
    }
  },
  content: {
    marginBottom: theme.spacing(6)
  }
}));

interface alertProps {
  browser: string;
}

const Alert: FC<alertProps> = ({ browser }) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.root}
      open={true}
      TransitionComponent={Transition}
      keepMounted
    >
      <CssBaseline />
      <DialogTitle>Incompatible Browser</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.content}>
          Your browser is not currently supported by CART. <br />
          &nbsp;- Detected Browser: <i>{browser}</i>
          <br />
          &nbsp;- Supported Browsers:{' '}
          <i>Google Chrome, Microsoft Edge, Mozilla Firefox</i>
          <br />
          <br />
          If you have any questions or need assistance, please contact us at{' '}
          <a href="mailto:CARThelp@teltrium.com">CARThelp@teltrium.com</a>.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default Alert;
