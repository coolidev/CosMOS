import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	makeStyles,
	Radio,
	TextField,
} from "@material-ui/core";

import { FC, useEffect, useState } from "react";
import axios from "src/utils/axios";
import { LinkProps } from "../LinksList";
import { Theme } from 'src/theme'
import { ConnectivitySource as RelationshipSource } from "../Manager";

interface LinksBuilderProps {
	networkId: number
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(1),
		padding: theme.spacing(3),
		height: '50vh'
	},
	mainPanel: {
		justifyContent: 'space-between',
	},
	mainAction: {
		marginTop: '2rem',
	},
	labelBox: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		justifyContent: 'space-between'
	},
	linksComp: {
		border: `1px solid #E3E3E3`,
		backgroundColor: 'white',
		// padding: theme.spacing(4),
		minHeight: 'calc(100% - 1.5rem)',
		overflowY: 'auto'
	},
	linkItem: {
		padding: theme.spacing(2),
		cursor: 'pointer',
		borderTop: `1px solid #E3E3E3`,
		borderRight: `1px solid #E3E3E3`,
		borderLeft: `1px solid #E3E3E3`,
		'&:last-child': {
			borderBottom: `1px solid #E3E3E3`
		}
	},
	activeLinkItem: {
		backgroundColor: '#e34747',
		color: 'white',
	},
	actionButton: {
		width: '50%',
		margin: '0.5rem',
	},
	submitButton: {
		width: '40%',
		margin: '0.5rem',
	},
	saveModalButton: {
		color: '#e34747'
	},
	rotationRight: {
		// color: "white",
		// transform: 'rotate(90deg)',
		'&:hover': {
			transform: 'scale(1.1)',
			opacity: 0.9
		}
	},
}));

