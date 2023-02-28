/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import {
  Backdrop,
  LinearProgress,
  makeStyles,
  Theme,
  colors,
  Paper,
  Grid,
  Typography,
  Box
} from '@material-ui/core';

interface LoadingOverlayProps {
  isLoading: boolean;
  status: string;
  progress: number;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  progressBar: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    borderRadius: 5
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  text: {
    color: colors.grey[100],
    fontWeight: 'bold',
    fontSize: theme.typography.pxToRem(15),
    marginLeft: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    borderRadius: 0
  },
  paperComment: {
    padding: theme.spacing(1),
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: 0
  },
}));

const LinearProgressWithLabel = (props) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

const LoadingOverlay: FC<LoadingOverlayProps> = ({
  isLoading,
  status,
  progress
}) => {
  const classes = useStyles();

  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    setProgressPercent(progress);
  },[progress]);

  useEffect(() => {
    if(isLoading){
      setProgressPercent(0);
    }
  },[isLoading]);

  return (
    <>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={4} >
            <Paper className={classes.paper}>
              {status.length > 0 ? status : 'Loading...'}
              <div className={classes.progressBar}>
                {progressPercent>0
                  ?<LinearProgressWithLabel value={progressPercent} />
                  :<LinearProgress/>
                }
              </div>
            </Paper>
          </Grid>        
        </Grid>
      </Backdrop>
    </>
  );
};

export default LoadingOverlay;