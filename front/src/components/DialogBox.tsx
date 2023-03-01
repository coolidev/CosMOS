import React, { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  Slide,
  Typography,
  IconButton,
  CssBaseline,
  useTheme
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close as CloseIcon } from '@material-ui/icons';
import useStyles from 'src/utils/styles';
import type { Theme } from 'src/theme';

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
  const theme = useTheme<Theme>();

  return (
    <Dialog
      id={id ?? ''}
      open={isOpen}
      TransitionComponent={Transition}
      onClose={onClose}
      classes={classes ?? className}
      style={style}
    >
      <CssBaseline />
      <MuiDialogTitle
        style={{
          margin: 0,
          padding: '16px',
          backgroundColor: theme.palette.primary.light
        }}
      >
        <Typography component="strong" variant="h4">
          {title}
        </Typography>
        <IconButton
          aria-label="Close"
          className={styles.dialogCloseBtn}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent
        style={{ backgroundColor: theme.palette.background.paper }}
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
