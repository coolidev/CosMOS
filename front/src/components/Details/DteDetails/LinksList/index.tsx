import { Accordion, AccordionDetails, AccordionSummary, Button, Grid, makeStyles, withStyles } from "@material-ui/core";
import { Add as PlusIcon, Remove as MinusIcon } from "@material-ui/icons";
import React, { FC, useEffect, useState } from "react";
import {Theme} from 'src/theme'
import { ConnectivitySource as RelationshipSource } from "../Manager";
import axios from "src/utils/axios";

interface LinksListProps {
	networkId: number,
	isEditable: boolean
}

interface Segments {
	connectionId: number,
	linkId: number,
	name: string,
	networkId: number,
	userId: number
}

export interface LinkProps {
	linkId: number,
	name: string,
	networkId: number,
	userId: number,
	segments: Segments[],
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(1),
		padding: theme.spacing(3),
		height: '50vh'
	},
	mainPanel: {
		border: `1px solid ${theme.palette.text.secondary}`,
		backgroundColor: 'white',
		padding: theme.spacing(3),
		overflowY: 'scroll'
	},
	linkItem: {
		backgroundColor: 'transparent'
	},
	accordionDetail: {
		display: 'block',
		paddingLeft: '2rem',
		paddingRight: '0.5rem',
		paddingTop: '0',
		paddingBottom: '0',
	},
	linkSummary: {
		border: `1px solid ${theme.palette.text.secondary}`,
		padding: theme.spacing(1),
		margin: theme.spacing(2),
		minHeight: '1.5rem !important',
		'& > div': {
			margin: 'inherit !important',
			padding: '0 !important'
		}
	},
	activedLink: {
		backgroundColor: '#e34747'
	},
	subLinkItem: {
		border: `1px solid ${theme.palette.text.secondary}`,
		padding: theme.spacing(3),
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4)
	},
	mainAction: {
		marginTop: '2rem',
	},
	actionButton: {
		height: '2rem',
		margin: '0.5rem',
		// marginTop: '0.5rem',
		// marginBottom: '0.5rem',
		border: '1px solid black',
		'&:active': {
			backgroundColor: '#e34747'
		}
	},
}))

const LinksList: FC<LinksListProps> = ({
	networkId,
	isEditable
}) => {
	const [selected, setSelected] = useState<string[]>([]);
	const [relationshipSource, setRelationshipSource] = useState<RelationshipSource[]>([])
	const [linkData, setLinkData] = useState<LinkProps[]>([]);
	const [isUpdated, setIsUpdated] = useState<boolean>(false)

	const classes = useStyles();

	useEffect(() => {
    const initializeData = async () => {
			try {
				const params = {
					// linkId: linkId,
					networkId: networkId,
					// userId: userId
				};
				const response = await axios.post<LinkProps[]>('/getLinks', params);

				if (response.data) {
					setLinkData(response.data)
				} else {
					setLinkData([])
				}

				const relationshipParams = { id: networkId }; // update with the id of the planet
				const relationshipResponse = await axios.post<RelationshipSource[]>('/requestRelationship', relationshipParams);
	
				if (relationshipResponse.data) {
					setRelationshipSource(relationshipResponse.data)
				}
			} catch (e) {
				setLinkData([])
				throw e
			}
    };
    initializeData();
  }, [])

	useEffect(() => {
    const fetchData = async () => {
			try {
				const params = {
					// linkId: linkId,
					networkId: networkId,
					// userId: userId
				};
				const response = await axios.post<LinkProps[]>('/getLinks', params);
	
				if (response.data) {
					setLinkData(response.data)
				}
			} catch (e) {
				setLinkData([])
				throw e
			}
    };
    fetchData();
  }, [isUpdated])

	const IconLeftAccordionSummary = withStyles({
    expandIcon: {
        order: -1
    }
	})(AccordionSummary);

	const getLinkPath = (id: number): string => {
		const item = relationshipSource.filter((one) => one.id === id)[0]
		if (item) {
			const from = [item.platform_src, item.antenna_src, item.rfFrontEnd_src, item.modDemod_src].filter((val) => val !== null);
			const to = [item.platform_dest,item.antenna_dest,item.rfFrontEnd_dest,item.modDemod_dest].filter((val) => val !== null);
			let linkPath = ""
			from.forEach((step) => {
				linkPath = linkPath.concat(`${step}/`);
			});
			linkPath = linkPath.substring(0, linkPath.length-1);
			linkPath = linkPath.concat(' → ');
			to.forEach((step) => {
				linkPath = linkPath.concat(`${step}/`);
			});
			linkPath = linkPath.substring(0, linkPath.length-1);
			return linkPath;
		}
		return `Connection not found`
	}

	const handleSelect = (id: number) => {
		const data = selected;
		const selectedIds = data.map((one) => {
			return parseInt(one.split('_')[1]);
		})
		const index = selectedIds.indexOf(id);
		if (index > -1) {
			data.splice(index, 1);
		} else {
			data.push(`link_${id}`);
		}
		setSelected(data);
		setIsUpdated(!isUpdated);
	}

	const handleRemove = () => {
		const deleteLink = async (id: number) => {
			const params = {
				linkId: id
			}
			const response = await axios.post('/deleteLink', params);
			if (response.data) {
				console.log(`Link id ${id} was deleted.`);
				setIsUpdated(!isUpdated)
			} else {
				console.log(`No records to delete`);
			}
		}
		const selectedLinks = selected.map((one) => {
			return parseInt(one.split('_')[1]);
		})
		selectedLinks.forEach((value) => {
			deleteLink(value);
		})
	}

	return (
    <>
      <div className={classes.root}>
        <Grid className={classes.mainPanel} style ={{height: isEditable?'40vh':'48vh'}}>
          {(isUpdated || !isUpdated) &&
            linkData.map((oneLink) => {
              const isExpanded = selected
                .map((one) => one.split('_')[1])
                .includes(oneLink.linkId.toString());
              return (
                <Accordion
                  key={`link_${oneLink.linkId}`}
                  className={`${classes.linkItem}`}
                  expanded={isExpanded}
                >
                  <IconLeftAccordionSummary
                    expandIcon={
                      !isExpanded ? (
                        <PlusIcon fontSize="small" />
                      ) : (
                        <MinusIcon fontSize="small" />
                      )
                    }
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    className={`${classes.linkSummary} ${
                      isExpanded ? classes.activedLink : ''
                    }`}
                    onClick={() => {
                      handleSelect(oneLink.linkId);
                    }}
                  >
                    {oneLink.name}
                  </IconLeftAccordionSummary>
                  <AccordionDetails className={`${classes.accordionDetail}`}>
                    {oneLink.segments.map((segment) => {
                      return (
                        <Grid
                          className={classes.subLinkItem}
                          key={`segment_${segment.linkId}_${segment.connectionId}`}
                        >
                          {getLinkPath(segment.connectionId)}
                        </Grid>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          {linkData.length === 0 && `There's no links which are saved`}
        </Grid>
        {isEditable && (
          <Grid
            container
            justifyContent="flex-end"
            className={classes.mainAction}
            spacing={4}
          >
            <Grid item>
              <Button
                onClick={handleRemove}
                disabled={selected.length === 0}
                color="primary"
                variant="contained"
              >
                {'Delete'}
              </Button>
            </Grid>
          </Grid>
        )}
      </div>
    </>
  );
};

export default LinksList;
