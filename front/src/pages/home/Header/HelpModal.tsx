import { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Link,
  Button,
  makeStyles,
  Theme,
  Dialog
} from '@material-ui/core';

interface HelpModalProps {
  open: boolean;
  onOpen: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: theme.spacing(100) + 'px !important',
    minHeight: theme.spacing(60) + 'px !important',
    maxWidth: theme.spacing(100) + 'px !important',
    maxHeight: theme.spacing(60) + 'px !important',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem'
  },
  tab: {
    color: '#fff',
    '&:hover': {
      color: '#aaa'
    },
    width: theme.spacing(40),
    position: 'absolute',
    verticalAlign: 'middle',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    bottom: '5%',
    left: theme.spacing(30)
  }
}));

const HelpModal: FC<HelpModalProps> = ({ open, onOpen }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onOpen}
      classes={{ paper: classes.root }}
    >
      <Typography variant="h1" component="h2" align="center">
        Need Help?
      </Typography>
      <br />
      <Typography variant="subtitle1" align="center">
        Have a question or need assistance using CART?
      </Typography>
      <br />
      <Typography align="center" variant="h6">
        Email us at:
        <br />
        <Link href="mailto:CARThelp@teltrium.com">CARTHelp@teltrium.com</Link>
      </Typography>
      <Button
        className={classes.tab}
        color="primary"
        variant="contained"
        size="large"
        onClick={onOpen}
      >
        OK
      </Button>
    </Dialog>
  );
};

HelpModal.propTypes = {
  open: PropTypes.bool,
  onOpen: PropTypes.func
};

export default HelpModal;
