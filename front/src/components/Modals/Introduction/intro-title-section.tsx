import React from 'react';
import { Typography, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import useStyles from 'src/utils/styles';
import { Theme } from 'src/theme';

const customStyle = makeStyles((theme: Theme) => ({
  title: {
    margin: 0,
    padding: theme.spacing(2, 4),
    backgroundColor: theme.palette.border.main,
    color: "white"
  },
  close: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.background.light,
    zIndex: 100
  },
}))

function IntroTitleSection(props) {
  const { children, onClose } = props;
  const classes = customStyle();

  return (
    <MuiDialogTitle disableTypography className={classes.title}>
      <Typography component="strong" variant="h4">
        {children}
      </Typography>
      {!props.isPanel && (
        <IconButton
          aria-label="close"
          className={classes.close}
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      )}
    </MuiDialogTitle>
  );
}

export default IntroTitleSection;
