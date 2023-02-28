import { FC, useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import axios from 'src/utils/axios';
import { useSelector } from 'src/store';
import { convertIntToStandards } from 'src/algorithms/network-library';
import DialogAlert from 'src/components/DialogAlert';
import DataTagBoxLite from './DataTagBoxLite';
import { NetworkAttr } from '.';

interface DataTableProps {
  source: NetworkAttr[];
  isAdmin: boolean;
  networkId: number;
}

interface AttrValue {
  id: number;
  name: string;
}

/**
 * DTE Network Details grid in Network library
 * @param {any} id
 * @param {any} isAdmin
 * @param {any} source
 * @return {=>}
 */
const DataTable: FC<DataTableProps> = ({ isAdmin, source, networkId }) => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [prevValue, setPrevValue] = useState<any>();

  const handleRowUpdating = async (event) => {
    const params = {
      networkId: networkId,
      attributeKey: event.key.attributeKey,
      attributeId: event.key.id,
      name: event.oldData.name,
      value: event.newData.value ?? event.oldData.value,
      explanation: event.newData.explanation ?? event.oldData.explanation,
      references: event.newData.references ?? event.oldData.references
    };
    try {
      await axios.post('/updateNetworkAttribute', params);
    } catch {
      setErrorMessage(
        'An error has occured while trying to change the value. Please check to ensure that your input is valid. If the issue persists, please contact CART support for help.'
      );
      setIsAlertOpen(true);
      event.key.value = prevValue ?? '';
      event.key.explanation = event.oldValue.explanation ?? '';
      event.key.references = event.oldValue.references ?? '';
    }
  };

  const handleRowDeleting = async (event) => {
    const params = {
      networkId: networkId,
      attributeId: event.key.id
    };
    try {
      await axios.post('/deleteNetworkAttribute', params);
    } catch {
      setErrorMessage(
        'An error has occured while trying to change the value. Please check to ensure that your input is valid. If the issue persists, please contact CART support for help.'
      );
      setIsAlertOpen(true);
    }
  };

  const cellTemplate = (container, options) => {
    if (!options?.data) return;
    container.textContent = options.value;
  };

  const optionalRow = (component) => {
    return isAdmin && !component.row.key.attributeKey;
  };

  return (
    <>
      <DataGrid
        dataSource={source}
        showBorders={true}
        //columnAutoWidth={true}
        onRowUpdating={handleRowUpdating}
        onRowRemoved={handleRowDeleting}
        wordWrapEnabled={true}
        columnWidth={200}
      >
        <Editing
          mode="row"
          allowUpdating={isAdmin}
          allowDeleting={optionalRow}
        />

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
          editCellComponent={(event) => DataTagBoxLite({ event, setPrevValue })}
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
