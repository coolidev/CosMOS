/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { Grid, Button, TextField } from '@material-ui/core';
import axios from 'src/utils/axios';
import DialogBox from 'src/components/DialogBox';
import { SystemType } from 'src/types/system';

interface AddSystemProps {
  isSystem: boolean;
  onIsSystem: () => void;
  onReload: () => void;
}

interface NewSystem {
  name: string;
  type: SystemType;
}

const initialSystem: NewSystem = {
  name: '',
  type: 'relay'
};

const AddSystem: FC<AddSystemProps> = ({ isSystem, onIsSystem, onReload }) => {
  const [system, setSystem] = useState<NewSystem>(initialSystem);
  const [submitButtonDisabled, setButtonDisabled] = useState<boolean>(false);

  useEffect(() =>{
    if(isSystem){
      setButtonDisabled(false);
      system.name = '';
    }
  },[isSystem]);

  const handleClick = async () => {
    setButtonDisabled(true);
    const params = {
      systemName: system.name,
      networkType: 'dte',
      email: localStorage?.getItem('email') ?? ''
    };
    await axios.post('/createSystem', params);
    onIsSystem();
    onReload();
  };

  const handleAddSystem = (event) => {
    const { name, value } = event.target;
    setSystem((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <DialogBox
      title="Add New Network"
      isOpen={isSystem}
      onClose={onIsSystem}
    >
      <Grid container justifyContent="center" alignItems="center" spacing={3}>
        <Grid item md={12}>
          <TextField
            name="name"
            type="text"
            value={system.name}
            placeholder="Network Name"
            onChange={handleAddSystem}
            fullWidth
          />
        </Grid>
        {/* <Grid item md={12}>
          <Select
            name="type"
            value={system.type}
            onChange={handleAddSystem}
            fullWidth
          >
            <MenuItem value="relay">Relay</MenuItem>
            <MenuItem value="dte">DTE</MenuItem>
          </Select>
        </Grid> */}
        <Grid item md={12}>
          <Button
            disabled={submitButtonDisabled}
            name="submitSystem"
            variant="contained"
            color="primary"
            onClick={handleClick}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </DialogBox>
  );
};

export default AddSystem;
