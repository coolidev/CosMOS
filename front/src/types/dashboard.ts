export interface Params {
    database: string;
    networkType: string;
    missionType: string;
    system: number;
    systemName: string;
    version: number;
    groundStation: string;
    frequencyBand: string;
    latitude: number;
    longitude: number;
    altitude: number;
    inclination: number;
    value: number;
    fileId: any;
    metricType: string;
    raan: number;
    eccentricity: number;
    argumentOfPerigee: number;
    trueAnomaly: number;
};

export interface AnalyticsPanel {
    params: any;
    source: any;
    terrestrial: any;
    traces: any;
    maxAltitude: number;
};

export interface MenuSubAttribute {
    id: number;
    dataset: string;
    name: string;
};

export interface MenuSelector {
    [key: string]: Array<MenuSubAttribute>;
};

export interface DashParams {
    [key: string]: number;
};

export interface SystemsAndVersions {
    systems: { [key: string]: { orbital: { [key: string]: number[] }, terrestrial: { [key: string]: number[] } } };
    versions: { [key: string]: { orbital: { [key: string]: number[] }, terrestrial: { [key: string]: number[] } } };
    stationsAndBands: { [key: string]: { groundStations: { [key: string]: string }, frequencyBands: { [key: string]: { [key: string]: string } } } };
};

export interface AnalyticsPlotsData {
    xTraces: any;
    yTraces?: any;
    avgTraces?: any;
    type: string;
    title: string;
};