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
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { useSelector } from 'src/store';
import axios from 'src/utils/axios';
import { State } from 'src/pages/home';
import { Theme } from 'src/theme';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

interface LoadingSPOverlayProps {
  isLoading: boolean;
  status: string;
  onState: any;
  progress: number;
  orbitPropPct: number;
  geoRFVisibilityPct: number;
  statAnalysisPct: number;
  dataFetchPct: number;
  socketMessage: string;
  hideLoading: boolean;
  setHideLoading: any;
  state: State;
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
  hide: {
    display: 'none'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
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
  },
  paperStatus: {
    padding: theme.spacing(1),
    fontStyle: 'bold',
    fontSize: 14,
    alignContent: 'left',
    color: theme.palette.text.primary,
    borderRadius: 0
  },
  icon: {
    color: colors.green[500]
  },
  console: {
    maxHeight: '90px',
    minHeight: '90px', 
    fontSize: '10px', 
    textAlign: 'left', 
    overflowY: 'scroll', 
    display: 'flex', 
    flexDirection: 'column-reverse',
    backgroundColor: '#000000',
    //borderRadius: '8px',
    color: '#FFFFFF',
    padding: theme.spacing(1),
  },
  box: {
    //borderRadius: "8px 8px 8px 8px",
    border: `1px solid ${theme.palette.border.main}`,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  interiorBox: {
    backgroundColor: "inheret"
  },
}));

