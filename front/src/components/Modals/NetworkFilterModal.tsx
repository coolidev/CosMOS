import { Dispatch, FC, SetStateAction, useEffect } from 'react';
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
import type { NetworkFilters } from 'src/types/preference';
import type { Theme } from 'src/theme';
import AdvancedSearch, { filterTypesUniversal } from './AdvancedOptions';
import { SearchOption } from 'src/types/details';
import { Filterer } from 'src/utils/filterer';
import TagBox from 'devextreme-react/tag-box';
import { State } from 'src/pages/home';

interface NetworkFilterModalProps {
  open: boolean;
  filterer: Filterer;
  filters: NetworkFilters;
  source: SearchOption[]
  onOpen: (evt?: any, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  onClear: () => void;
  onFilterChange: () => void;
  setSource: Dispatch<SetStateAction<SearchOption[]>>
  state: State;
  onState: (name: string, value: any) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    maxWidth: '768px',
    minHeight: '55vh'
  },
  dialogStyle: {
    '& > div > div': {
      border: `2px solid ${theme.palette.border.main}`,
      borderRadius: '8px 8px 0 0'
    }
  },
  title: {
    margin: 0,
    padding: theme.spacing(2, 4),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    display: 'flex',
    alignItems: 'center'
  },
  closeButton: {
    color: theme.palette.background.light
  },
  //attempt to remove the second border at some point in the future
  select: {
    padding: 0,
    //boxShadow: theme.name == THEMES.DARK? '' :'3px 3px 7px #c0c0c0', --To be added back when we make shadows everywhere
    borderRadius: '4px',
    // border: `solid 1px ${theme.palette.border.main}`,
    color: `${theme.palette.text.primary} !important`,
    '& .MuiSelect-iconOutlined': {
      // color: theme.palette.border.main
    },
    boxShadow: '0px 4px 14px rgb(0 0 0 / 10%)',
    border: 'none',
    '& fieldset': {
      border: 'none'
    }
  },
  textBox: {
    backgroundColor: theme.palette.background.light,
    color: theme.palette.text.primary,
    '& .MuiOutlinedInput-root': {
      //boxShadow: theme.name == THEMES.DARK? '' :'3px 3px 7px #c0c0c0',  --To be added back when we make shadows everywhere
      borderRadius: '4px',
      // border: `solid 1px ${theme.palette.border.main}`,
      // '& fieldset': {
      //   border: '0px',
      // },
    },
    boxShadow: '0px 4px 14px rgb(0 0 0 / 10%)',
    border: 'none',
    '& fieldset': {
      border: 'none'
    }
  },
  multiselect: {
    '& .dx-checkbox-checked .dx-checkbox-icon': {
      backgroundColor: theme.palette.border.main
    },
    '& .dx-dropdowneditor-input-wrapper .dx-texteditor-input': {
      color: theme.palette.text.primary
    },
    border: 'none',
    '& fieldset': {
      border: 'none'
    }
    // '& .dx-selectbox-popup-wrapper .dx-list': {
    //   backgroundColor: 'purple',
    //   color: theme.palette.text.primary
    // },
  },
}));

