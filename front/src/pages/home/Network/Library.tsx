import { FC, useState, useEffect } from 'react';
import clsx from 'clsx';
import DataGrid, { Column, Paging, Pager } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { colors, makeStyles, Theme } from '@material-ui/core';
import axios from 'src/utils/axios';
import { exploreImages as images } from 'src/utils/assets';
import { FREQ_FILTERING_OPTIONS as options } from 'src/utils/constants/network-library';
import type { Relay, Dte, System } from 'src/types/system';
import { DteDetails } from 'src/components/Details';

interface Panel {
  dte: number | null;
  relay: number | null;
}

const initialPanel: Panel = {
  dte: null,
  relay: null
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  table: {
    maxHeight: '33vh'
  },
  image: {
    borderRadius: '1px',
    width: '35px'
  },
  relay: {
    borderRadius: '1px',
    width: '35px'
  },
  bold: {
    fontWeight: 'bolder'
  }
}));

const Library: FC = () => {
  const classes = useStyles();
  const [results, setResults] = useState<any[]>();
  const [panel, setPanel] = useState<Panel>(initialPanel);
  const [checked, setChecked] = useState<number[]>([]);

  const fetchData = async () => {
    Promise.all([
      await axios.get<Relay[]>('/requestRelayDashboard'),
      await axios.get<Dte[]>('/requestDTEDashboard')
    ]).then((responses) => {
      let data: System[] = [];

      responses.forEach((response) => {
        response.data.forEach((system) => {
          const picture = images.find(
            (image) =>
              image.default.split('.')[0].split('/')[3].toLowerCase() ===
              system.system.toLowerCase()
          );
          if (Object.keys(system).includes('total_satellites')) {
            const freqBands = options.find(
              (item) =>
                parseInt(item.value.split('/')[0]) <=
                  parseInt(system.ssl_return_link_freq) &&
                parseInt(system.ssl_return_link_freq) <=
                  parseInt(item.value.split('/')[1])
            );

            const entry = {
              id: system.id,
              system: system.system,
              type: 'relay',
              year: system.ioc_year,
              location: system.location,
              freqBands: freqBands.band,
              picture: picture
                ? picture.default
                : '/static/images/genericRelay.png'
            };
            //@ts-ignore
            data.push(entry);
          } else {
            system['type'] = 'dte';
            system['picture'] = picture
              ? picture.default
              : '/static/images/genericDTE.png';
            data.push(system);
          }
        });
        setResults(data);
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDbClick = (event): void => {
    event?.data.type === 'relay' && handlePanel('relay', event.data.id);
    event?.data.type === 'dte' && handlePanel('dte', event.data.id);
  };

  const handleClick = (event) => {
    if (event.event.ctrlKey) {
      checked.includes(event.data.id)
        ? setChecked(checked.filter((item) => item !== event.data.id))
        : setChecked((prevState) => [...prevState, event.data.id]);
    }
  };

  const handleRemove = async (e): Promise<void> => {
    await axios.post('/deleteSystem', { systemName: e.key.system });
  };

  const handlePanel = (name, value): void => {
    setPanel((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className={classes.root}>
      <DataGrid
        className={classes.table}
        dataSource={results}
        showBorders={true}
        showRowLines={true}
        hoverStateEnabled={true}
        scrolling={{ mode: 'standard' }}
        onRowClick={handleClick}
        onRowDblClick={handleDbClick}
        onRowRemoved={handleRemove}
        wordWrapEnabled={true}
        onRowPrepared={(event) => {
          if (event.rowType === 'data' && checked.includes(event.data.id))
            event.rowElement.style['background'] = colors.blue[200];
        }}
      >
        <Paging defaultPageSize={64} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[8, 16, 32, 64]}
          showInfo={false}
        />
        <Column
          dataField="picture"
          caption=""
          width="7%"
          allowSorting={false}
          cellRender={(data) => (
            <img
              src={data.value}
              alt="system"
              className={clsx(
                classes.image,
                data.key.type === 'relay' && classes.relay
              )}
            />
          )}
          alignment="center"
        />
        <Column
          dataField="system"
          alignment="left"
          allowSearch={false}
          width="15%"
          cellRender={(data) => <div className={classes.bold}>{data.text}</div>}
        />
        <Column
          dataField="type"
          caption="Type"
          alignment="center"
          width="14%"
        />
        <Column
          dataField="year"
          caption="Operational Year"
          alignment="center"
          width="18%"
        />
        <Column
          dataField="supportedFrequencies"
          caption="Supported Frequencies"
          alignment="center"
          width="20%"
        />
        <Column
          dataField="location"
          caption="Location"
          alignment="center"
          width="20%"
        />
      </DataGrid>
      {panel.relay && (
        <DteDetails id={panel.relay} onClose={() => handlePanel('relay', null)} platformType = {2} refresh={() => fetchData()}/>
      )}
      {panel.dte && (
        <DteDetails id={panel.dte} onClose={() => handlePanel('dte', null)} platformType = {1} refresh={() => fetchData()}/>
      )}
    </div>
  );
};

export default Library;
