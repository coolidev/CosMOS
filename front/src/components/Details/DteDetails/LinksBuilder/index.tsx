import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	makeStyles,
	Radio,
	TextField,
} from "@material-ui/core";
import { CheckBox } from "devextreme-react";
import { FC, useEffect, useState } from "react";
import axios from "src/utils/axios";
import { LinkProps } from "../LinksList";
import {Theme} from 'src/theme'
import { ConnectivitySource as RelationshipSource } from "../Manager";
import { forEach } from "cypress/types/lodash";

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
		border: `1px solid ${theme.palette.text.secondary}`,
		backgroundColor: 'white',
		padding: theme.spacing(4),
		minHeight: 'calc(100% - 1.5rem)',
		overflowY: 'scroll'
	},
	linkItem: {
		padding: theme.spacing(2),
		borderTop: `1px solid ${theme.palette.text.secondary}`,
		borderRight: `1px solid ${theme.palette.text.secondary}`,
		borderLeft: `1px solid ${theme.palette.text.secondary}`,
		'&:last-child': {
			borderBottom: `1px solid ${theme.palette.text.secondary}`
		}
	},
	activeLinkItem: {
		backgroundColor: '#e34747'
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
		transform: 'rotate(90deg)',
		marginTop: '1.5rem',
		marginBottom: '1.5rem'
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
	},[relationshipSource]);

	useEffect(() => {
    const initializeData = async () => {
      const params = { id: networkId }; // update with the id of the planet
      const response = await axios.post<RelationshipSource[]>('/requestRelationship', params);

      if (response.data) {
        setRelationshipSource(response.data)
      }

			const linkParams = {
				// linkId: linkId,
				networkId: networkId,
				// userId: userId
			};
			const linkResponse = await axios.post<LinkProps[]>('/getLinks', params);

			if (linkResponse.data) {
				setLastLinkId(linkResponse.data.at(-1)?.linkId?? 0);
			} else {
				setLastLinkId(0);
			}
    };
    initializeData();
  }, [])

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
		if (selectedItems.length > 0 && selectedItems[0].split('_')[0] === 'prelist'){
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
			});
			setEstablishedRelations(data);
			clearSelection();
		}
	}

	const handleRemove = () => {
		if (selectedItems.length > 0 && selectedItems[0].split('_')[0] === 'established'){
			const data = establishedRelations;
			const selectedIds = selectedItems;
			const establishedIds = establishedRelations.map((one) => one.id.toString());
			selectedIds.sort((a, b) => {
				return establishedIds.indexOf(a.split('_')[1]) - establishedIds.indexOf(b.split('_')[1]);
			})
			for (let i = selectedIds.length - 1; i >=  0; i--) {
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
		selectedIds.sort(function(a, b){
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
		selectedIds.sort(function(a, b){
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
			const linkResponse = await axios.post<LinkProps[]>('/getLinks', {networkId});

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
		const from = [ item.antenna_src, item.rfFrontEnd_src, item.modDemod_src].filter((val) => val !== null);
		const to = [ item.antenna_dest, item.rfFrontEnd_dest, item.modDemod_dest].filter((val) => val !== null);
		let linkPath = ""
		from.forEach((step) => {
			linkPath = linkPath.concat(`${step}/`);
		});
		linkPath = linkPath.substring(0, linkPath.length-1);
		linkPath = linkPath.concat(' → ');
		to.reverse().forEach((step) => {
			linkPath = linkPath.concat(`${step}/`);
		});
		linkPath = linkPath.substring(0, linkPath.length-1);
		return linkPath;
	}

	const renderRelationship = (key: string, source: RelationshipSource[], exclude: RelationshipSource[]) => {
		const data = source.filter((one) => {
			let isInExclude = false;
			for (let i = 0; i < exclude.length; i++) {
				const element = exclude[i];
				if (element.id === one.id ) {
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
		if(conne.platform_src_id) srcLength++;
		if(conne.antenna_src_id) srcLength++;
		if(conne.rfFrontEnd_src_id) srcLength++;
		if(conne.modDemod_src_id) srcLength++;

		let destLength = 0;

		if(conne.platform_dest_id) destLength++;
		if(conne.antenna_dest_id) destLength++;
		if(conne.rfFrontEnd_dest_id) destLength++;
		if(conne.modDemod_dest_id) destLength++;

		if(filter){
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
              <Grid style={{paddingTop: '10px'}}>
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
            <Grid className={classes.linksComp} style={{height:"30vh"}}>
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
              <Grid container justifyContent="center" alignItems="flex-end" style={{paddingTop: "50px"}}>
			  <Button
				style={{float: 'right', marginRight: '1.5vh'}}
				className={classes.actionButton}
				onClick = {handleAdd}
				variant="contained" 
				color="primary"
				>
                  {'Add >'}
                </Button>
              </Grid>
              <Grid container justifyContent="center" alignItems="flex-start">
			  <Button
				style={{float: 'right', marginRight: '1.5vh'}}
				className={classes.actionButton}
				onClick = {handleRemove}
				variant="outlined" 
				color="secondary"
				>
                  {'< Remove'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={10} sm={4}>
            <Grid container className={classes.labelBox} style={{paddingTop: '10px', paddingBottom: '10px'}}>
              <h6>Established Links</h6>
            </Grid>
            <Grid className={classes.linksComp} style={{height:"30vh"}}>
              {(isUpdated || !isUpdated) &&
                renderRelationship('established', establishedRelations, [])}
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <Grid container style={{ height: '100%' }}>
              <Grid container justifyContent="center" alignItems="flex-end" style={{paddingTop: "50px"}}>
				<Button
					style={{float: 'right', marginRight: '1.5vh'}}
					className={`${classes.rotationRight}`}
					onClick={handleMoveUp}
					variant="contained" 
					color="primary"
					disabled={
						checkDisableStatus() === 1 || checkDisableStatus() === 3
					  }
				>
                  {'<'}
                </Button>
              </Grid>
              <Grid container justifyContent="center" alignItems="flex-start">
				<Button
					style={{float: 'right', marginRight: '1.5vh'}}
					className={`${classes.rotationRight}`}
					onClick={handleMoveDown}
					variant="contained" 
					color="primary"
					disabled={
						checkDisableStatus() === 2 || checkDisableStatus() === 3
					  }
				>
                  {'>'}
                </Button>
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
          <Grid item style={{width:'20vw', paddingTop: '5vh'}}>
			<Button
				className={classes.submitButton}
				onClick={handleReset}
				variant="outlined" 
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
