import React from 'react';
import { Typography, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import useStyles from 'src/utils/styles';

function IntroTitleSection(props) {
  const { children, onClose } = props;
  const classes = useStyles();

  return (
    <MuiDialogTitle disableTypography>
      <Typography component="strong" variant="h4">
        {children}
      </Typography>
      {!props.isPanel && (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      )}
    </MuiDialogTitle>
  );
}

export default IntroTitleSection;
