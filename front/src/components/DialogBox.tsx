import React, { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  Slide,
  Typography,
  IconButton,
  CssBaseline,
  useTheme,
  makeStyles
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close as CloseIcon } from '@material-ui/icons';
import useStyles from 'src/utils/styles';
import type { Theme } from 'src/theme';

const newStyles = makeStyles((theme: Theme) => ({
  dialogBox: {
    '& > div > div': {
      border: `2px solid ${theme.palette.border.main}`,
      borderRadius: '8px'
    }
  }
}))

interface DialogBoxProps {
  id?: string;
  isOpen: boolean;
  title: string;
  className?: any;
  children?: any;
  style?: any;
  classes?: any;
  onClose: (event?: any) => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const DialogBox: FC<DialogBoxProps> = ({
  id,
  title,
  isOpen,
  className,
  classes,
  children,
  style,
  onClose
}) => {
  const styles = useStyles();
  const newClasses = newStyles();
  const theme = useTheme<Theme>();

  return (
    <Dialog
      id={id ?? ''}
      open={isOpen}
      TransitionComponent={Transition}
      onClose={onClose}
      classes={classes ?? className}
      className={newClasses.dialogBox}
      style={style}
    >
      <CssBaseline />
      <MuiDialogTitle
        style={{
          margin: 0,
          padding: '8px 16px',
          backgroundColor: theme.palette.border.main,
          color: "white",
          alignItems: "center",
        }}
      >
        <Typography component="strong" variant="h4">
          {title}
        </Typography>
        <IconButton
          aria-label="Close"
          className={styles.dialogCloseBtn}
          style={{ color: theme.palette.background.light }}
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent
        style={{ backgroundColor: theme.palette.background.light }}
        className={className}
        classes={classes}
        dividers={true}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
