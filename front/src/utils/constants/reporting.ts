// This object allows us to connect each plotly chart with a 
// variable to be used in each report. To assign a chart from 
// the UI, assign a divId (such as divId='mychart') to each Plot 
// object and set as the componentKey below. The name value is 
// the variable to be used in the template report. For example, 
// a name of 'CHART' can be inserted into a document using $$CHART$$ 
// in your template document. Any plots not currently loaded in the 
// UI will appear with placeholder text stating that it is unavailable.
export const PLOT_LIST = {
    availability: '$$PLOTAVAILABILITY$$',
    coverage: '$$PLOTCOVERAGE$$',
    average_gap: '$$PLOTAVGGAP$$',
    tracking_rate: '$$PLOTTRACKINGRATE$$',
    slew_rate: '$$PLOTSLEWRATE$$',
    reduced_coverage: '$$PLOTREDCVG$$',
    mean_contacts: '$$PLOTMEANCONTACTS$$',
    mean_coverage_duration: '$$PLOTMEANCVGDUR$$',
    max_gap: '$$PLOTMAXGAP$$',
    mean_response_time: '$$PLOTMEANRESPONSETIME$$',
    coverageMinutes: '$$PLOTCVGMIN$$',
    contactsPerDay: '$$PLOTCONTACTSPERDAY$$',
    averageCoverageDuration: '$$PLOTAVGCGVDUR$$',
    maxCoverageDuration: '$$PLOTMAXCVGDUR$$',
    averageGapDuration: '$$PLOTAVGGAPDUR$$',
    maxGapDuration: '$$PLOTMAXGAPDUR$$',
    meanResponseTime: '$$PLOTMEANRESPTIME$$',
    RFCoverage: '$$RFCOVERAGE$$',
    CoverageStatistics: '$$COVERAGESTATS$$',
    CoverageDistribution: '$$COVERAGEDISTRIBUTION$$',
    CoverageRunningAverage: '$$COVERAGERUNNINGAVG$$'
};

export const USERBURDEN_ANTENNAOPTIONS = [
    'metrics'
];

export const USERBURDEN_MISSIONIMPACTS = [
    'reduced_coverage',
    'slew_rate',
    'tracking_rate'
];

export const NAVTRACKING_OPTIONS = [
    ''
];
