import { Accordion, AccordionDetails, AccordionSummary, Box, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@material-ui/core";
import { FC, useEffect } from "react";
import type { Theme } from 'src/theme';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import clsx from 'clsx';

interface NetworkSelectionSummaryProps {
    accordion: any;
    setAccordion: any;
    selectedNetworks: any[];
    networkType: string;
  };
  
  const useStyles = makeStyles((theme: Theme) => ({
    interiorBox: {
        backgroundColor: theme.palette.component.main
      },
      table: {
        '& .MuiTableCell-root': {
            borderBottom: `1px solid ${theme.palette.border.opposite}`,
            padding: '6px 12px 6px 8px'
        },
        '& .MuiTableCell-head': {
            color: `${theme.palette.text.primary}`,
            backgroundColor: `${theme.palette.background.paper}`,
        },
      },
      tableCell: {
        fontSize: '12px'
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
  }));
  
  const NetworkSelectionSummary: FC<NetworkSelectionSummaryProps> = ({
        accordion,
        setAccordion,
        selectedNetworks,
        networkType
    }) => {

    const classes = useStyles();

    const handleAccordion = () => {
        setAccordion({...accordion, networkSelection: !accordion['networkSelection']});
    }

    useEffect(() => {
        if(accordion.networkSelection){
            setAccordion({params: false, networkSelection: true, analysisParameters: false});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[accordion.networkSelection]);

    return (
        <Box
            className={clsx(classes.box, classes.listBox)}
        >
            <Accordion key={'networkSelectionSummary'} className={classes.interiorBox} expanded={accordion[`networkSelection`]}>
                <AccordionSummary id={`networkSelectionSummary`} onClick={handleAccordion}>
                    <Typography style={{ width: '100%', fontSize: '12pt' }}>
                        {`Selected Networks`}
                    </Typography>
                    {!accordion[`networkSelection`] ? (
                        <KeyboardArrowDownIcon fontSize="small" />
                        ) : (
                        <KeyboardArrowUpIcon fontSize="small" />
                    )}
                </AccordionSummary>
                <AccordionDetails>
                    <Table stickyHeader size="small" className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell className= {classes.tableCell}>
                                    {'Network Name'}
                                </TableCell>
                                <TableCell className= {classes.tableCell}>
                                    {'Frequency Band'}
                                </TableCell>
                                {networkType === 'dte' && 
                                    <TableCell className= {classes.tableCell}>
                                        {'Antenna'}
                                    </TableCell>
                                }
                                <TableCell className= {classes.tableCell}>
                                    {'Modulation'}
                                </TableCell>
                                <TableCell className= {classes.tableCell}>
                                    {'Coding'}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedNetworks.map((network) => {
                                return(
                                    <TableRow key={network.id}>
                                        <TableCell className= {classes.tableCell}>
                                            {network.name}
                                        </TableCell>
                                        <TableCell className= {classes.tableCell}>
                                            {network.frequencyBandId && network.frequencyBandId > 0? network.supportedFrequencies?.split(', ')[network.frequencyBandId-1] : network.supportedFrequencies?.split(', ')[0]}
                                        </TableCell>
                                        {networkType === 'dte' && 
                                            <TableCell className= {classes.tableCell}>
                                                {network.antennaName}
                                            </TableCell>
                                        }
                                        <TableCell className= {classes.tableCell}>
                                            {network.optimizedModCod? 'Auto-Select': network.modulation}
                                        </TableCell>
                                        <TableCell className= {classes.tableCell}>
                                            {network.optimizedModCod? 'Auto-Select': network.coding}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
  };
  
  export default NetworkSelectionSummary;