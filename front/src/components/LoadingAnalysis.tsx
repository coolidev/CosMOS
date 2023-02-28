/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import {
  Backdrop,
  LinearProgress,
  makeStyles,
  colors,
  Paper,
  Grid,
  CircularProgress,
  Box,
  Button,
} from '@material-ui/core';
import { State } from 'src/pages/home';
import CheckIcon from '@material-ui/icons/Check';
import { useSelector } from 'src/store';
import axios from 'src/utils/axios';
import { Theme } from 'src/theme';

interface LoadingOverlayProps {
  isLoading: boolean;
  status: string;
  state: State;
  onState: any;
  progress: number;
  analyticsPct: number;
  perfPct: number;
  comparePct: number;
  linkPct: number;
  hideLoading: boolean;
  setHideLoading: any;
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
  hide: {
    display: 'none'
  },
  text: {
    color: colors.grey[100],
    fontWeight: 'bold',
    fontSize: theme.typography.pxToRem(16),
    marginLeft: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.primary,
    fontSize: '24px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    alignItems: 'center',
    backgroundColor: theme.palette.background.main,
    borderRadius: 0,
    marginBottom: '20px'
  },
  paperComment: {
    padding: theme.spacing(4),
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    borderRadius: 0,
    backgroundColor: theme.palette.background.main,
  },
  paperStatus: {
    padding: theme.spacing(1),
    fontStyle: 'bold',
    fontSize: 14,
    alignContent: 'left',
    color: theme.palette.text.primary,
    borderRadius: 0,
    backgroundColor: theme.palette.background.main,
  },
  icon: {
    color: colors.green[500]
  },
  box: {
    backgroundColor: theme.palette.background.paper,
    //borderRadius: "8px 8px 8px 8px",
    border: `1px solid ${theme.palette.border.main}`,
    overflow: 'hidden',
  }
}));

