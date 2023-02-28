import { useEffect, useState } from 'react';
import { Button, Grid, makeStyles, Theme } from "@material-ui/core";
import { CheckBox } from "devextreme-react";
import { FC } from "react";
import { ConnectivitySource } from "..";
import { SubSection } from 'src/types/details';
import CousinConnection from './CousinConnection';
import { any } from 'cypress/types/bluebird';

interface ConnectivityPanelProps {
  id: number;
  selected: string[];
  selectedSource: SubSection[];
  relations: ConnectivitySource[];
  updateConnectivity: Function;
  updateConnectivityList: Function;
  setReloadFlag: any;
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
  }
}))

const ConnectivityPanel: FC<ConnectivityPanelProps> = ({ id, selected, selectedSource, relations, updateConnectivity, updateConnectivityList, setReloadFlag }) => {
  const [outputTo, setOutputTo] = useState<ConnectivitySource[]>([]);
  const [inputFrom, setInputFrom] = useState<ConnectivitySource[]>([]);
  const [cousinConnectionWindow, setCousinConnectionWindow] = useState<boolean>(false);

  const classes = useStyles()

  const getTreeID = (param) => {
    return [param.platformId, param.antennaId, param.rfFrontEndId, param.modDemodId].join('_').replace(/^_+|_+$/gm,'')
  }

  useEffect(() => {
    const output = []
    const input = []

    const selectedKey = selectedSource.length > 0 ? getTreeID(selectedSource[0]) : ''

    relations.forEach((one) => {
      if (selectedKey == [one.platform_src_id, one.antenna_src_id, one.rfFrontEnd_src_id, one.modDemod_src_id].join('_').replace(/^_+|_+$/gm,'')) {
        output.push(one)
      }
      if (selectedKey == [one.platform_dest_id, one.antenna_dest_id, one.rfFrontEnd_dest_id, one.modDemod_dest_id].join('_').replace(/^_+|_+$/gm,'')) {
        input.push(one)
      }
    });
    setOutputTo(output)
    setInputFrom(input)
  }, [selected, selectedSource])

  const handleConnectivity = (id: number, indexInList: number, isOutput: boolean) => {
    let newConnectivity = isOutput ? outputTo : inputFrom
    newConnectivity[indexInList].isconnected = !newConnectivity[indexInList].isconnected
    if (isOutput) {
      setOutputTo([...newConnectivity])
    } else {
      setInputFrom([...newConnectivity])
    }
    updateConnectivity(id)
  } // this comes from super component

  const refreshWindow = async () => {
    await updateConnectivityList(id);
    setCousinConnectionWindow(!cousinConnectionWindow);
    setReloadFlag();
  }
  return (<>
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <h5>Select output to:</h5>
        <Grid style={{ height: '300px', backgroundColor: "white", border: 'solid 1px', overflowY: "scroll", padding: "1rem" }}>
          {outputTo.map((relations, index) => (
            <div 
              key={'output' + relations.id + '_' + index}
              className="dx-field"
            >
              <CheckBox
                defaultValue={relations.isconnected}
                text={`${[relations.platform_dest, relations.antenna_dest, relations.rfFrontEnd_dest, relations.modDemod_dest].join('/').replace(/^\/+|\/+$/gm,'')}`}
                onValueChanged={() => {handleConnectivity(relations.id, index, true)}}
                className={classes.checkBox}
              />
            </div>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <h5>Select input from:</h5>
        <Grid style={{ height: '300px', backgroundColor: "white", border: 'solid 1px', overflowY: "scroll", padding: "1rem" }}>
          {inputFrom.map((relations, index) => (
            <div 
              key={'input' + relations.id + '_' + index}
              className="dx-field"
            >
              <CheckBox
                defaultValue={relations.isconnected}
                text={`${[relations.platform_src, relations.antenna_src, relations.rfFrontEnd_src, relations.modDemod_src].join('/').replace(/^\/+|\/+$/gm,'')}`}
                onValueChanged={() => {handleConnectivity(relations.id, index, false)}}
                className={classes.checkBox}
              />
            </div>
          ))}
        </Grid>
      </Grid>
     {(selectedSource[0] && selectedSource[0].rfFrontEndId && !selectedSource[0].modDemodId) && (<Grid item xs = {3}>
            <Button 
            onClick={() => setCousinConnectionWindow(!cousinConnectionWindow)} 
            color="default"
            variant="contained"
            >
              Cross-Platform Connection
            </Button>
      </Grid>)}
    </Grid>
    {cousinConnectionWindow && (
      <CousinConnection
        onClose = {() => setCousinConnectionWindow(!cousinConnectionWindow)}
        onSave = {refreshWindow}
        isOpen = {cousinConnectionWindow}
        sourceRFFrontEnd = {{
            platformName: selectedSource[0].key,
            platformId: selectedSource[0].platformId,
            antennaName: selectedSource[0].antennaName,
            antennaId: selectedSource[0].antennaId,
            rfFrontEndName: selectedSource[0].frequencyBand,
            rfFrontEndId: selectedSource[0].rfFrontEndId
          }  
        }
      />
    )}
  </>);
}

export default ConnectivityPanel;
