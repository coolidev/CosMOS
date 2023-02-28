import { FC } from 'react';
import {
  Grid,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Select,
  MenuItem,
  TextField,
  IconButton,
  FormControl,
  makeStyles,
  useTheme
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import type { GroundStationFilters } from 'src/types/preference';
import type { IOptions } from 'src/pages/home/Network/StationLibrary';
import type { Theme } from 'src/theme';
import { Filterer } from 'src/utils/filterer';
import { SearchOption } from 'src/types/details';
import TagBox from 'devextreme-react/tag-box';
import AdvancedSearchGS from './AdvancedOptionsGS';
import { State } from 'src/pages/home';

interface StationFilterModalProps {
  open: boolean;
  filterer: Filterer;
  filters: GroundStationFilters;
  source: SearchOption[];
  options: IOptions;
  onOpen: (evt? : any,reason? : 'backdropClick' | 'escapeKeyDown') => void;
  onClear: () => void;
  onFilters: (values) => void;
  onFilterChange: () => void;
  state: State;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    maxWidth: '768px',
    minHeight: '55vh'
  },
  title: {
    margin: 0,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.primary.light
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  select: {
    padding: 0,
    //boxShadow: theme.name == THEMES.DARK? '' :'3px 3px 7px #c0c0c0', --To be added back when we make shadows everywhere
    borderRadius: '4px',
    border: `solid 1px ${theme.palette.border.main}`,
    color: `${theme.palette.text.primary} !important`,
    '& .MuiSelect-iconOutlined': {
      color: theme.palette.border.main
    }
  },
  textBox: {
    backgroundColor: theme.palette.background.light,
    color: theme.palette.text.primary,
    '& .MuiOutlinedInput-root': {
      //boxShadow: theme.name == THEMES.DARK? '' :'3px 3px 7px #c0c0c0',  --To be added back when we make shadows everywhere
      borderRadius: '4px',
      border: `solid 1px ${theme.palette.border.main}`,
      '& fieldset': {
        border: '0px',
      },
    },
  },
  multiselect: {
    borderRadius: '4px',
    boxShadow: '0px 0px 0px #c0c0c0',
    '& .dx-checkbox-checked .dx-checkbox-icon': {
      backgroundColor: theme.palette.border.main
    },
    '& .dx-dropdowneditor-input-wrapper .dx-texteditor-input': {
      color: theme.palette.text.primary
    }
  },
}));