const LinksBuilder: FC<LinksBuilderProps> = ({
	networkId
}) => {
	const [filter, setFilter] = useState<boolean>(true); // if connection is downstream
	const [relationshipSource, setRelationshipSource] = useState<RelationshipSource[]>([])
	const [establishedRelations, setEstablishedRelations] = useState<RelationshipSource[]>([])
	const [selectedItems, setSelectedItems] = useState<string[]>([])
	const [isUpdated, setIsUpdated] = useState<boolean>(false)

	const [openSave, setOpenSave] = useState<boolean>(false);

	const [linkName, setLinkName] = useState<string>('');
	const [lastLinkId, setLastLinkId] = useState<number>(0);

	const classes = useStyles();

	useEffect(() => {
		console.log(relationshipSource);
	}, [relationshipSource]);

	useEffect(() => {
		const initializeData = async () => {
			const params = { id: networkId }; // update with the id of the planet
			const response = await axios.post<RelationshipSource[]>('/requestRelationship', params);

			if (response.data) {
				setRelationshipSource(response.data)
			}

			const linkResponse = await axios.post<LinkProps[]>('/getLinks', params);

			if (linkResponse.data) {
				setLastLinkId(linkResponse.data.at(-1)?.linkId ?? 0);
			} else {
				setLastLinkId(0);
			}
		};
		initializeData();
	}, [networkId])

	const handleFilter = () => {
		setFilter(!filter)
		clearSelection();
	}

	const handleSelectRelation = (key: string, sourceId: number) => {
		const data = selectedItems.filter((item) => item.split('_')[0] === key);
		const prekey = `${key}_${sourceId}`;
		const index = data.indexOf(prekey);
		if (index > -1) {
			data.splice(index, 1);
		} else {
			data.push(prekey);
		}
		setIsUpdated(!isUpdated)
		setSelectedItems(data);
	}

	const checkDisableStatus = () => {
		let disableStatus = 0;
		if (selectedItems.length > 0 && selectedItems[0].split('_')[0] === 'established') {
			const establishedIds = establishedRelations.map((one) => one.id.toString());
			const selectedIds = selectedItems;
			selectedIds.sort((a, b) => {
				return establishedIds.indexOf(a.split('_')[1]) - establishedIds.indexOf(b.split('_')[1]);
			});
			if (selectedIds[0].split('_')[1] === establishedIds[0]) {
				disableStatus = disableStatus + 1;
			}
			if (selectedIds[selectedIds.length - 1].split('_')[1] === establishedIds[establishedIds.length - 1]) {
				disableStatus = disableStatus + 2;
			}
		}
		return disableStatus;
	}

	const clearSelection = () => {
		setIsUpdated(!isUpdated);
		setSelectedItems([]);
	}

	const handleAdd = () => {
		if (selectedItems.length > 0 && selectedItems[0].split('_')[0] === 'prelist') {
			const data = establishedRelations;
			selectedItems.map((selectedItem) => {
				const id = selectedItem.split('_')[1];
				for (let i = 0; i < relationshipSource.length; i++) {
					const element = relationshipSource[i];
					if (id === (element.id).toString()) {
						data.push(element);
						break;
					}
				}
				return id
			});
			setEstablishedRelations(data);
			clearSelection();
		}
	}

	const handleRemove = () => {
		if (selectedItems.length > 0 && selectedItems[0].split('_')[0] === 'established') {
			const data = establishedRelations;
			const selectedIds = selectedItems;
			const establishedIds = establishedRelations.map((one) => one.id.toString());
			selectedIds.sort((a, b) => {
				return establishedIds.indexOf(a.split('_')[1]) - establishedIds.indexOf(b.split('_')[1]);
			})
			for (let i = selectedIds.length - 1; i >= 0; i--) {
				const element = selectedIds[i];
				const id = element.split('_')[1];
				const establishedIds = data.map((one) => one.id.toString())
				const index = establishedIds.indexOf(id)
				if (index > -1) {
					selectedIds.splice(index, 1);
					data.splice(index, 1);
				}
			}
			setSelectedItems(selectedIds)
			setEstablishedRelations(data);
			clearSelection();
		}
	}

	const handleMoveUp = () => {
		const data = establishedRelations;
		const selectedIds = selectedItems;
		const establishedIds = data.map((one) => one.id.toString())
		selectedIds.sort(function (a, b) {
			return establishedIds.indexOf(a.split('_')[1]) - establishedIds.indexOf(b.split('_')[1]);
		});
		for (let i = 0; i < selectedIds.length; i++) {
			const element = selectedIds[i];
			const id = element.split('_')[1];
			const currentEstablished = data.map((one) => one.id.toString())
			const index = currentEstablished.indexOf(id);
			if (index > -1) {
				const stackData = data[index - 1];
				data.splice(index - 1, 1);
				data.splice(index, 0, stackData);
			}
		}
		setSelectedItems(selectedIds);
		setEstablishedRelations(data);
		setIsUpdated(!isUpdated);
	}

	const handleMoveDown = () => {
		const data = establishedRelations;
		const selectedIds = selectedItems;
		const establishedIds = data.map((one) => one.id.toString())
		selectedIds.sort(function (a, b) {
			return establishedIds.indexOf(b.split('_')[1]) - establishedIds.indexOf(a.split('_')[1]);
		});
		for (let i = 0; i < selectedIds.length; i++) {
			const element = selectedIds[i];
			const id = element.split('_')[1];
			const currentEstablished = data.map((one) => one.id.toString())
			const index = currentEstablished.indexOf(id);
			if (index > -1) {
				const stackData = data[index + 1];
				data.splice(index + 1, 1);
				data.splice(index, 0, stackData);
			}
		}
		setSelectedItems(selectedIds);
		setEstablishedRelations(data);
		setIsUpdated(!isUpdated);
	}

	const handleReset = () => {
		setEstablishedRelations([]);
		clearSelection();
	}

	const handleOpenSaveDialog = () => {
		setLinkName(`${filter ? 'Return' : 'Forward'} Link ${lastLinkId + 1}`)
		setOpenSave(true);
	}

	const handleCloseSaveDialog = () => {
		setOpenSave(false);
	}

	const handleSave = async () => {
		// Save is needed. Call api /createLinkSegment
		const linkSegments = [];
		establishedRelations.map((one) => {
			linkSegments.push({
				'connectionId': one.id
			})
			return one
		})
		let platformId = establishedRelations[0]?.platform_src_id;
		let antennaId = establishedRelations[0]?.antenna_src_id
		const params = {
			userId: -1, //to be added later when we care about it
			linkSegments: linkSegments,
			linkName,
			platformId,
			antennaId
		};
		const response = await axios.post('/createLinkSegments', params);

		if (response.data) {
			console.log(`Link id ${response.data.linkId} was created.`)
			// Clear selection after add
			const linkResponse = await axios.post<LinkProps[]>('/getLinks', { networkId });

			if (linkResponse.data) {
				setLastLinkId(linkResponse.data.at(-1).linkId);
			} else {
				setLastLinkId(0);
			}

			handleReset();
			setOpenSave(false);
		} else {
		}
	}

	const getLinkPath = (item: RelationshipSource): string => {
		const from = [item.antenna_src, item.rfFrontEnd_src, item.modDemod_src].filter((val) => val !== null);
		const to = [item.antenna_dest, item.rfFrontEnd_dest, item.modDemod_dest].filter((val) => val !== null);
		let linkPath = ""
		from.forEach((step) => {
			linkPath = linkPath.concat(`${step}/`);
		});
		linkPath = linkPath.substring(0, linkPath.length - 1);
		linkPath = linkPath.concat(' → ');
		to.reverse().forEach((step) => {
			linkPath = linkPath.concat(`${step}/`);
		});
		linkPath = linkPath.substring(0, linkPath.length - 1);
		return linkPath;
	}

	const renderRelationship = (key: string, source: RelationshipSource[], exclude: RelationshipSource[]) => {
		const data = source.filter((one) => {
			let isInExclude = false;
			for (let i = 0; i < exclude.length; i++) {
				const element = exclude[i];
				if (element.id === one.id) {
					isInExclude = true;
					break;
				}
			}
			return !isInExclude && one.antenna_src_id && filterByForwardOrReturn(one);
		})
		return data.map((item, idx) => {
			const prekey = `${key}_${item.id}`;
			const checkActive = selectedItems.includes(prekey);
			return (<div key={key + '_' + idx} onClick={() => handleSelectRelation(key, item.id)} className={`${classes.linkItem} ${checkActive && classes.activeLinkItem}`}>{getLinkPath(item)}</div>)
		})
	}

	const filterByForwardOrReturn = (conne: RelationshipSource) => {
		let srcLength = 0;
		if (conne.platform_src_id) srcLength++;
		if (conne.antenna_src_id) srcLength++;
		if (conne.rfFrontEnd_src_id) srcLength++;
		if (conne.modDemod_src_id) srcLength++;

		let destLength = 0;

		if (conne.platform_dest_id) destLength++;
		if (conne.antenna_dest_id) destLength++;
		if (conne.rfFrontEnd_dest_id) destLength++;
		if (conne.modDemod_dest_id) destLength++;

		if (filter) {
			return srcLength < destLength;
		} else {
			return srcLength > destLength;
		}
	}
	return (
		<>
			<div className={classes.root}>
				<Grid container className={classes.mainPanel}>
					<Grid item xs={12} sm={5}>
						<Grid container className={classes.labelBox}>
							<Grid style={{ paddingTop: '10px' }}>
								<h6>Active-Unused Connections</h6>
							</Grid>
							<Grid>
								<Radio
									name={'forwardFilter'}
									checked={!filter}
									onChange={() => filter && handleFilter()}
								/>
								Forward
								<Radio
									name={'returnFilter'}
									checked={filter}
									onChange={() => !filter && handleFilter()}
								/>
								Return
							</Grid>
						</Grid>
						<Grid className={classes.linksComp} style={{ height: "30vh" }}>
							{(isUpdated || !isUpdated) &&
								renderRelationship(
									'prelist',
									relationshipSource,
									establishedRelations
								)}
						</Grid>
					</Grid>
					<Grid item xs={12} sm={2}>
						<Grid container style={{ height: '100%' }}>
							<Grid container justifyContent="center" alignItems="flex-end" style={{ paddingTop: "50px" }}>
								<Button
									style={{ float: 'right', marginRight: '1.5vh' }}
									className={classes.actionButton}
									onClick={handleAdd}
									variant="contained"
									color="primary"
								>
									{'Add >'}
								</Button>
							</Grid>
							<Grid container justifyContent="center" alignItems="flex-start">
								<Button
									style={{ float: 'right', marginRight: '1.5vh' }}
									className={classes.actionButton}
									onClick={handleRemove}
									variant="contained"
									color="primary"
								>
									{'< Remove'}
								</Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={10} sm={4}>
						<Grid container className={classes.labelBox} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
							<h6>Established Links</h6>
						</Grid>
						<Grid className={classes.linksComp} style={{ height: "30vh" }}>
							{(isUpdated || !isUpdated) &&
								renderRelationship('established', establishedRelations, [])}
						</Grid>
					</Grid>
					<Grid item xs={1}>
						<Grid container style={{ height: '100%' }}>
							<Grid container justifyContent="center" alignItems="flex-end" style={{ paddingTop: "50px" }}>
								<IconButton
									style={{ float: 'right', marginRight: '1.5vh' }}
									className={`${classes.rotationRight}`}
									onClick={handleMoveUp}
									// variant="contained"
									color="primary"
									disabled={
										checkDisableStatus() === 1 || checkDisableStatus() === 3
									}
								>
									<svg width="34" height="34" viewBox="0 0 34 34" fill="none">
										<path d="M16.9997 23.6667C17.4719 23.6667 17.868 23.5067 18.188 23.1867C18.5069 22.8678 18.6663 22.4722 18.6663 22V16.6667L20.1663 18.1667C20.4719 18.4722 20.8608 18.625 21.333 18.625C21.8052 18.625 22.1941 18.4722 22.4997 18.1667C22.8052 17.8611 22.958 17.4722 22.958 17C22.958 16.5278 22.8052 16.1389 22.4997 15.8333L18.1663 11.5C17.9997 11.3333 17.8191 11.215 17.6247 11.145C17.4302 11.0761 17.2219 11.0417 16.9997 11.0417C16.7775 11.0417 16.5691 11.0761 16.3747 11.145C16.1802 11.215 15.9997 11.3333 15.833 11.5L11.4997 15.8333C11.1941 16.1389 11.0413 16.5278 11.0413 17C11.0413 17.4722 11.1941 17.8611 11.4997 18.1667C11.8052 18.4722 12.1941 18.625 12.6663 18.625C13.1386 18.625 13.5275 18.4722 13.833 18.1667L15.333 16.6667V22C15.333 22.4722 15.493 22.8678 15.813 23.1867C16.1319 23.5067 16.5275 23.6667 16.9997 23.6667ZM16.9997 33.6667C14.6941 33.6667 12.5275 33.2289 10.4997 32.3533C8.4719 31.4789 6.70801 30.2917 5.20801 28.7917C3.70801 27.2917 2.52079 25.5278 1.64634 23.5C0.770786 21.4722 0.333008 19.3056 0.333008 17C0.333008 14.6944 0.770786 12.5278 1.64634 10.5C2.52079 8.47223 3.70801 6.70834 5.20801 5.20834C6.70801 3.70834 8.4719 2.52056 10.4997 1.645C12.5275 0.770558 14.6941 0.333336 16.9997 0.333336C19.3052 0.333336 21.4719 0.770558 23.4997 1.645C25.5275 2.52056 27.2913 3.70834 28.7913 5.20834C30.2913 6.70834 31.4786 8.47223 32.353 10.5C33.2286 12.5278 33.6663 14.6944 33.6663 17C33.6663 19.3056 33.2286 21.4722 32.353 23.5C31.4786 25.5278 30.2913 27.2917 28.7913 28.7917C27.2913 30.2917 25.5275 31.4789 23.4997 32.3533C21.4719 33.2289 19.3052 33.6667 16.9997 33.6667Z" fill="#E34747"/>
									</svg>
								</IconButton>
							</Grid>
							<Grid container justifyContent="center" alignItems="flex-start">
								<IconButton
									style={{ float: 'right', marginRight: '1.5vh' }}
									className={`${classes.rotationRight}`}
									onClick={handleMoveDown}
									// variant="contained"
									color="primary"
									disabled={
										checkDisableStatus() === 2 || checkDisableStatus() === 3
									}
								>
									<svg width="34" height="34" viewBox="0 0 34 34" fill="none">
										<path d="M17.0003 10.3333C16.5281 10.3333 16.132 10.4933 15.812 10.8133C15.4931 11.1322 15.3337 11.5278 15.3337 12L15.3337 17.3333L13.8337 15.8333C13.5281 15.5278 13.1392 15.375 12.667 15.375C12.1948 15.375 11.8059 15.5278 11.5003 15.8333C11.1948 16.1389 11.042 16.5278 11.042 17C11.042 17.4722 11.1948 17.8611 11.5003 18.1667L15.8337 22.5C16.0003 22.6667 16.1809 22.785 16.3753 22.855C16.5698 22.9239 16.7781 22.9583 17.0003 22.9583C17.2225 22.9583 17.4309 22.9239 17.6253 22.855C17.8198 22.785 18.0003 22.6667 18.167 22.5L22.5003 18.1667C22.8059 17.8611 22.9587 17.4722 22.9587 17C22.9587 16.5278 22.8059 16.1389 22.5003 15.8333C22.1948 15.5278 21.8059 15.375 21.3337 15.375C20.8614 15.375 20.4725 15.5278 20.167 15.8333L18.667 17.3333L18.667 12C18.667 11.5278 18.507 11.1322 18.187 10.8133C17.8681 10.4933 17.4725 10.3333 17.0003 10.3333ZM17.0003 0.333333C19.3059 0.333333 21.4726 0.771112 23.5003 1.64667C25.5281 2.52111 27.292 3.70833 28.792 5.20833C30.292 6.70833 31.4792 8.47222 32.3537 10.5C33.2292 12.5278 33.667 14.6944 33.667 17C33.667 19.3056 33.2292 21.4722 32.3537 23.5C31.4792 25.5278 30.292 27.2917 28.792 28.7917C27.292 30.2917 25.5281 31.4794 23.5003 32.355C21.4725 33.2294 19.3059 33.6667 17.0003 33.6667C14.6948 33.6667 12.5281 33.2294 10.5003 32.355C8.47255 31.4794 6.70866 30.2917 5.20866 28.7917C3.70866 27.2917 2.52144 25.5278 1.64699 23.5C0.77144 21.4722 0.333661 19.3056 0.333662 17C0.333662 14.6944 0.77144 12.5278 1.64699 10.5C2.52144 8.47222 3.70866 6.70833 5.20866 5.20833C6.70866 3.70833 8.47255 2.52111 10.5003 1.64666C12.5281 0.771111 14.6948 0.333333 17.0003 0.333333Z" fill="#E34747"/>
									</svg>
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid
					container
					justifyContent="flex-end"
					className={classes.mainAction}
					spacing={4}
				>
					<Grid item style={{ width: '15vw', paddingTop: '5vh' }}>
						<Button
							className={classes.submitButton}
							onClick={handleReset}
							variant="contained"
							color="primary"
						>
							{'Reset'}
						</Button>
						<Button
							className={classes.submitButton}
							onClick={handleOpenSaveDialog}
							variant="contained"
							color="primary"
							disabled={establishedRelations.length === 0}
						>
							{'Save'}
						</Button>
					</Grid>
				</Grid>
				<Dialog open={openSave} onClose={handleCloseSaveDialog}>
					<DialogTitle>Link Name</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							id="linkname"
							label="Link Name"
							type="text"
							fullWidth
							variant="standard"
							value={linkName}
							onChange={(e) => {
								setLinkName(e.target.value);
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleCloseSaveDialog}
							className={classes.saveModalButton}
						>
							Cancel
						</Button>
						<Button onClick={handleSave} className={classes.saveModalButton}>
							Add
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</>
	);
};

export default LinksBuilder;