const LoadingAnalysis: FC<LoadingOverlayProps> = ({
  isLoading,
  status,
  state,
  onState,
  progress,
  analyticsPct,
  perfPct,
  comparePct,
  linkPct,
  hideLoading,
  setHideLoading
}) => {
  const classes = useStyles();
  
  const [progressPercent, setProgressPercent] = useState(0);
  const [analyticsPercent, setAnalyticsPercent] = useState(0);
  const [performancePercent, setPerformancePercent] = useState(0);
  const [comparePercent, setComparePercent] = useState(0);
  const [linkPercent, setLinkPercent] = useState(0);

  const { zoom } = useSelector((state) => state.zoom);


  // useEffect(() => {
  //   if(Math.abs(progressPercent-progress)>25)
  //     return;
  //   setProgressPercent(progress);
  // },[progress]);

  useEffect(() => {
    setHideLoading(false);
  }, [])

  useEffect(() => {
    if(progress % 25 === 0){
      let pct = 0;
      if(!state.performanceLoading){
        pct += 50;
      }
      if(!state.analyticsLoading){
        pct += 25;
      }
      if(!state.comparisonLoading){
        pct += 25;
      }
      if(pct === 0 || pct > progressPercent){
        setProgressPercent(pct);
      }
    }
  },[state.performanceLoading, state.analyticsLoading, state.comparisonLoading]);

  useEffect(() => {
    if(progress === 0 || progress > progressPercent){
      setProgressPercent(progress);
    }
  },[progress]);

  useEffect(() => {
    if(isLoading){
      setProgressPercent(0);
      setAnalyticsPercent(0);
      setPerformancePercent(0);
      setComparePercent(0);
      setLinkPercent(0);
    }
  },[isLoading]);

  useEffect(() => {
    setAnalyticsPercent(analyticsPct);
  },[analyticsPct]);

  useEffect(() => {
    setPerformancePercent(perfPct);
  },[perfPct]);

  useEffect(() => {
    setComparePercent(comparePct);
  },[comparePct]);

  useEffect(() => {
    setLinkPercent(linkPct);
  },[linkPct]);

  const eliminate = async () => {
    setHideLoading(true);
    onState('loadingStopped', true);
    let aIds = await axios.post('/getAnalysesForUser',{userId:'testuser'});
    if(aIds && aIds.data && Array.isArray(aIds.data)) {
      aIds.data.forEach(e => {
        axios.post('/killAnalysisForUser',{userId:'testuser',analysisId:e.analysisId});
      });
    } else {
      console.error(`Encountered error cancelling analyses.`)
    }
  };

  return (
    <>
      <Backdrop className={hideLoading? classes.hide: classes.backdrop} open={isLoading}>
        <Grid container  justifyContent='center'>
          <Grid item style={{minWidth: ((window.screen.availHeight / zoom) * 0.4), minHeight: ((window.screen.availHeight / zoom) * 0.5)}} xs={2} className = {classes.box}>
            <Paper className={classes.paper}>{status?.length>0?status:'Running Analysis...'}</Paper>
            <Box width="100%" mr={1} mt={3}>
              <LinearProgress variant={"determinate"} value={progressPercent}/>
            </Box>
            <Paper className={classes.paperComment}>
              <br/>
              <Grid
                container
                justifyContent="flex-start"
                alignContent="flex-start"
                spacing={2}
              >
                <Grid item xs = {12}>
                  <Button
                    style={{borderRadius: '8px', float: 'right'}}
                    onClick = {() => {
                      setHideLoading(true);
                    }}
                    variant="contained" 
                    color="primary">
                      Hide Window
                  </Button>
                </Grid>
                <Grid item md={12} className={classes.paperStatus}>
                  <Box>
                  <div className={classes.paperStatus}>{'Analysis '}
                  {state.analyticsLoading?
                  <CircularProgress 
                    variant={analyticsPercent===0?"indeterminate":"determinate"}
                    size={20}
                    thickness={8}
                    value={analyticsPercent??100}
                  />:<CheckIcon fontSize="small" className={classes.icon} />
                  }</div>
                  </Box>
                </Grid>
                <Grid item md={12} className={classes.paperStatus}>
                  <Box>
                    <div className={classes.paperStatus}>{'Performance '}
                    {state.performanceLoading?
                    <CircularProgress 
                      variant={performancePercent===0?"indeterminate":"determinate"}
                      size={20}
                      thickness={8}
                      value={performancePercent??100}
                    />:<CheckIcon fontSize="small" className={classes.icon} />
                    }</div>
                  </Box>
                </Grid>
                <Grid item md={12} className={classes.paperStatus}>
                  <Box>
                    <div className={classes.paperStatus}>{'Link Budget '}
                    {state.performanceLoading?
                    <CircularProgress 
                      variant={linkPercent===0?"indeterminate":"determinate"}
                      size={20}
                      thickness={8}
                      value={linkPercent??100}
                    />:<CheckIcon fontSize="small" className={classes.icon} />
                    }</div>
                  </Box>
                </Grid>
                <Grid item md={12} className={classes.paperStatus}>
                  <Box>
                  <div className={classes.paperStatus}>{'Comparison '}
                  {state.comparisonLoading?
                  <CircularProgress 
                    variant={comparePercent===0?"indeterminate":"determinate"}
                    size={20}
                    thickness={8}
                    value={comparePercent??100}
                  />:<CheckIcon fontSize="small" className={classes.icon} />
                  }</div>
                  </Box>
                </Grid>
                <Grid item md = {12}/>
                <Grid item md = {12}>
                  <Button
                    style={{ borderRadius: '8px'}}
                    onClick = {() => {
                      eliminate();
                    }}
                    variant="contained" 
                    color="primary">
                      Stop Analysis
                  </Button>
                </Grid>
              </Grid>
            <hr/>
            {'* Please be patient as the results are computed.'}
            </Paper>
          </Grid>        
        </Grid>
      </Backdrop>
    </>
  );
};

export default LoadingAnalysis;