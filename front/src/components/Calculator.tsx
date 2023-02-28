import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  makeStyles,
  TextField,
  Tooltip,
  useTheme
} from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import CustomNumberFormat from './CustomNumberFormat';
import CloseIcon from '@material-ui/icons/Close';
import MathJax from 'react-mathjax';
import { Theme } from 'src/theme';
import { isNull } from 'underscore';
import { useSelector } from 'src/store';
import { THEMES } from 'src/utils/constants/general';

/**
 * Required Calculator Properties
 *
 * @export
 * @interface CalcProps
 */
export interface CalcProps {
  descriptor: string; //Description string that appears before the equation
  calcName: string; //Name of calculator (displayed in header bar)
  resultVar: string; //Variable being calculated (LaTeX)
  resultUnits?: string; //Units of result
  latex: string; //Associated Equation of Calculator (LaTeX)
  params: any; //
  constants?: any;
  calculate: (vals: any) => number; //Function used to calculate results. Requires 'vals' parameter to be defined as a JSON object containing each of the parameters defined in the 'params' prop.
  isOpen: boolean; //Boolean flag used to show or hide calculator dialog
  setIsOpen: (val: boolean) => void; //Function used to set visible/hidden state of dialog
  infoLatex?: string; //Not yet implemented - contains link or LaTeX text with detailed background info of calculation approach
  setResult: (val: number) => void; //Function used to set the result
}

export interface SubCalcProps {
  open?: boolean;
  setOpen?: (state: boolean) => void;
  setResult?: (value: number) => void;
}

interface localValProps {
  key: string;
  value: number;
  name: string;
  label: string;
  subCalcOpen: boolean;
  SubCalcObj?: FC<SubCalcProps>;
}
const useStyles = makeStyles((theme: Theme) => ({
  input: {
    textAlign: 'left',
    borderRadius: 6,
    border: `1px solid ${theme.palette.border.boring}`,
    backgroundColor: theme.palette.component.main,
    paddingLeft: '14px'
  },
  disabledInput: {
    textAlign: 'left',
    borderRadius: 6,
    border: `1px solid grey`,
    backgroundColor: theme.name !== THEMES.DARK ? theme.palette.grey[200]: theme.palette.grey[700],
    color: theme.palette.text.primary,
    paddingLeft: '14px'
  },
  tooltip: {
    maxWidth: '500px'
  },
  textfield: {
    [`& fieldset`]: {
      borderRadius: 6,
      border: '1px solid black'
    },
    '& .MuiOutlinedInput-root': {
      background: '#fff'
    }
  },
}));

/**
 * Common Calculator Object
 *
 * descriptor: This will appear at the top of the
 *
 * @param {*} {descriptor: hello, resultVar: hi, resultUnits, latex, params, constants, calculate, isOpen, setIsOpen, infoLatex, setResult}
 * @return {*}
 */
