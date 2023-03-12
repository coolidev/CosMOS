import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import React, { FC, useEffect } from "react";
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
  subSummary: {
    fontFamily: 'Roboto',
    fontStyle: "normal",
    fontSize: "26px",
    lineHeight: "32px",
    display: "flex",
    alignItems: "center",
    color: theme.palette.border.main,
		paddingTop: '1rem',
    paddingLeft: '1rem',
    borderBottom: `4px solid ${theme.palette.border.main}`,
  },
	table: {
		'& .MuiTableHead-root': {
			backgroundColor: '#E3E3E3',
			color: '#666666',
		},
		'& .MuiTableCell-root': {
			borderBottom: `1px solid ${theme.palette.border.opposite}`,
			padding: `3px 24px 3px 16px`,
			height: '30px',
		},
		'& .MuiTableCell-head': {
			color: `${theme.palette.text.primary}`,
			backgroundColor: `${theme.palette.background.paper}`,
		},
		'& .MuiTableRow-root:nth-child(odd)': {
			backgroundColor: '#E3E3E3',
			color: '#666666',
		}
	},
	tableElement: {
		width: '75%'
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
		setAccordion({ ...accordion, networkSelection: !accordion['networkSelection'] });
	}

	useEffect(() => {
		if (accordion.networkSelection) {
			setAccordion({ params: false, networkSelection: true, analysisParameters: false });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accordion.networkSelection]);

	return (
		<Grid container>
			<Grid item md={12}>
				<Typography className={classes.subSummary}>
					Selected Networks
				</Typography>
			</Grid>
			<Grid item md={12} style={{ marginTop: '20px' }}>
				<Table stickyHeader size="small" className={classes.table}>
					<TableBody>
						{selectedNetworks.map((network) => {
							return (
								<React.Fragment key={network.id}>
									<TableRow>
										<TableCell className={classes.tableCell}>
											{'Network Name'}
										</TableCell>
										<TableCell className={classes.tableCell}>
											{network.name}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className={classes.tableCell}>
											{'Frequency Band'}
										</TableCell>
										<TableCell className={classes.tableCell}>
											{network.frequencyBandId && network.frequencyBandId > 0 ? network.supportedFrequencies?.split(', ')[network.frequencyBandId - 1] : network.supportedFrequencies?.split(', ')[0]}
										</TableCell>
									</TableRow>
									{networkType === 'dte' && <TableRow>
											<TableCell className={classes.tableCell}>
												{'Antenna'}
											</TableCell>
											<TableCell className={classes.tableCell}>
												{network.antennaName}
											</TableCell>
									</TableRow>}
									<TableRow>
										<TableCell className={classes.tableCell}>
											{'Modulation'}
										</TableCell>
										<TableCell className={classes.tableCell}>
											{network.optimizedModCod ? 'Auto-Select' : network.modulation}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className={classes.tableCell}>
											{'Coding'}
										</TableCell>
										<TableCell className={classes.tableCell}>
											{network.optimizedModCod ? 'Auto-Select' : network.coding}
										</TableCell>
									</TableRow>
								</React.Fragment>
							)
						})}
					</TableBody>
				</Table>
			</Grid>
		</Grid>
	);
};

export default NetworkSelectionSummary;