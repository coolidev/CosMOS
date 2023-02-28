import { FC, useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import axios from 'src/utils/axios';
import { useSelector } from 'src/store';
import { SubSection, UpdatedAttribute } from 'src/types/details';
import DataTagBox from './DataTagBox';
import { convertIntToStandards } from 'src/algorithms/network-library';
import DialogAlert from 'src/components/DialogAlert';

interface DataTableProps {
  id: string;
  source: SubSection[];
  isAdmin: boolean;
  refresh: () => void;
}

interface AttrValue {
  id: number;
  name: string;
}
//fix this later
export const subKeyList = [
  'fwdLnkCod',
  'fwdLnkMod',
  'rtnLnkCod',
  'rtnLnkMod',
  'antenna_modulation',
  'platform_type',
  'reference_body',
  'vcmVdrSupport',
  'antenna_polarization',
  'modulationType',
  'antenna_data_format',
  'antenna_subcarrier_format',
  'decoding',
  'channelCodingType',
  'antenna_subcarrier_modulation',
  'subcarrierDataFormat'
];
export const multiKeyList = [
  'fwdLnkCod',
  'fwdLnkMod',
  'rtnLnkCod',
  'rtnLnkMod',
  'antenna_modulation',
  'modulationType',
  'antenna_data_format',
  'antenna_subcarrier_format',
  'decoding',
  'channelCodingType',
  'antenna_subcarrier_modulation',
  'subcarrierDataFormat'
];
export const dropdownList = [
  'platform_type',
  'reference_body',
  'vcmVdrSupport',
  'antenna_polarization'
];
export const calcStateKeyList = [];
export const stdsList = ['standards_compliance'];
//   'bandwidth',
//   'antenna_size',
//   'antenna_efficiency',
//   'antenna_gain',
//   'polarization_losses',
//   'antenna_beamwidth',
//   'eirp',
// ];
export const booleanKeyList = ['scanAgreement', 'dte_scan_agreement'];

/**
 * DTE Network Details grid in Network library
 * @param {any} id
 * @param {any} isAdmin
 * @param {any} source
 * @return {=>}
 */
const DataTable: FC<DataTableProps> = ({ id, isAdmin, source, refresh }) => {
  const [attrValues, setAttrValues] = useState<AttrValue[]>([]);
  const [platformAttrValues, setPlatformTypeAttrValues] = useState<AttrValue[]>(
    []
  );
  const [referenceBodyAttrValues, setReferenceBodyAttrValues] = useState<
    AttrValue[]
  >([]);
  const [vcmVdrAttrValues, setVcmVdrAttrValues] = useState<AttrValue[]>([]);
  const [polarizationAttrValues, setPolarizationAttrValues] = useState<
    AttrValue[]
  >([]);
  const [dataFormatAttrValues, setDataFormatAttrValues] = useState<AttrValue[]>(
    []
  );
  const [codingAttrValues, setCodingAttrValues] = useState<AttrValue[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [prevValue, setPrevValue] = useState<any>();

  //This whole thing is a very long way of getting the default values for all of the dropdowns
  useEffect(() => {
    const fetchAntennaData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_modulation ' }
      });
      response.data && setAttrValues(response.data);
    };

    const fetchPlatformTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'platform_type ' }
      });
      response.data && setPlatformTypeAttrValues(response.data);
    };

    const fetchReferenceBodyData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'reference_body ' }
      });
      response.data && setReferenceBodyAttrValues(response.data);
    };

    const fetchVcmVdrData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'vcmVdrSupport ' }
      });
      response.data && setVcmVdrAttrValues(response.data);
    };

    const fetchPolarizationData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_polarization ' }
      });
      response.data && setPolarizationAttrValues(response.data);
    };

    const fetchDataFormatData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'data_format ' }
      });
      response.data && setDataFormatAttrValues(response.data);
    };

    const fetchCodingData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'forward_link_coding ' }
      });
      response.data && setCodingAttrValues(response.data);
    };

    fetchAntennaData();
    fetchPlatformTypeData();
    fetchReferenceBodyData();
    fetchVcmVdrData();
    fetchPolarizationData();
    fetchDataFormatData();
    fetchCodingData();
  }, []);

  const handleRowUpdating = async (event) => {
    let value =
      typeof event.newData.value === 'string'
        ? event.newData.value
        : event.newData.value
        ? event.newData.value.join(',')
        : event.oldData.value;
    if (event.oldData.sub_key === 'standards_compliance') {
      value = event.newData.value.reduce((a, b) => a + b, 0);
    }

    let id = event.key.modDemodId
      ? event.key.modDemodId
      : event.key.rfFrontEndId
      ? event.key.rfFrontEndId
      : event.key.antennaId
      ? event.key.antennaId
      : event.key.platformId;
    const params = {
      id: id,
      attr: { [event.key.sub_key]: event.newData.value }
    };
    try {
      if (!event.key.antennaId) {
        await axios.post('/updatePlatform', params);
      } else if (!event.key.rfFrontEndId) {
        await axios.post('/updateAntenna', params);
      } else if (!event.key.modDemodId) {
        await axios.post('/updateRFFrontEnd', params);
      } else {
        await axios.post('/updateModDemod', params);
      }
      if (
        event.key.sub_key === 'station_name_model_number' ||
        event.key.sub_key === 'rf_FrontEnd_name' ||
        event.key.sub_key === 'rf_FrontEnd_name' ||
        event.key.sub_key === 'modDemod_name' ||
        event.key.sub_key === 'antenna_name'
      ) {
        refresh();
      }
    } catch {
      setErrorMessage(
        'An error has occured while trying to change the value. Please check to ensure that your input is valid. If the issue persists, please contact CART support for help.'
      );
      setIsAlertOpen(true);
      event.key.value = prevValue;
    }
  };

  useEffect(() => {
    //Update stds compliance to string list
    let stdsIndex = source.findIndex(
      (e) => e.sub_key === 'standards_compliance'
    );
    if (stdsIndex >= 0) {
      source[stdsIndex].value =
        source[stdsIndex].value != null &&
        !isNaN(Number(source[stdsIndex].value))
          ? convertIntToStandards(Number(source[stdsIndex].value)).join()
          : source[stdsIndex].value;
    }
  }, [source]);

  //Determines how the cell should be displayed based on the type of attribute. Different attributes have different display modes,
  //and this is reflected in this function. Note that there are some serious improvements that can be done here, but its 'quick and dirty'
  const cellTemplate = (container, options) => {
    if (
      (!options.data.value || options.data.value?.length === 0) &&
      !calcStateKeyList.includes(options.data.sub_key)
    ) {
      container.textContent = '-';
      return;
    }
    if (!options?.data) return;

    if (stdsList.includes(options.data.sub_key)) {
      if (Array.isArray(options.value)) {
        const noBreakSpace = '\u00A0',
          text = convertIntToStandards(
            (options.value || []).reduce((a, b) => a + b, 0)
          ).join(',');
        container.textContent = text || noBreakSpace;
        container.title = text;
        return;
      }
    }

    if (subKeyList.includes(options.data.sub_key)) {
      const values =
        typeof options.value === 'string'
          ? options.value.split(',')
          : options.value;
      const noBreakSpace = '\u00A0';
      let text;

      //Maybe find a better way than if-else statements in the future for this
      if (
        options.data.sub_key === 'antenna_modulation' ||
        options.data.sub_key === 'modulationType' ||
        options.data.sub_key === 'antenna_subcarrier_modulation' ||
        options.data.sub_key === 'rtnLnkMod' ||
        options.data.sub_key === 'fwdLnkMod'
      ) {
        text = (values || [])
          .map((element) => {
            const value = attrValues.find(
              (item) => item.id === parseInt(element)
            );
            if (typeof value === 'undefined' || value === null) {
              return null;
            }
            return value.name ?? '-';
          })
          .join(', ');
      } else if (options.data.sub_key === 'platform_type') {
        text = (values || [])
          .map((element) => {
            const value = platformAttrValues.find(
              (item) => item.id === parseInt(element)
            );
            if (typeof value === 'undefined' || value === null) {
              return null;
            }
            return value.name;
          })
          .join(', ');
      } else if (options.data.sub_key === 'reference_body') {
        text = (values || [])
          .map((element) => {
            const value = referenceBodyAttrValues.find(
              (item) => item.id === parseInt(element)
            );
            if (typeof value === 'undefined' || value === null) {
              return null;
            }
            return value.name;
          })
          .join(', ');
      } else if (options.data.sub_key === 'vcmVdrSupport') {
        text = (values || [])
          .map((element) => {
            const value = vcmVdrAttrValues.find(
              (item) => item.id === parseInt(element)
            );
            if (typeof value === 'undefined' || value === null) {
              return null;
            }
            return value.name;
          })
          .join(', ');
      } else if (options.data.sub_key === 'antenna_polarization') {
        text = (values || [])
          .map((element) => {
            const value = polarizationAttrValues.find(
              (item) => item.id === parseInt(element)
            );
            if (typeof value === 'undefined' || value === null) {
              return null;
            }
            return value.name;
          })
          .join(', ');
      } else if (
        options.data.sub_key === 'antenna_data_format' ||
        options.data.sub_key === 'antenna_subcarrier_format' ||
        options.data.sub_key === 'subcarrierDataFormat'
      ) {
        text = (values || [])
          .map((element) => {
            const value = dataFormatAttrValues.find(
              (item) => item.id === parseInt(element)
            );
            if (typeof value === 'undefined' || value === null) {
              return null;
            }
            return value.name;
          })
          .join(', ');
      } else if (
        options.data.sub_key === 'decoding' ||
        options.data.sub_key === 'channelCodingType' ||
        options.data.sub_key === 'rtnLnkCod' ||
        options.data.sub_key === 'fwdLnkCod'
      ) {
        text = (values || [])
          .map((element) => {
            const value = codingAttrValues.find(
              (item) => item.id === parseInt(element)
            );
            if (typeof value === 'undefined' || value === null) {
              return null;
            }
            return value.name;
          })
          .join(', ');
      }
      container.textContent = text || noBreakSpace;
      container.title = text;
    } else if (
      options.value === '' &&
      calcStateKeyList.includes(options.data.sub_key)
    ) {
      container.textContent = 'Calculated';
      container.style.fontStyle = 'italic';
      // } else if (container.options.value.toString()[0] === '[') {
      //   container.visible = 'false';
    } else if (booleanKeyList.includes(options.data.sub_key)) {
      if (options.value === '1') {
        container.textContent = 'Yes';
      } else {
        container.textContent = 'No';
      }
    } else {
      container.textContent = options.value;
    }
    //Replace replace the references from the datatable with the actual string values
  };

  return (
    <>
      <DataGrid
        dataSource={source}
        showBorders={true}
        //columnAutoWidth={true}
        onRowUpdating={handleRowUpdating}
        wordWrapEnabled={true}
        columnWidth={200}
      >
        <Editing mode="row" allowUpdating={isAdmin} />
        <Column
          dataField="name"
          caption="Attribute"
          width="20%"
          allowEditing={false}
        />
        <Column
          dataField="value"
          caption="Data"
          width="20%"
          allowSorting={false}
          cellTemplate={cellTemplate}
          editCellComponent={(event) =>
            DataTagBox({
              event,
              attrValues,
              platformAttrValues,
              referenceBodyAttrValues,
              vcmVdrAttrValues,
              polarizationAttrValues,
              dataFormatAttrValues,
              codingAttrValues,
              setPrevValue
            })
          }
        />
        <Column type="adaptive" visible={false} />
        <Column
          dataField="explanation"
          caption="Notes or Explanation"
          width="30%"
          allowSorting={false}
        />
        <Column
          dataField="references"
          caption="References"
          width="30%"
          allowSorting={false}
        />
      </DataGrid>
      <DialogAlert
        isOpen={isAlertOpen}
        onOpen={() => setIsAlertOpen(!isAlertOpen)}
        title={'Error'}
        message={errorMessage}
      />
    </>
  );
};

export default DataTable;
