import { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Link,
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  useTheme,
  Grid,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { Theme } from 'src/theme';
import { Close as CloseIcon, Info as InfoIcon } from '@material-ui/icons';

interface HelpModalProps {
  open: boolean;
  onOpen: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: theme.spacing(120) + 'px !important',
    // minHeight: theme.spacing(60) + 'px !important',
    maxWidth: theme.spacing(120) + 'px !important',
    // maxHeight: theme.spacing(60) + 'px !important',
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
  },
  title: {
    margin: 0,
    padding: theme.spacing(1, 4),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    display: 'flex',
    alignItems: 'center',
  },
  dialogStyle: {
    '& > div > div': {
      border: `2px solid ${theme.palette.border.main}`,
      borderRadius: '8px',
      backgroundColor: theme.palette.background.light
    }
  },
}));

const HelpModal: FC<HelpModalProps> = ({ open, onOpen }) => {
  const theme = useTheme<Theme>();
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onOpen}
      classes={{ paper: classes.root }}
      className={classes.dialogStyle}
    >
      <DialogTitle
        disableTypography
        className={classes.title}
      >
        <Typography
          variant="h4"
          component="span"
          style={{ fontWeight: 'normal', color: 'white' }}
        >
          Need Help?
        </Typography>
        <div className='ml-auto' />
        <IconButton size="small" onClick={onOpen}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ backgroundColor: theme.palette.component.main }}>
        <Grid container className='py-2 text-left'>
          <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center' }}>
            <InfoIcon style={{ color: theme.palette.border.main, width: '100%', height: '6rem' }} />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={9}>
            <Grid container style={{ alignItems: 'center', height: '100%' }}>
              <DialogContentText style={{ color: theme.palette.text.primary }}>
                <Typography variant="body1">
                  Have a question or need assistance using CoSMOS?
                </Typography>
                <br />
                <Typography variant="body1">
                  <b>Email us at: </b><Link href="mailto:CARThelp@teltrium.com">CARTHelp@teltrium.com</Link>
                </Typography>
              </DialogContentText>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main, padding: theme.spacing(2, 4), gap: theme.spacing(4) }}>
        <Button onClick={onOpen} color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

HelpModal.propTypes = {
  open: PropTypes.bool,
  onOpen: PropTypes.func
};

export default HelpModal;