const NetworkFilterModal: FC<NetworkFilterModalProps> = ({
  open,
  filterer,
  filters,
  onOpen,
  onClear,
  source,
  onFilterChange,
  setSource,
  state,
  onState
}) => {
  const theme = useTheme<Theme>();
  const classes = useStyles();
  // const [isOpen, setIsOpen] = useState(false);

  const getDataSource = () => {
    if (filterer.getFilteredList() == null) {
      return []
    } else {
      return filterer.getFilteredList().map(e => e.system)
    }
  }

  useEffect(() => {
    if (open) {
      let filterList = filterer.getFilters();
      let keyList = filterList.keys();

      let key = keyList.next();
      let newSource = source.slice();
      while (!key.done) {
        for (let i = 0; i < filterTypesUniversal.length; i++) {
          if (filterTypesUniversal[i].filter === key.value) {
            newSource.push({ filterName: filterTypesUniversal[i].filter, value: filterList.get(key.value).filterParam, operator: null });
          }
        }
        key = keyList.next();
      }
      setSource(newSource);
    } else {
      setSource([]);
    }
  }, [open])
  return (
    <Dialog
      open={open}
      onClose={onOpen}
      maxWidth="md"
      disableEscapeKeyDown
      keepMounted
      fullWidth
      className={classes.dialogStyle}
    >
      <DialogTitle disableTypography className={classes.title}>
        <Typography variant="h6">Network Filters</Typography>
        <div className='ml-auto' />
        <IconButton className={classes.closeButton} onClick={onOpen} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers style={{ backgroundColor: theme.palette.component.main }}>
        <Grid container justifyContent="flex-start" alignItems="center" spacing={5}>
          <Grid item xs={2}>
            <Typography variant="body1">Network Type</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="filled" size="small" fullWidth >
              <Select
                className={classes.select}
                name="type"
                variant="outlined"
                data-filter-network="true"
                value={
                  filters.type !== '' && filters.type !== 'none'
                    ? filters.type
                    : 'none'
                }
                color="primary"
                onChange={(e) => {
                  const { name, value } = e.target;
                  if (filterer.getFilters().has(name)) {
                    filterer.removeFilter(name);
                  }
                  const newFilter =
                  {
                    filterName: "Type",
                    filterParam: value?.toString(),
                    filterFunction: (val: any) => {
                      return value === "none" || val.type === value;
                    }
                  };
                  filterer.addFilter(name, newFilter);
                  filters.type = value.toString();
                  onFilterChange();
                }}
                fullWidth
              >
                <MenuItem value="none">All</MenuItem>
                <MenuItem value="relay">Relay</MenuItem>
                <MenuItem value="dte">DTE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" style={{ textAlign: 'left' }}>Agreements With SCaN</Typography>
          </Grid>
          <Grid item xs={3}>
            <FormControl variant="filled" size="small" fullWidth>
              <Select
                name="SCAN"
                className={classes.select}
                variant="outlined"
                value={
                  filters.scanAgreement !== '' && filters.scanAgreement !== 'none'
                    ? filters.scanAgreement
                    : 'none'
                }
                onChange={(e) => {
                  const { name, value } = e.target;
                  if (filterer.getFilters().has(name)) {
                    filterer.removeFilter(name);
                  }
                  if (value !== 'none') {
                    let boolVal = value === "Yes" ? true : false;

                    const newFilter =
                    {
                      filterName: "SCAN",
                      filterParam: boolVal?.toString(),
                      filterFunction: (val: any) => {
                        return val.scanAgreement === boolVal;
                      }
                    }

                    filterer.addFilter(name, newFilter);
                  }
                  filters.scanAgreement = value.toString();
                  onFilterChange();
                }}
                fullWidth
              >
                <MenuItem value="none">--</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">System Name</Typography>
          </Grid>
          <Grid item xs={4}>
            <TagBox
              style={{
                borderRadius: '4px',
                //I don't know why, but having this shadow disables the annoying highlight feature this component has. Even though it does nothing, do not remove the shadow.
                boxShadow: '0px 0px 0px #c0c0c0',
                // border: `solid 1px ${theme.palette.border.main}`,
                color: theme.palette.text.primary,
              }}
              dataSource={getDataSource()}
              showSelectionControls={true}
              maxDisplayedTags={3}
              showMultiTagOnly={false}
              applyValueMode="useButtons"
              searchEnabled={true}
              stylingMode="outlined"
              className={classes.multiselect}
              id="filter-name"
              onValueChanged={(e) => {
                const { name, values } = { name: 'name', values: e.value };
                if (filterer.getFilters().has(name)) {
                  filterer.removeFilter(name);
                }
                const newFilter =
                {
                  filterName: "Sys. Name",
                  filterParam: values?.toString(),
                  filterFunction: (val: any) => {
                    for (let i = 0; i < values.length; i++) {
                      if (val.system.toLowerCase().includes(values[i].toLowerCase())) return true;
                    }
                    return false;
                  }
                }
                if (values.length > 0) {
                  filterer.addFilter(name, newFilter);
                }
                filters.name = values;
                onFilterChange();
              }}
              value={filters.name}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1">Operational Year</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              className={classes.textBox}
              variant="outlined"
              size="small"
              fullWidth
              name="operationalYear"
              onChange={(e) => {
                const { name, value } = e.target;
                if (!isNaN(Number(value))) {
                  if (filterer.getFilters().has('missionLaunchYear')) {
                    filterer.removeFilter('missionLaunchYear');
                  }
                  if (!isNaN(Number(value))) {
                    if (filterer.getFilters().has(name)) {
                      filterer.removeFilter(name);
                    }
                  }
                  const newFilter =
                  {
                    filterName: "Op. Year",
                    filterParam: value?.toString(),
                    filterFunction: (val: any) => {
                      if (value === '') return true;
                      return Number(val.year) <= Number(value);
                    }
                  }
                  filterer.addFilter(name, newFilter);
                  filters.operationalYear = !isNaN(parseInt(value)) ? value : filters.operationalYear;
                  onFilterChange();
                }
                if (value === '') {
                  if (filterer.getFilters().has(name)) {
                    filterer.removeFilter(name);
                  }
                  filters.operationalYear = value;
                }
              }}
              value={filters.operationalYear}
            >
            </TextField>
          </Grid>
          <Grid item xs={12} >
            <AdvancedSearch
              filtererHasBeenChanged={onFilterChange}
              filterer={filterer}
              source={source}
              filters={filters}
              setSource={setSource}
              onClear={onClear}
              onOpen={onOpen}
              state={state}
              onState={onState}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkFilterModal;
