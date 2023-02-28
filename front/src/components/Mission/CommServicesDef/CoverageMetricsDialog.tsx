import {Typography, TextField, Grid, makeStyles, Tooltip, Box} from "@material-ui/core";
import { FC } from "react";
import CustomNumberFormat from "src/components/CustomNumberFormat";
import { State } from "src/pages/home";
import { ChangeProps } from "src/pages/home/QuickAccess";
import { Theme } from "src/theme";
import {TooltipList} from 'src/utils/constants/tooltips'
import { THEMES } from "src/utils/constants/general";

interface CoverageMetricsDialogProps {
    state: State;
    onState: (name: string, value: any) => void;
    bounds: { [key: string]: { min: number; max: number } };
    onChange: (values: ChangeProps) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
      //marginTop: theme.spacing(2)
    },
    box: {
      borderTop: `1px solid ${theme.palette.border.main}`,
      borderLeft: `1px solid ${theme.palette.border.main}`,
      borderRight: `1px solid ${theme.palette.border.main}`,
      paddingRight: '20px',
      paddingLeft: '20px',
      paddingBottom: '20px',
      paddingTop: "10px"
    },
    textfield: {
      [`& fieldset`]: {
        borderRadius: 6,
        border: '1px solid black'
      },
      '& .MuiOutlinedInput-root': {
        background: theme.name === THEMES.LIGHT ? "#FFFFFF" : "#4c4c4c",
      }
    },
    text:{
      color: `${theme.palette.text.primary} !important`,
      fontFamily: 'Roboto',
      fontStyle: "normal",
      fontSize: "12px",
      lineHeight: "16px",
      letterSpacing:" 0.05em",
    },
    input: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "5px",
      gap: "1px",
  
      background: theme.name === THEMES.LIGHT ? "#FFFFFF" : "#4c4c4c",
      boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.1)",
      borderRadius:"8px",
  
      minHeight: "3vh",
      paddingLeft: "14px"
    },
    disabledInput: {
      textAlign: 'center',
      borderRadius: 6,
      border: `1px solid grey`,
      backgroundColor: theme.palette.component.main
    },
    interiorBox: {
      backgroundColor: theme.palette.component.main
    },
    select: {
      background: theme.name === THEMES.LIGHT ? "#FFFFFF" : "#4c4c4c",
      boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0px",
      gap: "1px",
      border: "0px"
    },
    header:{
      fontWeight: 'bold'
    }
  }));

const CoverageMetricsDialog: FC<CoverageMetricsDialogProps> = ({ state, onState, bounds, onChange}) => {
    const classes = useStyles();
    // const theme = useTheme<Theme>();

    const handleClick = (event): void => {
      const { name, value } = event.target;
      if(name === 'tolerableGap'){
        onChange({ name: 'tolerableGap', value: value.replaceAll(',',''), category: 'specifications' });
      }else if(name === 'serviceEfficiency'){
        onChange({ name: 'availability', value: value.replaceAll(',',''), category: 'specifications' });
      }else{
        onState('commsSpecs',{...state.commsSpecs, coverageMetrics: {...state.commsSpecs.coverageMetrics,[name]:parseFloat(value.replaceAll(',',''))}});
      }
    };
    return (
      <Box className = {classes.box}>
        <Grid container alignItems="center" spacing={2}>
        <Grid item md={8}>
         <Tooltip title= {TooltipList.meanNumberOfContactsPerOrbit}>
            <Typography className={classes.text}>
              {'Avg. Number of Contacts Per Orbit'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={4}>
            <TextField
              name="meanNumContacts"
              value={state.commsSpecs.coverageMetrics.meanNumContacts}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.meanNumContacts.min,
                  max: bounds.meanNumContacts.max
                }
              }}
              disabled={state.loading}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
            />
          </Grid>
         <Grid item md={8}>
         <Tooltip title= {TooltipList.meanRFContactDuration}>
            <Typography className={classes.text}>
              {'Avg. RF Contact Duration (min)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={4}>
            <TextField
              name="meanContactDur"
              value={state.commsSpecs.coverageMetrics.meanContactDur}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.meanContactDur.min,
                  max: bounds.meanContactDur.max
                }
              }}
              disabled={state.loading}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
            />
          </Grid>
         {/* <Grid item md={5}>
         <Tooltip title= {TooltipList.averageGap}>
            <Typography className={classes.text}>
              {'Average Gap (min)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={7}>
            <TextField
              name="averageGap"
              value={state.commsSpecs.coverageMetrics.averageGap}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.averageGap.min,
                  max: bounds.averageGap.max
                }
              }}
              disabled={state.loading}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
            />
          </Grid> */}
         <Grid item md={8}>
         <Tooltip title= {TooltipList.maxGap}>
            <Typography className={classes.text}>
              {'Max Gap Duration (min)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={4}>
            <TextField
              name="tolerableGap"
              value={state.specifications.tolerableGap}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.tolerableGap.min,
                  max: bounds.tolerableGap.max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              disabled={state.loading}
            />
          </Grid>
         {/* <Grid item md={8}>
         <Tooltip title= {TooltipList.meanResponseTime}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'Mean Response Time (min)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={4}>
            <TextField
              name="meanResponse"
              value={state.commsSpecs.coverageMetrics.meanResponse}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.meanResponse.min,
                  max: bounds.meanResponse.max
                }
              }}
              disabled={state.loading}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
            />
          </Grid> */}
         {/* <Grid item md={5}>
         <Tooltip title= {TooltipList.meanRFCoverage}>
            <Typography className={classes.text}>
              {'Mean RF Coverage (% of Orbit)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={7}>
            <TextField
              name="meanRFCoverage"
              value={state.commsSpecs.coverageMetrics.meanRFCoverage}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.meanRFCoverage.min,
                  max: bounds.meanRFCoverage.max
                }
              }}
              disabled={state.loading}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
            />
          </Grid> */}
         {/* <Grid item md={5}>
         <Tooltip title= {TooltipList.serviceEfficiency}>
            <Typography className={classes.text}>
              {'Service Efficiency (%)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={7}>
            <TextField
              name="serviceEfficiency"
              value={state.specifications.availability}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.availability.min,
                  max: bounds.availability.max
                }
              }}
              disabled={state.loading}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
            />
          </Grid> */}
          {/* <Grid item md = {4}>
            <Button 
              onClick={() => close()}
              variant={'contained'}
              color={'primary'}
              size="small"
              style={{
                color:
                  theme.name === THEMES.LIGHT
                    ? '#fff'
                    : theme.palette.text.primary
              }}
            >
              <ArrowLeft/> {'Back'}
            </Button>
        </Grid>
        <Grid item md={8}/> */}
      </Grid>
      </Box>
    );
};

export default CoverageMetricsDialog;