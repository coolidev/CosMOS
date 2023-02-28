import { interpolate } from "src/algorithms/interpolation";
import { getOrbitalModelValue, getValue } from "src/algorithms/regressions";
import { State } from "src/pages/home";
import { 
    PerformancePanel,
    RelayCharacteristics,
    GroundStationCharacteristics
} from "src/types/evaluation";
import { PLOT_LIST } from 'src/utils/constants/reporting';
import { METRIC_LABELS, PERFORMANCE_KEYS } from "src/utils/constants/analysis";

export function performanceSection(performance: PerformancePanel, showGraph: boolean, state: State): string {

    let tableContents = '';

    if(state.parameters.isOrbital){
        PERFORMANCE_KEYS.forEach((key: string) => {
            let value = getOrbitalModelValue(
                state.parameters.altitude,
                state.parameters.inclination,
                key,
                performance.modelData,
                ''
            )
            if((isNaN(value) || !state.pointSync) && !state.noRegression){
                value = getValue(
                    state.parameters.altitude,
                    state.parameters.inclination,
                    key,
                    state.regressionTypes[key],
                    performance.predictedData,
                    state.selectedItems.length === 1
                      ? (performance.systemParams as RelayCharacteristics | GroundStationCharacteristics).systemName
                      : ''
                  );
            }
            if (isNaN(value)) return '';
            let rowTitle = '';
            let plot = '';
            rowTitle = METRIC_LABELS[key];
            plot = (showGraph && PLOT_LIST[key])?`<br><br>${PLOT_LIST[key]}`:``;        

            tableContents = tableContents.concat(`
                <tr style='mso-yfti-irow:1;height:.2in'>
                <td width=270 style='width:202.25pt;border:solid windowtext 1.0pt;border-top:
                none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
                padding:0in 5.4pt 0in 5.4pt;height:.2in'>
                <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
                line-height:normal'>${plot.length===0?``:`${plot}<br><br>`}<b>${rowTitle}${plot.length===0?``:`<br><br>`}<o:p></o:p></b></p>
                </td>
                <td width=156 style='width:117.0pt;border-top:none;border-left:none;
                border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
                mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
                mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
                <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
                style='font-family:"Courier New"'>${value.toFixed(2)?.toString()}<o:p></o:p></span></p>
                </td>
                </tr>
            `);
        });
    } else{
        PERFORMANCE_KEYS.forEach((key: string) => {
            if (!Object.keys(performance.modelData.terrestrial).includes(key)) {
                return null;
            }

            let interpolatedValue = interpolate(
                state.parameters.longitude,
                state.parameters.latitude,
                key,
                performance.modelData.terrestrial[key].table
            );
            if (interpolatedValue < 0) interpolatedValue = 0;

            let rowTitle = '';
            let plot = '';
            rowTitle = METRIC_LABELS[key];
            plot = (showGraph && PLOT_LIST[key])?`<br><br>${PLOT_LIST[key]}`:``;        

            tableContents = tableContents.concat(`
                <tr style='mso-yfti-irow:1;height:.2in'>
                <td width=270 style='width:202.25pt;border:solid windowtext 1.0pt;border-top:
                none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
                padding:0in 5.4pt 0in 5.4pt;height:.2in'>
                <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
                line-height:normal'>${plot.length===0?``:`${plot}<br><br>`}<b>${rowTitle}${plot.length===0?``:`<br><br>`}<o:p></o:p></b></p>
                </td>
                <td width=156 style='width:117.0pt;border-top:none;border-left:none;
                border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
                mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
                mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
                <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
                style='font-family:"Courier New"'>${interpolatedValue.toFixed(2)?.toString()}<o:p></o:p></span></p>
                </td>
                </tr>
            `);
        });
    }

    return `
        <div align=center>
        <table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
        style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;
        mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt'>
        <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:.2in'>
            <td width=270 valign=top style='width:202.25pt;border:solid windowtext 1.5pt;
            border-right:solid windowtext 1.0pt;background:#BFBFBF;mso-background-themecolor:
            background1;mso-background-themeshade:191;padding:0in 5.4pt 0in 5.4pt;
            height:.2in'>
            <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
            line-height:normal'><b><span style='mso-fareast-font-family:Times New Roman;
            mso-fareast-theme-font:minor-latin'>Characteristic<o:p></o:p></span></b></p>
            </td>
            <td width=156 valign=top style='width:117.0pt;border:solid windowtext 1.5pt;
            border-left:none;mso-border-left-alt:solid windowtext 1.0pt;background:#BFBFBF;
            mso-background-themecolor:background1;mso-background-themeshade:191;
            padding:0in 5.4pt 0in 5.4pt;height:.2in'>
            <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
            line-height:normal'><b><span style='mso-fareast-font-family:Times New Roman;
            mso-fareast-theme-font:minor-latin;color:black;mso-color-alt:windowtext'>Value</span></b><span
            style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
            minor-latin'><o:p></o:p></span></p>
            </td>
        </tr>
        ${tableContents}
        </table>
        </div>
    `;
}