const StationFilterModal: FC<StationFilterModalProps> = ({
  open,
  filterer,
  filters,
  source,
  options,
  onOpen,
  onClear,
  onFilters,
  onFilterChange,
  state
}) => {
  const theme = useTheme<Theme>();
  const classes = useStyles();

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   onFilters((prevState) => ({ ...prevState, [name]: value }));
  // };

  return (
    <Dialog
      open={open}
      onClose={onOpen}
      maxWidth="md"
      disableEscapeKeyDown
      keepMounted
      fullWidth
    >
      <DialogTitle disableTypography className={classes.title}>
        <Typography variant="h6">Ground Station Filters</Typography>
        <IconButton className={classes.closeButton} onClick={onOpen}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers style={{ backgroundColor: theme.palette.component.main }}>
        <Grid container justifyContent="center" alignItems="center" spacing={5}>
        <Grid item md={2} xs={12}>
            <Typography variant="body1">Network</Typography>
          </Grid>
          <Grid item md={4} xs={12}>
          <TagBox
          style = {{
            borderRadius: '4px',
            //I don't know why, but having this shadow disables the annoying highlight feature this component has. Even though it does nothing, do not remove the shadow.
            boxShadow: '0px 0px 0px #c0c0c0', 
            border: `solid 1px ${theme.palette.border.main}`,
          }}
          dataSource={options.networks}
          showSelectionControls={true}
          maxDisplayedTags={3}
          showMultiTagOnly={false}
          applyValueMode="useButtons"
          stylingMode="outlined"
          searchEnabled={true}
          className = {classes.multiselect}
          onValueChanged={(e) => {
            const { name, values } = {name: 'networks', values: e.value};
            if(filterer.getFilters().has(name)) {
              filterer.removeFilter(name);
            }
            const newFilter = 
            {
              filterName: "Network",
              filterParam: values?.toString(),
              filterFunction: (val : any) => {
                let networks;
                if(values === null || values.length===0){
                  networks = [""]
                } else {
                  networks = values;
                }
                if (networks.length === 0) {
                  networks = [""]
                }
                networks = networks.map(e => e.toLowerCase());
            
                for(let i = 0; i < networks.length; i++) {
                  if(networks[i] === 'ksat'){
                    let vals = val.networks.split(',')
                    for(let j = 0; j < vals.length; j++){
                      if(vals[j].toLowerCase().includes(networks[i]) && vals[j] !== 'KSAT Lite'){
                        return true;
                      }
                    }
                    continue;
                  }
                  if (val.networks.toLowerCase().includes(networks[i])) return true;
                }
                return false;
              }
            }
            if(values.length > 0){
              filterer.addFilter(name, newFilter);
            }
            filters.networks = values;
            onFilterChange();
          }}
          value = {filters.networks}
          name = "networks"
          />
          </Grid>
          
          <Grid item md={2} xs={12}>
            <Typography variant="body1" style = {{textAlign: 'left'}}>Agreements With SCaN</Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl variant="filled" size="small" fullWidth>
              <Select
                name="SCAN"
                variant="outlined"
                value={
                  filters.scanAgreement !== '' && filters.scanAgreement !== 'none'
                    ? filters.scanAgreement
                    : 'none'
                }
                onChange={(e) => {
                  const { name, value } = e.target;
                  if(filterer.getFilters().has(name)) {
                    filterer.removeFilter(name);
                  }
                  let compString = value
                  const newFilter =
                  {
                    filterName: "SCAN",
                    filterParam: value?.toString(),
                    filterFunction: (val : any) => {
                      if(compString === 'none'){
                        return true;
                      }
                      return val.SCANAgreement === compString? true:false;
                    }
                  }
                  
                  filterer.addFilter(name, newFilter);
                  filters.scanAgreement = value.toString();
                  onFilterChange();
                }}
                className={classes.select}
                fullWidth
              >
                <MenuItem value="none">--</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={2} xs={12}>
            <Typography variant="body1">Ground Station Name</Typography>
          </Grid>
          <Grid item md={4} xs={12}>
          <TagBox
          style={{
          borderRadius: '4px',
          //I don't know why, but having this shadow disables the annoying highlight feature this component has. Even though it does nothing, do not remove the shadow.
          boxShadow: '0px 0px 0px #c0c0c0', 
          border: `solid 1px ${theme.palette.border.main}`,}}
          dataSource={filterer.getFilteredList()? filterer.getFilteredList().map(e => e.name): []}
          showSelectionControls={true}
          maxDisplayedTags={3}
          showMultiTagOnly={false}
          applyValueMode="useButtons"
          stylingMode="outlined"
          searchEnabled={true}          
          className = {classes.multiselect}
          onValueChanged={(e) => {
            const { name, values } = {name: 'name', values: e.value};
            if(filterer.getFilters().has(name)) {
              filterer.removeFilter(name);
            }
            const newFilter = 
            {
              filterName: "Name",
              filterParam: values?.toString(),
              filterFunction: (val : any) => {
                for(let i = 0; i < values.length; i++){
                  if(val.name.toLowerCase().includes(values[i].toLowerCase())) return true; 
                }
                return false;
              }
            }
            
            if(values.length > 0){
              filterer.addFilter(name, newFilter);
            }
            filters.name = values;
            onFilterChange();
          }}
          value = {filters.name}
          name = 'name'
        />
          </Grid>

          <Grid item xs={2}>
            <Typography variant="body1">Operational Year</Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              name="operationalYear"
              className= {classes.textBox}
              onChange={(e) => {
                const { name, value } = e.target;
                if(filterer.getFilters().has(name)) {
                  filterer.removeFilter(name);
                }
                const newFilter = 
                {
                  filterName: "Op Year",
                  filterParam: value?.toString(),
                  filterFunction: (val : any) => {
                    if(value === '') return true;
                    if(isNaN(Number(value))) return false
                    
                    if(val.stopYear){
                      return Number(val.startYear) <= Number(value) && Number(val.stopYear) >= Number(value);
                    } else {
                      return Number(val.startYear) <= Number(value);
                    }
                  }
                }
                  filters.operationalYear = !isNaN(parseInt(value)) ? value: filters.operationalYear;
                  filterer.addFilter(name, newFilter);
                onFilterChange();
                  
              }}
              value = {filters.operationalYear}
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <AdvancedSearchGS state={state} filtererHasBeenChanged={onFilterChange} filterer = {filterer} source = {source} onClear = {onClear} onOpen = {onOpen}></AdvancedSearchGS>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StationFilterModal;
