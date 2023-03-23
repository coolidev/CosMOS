import {
  Typography,
  TextField,
  useTheme,
  Grid,
  Button,
  makeStyles,
  FormControl,
  Select,
  MenuItem,
  Icon,
  Tooltip,
  Box,
  InputAdornment,
  Input,
  OutlinedInput,
} from '@material-ui/core';
import { FC, useEffect, useState } from 'react';
import CustomNumberFormat from 'src/components/CustomNumberFormat';
import { State } from 'src/pages/home';
import { ChangeProps } from 'src/pages/home/QuickAccess';
import { Theme } from 'src/theme';
import IconButton from '@material-ui/core/IconButton';
import { useSelector } from 'src/store';
import { AttrValue } from '.';
import axios from 'src/utils/axios';
import Calculator, { SubCalcProps } from 'src/components/Calculator';
import { isNull } from 'underscore';
import { TooltipList } from 'src/utils/constants/tooltips';
import { THEMES } from 'src/utils/constants/general';
import DialogBox from 'src/components/DialogBox';
import { getCoverage } from 'src/algorithms/coverage';
import { getOptimalModCod } from 'src/algorithms/link-optimization';
import { calculateMaxAchievableDataRate } from 'src/algorithms/link';
import { ModCodOption } from 'src/types/evaluation';
import { FilteringSelection } from 'src/pages/home/QuickAccess/Mission';
import { Autocomplete } from '@material-ui/lab';

export interface CommsPayloadSpecsDialogProps {
  state: State;
  onState: (name: string, value: any) => void;
  bounds: { [key: string]: { min: number; max: number } };
  onBounds: (name: string, type: string, value: number) => void;
  onChange: (values: ChangeProps) => void;
  filterSelectionOrder: FilteringSelection[];
  setFilterSelectionOrder: any;
  filterFlag: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    //marginTop: theme.spacing(2)
  },
  box: {
    borderTop: `1px solid ${theme.palette.border.main}`,
    borderLeft: `1px solid ${theme.palette.border.main}`,
    borderRight: `1px solid ${theme.palette.border.main}`,
    borderBottom: `1px solid ${theme.palette.border.main}`,
    paddingRight: '20px',
    paddingLeft: '20px',
    paddingBottom: '20px',
    paddingTop: "10px",
    borderRadius: "0px 0px 8px 8px"
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
  text: {
    color: `${theme.palette.text.primary} !important`,
    fontFamily: 'Roboto',
    fontStyle: "normal",
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: " 0.05em",
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
    borderRadius: "8px",

    minHeight: "3vh",
    paddingLeft: "14px"
  },
  disabledInput: {
    textAlign: 'center',
    borderRadius: 6,
    border: `1px solid grey`,
    backgroundColor: theme.name !== THEMES.DARK ? theme.palette.grey[200] : theme.palette.grey[700]
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
  noOutline: {
    '& .MuiOutlinedInput-notchedOutline': {
      border: '0px'
    }
  },
  header: {
    fontWeight: 'bold'
  },
  tooltip: {
    maxWidth: '500px'
  },
  dialog: {
    width: '25vw'
  },
  enhanceDropdown: {
    padding: 0,
    //boxShadow: theme.name == THEMES.DARK? '' :'3px 3px 7px #c0c0c0', --To be added back when we make shadows everywhere
    borderRadius: '4px',
    border: `solid 1px ${theme.palette.border.main}`,
    color: `${theme.palette.text.primary} !important`,
    '& .MuiSelect-iconOutlined': {
      color: theme.palette.border.main
    }
  },
  selectedEnhanceDropdown: {
    '& .MuiAutocomplete-clearIndicator': {
      visibility: 'inherit'
    }
  },
}));

export const TxPwrCalcUI: FC<SubCalcProps> = ({ open, setOpen, setResult }) => {
  return (
    <Calculator
      key={'key1'}
      descriptor={'System Noise Temperature (K)'}
      calcName={'System Noise Temperature Calculator'}
      resultVar={'SNT'}
      resultUnits={'K'}
      latex={'{SNT} = {T_{a}} + {T_0} + {T_{LNA}} + {L_{AntToLNA}}'}
      params={[
        {
          antTemp: {
            name: 'Antenna Temperature (K)',
            labelTeX: '{T_{a}}'
          }
        },
        {
          ambTemp: {
            name: 'Ambient Temperature (K)',
            labelTeX: '{T_0}'
          }
        },
        {
          lnaTemp: {
            name: 'LNA Temperature (K)',
            labelTeX: '{T_{LNA}}'
          }
        },
        {
          lineLoss: {
            name: 'Line Loss between Antenna and LNA (dB)',
            labelTeX: '{L_{AntToLNA}}'
          }
        }
      ]}
      calculate={txPwrCalcEqn}
      isOpen={open}
      setIsOpen={setOpen}
      infoLatex={''}
      setResult={setResult}
    />
  );
};

function txPwrCalcEqn(params: {
  antTemp: number;
  ambTemp: number;
  lnaTemp: number;
  lineLoss: number;
}) {
  return params.antTemp + params.ambTemp + params.lnaTemp + params.lineLoss;
}

function gainCalcEqn_Parabolic(vals: {
  freq: number;
  efficiency: number;
  diameter: number;
}) {
  const { freq, efficiency, diameter } = vals;
  return (
    20 *
    Math.log10(
      (Math.PI * freq * Math.pow(10, 9) * diameter) / (3 * Math.pow(10, 8))
    ) +
    10 * Math.log10(efficiency / 100)
  );
}

function gainCalcEqn_Helix(params: { freq: number; turns: number }) {
  const { freq, turns } = params;
  let N = turns;
  let f = freq;
  let λ = 3e8 / (f * 1e9);
  let S = 0.25 * λ;
  let C = λ;
  return 10 * Math.log10(15 * ((N * Math.pow(C, 2) * S) / Math.pow(λ, 3)));
}

// interface ModulationProps {
//   state: State;
//   onState: (name: string, value: any) => void;
//   onBounds: (name: string, type: string, value: number) => void;
// }

interface Attribute {
  id: number;
  name: string;
}

const initialOptions = {
  modulation: 0,
  coding: 0
};