const Calculator: FC<CalcProps> = ({
  descriptor,
  calcName,
  resultVar,
  resultUnits,
  latex,
  params,
  constants,
  calculate,
  isOpen,
  setIsOpen,
  infoLatex,
  setResult
}) => {
  const { zoom } = useSelector((state) => state.zoom);
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [localVals, setLocalVals] = useState<localValProps[]>(
    params
      .map((attr) => {
        return {
          key: Object.keys(attr)[0],
          value: null,
          name: attr[Object.keys(attr)[0]].name,
          label: attr[Object.keys(attr)[0]].labelTeX,
          subCalcOpen: false,
          SubCalcObj: attr[Object.keys(attr)[0]].calculator
            ? attr[Object.keys(attr)[0]].calculator[
                Object.keys(attr[Object.keys(attr)[0]].calculator)[0]
              ]
            : null
        };
      })
      .sort((a, b) => a.key.localeCompare(b.key))
  );
  const [subParams, setSubParams] = useState<{ value: number; currParam: any }>(
    { value: null, currParam: null }
  );

  const constantsVar: {
    key: string;
    value: number;
    name: string;
    label: string;
  }[] = constants
    ?.map((attr) => {
      return {
        key: Object.keys(attr)[0],
        value: attr[Object.keys(attr)[0]].value,
        name: attr[Object.keys(attr)[0]].name,
        label: attr[Object.keys(attr)[0]].labelTeX
      };
    })
    ?.sort((a, b) => a.key.localeCompare(b.key));
  const [result, updateResult] = useState<number>(null);

  useEffect(() => {
    if (
      localVals.filter((attr) => {
        return isNull(attr.value);
      }).length > 0
    ) {
      updateResult(null);
      return;
    }
    updateResult(
      calculate(
        localVals.reduce(
          (allParams, param) => ({ ...allParams, [param.key]: param.value }),
          {}
        )
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localVals]);

  // Had to use this roundabout way to update the sub-calculator parameters.
  // Timing issues prevented result from being set.
  // subCalcOpen also doesn't work the same as the top level value, so we're also updating that here.
  useEffect(() => {
    if (!subParams.currParam) {
      return;
    }
    const cleanedList: any[] = localVals.filter((x) => {
      return x.key !== subParams.currParam.key;
    });
    setLocalVals(
      [
        ...cleanedList,
        { ...subParams.currParam, value: subParams.value, subCalcOpen: false }
      ].sort((a, b) => a.key.localeCompare(b.key))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subParams]);

  const resetVals = (): void => {
    setLocalVals(
      params
        .map((attr) => {
          return {
            key: Object.keys(attr)[0],
            value: null,
            name: attr[Object.keys(attr)[0]].name,
            label: attr[Object.keys(attr)[0]].labelTeX,
            subCalcOpen: false,
            SubCalcObj: attr[Object.keys(attr)[0]].calculator
              ? attr[Object.keys(attr)[0]].calculator[
                  Object.keys(attr[Object.keys(attr)[0]].calculator)[0]
                ]
              : null
          };
        })
        ?.sort((a, b) => a.key.localeCompare(b.key))
    );
  };

  const handleOpenState = (value: boolean, currParam: any): void => {
    //To update the specific value, lets create a temporary object without the updated parameter and add it back in (keeping alphabetic sorting)
    const cleanedList: any[] = localVals.filter((x) => {
      return x.key !== currParam.key;
    });
    setLocalVals(
      [...cleanedList, { ...currParam, subCalcOpen: value }].sort((a, b) =>
        a.key.localeCompare(b.key)
      )
    );
  };

  const handleUpdate = (value: number, currParam: any): void => {
    //To update the specific value, lets create a temporary object without the updated parameter and add it back in (keeping alphabetic sorting)
    const cleanedList: any[] = localVals.filter((x) => {
      return x.key !== currParam.key;
    });
    setLocalVals(
      [...cleanedList, { ...currParam, value: value }].sort((a, b) =>
        a.key.localeCompare(b.key)
      )
    );
  };

  return (
    <Dialog
      maxWidth={'sm'}
      fullWidth
      open={isOpen}
      //TransitionComponent={Transition}
      keepMounted
      onClose={() => setIsOpen(false)}
    >
      <DialogTitle
        style={{
          margin: 0,
          padding: '16px',
          backgroundColor: theme.palette.primary.light,
          borderBottom:'1px solid lightgrey'
        }}
      >
        <Box display="flex" alignItems="Left">
          <Box flexGrow={1}>{calcName}</Box>
          <Box>
            <IconButton size="small" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent
        style={{
          backgroundColor: theme.palette.background.paper,
          maxHeight: '70vh',
          overflowY: 'auto',
          minWidth: '20vw',
          alignItems: 'left'
        }}
      >
        {/* Lets get it gamers */}
        <Box sx={{ display: 'flex', p: 1 }}>
          <MathJax.Provider>
            <MathJax.Node
              format={'TeX'}
              formula={descriptor?.replaceAll(' ', '\\,')}
            />
          </MathJax.Provider>
        </Box>
        <Box sx={{ display: 'flex', p: 1, paddingLeft: '30px' }}>
          <MathJax.Provider>
            <MathJax.Node format={'TeX'} formula={latex} />
          </MathJax.Provider>
        </Box>
        <Box sx={{ display: 'flex', p: 1 }}>
          <MathJax.Provider>
            <MathJax.Node format={'TeX'} formula={'Where:'} />
          </MathJax.Provider>
        </Box>
        {constantsVar?.map((constant) => {
          return (
            <React.Fragment key={constant.key}>
              <div style={{ display: 'inline-block', width: '79%' }}>
                <Box sx={{ display: 'flex', p: 1, paddingLeft: '30px' }}>
                  <MathJax.Provider>
                    <MathJax.Node
                      format={'TeX'}
                      formula={
                        constant.label +
                        '\\,(' +
                        constant.name?.replaceAll(' ', '\\,') +
                        ')\\,' +
                        ' ='
                      }
                    />
                  </MathJax.Provider>
                </Box>
              </div>

              <div
                style={{
                  display: 'inline-block',
                  width: '20%',
                  textAlign: 'right'
                }}
              >
                <MathJax.Provider>
                    <MathJax.Node
                      format={'TeX'}
                      formula={
                        constant.value
                      }
                    />
                  </MathJax.Provider>
              </div>
            </React.Fragment>
          );
        })}

        {localVals.map((param) => {
          return (
            <Grid key={param.key} container spacing = {2}>
              <Grid item md = {8}>
                <div style={{ display: 'inline-block', width: '79%' }}>
                  <Box sx={{ display: 'flex', p: 1, paddingLeft: '30px' }}>
                    <MathJax.Provider>
                      <MathJax.Node
                        format={'TeX'}
                        formula={
                          param.label +
                          '\\,(' +
                          param.name?.replaceAll(' ', '\\,') +
                          ')\\,' +
                          ' ='
                       }
                      />
                    </MathJax.Provider>
                  </Box>
                </div>
              </Grid>
              <Grid item md = {4}>
                <div
                  style={{
                    display: 'inline-block',
                    textAlign: 'right'
                  }}
                >
                <Grid container spacing = {1}>
                  <Grid item md = {param.SubCalcObj? 10 : 12}>
                    <TextField
                      name={param.key}
                      value={param.value ?? ''}
                      style={{paddingTop: '15px'}}
                      //@ts-ignore
                      onInput={(ev)=>handleUpdate(parseFloat(ev.target.value), param)}
                      fullWidth
                      InputProps={{
                        inputComponent: CustomNumberFormat,
                        disableUnderline: true,
                        inputProps: {
                          className: classes.input,
                          min: 0,
                          max: 999999999
                        },
                        style: { textAlign: 'center' }
                      }}
                      disabled={false}
                    />
                  </Grid>
                  {param.SubCalcObj && (
                    <>
                   <Grid item md = {2}>
                      <div
                        style={{
                          display: 'inline-block',
                          textAlign: 'right',
                          paddingLeft: '5px',
                          marginTop: '7px',
                          marginBottom: '0px'
                        }}
                      >
                        <Tooltip
                          title={param.name + ' Calculator'}
                          placement="top-start"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleOpenState(true, param)}
                          >
                            <Icon
                              style={{
                                width:
                                  (window.screen.availHeight / zoom) * 0.0284,
                                height:
                                  (window.screen.availHeight / zoom) * 0.0284,
                                textAlign: 'center',
                                overflow: 'visible'
                              }}
                              onClick={() => handleOpenState(true, param)}
                            >
                              <img
                                alt="calculate"
                                src="/static/icons/calculator.svg"
                                style={{
                                  height:
                                    (window.screen.availHeight / zoom) * 0.025
                                }}
                              />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                        <param.SubCalcObj
                          open={param.subCalcOpen}
                          setOpen={(state: boolean) => {
                            handleOpenState(state, param);
                          }}
                          setResult={(val: number) => {
                            setSubParams({ value: val, currParam: param });
                          }}
                        />
                      </div>
                    </Grid>
                  </>
                  )}
                </Grid>  
              </div>
            </Grid>
          </Grid>
          );
        })}
          <hr
            style={{
              borderColor: theme.palette.border.boring,
              height: '1px'
            }}
          />
        <Grid container spacing = {2}>
          <Grid item md = {8}>
            <div style={{ display: 'inline-block', width: '79%' }}>
              <Box sx={{ display: 'flex', p: 1, paddingLeft: '30px' }}>
                <MathJax.Provider>
                  <MathJax.Node
                    speaktext="false"
                    format={'TeX'}
                    formula={`{${resultVar}}\\,(${resultUnits}) = `}
                  ></MathJax.Node>
                </MathJax.Provider>
              </Box>
            </div>
          </Grid>
          <Grid item md = {4}>
            <div
              style={{
                display: 'inline-block',
                textAlign: 'right'
              }}
            >
              <Grid container spacing = {1}>
                <Grid item md = {12}>
                  <TextField
                    name={'result'}
                    InputProps={{
                      inputComponent: CustomNumberFormat,
                      disableUnderline: true,
                      inputProps: {
                        className: classes.disabledInput,
                        min: 0,
                        max: 999999999
                      },
                      style: { textAlign: 'center' }
                    }}
                    // inputProps={{ style: { textAlign: 'center' } }}
                    value={isNaN(result) || isNull(result) ? '' : result.toFixed(2)}
                    disabled={true}
                    // disableUnderline
                    fullWidth
                  />
                </Grid>
              </Grid>  
            </div>
          </Grid>
        </Grid>
        {/* <Box border={'2px'} borderColor={'black'}>
          <div
            style={{
              display: 'inline-block',
              width: '79%',
              textAlign: 'right'
            }}
          >
            <Box sx={{ display: 'flex', p: 3 }}>
              
            </Box>
          </div>
          <div
            style={{ display: 'inline-block', width: '20%', textAlign: 'left' }}
          >
            
          </div>
        </Box> */}
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.background.paper }}>
        <Button
          onClick={() => {
            resetVals();
          }}
          color="primary"
          variant="outlined"
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            setResult(result);
            setIsOpen(false);
          }}
          color="primary"
          variant="contained"
          disabled={isNaN(result) || isNull(result)}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Calculator;
