import { State } from "src/pages/home";
import { 
    ANTENNA_OPTIONS_NAME, 
    MISSION_IMPACTS_NAME, 
    NAV_AND_TRACKING_NAME, 
    PARAMETERS_NAME, 
    PERFORMANCE_NAME, 
    RANKING_NAME } from "src/pages/home/Results/Comparison";
import { ResultsState } from "src/slices/results";
import { reportInfo } from "../..";
import { chartSection, columnTitleHoriz, rankingRow, rankingSelectionTemplate, rowEntry, rowTemplate, rowTitle } from "./chartSection";

export interface CompareTableParams {
    type: string,
    results: ResultsState, 
    state: State, 
    reportData: reportInfo
}

export interface CompareType {
    [key: string]: string;
}

export const compareTableTypes = {
    'COMPARISONCHART_PARAMS': PARAMETERS_NAME,
    'COMPARISONCHART_RANKING': RANKING_NAME,
    'COMPARISONCHART_PERFORMANCE': PERFORMANCE_NAME,
    'COMPARISONCHART_USERANTENNA': ANTENNA_OPTIONS_NAME,
    'COMPARISONCHART_USERMISSION': MISSION_IMPACTS_NAME,
    'COMPARISONCHART_NAVANDTRACKING': NAV_AND_TRACKING_NAME
}

//Generate charts for compare panel. 
//This component is reversed from how data is shown in the compare panel, 
//so rows are mapped to columns, and columns are mapped to rows in the resulting tables.
export function comparisonCharts(type: string, results: ResultsState) {
    let result = '';

    //Lets hide the Ranking table if values are empty
    if(type === 'COMPARISONCHART_RANKING' && results.comparePanel.rows.find((x) => (x.group === RANKING_NAME)).rows[0][1] === ''){
        return '';
    }

    //Some of the comparison tables won't be relevant depending on system type, so lets skip those that fail to run (try/catch).
    try{
        //Populate column headers (system name)
        let columnHeaders = '';
        results.comparePanel.columns.forEach((networkName,idx) => {
            if(idx !== 0){
                columnHeaders += (columnTitleHoriz.replace("$COLNAME$",networkName))
            }
        });
        result = chartSection.replace("$TITLES$",columnHeaders).replace("$SECTIONNAME$",compareTableTypes[type]);
        if(type !== 'COMPARISONCHART_RANKING'){
            result = result.replace('$$RANKING_SELECTIONS$$','');
        }

        //Populate rows (each unique system)
        let rowData = '';
        results.comparePanel.rows.find((x) => (x.group === compareTableTypes[type])).rows.forEach((row) => {
            let tempRow = rowTemplate;
            //Set Row Title to parameter name
            tempRow = tempRow.replace("$ROWTITLE$",rowTitle.replace("$SYSTEMNAME$",row[0].toString().replace("²","&sup2;")));

            //Populate values
            let tempCells = '';
            row.forEach((cell, id) => {
                if(id !== 0){
                    tempCells += (rowEntry.replace("$VAL$",cell.toString()));
                }
            });

            //Add to row object
            rowData += tempRow.replace("$ROWVALS$",tempCells);
        });

        return result.replace("$ROWTEMPLATE$",rowData).replaceAll('$COLNUM',results.comparePanel.columns.length.toString());
    }catch{
        return '';
    }
}

export function rankingSelections(results: ResultsState){
    if(results.comparePanel.rows.find((x) => (x.group === RANKING_NAME)).rows[0][1] === ''){
        return '';
    }

    let rows = '';
    results.comparePanel.metricSelections.forEach((x) => {
        rows += rankingRow.replace('$PARAM$',x.metricName).replace('$VALUE$',x.metricImportance);
    });
    return rankingSelectionTemplate.replace('$ROWS$',rows);;
}






