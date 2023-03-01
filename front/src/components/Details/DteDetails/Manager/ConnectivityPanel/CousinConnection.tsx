import { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, makeStyles, Theme } from "@material-ui/core";
import { CheckBox } from "devextreme-react";
import { FC } from "react";
import { Close as CloseIcon } from '@material-ui/icons';
import axios from 'src/utils/axios';

interface CousinConnectionProps {
  onClose: any;
  onSave: any;
  isOpen: boolean;
  sourceRFFrontEnd: {
    platformName: string;
    platformId: number;
    antennaName: string;
    antennaId: number;
    rfFrontEndName: string;
    rfFrontEndId: number;
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  checkBox: {
    '& .dx-checkbox-icon': {
      backgroundColor: 'white',
      border: '2px solid rgba(0,0,0,.54)'
    },
    '&.dx-checkbox-checked .dx-checkbox-icon::before': {
      color: 'black',
      content: '"\\00d7"'
    }
  },
  close: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    zIndex: 100
  }
}))

const CousinConnection: FC<CousinConnectionProps> = ({onClose, onSave, isOpen, sourceRFFrontEnd}) => {
    const [source, setSource] = useState<any[]>([]);
    const [toAdd, setToAdd] = useState<any[]>([]);

    const classes = useStyles();

    //gets source for the whole list on load
    useEffect(() => {
        let internalFunc = async () => {
            let newSource = await axios.get('/requestPossibleConnections', {});
            setSource(newSource.data);
        };
        internalFunc();
    },[]);

    const addToList = (changedValue) => {
        let index = toAdd.findIndex((val) => valEquals(val, changedValue));
        let newArray = toAdd
        if(index > -1){
            newArray.splice(index, index);
        } else {
            newArray.push(changedValue)
        }
        setToAdd(newArray);
    }

    const valEquals = (val1, val2) => {
        if(val1.antennaId === val2.antennaId &&
            val1.platformId === val2.platformId &&
            val1.rfFrontEndId === val2.rfFrontEndId &&
            val1.modDemodId === val2.modDemodId){
            return true;
        } else {
            return false;
        }
    }

    const onInternalSave = async () => {
        for(let i = 0; i < toAdd.length; i++) {
            await axios.post('/createNewConnection', {
                platform_src : sourceRFFrontEnd.platformName,
                platform_src_id : sourceRFFrontEnd.platformId,
                antenna_src : sourceRFFrontEnd.antennaName,
                antenna_src_id : sourceRFFrontEnd.antennaId,
                rfFrontEnd_src: sourceRFFrontEnd.rfFrontEndName,
                rfFrontEnd_src_id : sourceRFFrontEnd.rfFrontEndId,
                modDemod_src : null,
                modDemod_src_id : null,
                platform_dest: toAdd[i].platformName,
                platform_dest_id : toAdd[i].platformId,
                antenna_dest : toAdd[i].antennaName,
                antenna_dest_id : toAdd[i].antennaId,
                rfFrontEnd_dest : toAdd[i].rfFrontEndName,
                rfFrontEnd_dest_id : toAdd[i].rfFrontEndId,
                // modDemod_dest : toAdd[i].modDemodName,
                // modDemod_dest_id : toAdd[i].modDemodId,
                // down : true
            });
        }
        onSave();

    }
    return (
        <Dialog
            maxWidth={'sm'}
            fullWidth
            open={isOpen}
            keepMounted
            onClose={onClose}>
            <DialogTitle>
                Establish New Cross Platform Connection
                <IconButton className={classes.close} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <h5>Select Potential Connections:</h5>
                        <Grid style={{ height: '300px', backgroundColor: "white", border: 'solid 1px', overflowY: "scroll", padding: "1rem" }}>
                        {source.map((relations, index) => (
                            <div 
                            key={'output' + relations.id + '_' + index}
                            className="dx-field"
                            >
                            <CheckBox
                                defaultValue={relations.isconnected}
                                text={`${[relations.platformName, relations.antennaName, relations.rfFrontEndName, relations.modDemodName].join('/').replace(/^\/+|\/+$/gm,'')}`}
                                onValueChanged={() => {addToList(relations)}}
                                className={classes.checkBox}
                            />
                            </div>
                        ))}
                        </Grid>
                    </Grid>
                    <Grid item xs = {2}>
                        <Button 
                        onClick={onClose} 
                        color="primary"
                        variant="contained"
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs = {3}>
                        <Button 
                        onClick={onInternalSave} 
                        color="primary"
                        variant="contained"
                        >
                            Add Selected
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent> 
        </Dialog>);
}

export default CousinConnection;