const LoadingSPAnalysis: FC<LoadingSPOverlayProps> = ({
  isLoading,
  status,
  progress,
  orbitPropPct,
  geoRFVisibilityPct,
  statAnalysisPct,
  dataFetchPct,
  socketMessage,
  hideLoading,
  setHideLoading,
  onState,
  state
}) => {
  const classes = useStyles();
  
  //percentage done a given section is
  const [progressPercent, setProgressPercent] = useState(0);
  const [orbitPropPercent, setOrbitPropPercent] = useState(0);
  const [geoRFVisibilityPercent, setGeoRFVisibilityPercent] = useState(0);
  const [statAnalysisPercent, setStatAnalysisPercent] = useState(0);
  const [dataFetchPercent, setDataFetchPercent] = useState(0);

  //if a given section is done variables
  const [orbitPropDone, setOrbitPropDone] = useState(false);
  const [geoRFVisibilityDone, setGeoRFVisibilityDone] = useState(false);
  const [statAnalysisDone, setStatAnalysisDone] = useState(false);
  const [dataFetchDone, setdataFetchDone] = useState(false);

  const[detailsOn, setDetailsOn] = useState(false);
  const[detailedStatus, setDetailedStatus] = useState('>Starting...\n\n');
  const[detailedPercentage, setDetailedPercentage] = useState('');

  const[stopAnalysis, setStopAnalysis] = useState<boolean>(false);

  const { zoom } = useSelector((state) => state.zoom);

  const eliminate = async () => {

    let aIds = await axios.post('/getAnalysesForUser',{userId:'testuser'})
    if(aIds && aIds.data && Array.isArray(aIds.data)) {
      aIds.data.forEach(e => {
        axios.post('/killAnalysisForUser',{userId:'testuser',analysisId:e.analysisId});
      });
    } else {
      console.error(`Encountered error cancelling analyses.`)
    }
  };

  const stopAnalysisFunc = () => {
    setStopAnalysis(true);
  }

  useEffect(() => {
    if(stopAnalysis){
      eliminate()
    }
  }
  ,[stopAnalysis])
  useEffect(() => {
    setHideLoading(false);
  }, [])
  //change the progress if it is progressing
  useEffect(() => {
    if(progress === 0 || progress > progressPercent){
      setProgressPercent(progress);
    }
  },[progress]);

  //set everything to zero at the start
  useEffect(() => {
    if(isLoading){
      setProgressPercent(0);
      setOrbitPropPercent(0);
      setGeoRFVisibilityPercent(0);
      setStatAnalysisPercent(0);
      setDataFetchPercent(0);

      setOrbitPropDone(false);
      setGeoRFVisibilityDone(false);
      setStatAnalysisDone(false);
      setdataFetchDone(false);

      setDetailedStatus('>Starting...\n');
      setDetailedPercentage('>Starting...\n');
    }
  },[isLoading]);


  //set the coresponding percent to change when the input changes. If its at 100, mark it as done
  useEffect(() => {
    setOrbitPropPercent(orbitPropPct);
    if(!orbitPropDone){
      setOrbitPropDone(orbitPropPct === 100);
    }
    //for updating the details
    if(!isNaN(orbitPropPct)){
      setDetailedPercentage(detailedStatus + orbitPropPct.toFixed(2) + '%');
    }
  },[orbitPropPct]);

  useEffect(() => {
    setGeoRFVisibilityPercent(geoRFVisibilityPct);
    if(!geoRFVisibilityDone){
      setGeoRFVisibilityDone(geoRFVisibilityPct === 100);
    }
    //for updating the details
    if(!isNaN(geoRFVisibilityPct) && geoRFVisibilityPct < 100){
      setDetailedPercentage(detailedStatus + geoRFVisibilityPct.toFixed(2) + '%');
    }
  },[geoRFVisibilityPct]);

  useEffect(() => {
    setStatAnalysisPercent(statAnalysisPct);
    if(!statAnalysisDone){
      setStatAnalysisDone(statAnalysisPct === 100);
    }
    //for updating the details
    if(!isNaN(statAnalysisPct)){
      setDetailedPercentage(detailedStatus + statAnalysisPct.toFixed(2) + '%');
    }
  },[statAnalysisPct]);

  useEffect(() => {
    setDataFetchPercent(dataFetchPct);
    if(!dataFetchDone){
      setdataFetchDone(dataFetchPct === 100);
    }
    //for updating the details
    if(!isNaN(dataFetchPct)){
      setDetailedPercentage(detailedStatus + dataFetchPct + '%');
    }
  },[dataFetchPct]);

  useEffect(() => {
    setDetailedStatus(detailedStatus + '>' + socketMessage + '\n\n');
  },[socketMessage])

  return (
    <>
      <Backdrop className={hideLoading? classes.hide: classes.backdrop} open={isLoading}>
        <Grid container justifyContent='center'>
          <Grid item style={{minWidth: ((window.screen.availHeight / zoom) * 0.4), minHeight: ((window.screen.availHeight / zoom) * 0.5)}} xs={2} className = {classes.box}>
            <Paper className={classes.paper}>{!stopAnalysis? status?.length>0? status:'Running Analysis...': 'Stopping Analysis...'}</Paper>
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
                  <div className={classes.paperStatus}>{'Orbit Propagator'}
                  {orbitPropDone?
                  <CheckIcon fontSize="small" className={classes.icon} />:
                  <CircularProgress 
                    variant={ "determinate"}
                    size={20}
                    thickness={8}
                    value={orbitPropPercent??100}
                  />
                  }</div>
                  </Box>
                </Grid>
                <Grid item md={12} className={classes.paperStatus}>
                  <Box>
                    <div className={classes.paperStatus}>{'Geometric & RF Analysis'}
                    {geoRFVisibilityDone?
                    <CheckIcon fontSize="small" className={classes.icon} />:
                    <CircularProgress 
                      variant={"determinate"}
                      size={20}
                      thickness={8}
                      value={geoRFVisibilityPercent??100}
                    />
                    }</div>
                  </Box>
                </Grid>
                <Grid item md={12} className={classes.paperStatus}>
                  <Box>
                  <div className={classes.paperStatus}>{'Statistical Analysis'}
                  {statAnalysisDone?
                  <CheckIcon fontSize="small" className={classes.icon} />:
                  <CircularProgress 
                    variant={"determinate"}
                    size={20}
                    thickness={8}
                    value={statAnalysisPercent??100}
                  />
                  }</div>
                  </Box>
                </Grid>
                <Grid item md={12} className={classes.paperStatus}>
                  <Box>
                    <div className={classes.paperStatus}>{'Fetching Data'}
                    {dataFetchDone?
                    <CheckIcon fontSize="small" className={classes.icon} />:
                    <CircularProgress 
                      variant={"determinate"}
                      size={20}
                      thickness={8}
                      value={dataFetchPercent??100}
                    />
                    }</div>
                  </Box>
                </Grid>
                <Grid item md = {12}>
                <Accordion key={'networkSelectionSummary'} className={classes.interiorBox} expanded={detailsOn}>
                  <AccordionSummary id={`networkSelectionSummary`} onClick={() => {setDetailsOn(!detailsOn)}}>
                  {!detailsOn ? (
                          <KeyboardArrowDownIcon fontSize="small" color = "primary"/>
                          ) : (
                          <KeyboardArrowUpIcon fontSize="small" color = "primary"/>
                      )}
                      <Typography className = {classes.paperStatus}>
                          {`Details`}
                      </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Grid item md = {12}>
                        <Typography style = {{whiteSpace: 'pre-wrap'}}>
                          <div className = {classes.console}>
                            {detailedPercentage}
                          </div>
                        </Typography>
                      </Grid>
                  </AccordionDetails>
                </Accordion>
                  {/* <Button
                    style={{borderRadius: 8}}
                    onClick = {() => {
                      setDetailsOn(!detailsOn)
                    }}
                    variant="contained" 
                    color="primary">
                      Details {detailsOn? '↑': '↓'}
                    </Button> */}
                </Grid>
                <Grid item md = {12}>
                  <Button
                  style={{marginRight: '1.5vh', borderRadius: 8}}
                  onClick = {() => {
                    stopAnalysisFunc();
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

export default LoadingSPAnalysis;