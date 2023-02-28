import type { Metric } from './evaluation';

export interface Status {
  page: number;
  perPage: number;
  totalPage: number;
  isSize: boolean;
  width: string;
  disabled: boolean;
}

export interface IData {
  [key: string]: string;
}

export interface IColumnType<T> {
  key: string;
  name: string;
  removeEnabled?: boolean;
  width?: number;
  render?: (column: IColumnType<T>, item: T) => void;
}

export interface IRowType<T> {
  key: string;
  name: string;
  rowBreakdownOptions?: string[];
  isGroup?: boolean;
  height?: number;
  render?: (row: IRowType<T>, item: T) => void;
}

export interface IRowBreakdownOption<T> {
  key: string;
  name: string;
  action: Function;
  render?: (option: IRowBreakdownOption<T>, item: T) => void;
}

export interface ICellType<T> {
  key: string;
  colKey: string;
  value: string;
  isGroup?: boolean;
  rowBreakdownOptions?: IRowBreakdownOption<IData>[];
  render?: (cell: ICellType<T>, item: T) => void;
}

export interface IGroupItem {
  name: string;
  key: string;
  rowBreakdownOptions: string[];
}
export interface IGroup {
  name: string;
  key: string;
  info: string | null;
  items: IGroupItem[];
}
export interface ITableStructure {
  group: IGroup[];
  rowBreakdownOptions: IRowBreakdownOption<IData>[]
}
export interface IColumnData {
  name: string;
  key: string;
  data: IData[]
}
export interface IComparisonType {
  tableStructure: ITableStructure;
  columnData: IColumnData[];
  columnSequence: string[];
}


export interface ICompare {
  dataIDs: DataID[];
  rows: IRow[];
  columns: string[];
  columnMapping: string[],
  columnData: any;
  tooltips: IStrKey;
  resultId: string;
  keyList: IStrKey;
  csvData: string[][];
  fileName: string;
  userBurden: Burden;
  surfaces: Surface;
  surfaceSlices: Surface;
  metricSelections: metricImportance[];
}

export interface metricImportance {
  metricName: string;
  metricImportance: string;
}

export interface DataID {
  networkId: number;
  system_attribute_version_id: number;
}

export interface IRow {
  group: string;
  rows: (string | number)[][];
}

export interface IStrKey {
  [key: string]: string;
}

export interface IArrKey {
  [key: string]: any[];
}

export interface Burden {
  [key: string]: IBurden;
}

export interface IBurden {
  P_rec: number;
  A_r: number;
  theta: number;
  f_MHz: number;
  R_kbps: number;
  lambda: number;
  gOverT: number;
  cOverNo: number;
  implementationLoss: number;
  polarizationLoss_dB: number;
  propagationLosses_dB: number;
  otherLosses_dB: number;
  ebNo: number;
}

export interface Surface {
  [key: string]: ISurface;
}

export interface ISurface {
  mean_contacts: Metric[];
  reduced_coverage: Metric[];
  max_gap: Metric[];
  average_gap: Metric[];
  slew_rate: Metric[];
  mean_response_time: Metric[];
  tracking_rate: Metric[];
  coverage: Metric[];
  mean_coverage_duration: Metric[];
}