const CommsPayloadSpecDialog: FC<CommsPayloadSpecsDialogProps> = ({
  state,
  bounds,
  onBounds,
  onChange,
  onState,
  filterSelectionOrder,
  setFilterSelectionOrder,
  filterFlag,
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const { zoom } = useSelector((state) => state.zoom);
  const [modulationOptions, setModulationOptions] = useState<AttrValue[]>([]);
  const [filteredModList, setFilteredModList] = useState<AttrValue[]>([]);
  const [codingOptions, setCodingOptions] = useState<AttrValue[]>([]);
  const [codingTypeOptions, setCodingTypeOptions] = useState<AttrValue[]>([]);
  const [filteredCodingOptions, setFilteredCodingOptions] = useState<AttrValue[]>([]);
  const [filteredCodingTypeOptions, setFilteredCodingTypeOptions] = useState<AttrValue[]>([]);
  const [polarizationOptions, setPolarizationOptions] = useState<AttrValue[]>([]);
  const [filteredPolarizationList, setFilteredPolarizationList] = useState<AttrValue[]>([]);
  const [eirpCalc, setEirpCalc] = useState<boolean>(false);
  const [eirpVal, setEirpVal] = useState<number>(state.commsSpecs.commsPayloadSpecs.eirp);
  const [gainCalcOptions, setGainCalcOptions] = useState<boolean>(false);
  const [gainCalcId, setGainCalcId] = useState<number>(0);
  const [parabolicCalc, setParabolicCalc] = useState<boolean>(false);
  const [helixCalc, setHelixCalc] = useState<boolean>(false);
  const [gainCalcNotes, setGainCalcNotes] = useState<string>('');

  const [options, setOptions] = useState(initialOptions);
  const [modCods, setModCods] = useState(null);
  const [moduls, setModuls] = useState<Attribute[]>([]);
  const [codings, setCodings] = useState<Attribute[]>([]);
  const { performancePanel, modCodOptions } = useSelector(state => state.results);
  const [selectedLength, setSelectedLength] = useState<number>(-1);

  const { coding, frequencyBands, modulation, polarization } = useSelector((state) => state.networkList);
  const [codeRateOptions_codeType, setCodingRateOptions_codeType] = useState<number[]>([]);
  const [modulationOptions_codeType, setModulationOptions_codeType] = useState<number[]>([]);


  useEffect(() => {
    if (state.selectedItems.length !== selectedLength) {
      setSelectedLength(state.selectedItems.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedItems.length]);

  function launchGainCalc() {
    setGainCalcOptions(false);
    if (gainCalcId === 0) {
      //Parabolic
      setParabolicCalc(true);
    } else if (gainCalcId === 1) {
      //Patch
      handleClick({ target: { name: 'gain', value: 8 } }); //Patch Antenna always 8 dBi
    } else if (gainCalcId === 2) {
      //Dipole
      handleClick({ target: { name: 'gain', value: 1.75 } }); //Patch Antenna always 1.75 dBi
    } else if (gainCalcId === 3) {
      //Helix
      setHelixCalc(true);
    }
  }

  useEffect(() => {
    updateCodingRateOptions(state.commsSpecs.commsPayloadSpecs.codingType);
    updateModulationOptions(state.commsSpecs.commsPayloadSpecs.codingType);
  }, []);

  async function updateModulationOptions(codingType: number, codingRate?: number) {
    const response = await axios.get<AttrValue[]>('/getAvailableModulations', {
      params: {
        codingType: codingType,
        codingRateId: codingRate && codingRate > 0 ? codingRate : -1
      }
    });
    //@ts-ignore
    setModulationOptions_codeType(Array.from(new Set(response.data.map((item) => item.modulationId))));
  }

  async function updateCodingRateOptions(codingType: number, modulation?: number) {
    const response = await axios.get<AttrValue[]>('/getAvailableCodingRates', {
      params: {
        codingType: codingType,
        modulationId: modulation && modulation > 0 ? modulation : -1
      }
    });
    //@ts-ignore
    setCodingRateOptions_codeType(Array.from(new Set(response.data.map((item) => item.codingRateId))));
  }

  useEffect(() => {
    if (eirpVal !== state.commsSpecs.commsPayloadSpecs.eirp) {
      onState('commsSpecs', {
        ...state.commsSpecs,
        commsPayloadSpecs: {
          ...state.commsSpecs.commsPayloadSpecs,
          eirp: eirpVal
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eirpVal]);

  useEffect(() => {
    filterSelectionLists(filterSelectionOrder);
  }, [filterFlag])

  useEffect(() => {
    if (gainCalcId === 1 || gainCalcId === 2) {
      setGainCalcNotes(
        'This Antenna has a pre-configured Gain value that will be applied'
      );
    } else {
      setGainCalcNotes('');
    }
  }, [gainCalcId]);

  useEffect(() => {
    if (state.commsSpecs.commsPayloadSpecs.gainOn) {
      const newEIRP = (state.commsSpecs.commsPayloadSpecs.gain ?? 5) + (state.commsSpecs.commsPayloadSpecs.transmitterPower ?? 1) - (state.commsSpecs.commsPayloadSpecs.passiveLoss ?? 0) - (state.commsSpecs.commsPayloadSpecs.otherLoss ?? 0);
      onState('commsSpecs', {
        ...state.commsSpecs,
        commsPayloadSpecs: {
          ...state.commsSpecs.commsPayloadSpecs,
          eirp: newEIRP
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.commsPayloadSpecs.gain, state.commsSpecs.commsPayloadSpecs.transmitterPower, state.commsSpecs.commsPayloadSpecs.passiveLoss, state.commsSpecs.commsPayloadSpecs.otherLoss]);

  useEffect(() => {
    if (state.commsSpecs.commsPayloadSpecs.eirp !== eirpVal) {
      setEirpVal(state.commsSpecs.commsPayloadSpecs.eirp);
    }
    onState('commsSpecs', {
      ...state.commsSpecs,
      commsPayloadSpecs: {
        ...state.commsSpecs.commsPayloadSpecs,
        minEIRPFlag: isNull(state.commsSpecs.commsPayloadSpecs.eirp)
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.commsSpecs.commsPayloadSpecs.eirp]);

  useEffect(() => {
    if (state.commsSpecs.commsPayloadSpecs.minEIRPFlag) {
      console.log('Min EIRP Mode');
    } else {
      console.log('Link Calc Mode');
    }
  }, [state.commsSpecs.commsPayloadSpecs.minEIRPFlag]);

  useEffect(() => {
    const fetchModulationTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_modulation' }
      });
      const modSort = (modArr: any[]) => {
        const noNumbers = modArr.filter((mod) => {
          return mod.name.match(/\d/) == null;
        });
        const withNumbers = modArr.filter((mod) => {
          return mod.name.match(/\d/) != null;
        });;

        return noNumbers
          .sort((a, b) => a.name.localeCompare(b.name))
          .concat(
            withNumbers.sort((modA, modB) => {
              const modASplit = modA.name.split(" ");
              const modANum = modASplit[0];
              const modBSplit = modB.name.split(" ");
              const modBNum = modBSplit[0];

              if (isNaN(Number(modANum)) && isNaN(Number(modBNum))) {
                return 0;
              } else if (isNaN(Number(modANum))) {
                return -1;
              } else if (isNaN(Number(modBNum))) {
                return 1;
              } else {
                if (Number(modANum) - Number(modBNum) === 0) {
                  return modASplit[modASplit.length - 1].localeCompare(modBSplit[modBSplit.length - 1]);
                } else {
                  return Number(modANum) - Number(modBNum);
                }
              }
            })
          );
      };
      // response.data && setModulationOptions(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      // response.data && setFilteredModList(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      response.data && setModulationOptions(modSort(response.data));
      response.data && setFilteredModList(modSort(response.data));
    };

    fetchModulationTypeData();
  }, []);

  useEffect(() => {
    const fetchCodingTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'codingTypes' }
      });

      response.data && setCodingTypeOptions(response.data);
      response.data && setFilteredCodingTypeOptions(response.data);
    };

    fetchCodingTypeData();
  }, []);

  useEffect(() => {
    const fetchCodingTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'channel_coding' }
      });

      response.data && setCodingOptions(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      response.data && setFilteredCodingOptions(response.data.sort((a, b) => a.name.localeCompare(b.name)));
    };

    fetchCodingTypeData();
  }, []);

  useEffect(() => {
    const fetchPolarizationTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_polarization' }
      });

      response.data && setPolarizationOptions(response.data);
      response.data && setFilteredPolarizationList(response.data);
    };

    fetchPolarizationTypeData();
  }, []);

  const handleClick = (event, targetName?): void => {
    let { name, value } = event.target;
    if (targetName) name = targetName;
    if (name === 'modulation') {
      let newFilterSelectionOrder = filterSelectionOrder.slice();
      if (value === -1) {
        if (newFilterSelectionOrder.includes(FilteringSelection.MODULATION)) {
          let index = newFilterSelectionOrder.indexOf(FilteringSelection.MODULATION);
          newFilterSelectionOrder.splice(index, 1);
        }
      } else {
        if (!newFilterSelectionOrder.includes(FilteringSelection.MODULATION)) {
          newFilterSelectionOrder.push(FilteringSelection.MODULATION);
        }
        updateCodingRateOptions(state.commsSpecs.commsPayloadSpecs.codingType, value);
      }
      setFilterSelectionOrder(newFilterSelectionOrder);
    }
    if (name === 'codingType') {
      let newFilterSelectionOrder = filterSelectionOrder.slice();
      if (value === -1) {
        if (newFilterSelectionOrder.includes(FilteringSelection.CODING_TYPE)) {
          let index = newFilterSelectionOrder.indexOf(FilteringSelection.CODING_TYPE);
          newFilterSelectionOrder.splice(index, 1);
        }
      } else {
        if (!newFilterSelectionOrder.includes(FilteringSelection.CODING_TYPE)) {
          newFilterSelectionOrder.push(FilteringSelection.CODING_TYPE);
        }
      }
      setFilterSelectionOrder(newFilterSelectionOrder);
    }
    if (name === 'coding') {
      let newFilterSelectionOrder = filterSelectionOrder.slice();
      if (value === -1) {
        if (newFilterSelectionOrder.includes(FilteringSelection.CODING_RATE)) {
          let index = newFilterSelectionOrder.indexOf(FilteringSelection.CODING_RATE);
          newFilterSelectionOrder.splice(index, 1);
        }
      } else {
        if (!newFilterSelectionOrder.includes(FilteringSelection.CODING_RATE)) {
          newFilterSelectionOrder.push(FilteringSelection.CODING_RATE);
        }
        updateModulationOptions(state.commsSpecs.commsPayloadSpecs.codingType, value);
      }
      setFilterSelectionOrder(newFilterSelectionOrder);
    }
    if (name === 'polarizationType') {
      let newFilterSelectionOrder = filterSelectionOrder.slice();
      if (value === -1) {
        if (newFilterSelectionOrder.includes(FilteringSelection.POLARIZATION)) {
          let index = newFilterSelectionOrder.indexOf(FilteringSelection.POLARIZATION);
          newFilterSelectionOrder.splice(index, 1);
        }
      } else {
        if (!newFilterSelectionOrder.includes(FilteringSelection.POLARIZATION)) {
          newFilterSelectionOrder.push(FilteringSelection.POLARIZATION);
        }
      }
      setFilterSelectionOrder(newFilterSelectionOrder);
    }
    let newVal = !isNaN(parseFloat(value)) ? parseFloat(value) : null;
    onState('commsSpecs', {
      ...state.commsSpecs,
      commsPayloadSpecs: {
        ...state.commsSpecs.commsPayloadSpecs,
        [name]: newVal
      }
    });
  };

  useEffect(() => {
    onState('commsSpecs', {
      ...state.commsSpecs,
      commsPayloadSpecs: {
        ...state.commsSpecs.commsPayloadSpecs,
        coding: -1
      }
    })
  }, [state.commsSpecs.commsPayloadSpecs.codingType])
  // const refreshModCodList = () => {
  //   if(state.networkType === "relay" && state.selectedItems.length > 0){
  //     let validCodingStrings = state.selectedItems[0].codingType.split(',');
  //     let validCodings: AttrValue[] = [];
  //     for(let i = 0; i < validCodingStrings.length; i++){
  //       codingOptions.forEach((option) => {
  //         if(option.name === validCodingStrings[i]){
  //           validCodings.push(option);
  //         }
  //       })
  //     }
  //     setFilteredCodingOptions(validCodings);
  //     let validModStrings = state.selectedItems[0].modulationType.split(',');
  //     let validMods: AttrValue[] = [];
  //     for(let i = 0; i < validModStrings.length; i++){
  //       modulationOptions.forEach((option) => {
  //         if(option.name === validModStrings[i]){
  //           validMods.push(option);
  //         }
  //       })
  //     }
  //     setFilteredModList(validMods);
  //   } else if (state.networkType === 'dte' && state.selectedItems.length > 0){
  //     let selectedItem = state.selectedItems.filter((item) => item.id === state.radioButtonSelectionId)
  //     let validCodingStrings = selectedItem.length > 0? selectedItem[0].channelCodingType.split(','): state.selectedItems[0].channelCodingType.split(',');
  //     let validCodings: AttrValue[] = [];
  //     for(let i = 0; i < validCodingStrings.length; i++){
  //       codingOptions.forEach((option) => {
  //         if(option.name === validCodingStrings[i]){
  //           validCodings.push(option);
  //         }
  //       })
  //     }
  //     let noDupesValidCodings = filterDupes(validCodings);
  //     setFilteredCodingOptions(noDupesValidCodings);
  //     let validModStrings = selectedItem.length > 0? selectedItem[0].modulationType.split(','): state.selectedItems[0].modulationType.split(',');
  //     let validMods: AttrValue[] = [];
  //     for(let i = 0; i < validModStrings.length; i++){
  //       modulationOptions.forEach((option) => {
  //         if(option.name === validModStrings[i]){
  //           validMods.push(option);
  //         }
  //       })
  //     }
  //     let noDupesValidMods = filterDupes(validMods);
  //     setFilteredModList(noDupesValidMods);
  //   } else {
  //     setFilteredCodingOptions(codingOptions);
  //     setFilteredModList(modulationOptions);  
  //   }
  //   // onState('commsSpecs', {...state.commsSpecs, commsPayloadSpecs: {...state.commsSpecs.commsPayloadSpecs, modulation: -1, coding: -1}});
  // }
  // const refreshModCodList = () => {
  //   if(state.networkType === "relay" && state.selectedItems.length > 0){
  //     let validCodingStrings = state.selectedItems[0].codingType.split(',');
  //     let validCodings: AttrValue[] = [];
  //     for(let i = 0; i < validCodingStrings.length; i++){
  //       codingOptions.forEach((option) => {
  //         if(option.name === validCodingStrings[i]){
  //           validCodings.push(option);
  //         }
  //       })
  //     }
  //     setFilteredCodingOptions(validCodings);
  //     let validModStrings = state.selectedItems[0].modulation.split(',');
  //     let validMods: AttrValue[] = [];
  //     for(let i = 0; i < validModStrings.length; i++){
  //       modulationOptions.forEach((option) => {
  //         if(option.name === validModStrings[i]){
  //           validMods.push(option);
  //         }
  //       })
  //     }
  //     setFilteredModList(validMods);
  //   } else if (state.networkType === 'dte' && state.selectedItems.length > 0){
  //     let selectedItem = state.selectedItems.filter((item) => item.id === state.radioButtonSelectionId)
  //     let validCodingStrings = selectedItem.length > 0? selectedItem[0].coding.split(','): state.selectedItems[0].coding.split(',');
  //     let validCodings: AttrValue[] = [];
  //     for(let i = 0; i < validCodingStrings.length; i++){
  //       codingOptions.forEach((option) => {
  //         if(option.name === validCodingStrings[i]){
  //           validCodings.push(option);
  //         }
  //       })
  //     }
  //     let noDupesValidCodings = filterDupes(validCodings);
  //     setFilteredCodingOptions(noDupesValidCodings);
  //     let validModStrings = selectedItem.length > 0? selectedItem[0].modulation.split(','): state.selectedItems[0].modulation.split(',');
  //     let validMods: AttrValue[] = [];
  //     for(let i = 0; i < validModStrings.length; i++){
  //       modulationOptions.forEach((option) => {
  //         if(option.name === validModStrings[i]){
  //           validMods.push(option);
  //         }
  //       })
  //     }
  //     let noDupesValidMods = filterDupes(validMods);
  //     setFilteredModList(noDupesValidMods);
  //   } else {
  //     setFilteredCodingOptions(codingOptions);
  //     setFilteredModList(modulationOptions);  
  //   }
  //   // onState('commsSpecs', {...state.commsSpecs, commsPayloadSpecs: {...state.commsSpecs.commsPayloadSpecs, modulation: -1, coding: -1}});
  // }
  // // useEffect(() => {
  // //   refreshModCodList();
  // // }, [state.selectedItems, state.radioButtonSelectionId])

  // useEffect(() => {
  //   if(codingOptions.length > 0 && modulationOptions.length > 0 && firstLoad){
  //     refreshModCodList();
  //     setFirstLoad(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [codingOptions, modulationOptions])


  const filterSelectionLists = (filterSelectionOrder: FilteringSelection[]) => {
    //Polarization Section
    let data = { frequencyBands: frequencyBands, polarization: polarization, modulation: modulation, coding: coding }
    let newFilteredPolarizationList = polarizationOptions.slice();
    newFilteredPolarizationList.forEach((option) => {
      if (data.polarization.includes(option.id)) {
        option.disabled = false;
      } else {
        option.disabled = true;
      }
    });
    setFilteredPolarizationList(newFilteredPolarizationList);
    //Modulation Section
    let newFilteredModulationList = modulationOptions.slice();
    newFilteredModulationList.forEach((option) => {
      if (data.modulation.includes(option.id) && modulationOptions_codeType.includes(option.id)) {
        option.disabled = false;
      } else {
        option.disabled = true;
      }
    });
    setFilteredModList(newFilteredModulationList);
    //Coding Section
    let newFilteredCodingList = codingOptions.slice();
    newFilteredCodingList.forEach((option) => {
      if (data.coding.includes(option.id) && codeRateOptions_codeType.includes(option.id)) {
        option.disabled = false;
      } else {
        option.disabled = true;
      }
    });
    setFilteredCodingOptions(newFilteredCodingList);
  }

  const makePolarizationList = () => {
    return filteredPolarizationList.map((option, idx) => {
      return <MenuItem key={idx} value={option.id} disabled={option.disabled}>{option.name}</MenuItem>;
    })
  }

  useEffect(() => {
    makePolarizationList();
    // console.log(filteredPolarizationList)
  }, [JSON.stringify(filteredPolarizationList)])

  const getPolarizationValue = () => {
    let option = polarizationOptions.filter((value) => value.id === state.commsSpecs.commsPayloadSpecs.polarizationType)[0];
    if (option) {
      return option
    } else {
      return { id: state.commsSpecs.commsPayloadSpecs.polarizationType, name: "", disabled: false }
    }
  }
  const getCodingRateValue = () => {
    let option = codingOptions.filter((value) => value.id === state.commsSpecs.commsPayloadSpecs.coding)[0];
    if (option) {
      return option
    } else {
      return { id: state.commsSpecs.commsPayloadSpecs.coding, name: "", disabled: false }
    }
  }
  const getModulationValue = () => {
    let option = modulationOptions.filter((value) => value.id === state.commsSpecs.commsPayloadSpecs.modulation)[0];
    if (option) {
      return option
    } else {
      return { id: state.commsSpecs.commsPayloadSpecs.modulation, name: "", disabled: false }
    }
  }
  const updateThroughput = (modulation: string, coding: string) => {
    // If an analysis is loaded, update the throughput / 
    // max throughput if necessary. 
    if (performancePanel && modCodOptions) {
      let maxAchievableDataRate_kbps: number;
      if (performancePanel.systemParams.multipleAccess === 'TDMA') {
        const option: ModCodOption = performancePanel.systemParams.modCodOptions.find(opt =>
          opt.modulation === modulation && opt.coding === coding);
        if (!option) return;
        maxAchievableDataRate_kbps = option.dataRate_kbps;
      } else {
        maxAchievableDataRate_kbps = calculateMaxAchievableDataRate(
          performancePanel.systemParams.R_kbps as number,
          performancePanel.systemParams.bandwidthMHz as number,
          performancePanel.linkParams.modCodTable,
          modulation,
          coding
        );
      }
      const maxThroughput_Gb_Day = maxAchievableDataRate_kbps * getCoverage(state, performancePanel) / Math.pow(10, 6) * 86400;

      // Update the throughput input field in the parameters panel. 
      // If the current throughput is greater than the max possible
      // throughput for the selected network and the currently 
      // selected user, set the throughput to the max throughput. 
      onBounds('throughput', 'max', maxThroughput_Gb_Day);
      onState('results', {
        ...state.results,
        maxThroughput_Gb_Day: maxThroughput_Gb_Day
      });
      if (state.commsSpecs.dataRateKbps > maxThroughput_Gb_Day) {
        onState('commsSpecs', {
          ...state.commsSpecs,
          dataRate: maxThroughput_Gb_Day
        });
        //onError(`The throughput you've entered is greater than the throughput this network can support. Your throughput specification has been adjusted to ${maxThroughput_Gb_Day.toFixed(2)} Gb/Day.`, true, 'Warning');
      }
    }
  };

  useEffect(() => {
    if (state.radioButtonSelectionId <= 0) return;
    const selectedItem = state.selectedItems.find(item => item.id === state.radioButtonSelectionId);

    if (Object.keys(modCodOptions).includes(selectedItem?.id.toString())) {
      const validCodings = modCodOptions[selectedItem.id]
        .filter(option => option.modulationId === selectedItem.modulationId)
        .map(option => option.coding);

      const newModulations: Attribute[] = [];
      const newCodings: Attribute[] = [];
      modCodOptions[selectedItem.id].forEach(option => {

        if (newModulations.filter(mod => mod.id === option.modulationId).length === 0) {
          newModulations.push({
            id: option.modulationId,
            name: option.modulation
          });
        }

        if (
          newCodings.filter(cod => cod.id === option.codingId).length === 0 &&
          validCodings.includes(option.coding)
        ) {
          newCodings.push({
            id: option.codingId,
            name: option.coding
          });
        }
      });

      setModuls(newModulations);
      setCodings(newCodings);


      setOptions((prevState) => ({
        ...prevState,
        modulation: selectedItem.modulationId !== -1 ? selectedItem.modulationId : 0,
        coding: selectedItem.codingId !== -1 ? selectedItem.codingId : 0
      }));
      //   if (item.id === selectedItem.id) {
      //     return {
      //       ...item,
      //       modulationId: finMod,
      //       codingId: finCod,
      //       modulation: finModName,
      //       coding: finCodName,
      //       optimizedModCod: optimized
      //     };
      //   } else {
      //     return item;
      //   }
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modCodOptions, state.selectedItems]);

  // Query the database for modulation and coding options for the
  // selected relay or for the selected antenna and frequency band
  // combination.
  const handleModCods = async (
    frequencyBandId: number,
    antennaId: number,
    antennaName: string,
    optimizedModCod: boolean
  ) => {
    // If the Optimized Modulation and Coding checkbox is checked, update the
    // state with the optimized modulation and coding values.
    if (optimizedModCod) {
      let modulationId = 0;
      let codingId = 0;
      let modulation = '';
      let coding = '';

      if (performancePanel && modCodOptions) {
        const selectedItem = state.selectedItems.find(item => item.id === state.radioButtonSelectionId);
        const {
          modCodOptions,
          multipleAccess,
          bandwidthMHz,
          R_kbps
        } = state.selectedItems.length > 1 ? performancePanel.systemParams[selectedItem.id] : performancePanel.systemParams;

        let throughput = state.commsSpecs.dataRateKbps;
        if (state.selectedItems.length > 1) {
          const stationCoverage = getCoverage(state, performancePanel, selectedItem.id.toString());
          throughput = R_kbps * stationCoverage / Math.pow(10, 6) * 86400;
        }

        // Determine the optimal modulation and coding for the current 
        // specified throughput. 
        const modCodOption = getOptimalModCod(
          modCodOptions,
          multipleAccess,
          throughput,
          getCoverage(state, performancePanel),
          bandwidthMHz,
          performancePanel.linkParams.modCodTable,
          performancePanel.linkParams.ebNoTable
        );
        modulationId = modCodOption.modulationId;
        codingId = modCodOption.codingId;
        modulation = modCodOption.modulation;
        coding = modCodOption.coding;
      }

      setOptions((prevState) => ({
        ...prevState,
        modulation: modulationId,
        coding: codingId
      }));
      updateState(frequencyBandId, antennaId, antennaName, modulationId, codingId, modulation, coding, true);
      updateThroughput(modulation, coding);
      return;
    }

    updateModCods(modCodOptions, frequencyBandId, antennaId, antennaName, optimizedModCod);
  };

  const updateModCods = (newModCodOptions, frequencyBandId: number, antennaId: number, antennaName: string, optimizedModCod: boolean, modulationId?: number) => {
    const currentModCodOptions = modCodOptions[state.radioButtonSelectionId];

    // If the Redux object storing the modulation and coding options for the current 
    // selection is empty, throw an error. 
    if (
      !currentModCodOptions || currentModCodOptions.length === 0
    ) {
      return;
      // throw new Error(`No valid modulation and coding combinations.`);
    }

    // Check whether
    //  1) the modulation/coding IDs are currently set, and
    //  2) whether the modulation/coding that are currently selected exist in the list of options
    //     that was returned.
    if (!modulationId) {
      modulationId = 0;
      if (!state.selectedItems.find(item => item.id === state.radioButtonSelectionId)?.modulationId) {
        // Select the first modulation from the list. 
        modulationId = currentModCodOptions[0].modulationId;
      } else {
        // Check whether the selected modulation is in the list
        // of valid options. If not, select a new modulation. 
        modulationId = state.selectedItems.find(item => item.id === state.radioButtonSelectionId)?.modulationId;

        if (!currentModCodOptions.map(option => option.modulationId).includes(modulationId)) {
          modulationId = currentModCodOptions[0].modulationId;
        }
      }
    }

    // Extract the modulation and coding names. 
    const modulation = currentModCodOptions.find(modul => modul.modulationId === modulationId)?.modulation;

    // Get the valid modulation and coding combinations that 
    // include the currently selected modulation. 
    const filteredCodings = currentModCodOptions
      .filter(option => option.modulation === modulation)
      .map(option => option.coding);

    // Iterate over the valid modulation and coding combinations and create
    // the arrays used to populate the modulation and coding dropdowns.
    const validModulations: Attribute[] = [];
    const validCodings: Attribute[] = [];
    currentModCodOptions.forEach((option: { modulationId: number, modulation: string, codingId: number, coding: string, dataRate_kbps?: number }) => {
      // Add unique modulation and codings to arrays. These arrays are used to 
      // populate the dropdowns. 
      if (validModulations.filter(validMod => validMod.id === option.modulationId).length === 0) {
        validModulations.push({
          id: option.modulationId,
          name: option.modulation
        });
      }
      if (
        validCodings.filter(validCod => validCod.id === option.codingId).length === 0 &&
        filteredCodings.includes(option.coding)
      ) {
        validCodings.push({
          id: option.codingId,
          name: option.coding
        });
      }
    }
    );

    let codingId = 0;
    if (
      !state.selectedItems.find(
        (item) => item.id === state.radioButtonSelectionId
      )?.codingId
    ) {
      if (validCodings.length > 0) {
        // Select the first coding from the list.
        codingId = validCodings[0].id;
      } else {
        // If there is not currently a selcted coding and
        // no coding options were returned, return from this
        // function.
        return;
      }
    } else {
      // Check whether the selected coding is in the list
      // of valid options. If not, select a new coding.
      codingId = state.selectedItems.find(
        (item) => item.id === state.radioButtonSelectionId
      )?.codingId;

      if (!validCodings.map((option) => option.id).includes(codingId)) {
        if (validCodings.length > 0) {
          codingId = validCodings[0].id;
        } else {
          return;
        }
      }
    }

    const coding = currentModCodOptions.find(coding => coding.codingId === codingId)?.coding;

    setModuls(validModulations);
    setCodings(validCodings);
    setModCods(newModCodOptions);
    setOptions((prevState) => ({
      ...prevState,
      modulation: modulationId,
      coding: codingId
    }));
    updateThroughput(modulation, coding);

    // If the code reaches this point, a valid frequency band, antenna (in the case
    // a ground station is selected), and a modulation and coding have been selected.
    // Update the selectedItems state object with these values.
    updateState(
      frequencyBandId,
      antennaId,
      antennaName,
      modulationId,
      codingId,
      modulation,
      coding,
      optimizedModCod
    );
  };

  const updateState = (
    frequencyBandId: number,
    antennaId: number,
    antennaName: string,
    modulationId: number,
    codingId: number,
    modulation: string,
    coding: string,
    optimizedModCod: boolean
  ) => {
    const newSelectedItems = state.selectedItems.map((item) => {
      if (item.id === state.radioButtonSelectionId) {
        return {
          ...item,
          frequencyBandId: frequencyBandId,
          antennaId: antennaId,
          antennaName: antennaName,
          modulationId: modulationId,
          codingId: codingId,
          modulation: modulation,
          coding: coding,
          optimizedModCod: optimizedModCod
        };
      } else {
        return item;
      }
    });
    onState('selectedItems', newSelectedItems);
  };

  // This function is called when any of the dropdown values are changed.
  // These are currently frequency band, antenna, modulation, and coding.
  // Updates the state.
  const handleOption = (event): void => {
    const { name, value } = event.target;

    const selectedItem = state.selectedItems.find(
      (item) => item.id === state.radioButtonSelectionId
    );

    if (name === 'modulation') {
      //const modulation = moduls.find(modul => modul.id === value)?.name;
      //setOptions((prevState) => ({
      //  ...prevState,
      //  modulation: value
      //}));
      updateModCods(modCods, selectedItem?.frequencyBandId, selectedItem?.antennaId, selectedItem?.antennaName, selectedItem?.optimizedModCod, value);
      //updateState(selectedItem?.frequencyBandId, selectedItem?.antennaId, selectedItem?.antennaName, value, selectedItem?.codingId, modulation, selectedItem?.coding, selectedItem?.optimizedModCod);
    } else if (name === 'coding') {
      const coding = codings.find((coding) => coding.id === value)?.name;
      setOptions((prevState) => ({
        ...prevState,
        coding: value
      }));

      updateThroughput(selectedItem?.modulation, coding);
      updateState(selectedItem?.frequencyBandId, selectedItem?.antennaId, selectedItem?.antennaName, selectedItem?.modulationId, value, selectedItem?.modulation, coding, selectedItem?.optimizedModCod);
    }
    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
  };

  // This function is called when the Optimized Modulation and Coding checkbox
  // is checked (or unchecked). The modulation and coding values are also
  // updated accordingly.
  const handleCheck = (event): void => {
    const { checked } = event.currentTarget;

    const selectedItem = state.selectedItems.find(
      (item) => item.id === state.radioButtonSelectionId
    );
    handleModCods(
      selectedItem?.frequencyBandId,
      selectedItem?.antennaId,
      selectedItem?.antennaName,
      checked
    );

    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
  };


  return (
    <>
      <Box className={classes.box}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          style={{ paddingTop: '10px' }}
        >
          <Grid item md={6}>
            <Tooltip title={TooltipList.EIRP}>
              <Typography
                className={classes.text}
              >
                {'EIRP (dBW)'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <FormControl variant='filled' className={classes.input}>
              <TextField
                name="eirp"
                value={isNull(eirpVal) || isNaN(eirpVal) ? '' : eirpVal}
                onBlur={(ev) => ev.target.value.length > 0 && ev.target.value !== '' ? (!state.isDataLoaded ? setEirpVal(parseFloat(ev.target.value)) : null) : (!state.isDataLoaded ? setEirpVal(null) : null)}
                fullWidth
                placeholder={isNull(eirpVal) || isNaN(eirpVal) ? "Calculated" : ""}
                InputProps={{
                  inputComponent: CustomNumberFormat,
                  disableUnderline: true,
                  inputProps: {
                    // className: classes.input,
                    min: -999999,
                    max: 999999
                  },
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Tooltip
                        title={'EIRP Calculator'}
                        placement="top-start"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => setEirpCalc(true)}
                          disabled={
                            state.loading
                          }
                        >
                          <Icon
                            style={{
                              textAlign: 'center',
                              overflow: 'visible'
                            }}
                          >
                            <img
                              alt="calculate"
                              src="/static/icons/calculator.svg"
                              style={{
                                height: (window.screen.availHeight / zoom) * 0.032,
                                paddingBottom: '12px',
                              }}
                            />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
                disabled={
                  state.loading
                }
              />
            </FormControl>
          </Grid>

          <Grid item md={6}>
            <Tooltip title={TooltipList.polarizationType}>
              <Typography className={classes.text}>
                {'Polarization Type'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <Autocomplete
              options={polarizationOptions}
              getOptionDisabled={(option) => option.disabled}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} placeholder="---" variant="outlined" />}
              color="primary"
              size='small'
              value={getPolarizationValue()}
              className={`${classes.noOutline} ${classes.enhanceDropdown} ${state.commsSpecs.commsPayloadSpecs.polarizationType !== -2 && classes.selectedEnhanceDropdown}`}
              forcePopupIcon={state.commsSpecs.commsPayloadSpecs.polarizationType !== -2 ? false : true}
              style={{ textAlign: 'center' }}
              //@ts-ignore
              onChange={(e, newVal) => { handleClick({ target: { name: "polarizationType", value: (newVal ? newVal.id : -1) } }) }}
              openOnFocus={true}
            />
          </Grid>
          <Grid item md={6}>
            <Tooltip title={TooltipList.polarizationLoss}>
              <Typography className={classes.text}>
                {'Polarization Loss (dB)'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name="polarizationLoss"
              value={state.commsSpecs.commsPayloadSpecs.polarizationLoss}
              onBlur={(e) => { handleClick(e) }}
              fullWidth
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.polarizationLoss.min,
                  max: bounds.polarizationLoss.max
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
          <Grid item md={6}>
            <Tooltip title={TooltipList.pointingLoss}>
              <Typography className={classes.text}>
                {'Pointing Loss (dB)'}
              </Typography>
            </Tooltip>
            <Typography color="textSecondary"></Typography>
          </Grid>
          <Grid item md={6}>
            <TextField
              name="pointingLoss"
              value={state.commsSpecs.commsPayloadSpecs.pointingLoss}
              onBlur={(e) => { handleClick(e) }}
              fullWidth
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.pointingLoss.min,
                  max: bounds.pointingLoss.max
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
          <Grid item md={6}>
            <Tooltip title={TooltipList.otherLosses}>
              <Typography className={classes.text}>
                {'Other Losses (dB)'}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item md={6}>
            <TextField
              name="otherLoss"
              value={state.commsSpecs.commsPayloadSpecs.otherLoss}
              onBlur={(e) => { handleClick(e) }}
              fullWidth
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.otherLoss.min,
                  max: bounds.otherLoss.max
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
          {/* {state.selectedItems.length <= 0 
        ?*/}
          <>
            <Grid item md={6}>
              <Tooltip title={TooltipList.modulation}>
                <Typography className={classes.text}>
                  {'Modulation'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item md={6}>
              <Autocomplete
                options={filteredModList}
                getOptionDisabled={(option) => option.disabled}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} placeholder="---" variant="outlined" />}
                color="primary"
                size='small'
                value={getModulationValue()}
                className={`${classes.noOutline} ${classes.enhanceDropdown} ${state.commsSpecs.commsPayloadSpecs.modulation !== -2 && classes.selectedEnhanceDropdown}`}
                forcePopupIcon={state.commsSpecs.commsPayloadSpecs.modulation !== -2 ? false : true}
                style={{ textAlign: 'center' }}
                //@ts-ignore
                onChange={(e, newVal) => { handleClick({ target: { name: "modulation", value: (newVal ? newVal.id : -1) } }) }}
                openOnFocus={true}
              />
            </Grid>
            <Grid item md={6}>
              <Tooltip title={TooltipList.coding}>
                <Typography className={classes.text}>
                  {'Coding Type'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item md={6}>
              <FormControl variant="filled" size="small" fullWidth className={classes.select}>
                <Select
                  className={`${classes.noOutline}`}
                  name="codingType"
                  variant="outlined"
                  data-filter-network="true"
                  color="primary"
                  value={state.commsSpecs.commsPayloadSpecs.codingType}
                  onChange={(e) => { handleClick(e) }}
                  disabled={state.loading}
                  fullWidth
                >
                  {filteredCodingTypeOptions.map((option, idx) => {
                    return <MenuItem key={idx} value={option.id} disabled={option.disabled}>{option.name}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6}>
              <Tooltip title={TooltipList.coding}>
                <Typography className={classes.text}>
                  {'Coding Rate'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item md={6}>
              <Autocomplete
                options={filteredCodingOptions}
                getOptionDisabled={(option) => option.disabled}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} placeholder="---" variant="outlined" />}
                color="primary"
                size='small'
                value={getCodingRateValue()}
                className={`${classes.noOutline} ${classes.enhanceDropdown} ${state.commsSpecs.commsPayloadSpecs.coding !== -2 && classes.selectedEnhanceDropdown}`}
                forcePopupIcon={state.commsSpecs.commsPayloadSpecs.coding !== -2 ? false : true}
                style={{ textAlign: 'center' }}
                //@ts-ignore
                onChange={(e, newVal) => { handleClick({ target: { name: "coding", value: (newVal ? newVal.id : -1) } }) }}
                openOnFocus={true}
              />
            </Grid>
          </>
        </Grid>
      </Box>



      {/*****************************************************************************************************/}
      {/***************************************  Calculators  ***********************************************/}
      {/*****************************************************************************************************/}

      <DialogBox
        id="gainCalcOptions"
        title="Antenna Type"
        isOpen={gainCalcOptions}
        onClose={() => setGainCalcOptions(false)}
        className={{ paper: classes.dialog }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item md={12}>
            <Typography variant="body1" component="p" color="textPrimary">
              Please select the type of Antenna you would like to calculate Gain
              for
            </Typography>
          </Grid>
          <Grid item md={12}>
            <FormControl variant="filled" size="small" fullWidth>
              <Select
                className={classes.input}
                name="antennaType"
                variant="outlined"
                data-filter-network="true"
                value={gainCalcId}
                color={'primary'}
                onChange={(ev) => {
                  //@ts-ignore
                  setGainCalcId(ev.target.value);
                }}
              >
                <MenuItem value={0}>Parabolic Reflector</MenuItem>
                <MenuItem value={1}>Patch Antenna</MenuItem>
                <MenuItem value={2}>Dipole Antenna</MenuItem>
                <MenuItem value={3}>Helix Antenna</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={12}>
            <Typography
              variant="body2"
              component="p"
              color="textSecondary"
              align="center"
            >
              {gainCalcNotes}
            </Typography>
          </Grid>
          <Grid item md={12} container alignItems={'flex-end'}>
            <Button
              name="submitSystem"
              variant="contained"
              color="primary"
              onClick={launchGainCalc}
              style={{ float: 'right' }}
            >
              Calculate
            </Button>
          </Grid>
        </Grid>
      </DialogBox>

      <Calculator
        descriptor={'Calculate EIRP in dBW'}
        calcName={'EIRP Calculator'}
        resultVar={'EIRP'}
        resultUnits={'dBW'}
        latex={'{EIRP} = {P_T} + {G_{Ant}} - {L_P}'}
        params={[
          {
            gain: {
              name: 'Antenna Gain in dB',
              labelTeX: '{G_{Ant}}'
            }
          },
          {
            txPwr: {
              name: 'Transmitter Power in dBW',
              labelTeX: '{P_T}'
            }
          },
          {
            passiveLoss: {
              name: 'Passive Loss in dB',
              labelTeX: '{L_P}'
            }
          }
        ]}
        calculate={(params: {
          gain: number;
          passiveLoss: number;
          txPwr: number;
        }) => {
          return params.gain + params.txPwr - params.passiveLoss;
        }}
        isOpen={eirpCalc}
        setIsOpen={setEirpCalc}
        infoLatex={''}
        setResult={setEirpVal}
        key={'eirpCalc'}
      />

      <Calculator
        descriptor={'Calculate Gain in dBi'}
        calcName={'Gain Calculator (Parabolic Reflector)'}
        resultVar={'Gain'}
        resultUnits={'dBi'}
        latex={
          '{Gain} = 20log_{10} (\\frac{\\pi f*1e9*D}{3e8} ) + 10log_{10}(\\frac{E}{100})'
        }
        params={[
          {
            freq: {
              name: 'Frequency in GHz',
              labelTeX: '{f}'
            }
          },
          {
            efficiency: {
              name: 'Efficiency \\%',
              labelTeX: '{E}'
            }
          },
          {
            diameter: {
              name: 'Diameter in m',
              labelTeX: '{D}'
            }
          }
        ]}
        calculate={gainCalcEqn_Parabolic}
        isOpen={parabolicCalc}
        setIsOpen={setParabolicCalc}
        infoLatex={''}
        setResult={(value) => {
          handleClick({ target: { name: 'gain', value: value } });
        }}
        key={'parabolicGainCalc'}
      />

      <Calculator
        descriptor={'Calculate Gain in dBi'}
        calcName={'Gain Calculator (Helix)'}
        resultVar={'Gain'}
        resultUnits={'dBi'}
        latex={'{Gain} = 10log_{10} (15*\\frac{NC^2 S}{\\lambda^3})'}
        params={[
          {
            turns: {
              name: 'Number of Turns',
              labelTeX: '{N}'
            }
          },
          {
            freq: {
              name: 'Frequency in GHz',
              labelTeX: '{f}'
            }
          }
        ]}
        constants={[
          {
            wavelength: {
              key: 'wavelength',
              value: '3e8/(f*1e9)',
              name: 'Wavelength in m',
              labelTeX: '\\lambda'
            }
          },
          {
            spacing: {
              key: 'spacing',
              value: '0.25 \\lambda',
              name: 'Spacing between coils in m',
              labelTeX: 'S'
            }
          }
        ]}
        calculate={gainCalcEqn_Helix}
        isOpen={helixCalc}
        setIsOpen={setHelixCalc}
        infoLatex={''}
        setResult={(value) => {
          handleClick({ target: { name: 'gain', value: value } });
        }}
        key={'helixGainCalc'}
      />
    </>
  );
};

export default CommsPayloadSpecDialog;
