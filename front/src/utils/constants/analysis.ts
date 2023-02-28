export const PERFORMANCE_PARAMETERS = [
    'coverage', 'mean_contacts', 'mean_coverage_duration',
    'average_gap', 'max_gap', 'mean_response_time', 
    'availability', 'dataRate', 'throughput'
];

export const DTE_PERFORMANCE_PARAMETERS = [
    'coverageMinutes', 'contactsPerDay', 'averageCoverageDuration',
    'maxCoverageDuration', 'averageGapDuration', 'maxGapDuration',
    'meanResponseTime', 'dataRate', 'throughput'
];

export const ANTENNA_OPTIONS_PARAMETERS = [
    'eirp_dbw', 'parabolicDiameter', 'parabolicMass',
    'steerableSize', 'helicalHeight',
    'patchSize', 'dipoleSize'
];

export const MISSION_IMPACTS_PARAMETERS = [
    'tracking_rate', 'slew_rate', 'reduced_coverage',
    'bodyPointingFeasibility', 'mechanicalPointingFeasibility'
];

export const NAV_AND_TRACKING_PARAMETERS = [
    'trackingCapability', 'gnssUsage'
];

export const METRIC_LABELS = {
    availability: 'Effective Comms Time (%)',
    coverage: 'RF Coverage (%)',
    data_volume: 'Throughput (GB/Day)',
    average_gap: 'Average Gap (minutes)',
    tracking_rate: 'Tracking Rate (deg/s)',
    slew_rate: 'Slew Rate (deg/s)',
    reduced_coverage: 'Pointing-Adjusted RF Coverage (%)',
    mean_contacts: 'Mean Number of RF Contacts Per Orbit',
    mean_coverage_duration: 'Mean RF Contact Duration (minutes)',
    max_gap: 'Max RF Coverage Gap (minutes)',
    mean_response_time: 'Mean Response Time (minutes)',
    coverageMinutes: 'RF Coverage (minutes/day)',
    contactsPerDay: 'Contacts Per Day',
    averageCoverageDuration: 'Average Contact Duration (minutes)',
    maxCoverageDuration: 'Max Coverage Duration (minutes)',
    averageGapDuration: 'Average Gap (minutes)',
    maxGapDuration: 'Max Gap (minutes)',
    meanResponseTime: 'Mean Response Time (minutes)',
    dataRate: 'Data Rate (Mbps)',
    throughput: 'Throughput (GB/Day)'
};

export const RELAY_METRIC_LABELS = {
    coverage: 'RF Coverage (%)',
    data_volume: 'Throughput (GB/Day)',
    average_gap: 'Average Gap (minutes)',
    tracking_rate: 'Tracking Rate (deg/s)',
    slew_rate: 'Slew Rate (deg/s)',
    reduced_coverage: 'Pointing-Adjusted RF Coverage (%)',
    mean_contacts: 'Mean Number of RF Contacts Per Orbit',
    mean_coverage_duration: 'Mean RF Contact Duration (minutes)',
    max_gap: 'Max RF Coverage Gap (minutes)',
    mean_response_time: 'Mean Response Time (minutes)',    
    dataRate: 'Data Rate (Mbps)',
    throughput: 'Throughput (GB/Day)'
};

export const DTE_METRIC_LABELS = {
    coverageMinutes: 'RF Coverage (minutes/day)',
    contactsPerDay: 'Contacts Per Day',
    averageCoverageDuration: 'Average Contact Duration (minutes)',
    maxCoverageDuration: 'Max Coverage Duration (minutes)',
    averageGapDuration: 'Average Gap (minutes)',
    maxGapDuration: 'Max Gap (minutes)',
    meanResponseTime: 'Mean Response Time (minutes)',
    dataRate: 'Data Rate (Mbps)',
    throughput: 'Throughput (GB/Day)'
};

export const PERFORMANCE_KEYS = [
    'coverage',
    'mean_contacts',
    'mean_coverage_duration',
    'average_gap',
    'max_gap',
    'mean_response_time',
    'availability',
    'coverageMinutes',
    'contactsPerDay',
    'averageCoverageDuration',
    'maxCoverageDuration',
    'averageGapDuration',
    'maxGapDuration',
    'meanResponseTime'
];

export const ANTENNA_TYPES = {
    'parabolicDiameter': 'Parabolic Antenna Diameter (m)',
    'parabolicMass': 'Parabolic Antenna Mass (kg)',
    'steerableSize': 'Electronically Steerable Antenna Size (m²)',
    'helicalHeight': 'Helical Antenna Height (m)',
    'patchSize': 'Patch Antenna Size (m²)',
    'dipoleSize': 'Dipole Antenna Size (m)'
};

export const USER_BURDEN_KEYS = {
    'User EIRP (dBW)': 'eirp_dbw',
    'Parabolic Antenna Diameter (m)': 'parabolicDiameter',
    'Parabolic Antenna Mass (kg)': 'parabolicMass',
    'Electronically Steerable Antenna Size (m²)': 'steerableSize',
    'Electronically Steerable Antenna Mass (kg)': 'steerableMass',
    'Helical Antenna Height (m)': 'helicalHeight',
    'Patch Antenna Size (m²)': 'patchSize',
    'Dipole Antenna Size (m)': 'dipoleSize'
};

export const MISSION_IMPACTS_LABELS = {
    'tracking_rate': 'Tracking Rate (deg/s)',
    'slew_rate': 'Slew Rate (deg/s)',
    'reduced_coverage': 'Pointing-Adjusted RF Coverage (%)',
    'bodyPointingFeasibility': 'Body Pointing Feasibility',
    'mechanicalPointingFeasibility': 'Mechanical Pointing Feasibility'
};

export const NAV_AND_TRACKING_LABELS = {
    'trackingCapability': 'Tracking Accuracy (m)',
    'gnssUsage': 'GNSS Availability'
};

export const REAL_TIME_MODELING_DESCRIPTION = "Real Time Modeling is powered by a python engine that employ's NASA's GMAT/SPICE packages. It propagates, statistically analyzes, and processes the data for the user satellite in real time and optimizes performance using multiple processing cores. This gives the user a direct set of performance metrics for their user satellite if the user is not satisfied with the results achieved from the Regression Estimation.";

export const REGRESSION_ESTIMATION_DESCRIPTION = 'Regression Estimation employs machine learning that is used to dynamically fit regression curves over a trade space of pre-run user data. This method offers a quick baseline as to what the user could expect from a particular network topology and if that network topology is suitable for their users needs.';