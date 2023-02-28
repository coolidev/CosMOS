import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { CommsSpecs, Constraints, Parameter, SelectedNetwork } from "src/types/preference";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import type { Theme } from 'src/theme';
import { AttrValue } from "src/components/Mission/CommServicesDef";
import axios from "src/utils/axios";
import clsx from 'clsx';

interface ParameterSummaryProps {
    parameters: Parameter;
    missionTime: any;
    commsSpecs: CommsSpecs;
    accordion: any;
    setAccordion: any;
    networkType: string;
    constraints: Constraints;
    selectedItems: SelectedNetwork[];
  };
  
//   interface IAccordion {
//     [key: string]: boolean;
//   }
  
//   const initialAccordion: IAccordion = {
//     'missionParameters': true,
//     'missionTimeframe': false,
//     'commDefinitions': false,
//     'commsPayloadSpecs': false,
//     'coverageMetrics': false
//   };
  
  const useStyles = makeStyles((theme: Theme) => ({
    interiorBox: {
        backgroundColor: theme.palette.component.main
      },
      table: {
        '& .MuiTableCell-root': {
            borderBottom: `1px solid ${theme.palette.border.opposite}`,
        },
        '& .MuiTableCell-head': {
            color: `${theme.palette.text.primary}`,
            backgroundColor: `${theme.palette.background.paper}`,
        },
      },
      interiorAccordian: {
        width: '100%',
      },
      box: {
        margin: theme.spacing(2, 5, 2, 5),
        backgroundColor: theme.palette.background.light,
        borderRadius: 6
      },
      listBox: {
        overflowY: 'auto',
        border: `1px solid ${theme.palette.border.main}`
      },
      header: {
        fontWeight: 'bold'
      },
      tableElement: {
        minWidth: '13vw',
        maxWidth: '13vw'
      },
  }));
  
  const ParameterSummary: FC<ParameterSummaryProps> = ({
        parameters,
        missionTime,
        commsSpecs,
        accordion,
        setAccordion,
        networkType,
        constraints,
        selectedItems
    }) => {

        const classes = useStyles();
        const [dataSource, setDataSource] = useState<any>({title: '', parameters: [], commsSpecs: [], coverageMetrics: [], commsPayloadSpecs: [], missionTime: []});
        // const [accordionController, setAccordionController] = useState<IAccordion>(initialAccordion);
        const [modulationOptions, setModulationOptions] = useState<AttrValue[]>([]);
        const [codingOptions, setCodingOptions] = useState<AttrValue[]>([]);
        const [codingTypeOptions, setCodingTypeOptions] = useState<AttrValue[]>([]);
        const [polarizationOptions, setPolarizationOptions] = useState<AttrValue[]>([]);
        const [freqBandOptions, setFreqBandOptions] = useState<AttrValue[]>([]);
        const [freqBandDetails, setFreqBandDetails] = useState<any[]>(null);
        const [selectedCenterBand, setSelectedCenterBand] = useState<string>('--');

        useEffect(() => {
            const fetchFrequencyBandSpecs = async () => {
              const response = await axios.get<AttrValue[]>(
                '/getFrequencyBandSpecs',
                {}
              );
              response.data && setFreqBandDetails(response.data);
            };
            fetchFrequencyBandSpecs();
          }, []);

        useEffect(() => {
            if(accordion.params){
                setAccordion({params: true, networkSelection: false, analysisParameters: false});
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },[accordion.params]);
        
        useEffect(() => {
            const fetchModulationTypeData = async () => {
                const response = await axios.get<AttrValue[]>('/getAttributeValues', {
                params: { sub_key: 'antenna_modulation' }
                });
                response.data && setModulationOptions(response.data);
            };
        
            fetchModulationTypeData();
        }, []);
        
        useEffect(() => {
            const fetchCodingTypeData = async () => {
                const response = await axios.get<AttrValue[]>('/getAttributeValues', {
                params: { sub_key: 'channel_coding' }
                });
        
                response.data && setCodingOptions(response.data);
            };
        
            fetchCodingTypeData();
        }, []);

        useEffect(() => {
            const fetchCodingTypeData = async () => {
                const response = await axios.get<AttrValue[]>('/getAttributeValues', {
                params: { sub_key: 'codingTypes' }
                });
        
                response.data && setCodingTypeOptions(response.data);
            };
        
            fetchCodingTypeData();
        }, []);
        
        useEffect(() => {
            const fetchPolarizationTypeData = async () => {
                const response = await axios.get<AttrValue[]>('/getAttributeValues', {
                params: { sub_key: 'antenna_polarization' }
                });
        
                response.data && setPolarizationOptions(response.data);
            };
        
            fetchPolarizationTypeData();
        }, []);

        useEffect(()=>{
            const fetchFrequencyBandData = async () => {
              const response = await axios.get<AttrValue[]>('/getAttributeValues', {
                params: { sub_key: 'frequency_bands ' }
              });
              response.data && setFreqBandOptions(response.data);
            };
            fetchFrequencyBandData();
          },[]);

        //This whole thing makes sure that the parameters panel updates when the actual parameters are updated
        useEffect(() => {
            
            try{
                const band = selectedItems[0]?.frequencyBandId ?? 0
        
                if(band === 0 || selectedItems.length > 1){
                    setSelectedCenterBand('--');
                }else{
                        const currFreq = freqBandDetails.find(
                        (curr) => curr.id === band
                    );
                    setSelectedCenterBand((currFreq.minFrequency_MHz + (currFreq.maxFrequency_MHz - currFreq.minFrequency_MHz) / 2).toFixed(0));
                }
            }catch{}
            
            
            let newDataSource = {title: '', parameters: [], commsSpecs: [], coverageMetrics: [], commsPayloadSpecs: [], missionTime: []}
            if(parameters.isOrbital){
                if(!parameters.orbitState || parameters.orbitState === 0){
                    newDataSource.title = 'Circular Orbit'; 
                    newDataSource.parameters= [
                        {name: 'Altitude (km)', value: parameters.altitude},
                        {name: 'Inclination (deg)', value: parameters.inclination}, 
                        {name: 'RAAN (deg)', value: parameters.raan}
                    ];
                } else if (parameters.orbitState === 1){
                    newDataSource.title= 'Eccentric Orbit' 
                    newDataSource.parameters= [
                        {name: 'Semimajor Axis (km)', value: parameters.altitude + 6378},
                        {name: 'Eccentricity', value: parameters.eccentricity}, 
                        {name: 'Inclination (deg)', value: parameters.inclination},
                        {name: 'Argument of Perigee (deg)', value: parameters.argumentOfPerigee},
                        {name: 'RAAN (deg)', value: parameters.raan},
                        {name: 'True Anomaly (deg)', value: parameters.trueAnomaly}
                    ];
                } else if (parameters.orbitState === 2){
                    newDataSource.title= 'Sun-Sync Orbit' 
                    newDataSource.parameters= [
                        {name: 'Altitude (km)', value: parameters.altitude},
                        {name: 'Inclination (deg)', value: parameters.inclination}, 
                        {name: 'LTAN (hh:mm)', value: parameters.ltan}
                    ];
                }
            } else {
                newDataSource.title = 'Terrestrial Mission'
                newDataSource.parameters = [
                    {name: 'Latitude (deg)', value: parameters.latitude},
                    {name: 'Longitude (deg)', value: parameters.longitude},
                ]
            }
            newDataSource.commsSpecs = [
                {name: 'Data Volume (GB)', value: constraints.throughputFlag?((commsSpecs.dataVolumeGb_day/8)?.toFixed(2) ?? '--'):'--'}, 
                {name: 'Data Rate (Mbps)', value: !constraints.throughputFlag?((commsSpecs.dataRateKbps/1000)?.toFixed(2) ?? '--'):'--'},
                {name: 'Frequency Band', value: (networkType === 'dte' ? ((Array.from(new Set(selectedItems.flatMap((item) => {return item.frequencyBandId}).filter((item)=>{return item !== 0}))).map((selectionId) => freqBandOptions.find((obj)=>{return obj.id === selectionId})?.name)).join(`,\n\r`) ):(commsSpecs.freqBand === 0 || isNaN(commsSpecs.freqBand)) ? '--' : freqBandOptions.find((obj)=>{return obj.id === commsSpecs.freqBand})?.name ?? '--')},
                {name: 'Center Frequency (MHz)', value: (networkType === 'relay' ? (commsSpecs.centerBand? (commsSpecs.centerBand>0?commsSpecs.centerBand.toFixed(0):'--'): '--'):selectedCenterBand)},
                {name: 'Standards Compliance', value: (commsSpecs.standardsCompliance === 0 || isNaN(commsSpecs.standardsCompliance)) ? '--' :commsSpecs.standardsCompliance === 1?'CCSDS':'DVB-S2'},
            ];
                
            newDataSource.coverageMetrics = [
                {name: 'Mean Number Of Contacts', value: commsSpecs.coverageMetrics.meanNumContacts ?? '--'}, 
                {name: 'Mean Contact Duration (min)', value: commsSpecs.coverageMetrics.meanContactDur ?? '--'},
                // {name: 'Average Gap (min)', value: commsSpecs.coverageMetrics.averageGap ?? '--'},
                {name: 'Max Gap (min)', value: commsSpecs.coverageMetrics.maxGap ?? '--'},
                // {name: 'Mean Response Time (min)', value: commsSpecs.coverageMetrics.meanResponse ?? '--'},
                // {name: 'Mean RF Coverage (% of Orbit)', value: commsSpecs.coverageMetrics.meanRFCoverage ?? '--'}, 
                // {name: 'Service Efficiency (%)', value: commsSpecs.coverageMetrics.serviceEfficiency ?? '--'},
            ];
            newDataSource.commsPayloadSpecs= [
                // {name: 'Gain (dBW)', value: commsSpecs.commsPayloadSpecs.gain ?? '--'}, 
                {name: 'EIRP (dBW)', value: commsSpecs.commsPayloadSpecs.eirp ?? '--'},
                {name: 'Polarization Type', value: polarizationOptions.find((obj) => {return obj.id === commsSpecs.commsPayloadSpecs.polarizationType})?.name ?? '--'},
                {name: 'Polarization Loss (dB)', value: commsSpecs.commsPayloadSpecs.polarizationLoss >=0? commsSpecs.commsPayloadSpecs.polarizationLoss: '--' ?? '--'},
                {name: 'Pointing Loss (dB)', value: commsSpecs.commsPayloadSpecs.pointingLoss ?? '--'},
                // {name: 'Transmitter Power (dB)', value: commsSpecs.commsPayloadSpecs.transmitterPower ?? '--'}, 
                {name: 'Other Losses (dB)', value: commsSpecs.commsPayloadSpecs.otherLoss ?? '--'},
                {name: 'Coding Type', value: codingTypeOptions.find((obj) => {return obj.id === commsSpecs.commsPayloadSpecs.codingType})?.name ?? '--'},
                {name: 'Coding', value: codingOptions.find((obj) => {return obj.id === commsSpecs.commsPayloadSpecs.coding})?.name ?? '--'},
                {name: 'Modulation', value: modulationOptions.find((obj) => {return obj.id === commsSpecs.commsPayloadSpecs.modulation})?.name ?? '--'}
            ];
            newDataSource.missionTime = [
                {name: "Start Date", value: missionTime.launchDate},
                {name: "End Date", value: missionTime.endDate}
            ];
            setDataSource(newDataSource);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [networkType, parameters, commsSpecs, missionTime])

        const handleAccordion = () => {
            setAccordion({...accordion, params: !accordion['params']});
        }

        // const handleAccordionController = (event) => {
        //     const { id } = event.currentTarget;
        //     const value = event.currentTarget.getAttribute('aria-expanded') === 'false';
        //     setAccordionController((prevState) => ({ ...prevState, [id]: value }));
        //   };

        return (
        <Box
            className={clsx(classes.box, classes.listBox)}
        >
            <Accordion key={'parameterSummary'} className={classes.interiorBox} expanded={accordion[`params`]}>
                <AccordionSummary id={`paramSummary`} onClick={handleAccordion}>
                    <Typography style={{ width: '100%', fontSize: '12pt' }}>
                        {`Parameters Summary`}
                    </Typography>
                    {!accordion[`params`] ? (
                        <KeyboardArrowDownIcon fontSize="small" />
                        ) : (
                    <KeyboardArrowUpIcon fontSize="small" />
                )}
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing = {1}>
                        <Grid item md = {12}>
                            <Typography
                            variant="body1"
                            component="p"
                            color="textPrimary"
                            className={classes.header}
                            >
                            {`${parameters.isOrbital? 'Orbital': 'Terrestrial'} Parameters`}
                            </Typography>
                        </Grid>
                        <Grid item md={12}>
                            <Table stickyHeader size="small" className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableElement}>
                                            {'Parameter'}
                                        </TableCell>
                                        <TableCell>
                                            {'Value'}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataSource.parameters.map((row) => { 
                                        return(
                                        <TableRow key={row.name}>
                                            <TableCell className={classes.tableElement}>
                                                {row.name}
                                            </TableCell>
                                            <TableCell>
                                                {row.value}
                                            </TableCell>
                                        </TableRow>
                                        )
                                    }
                                    )}
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item md = {12} style={{marginTop:'20px'}}>
                            <Typography
                            variant="body1"
                            component="p"
                            color="textPrimary"
                            className={classes.header}
                            >
                            {'Mission Time Frame'}
                            </Typography>
                        </Grid>
                        <Grid item md={12}>
                            <Table stickyHeader size="small" className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableElement}>
                                            {'Parameter'}
                                        </TableCell>
                                        <TableCell>
                                            {'Value'}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {dataSource.missionTime.map((row) => { 
                                        return(
                                        <TableRow key={row.name}>
                                            <TableCell className={classes.tableElement}>
                                                {row.name}
                                            </TableCell>
                                            <TableCell>
                                                {row.value}
                                            </TableCell>
                                        </TableRow>
                                        )
                                    }
                                    )}
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item md = {12} style={{marginTop:'20px'}}>
                            <Typography
                            variant="body1"
                            component="p"
                            color="textPrimary"
                            className={classes.header}
                            >
                            {`Communications Services Definition`}
                            </Typography>
                        </Grid>
                        <Grid item md={12}>
                            <Table stickyHeader size="small" className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableElement}>
                                            {'Parameter'}
                                        </TableCell>
                                        <TableCell>
                                            {'Value'}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataSource.commsSpecs.map((row) => { 
                                        return(
                                        <TableRow key={row.name}>
                                            <TableCell className={classes.tableElement} >
                                                {row.name}
                                            </TableCell>
                                            <TableCell style={{whiteSpace: 'pre-wrap'}}>
                                                {(!isNaN(Number(row.value)))? Number(row.value).toFixed(2): row.value}
                                            </TableCell>
                                        </TableRow>
                                        )
                                    }
                                    )}
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item md = {12} style={{marginTop:'20px'}}>
                            <Typography
                                variant="body1"
                                component="p"
                                color="textPrimary"
                                className={classes.header}
                                >
                                {`Coverage Metrics`}
                                </Typography>
                            </Grid>
                        <Grid item md = {12}>
                            <Table stickyHeader size="small" className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableElement}>
                                            {'Parameter'}
                                        </TableCell>
                                        <TableCell>
                                            {'Value'}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataSource.coverageMetrics.map((row) => { 
                                        return(
                                        <TableRow key={row.name}>
                                            <TableCell className={classes.tableElement}>
                                                {row.name}
                                            </TableCell>
                                            <TableCell>
                                                {(!isNaN(Number(row.value)))? Number(row.value).toFixed(2): row.value}
                                            </TableCell>
                                        </TableRow>
                                        )
                                    }
                                    )}
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item md = {12} style={{marginTop:'20px'}}>
                            <Typography
                                variant="body1"
                                component="p"
                                color="textPrimary"
                                className={classes.header}
                                >
                                {`Comms Payload Specifications`}
                                </Typography>
                            </Grid>
                        <Grid item md = {12}>
                            <Table stickyHeader size="small" className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableElement}>
                                            {'Parameter'}
                                        </TableCell>
                                        <TableCell>
                                            {'Value'}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataSource.commsPayloadSpecs.map((row) => { 
                                        return(
                                        <TableRow key={row.name}>
                                            <TableCell className={classes.tableElement}>
                                                {row.name}
                                            </TableCell>
                                            <TableCell>
                                                {(!isNaN(Number(row.value)))? Number(row.value).toFixed(2): row.value}
                                            </TableCell>
                                        </TableRow>
                                        )
                                    }
                                    )}
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
  };
  
  export default ParameterSummary;