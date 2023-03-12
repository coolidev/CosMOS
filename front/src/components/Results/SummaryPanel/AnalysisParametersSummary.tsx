import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import type { Theme } from 'src/theme';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import clsx from 'clsx';
import { StepDef } from "src/types/preference";

interface AnalysisParametersSummaryProps {
	accordion: any;
	setAccordion: any;
	parameters: any;
	networkType: string;
	parametric: boolean;
	startDate: Date;
	eccentricity: boolean;
	step: StepDef;
};

//   interface IAccordion {
//     [key: string]: boolean;
//   }

//   const initialAccordion: IAccordion = {
//     //short for parametricParameters (This was the only name I could have given it)
//     'paraPara': false,
//   };

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
		// '& .MuiTableRow-root:nth-child(odd)': {
		// 	backgroundColor: '#E3E3E3',
		// 	color: '#666666',
		// }
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

const AnalysisParametersSummary: FC<AnalysisParametersSummaryProps> = ({
	accordion,
	setAccordion,
	parameters,
	networkType,
	parametric,
	startDate,
	eccentricity,
	step
}) => {

	const classes = useStyles();
	const [displayParams, setDisplayParams] = useState({ timeStep: [], altitudeStep: [], inclinationStep: [], eccentricityStep: [] });
	// const [accordionController, setAccordionController] = useState<IAccordion>(initialAccordion);

	useEffect(() => {
		if (accordion.analysisParameters) {
			setAccordion({ params: false, networkSelection: false, analysisParameters: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accordion.analysisParameters]);

	useEffect(() => {
		let newDisplayParams = { timeStep: [], altitudeStep: [], inclinationStep: [], eccentricityStep: [] };
		const today = new Date(startDate);
		let tomorrow = new Date(startDate);
		let nextMonth = new Date(startDate);
		tomorrow.setDate(today.getDate() + 1);
		nextMonth.setMonth(today.getMonth() + 1);
		//These need to not be hard coded in the future (the values, not the names)
		newDisplayParams.timeStep = [
			{ name: "Start Time", value: step.timeStep.start.toLocaleDateString('en-US') },
			{ name: "End Time", value: step.timeStep.end.toLocaleDateString('en-US') },
			{ name: "Time Step (sec)", value: step.timeStep.step }
		];
		newDisplayParams.altitudeStep = [
			{ name: "Start Altitude (km)", value: parameters.altitudeStep.start },
			{ name: "End Altitude (km)", value: parameters.altitudeStep.end },
			{ name: "Step (km)", value: parameters.altitudeStep.step }
		];
		newDisplayParams.inclinationStep = [
			{ name: "Start Inclination (deg)", value: parameters.inclinationStep.start },
			{ name: "End Inclination (deg)", value: parameters.inclinationStep.end },
			{ name: "Step (deg)", value: parameters.inclinationStep.step }
		];
		newDisplayParams.eccentricityStep = [
			{ name: "Start Eccentricity", value: parameters.eccentricityStep.start },
			{ name: "End Eccentricity", value: parameters.eccentricityStep.end },
			{ name: "Step", value: parameters.eccentricityStep.step }
		];
		setDisplayParams(newDisplayParams);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parameters])

	const handleAccordion = () => {
		setAccordion({ ...accordion, analysisParameters: !accordion['analysisParameters'] });
	}

	// const handleAccordionController = (event) => {
	//     const { id } = event.currentTarget;
	//     const value = event.currentTarget.getAttribute('aria-expanded') === 'false';
	//     setAccordionController((prevState) => ({ ...prevState, [id]: value }));
	// };

	return (
		<Grid container>
			<Grid item md={12}>
				<Typography className={classes.subSummary}>
					Analysis Parameters
				</Typography>
			</Grid>
			<Grid item md={12} style={{ marginTop: '20px' }}>
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
						{displayParams.timeStep.map((row, i) => {
							return (
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
				{parametric &&
					<>
						<Grid item md={12} style={{ marginTop: '20px' }}>
							<Typography
								variant="body1"
								component="p"
								color="textPrimary"
								className={classes.header}
							>
								{`Parametric Parameters`}
							</Typography>
						</Grid>
						<Grid item md={12}>
							<Grid container spacing={2}>
								<Grid item md={12}>
									<Typography>
										{"Altitude"}
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
											{displayParams.altitudeStep.map((row) => {
												return (
													<TableRow>
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
								<Grid item md={12}>
									<Typography>
										{"Inclination"}
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
											{displayParams.inclinationStep.map((row) => {
												return (
													<TableRow>
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
								{eccentricity &&
									<>
										<Grid item md={12}>
											<Typography>
												{"Eccentricity"}
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
													{displayParams.eccentricityStep.map((row) => {
														return (
															<TableRow>
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
									</>
								}
							</Grid>
						</Grid>
					</>
				}
			</Grid>
		</Grid>
	);
};

export default AnalysisParametersSummary;
