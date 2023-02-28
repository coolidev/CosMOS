import { State } from "src/pages/home";
import { ResultsState } from "src/slices/results";
import { reportInfo } from "..";

export function networkDetails(results: ResultsState, state: State, reportData: reportInfo): string {
    //Build Link Summary table
    /************************************************************/
    let table = networkSummaryShell;
    table = table.replaceAll("$YEAR",'-');
    table = table.replaceAll("$ALTITUDE",'-');
    table = table.replaceAll("$INCLINATION",'-');
    table = table.replaceAll("$NUMBERSHELLS",'-');
    table = table.replaceAll("$PLANESPERSHELL",'-');
    table = table.replaceAll("$SATELLITESPERPLANE",'-');
    table = table.replaceAll("$LONGITUDEGEO",'-');
    table = table.replaceAll("$DEGREEPROCESSING",'-');
    table = table.replaceAll("$MULTIPLEACCESSSCHEME",'-');
    /************************************************************/

    return table;
}



//Shell for Link Summary table - includes first row of antenna list
const networkSummaryShell = `
<div align=center>

<table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
 style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext 2.25pt;
 mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt;mso-border-insideh:
 1.0pt solid windowtext;mso-border-insidev:1.0pt solid windowtext'>
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
 <tr style='mso-yfti-irow:2;height:.2in'>
  <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:.5pt;mso-border-left-alt:
  1.5pt;mso-border-bottom-alt:.5pt;mso-border-right-alt:1.5pt;mso-border-color-alt:
  windowtext;mso-border-style-alt:solid;padding:0in 5.4pt 0in 5.4pt;height:
  .2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Operational
  Year<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  mso-border-top-alt:.5pt;mso-border-left-alt:1.5pt;mso-border-bottom-alt:.5pt;
  mso-border-right-alt:1.5pt;mso-border-color-alt:windowtext;mso-border-style-alt:
  solid;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin;'>$YEAR<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:3;height:.2in'>
  <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:.5pt;mso-border-left-alt:
  1.5pt;mso-border-bottom-alt:.5pt;mso-border-right-alt:1.5pt;mso-border-color-alt:
  windowtext;mso-border-style-alt:solid;padding:0in 5.4pt 0in 5.4pt;height:
  .2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Altitude
  (km)<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  mso-border-top-alt:.5pt;mso-border-left-alt:1.5pt;mso-border-bottom-alt:.5pt;
  mso-border-right-alt:1.5pt;mso-border-color-alt:windowtext;mso-border-style-alt:
  solid;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin;'>$ALTITUDE<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:4;height:.2in'>
  <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:.5pt;mso-border-left-alt:
  1.5pt;mso-border-bottom-alt:.5pt;mso-border-right-alt:1.5pt;mso-border-color-alt:
  windowtext;mso-border-style-alt:solid;padding:0in 5.4pt 0in 5.4pt;height:
  .2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Inclination
  (deg)<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  mso-border-top-alt:.5pt;mso-border-left-alt:1.5pt;mso-border-bottom-alt:.5pt;
  mso-border-right-alt:1.5pt;mso-border-color-alt:windowtext;mso-border-style-alt:
  solid;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin;'>$INCLINATION<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:5;height:.2in'>
  <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:.5pt;mso-border-left-alt:
  1.5pt;mso-border-bottom-alt:.5pt;mso-border-right-alt:1.5pt;mso-border-color-alt:
  windowtext;mso-border-style-alt:solid;padding:0in 5.4pt 0in 5.4pt;height:
  .2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Number
  of Shells<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  mso-border-top-alt:.5pt;mso-border-left-alt:1.5pt;mso-border-bottom-alt:.5pt;
  mso-border-right-alt:1.5pt;mso-border-color-alt:windowtext;mso-border-style-alt:
  solid;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin;'>$NUMBERSHELLS<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:6;height:.2in'>
  <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:.5pt;mso-border-left-alt:
  1.5pt;mso-border-bottom-alt:.5pt;mso-border-right-alt:1.5pt;mso-border-color-alt:
  windowtext;mso-border-style-alt:solid;padding:0in 5.4pt 0in 5.4pt;height:
  .2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Planes
  Per Shell<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  mso-border-top-alt:.5pt;mso-border-left-alt:1.5pt;mso-border-bottom-alt:.5pt;
  mso-border-right-alt:1.5pt;mso-border-color-alt:windowtext;mso-border-style-alt:
  solid;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin;'>$PLANESPERSHELL<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:7;height:.2in'>
  <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:.5pt;mso-border-left-alt:
  1.5pt;mso-border-bottom-alt:.5pt;mso-border-right-alt:1.5pt;mso-border-color-alt:
  windowtext;mso-border-style-alt:solid;padding:0in 5.4pt 0in 5.4pt;height:
  .2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Satellites
  Per Plane<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  mso-border-top-alt:.5pt;mso-border-left-alt:1.5pt;mso-border-bottom-alt:.5pt;
  mso-border-right-alt:1.5pt;mso-border-color-alt:windowtext;mso-border-style-alt:
  solid;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin'>$SATELLITESPERPLANE<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:8;height:.2in'>
  <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:.5pt;mso-border-left-alt:
  1.5pt;mso-border-bottom-alt:.5pt;mso-border-right-alt:1.5pt;mso-border-color-alt:
  windowtext;mso-border-style-alt:solid;padding:0in 5.4pt 0in 5.4pt;height:
  .2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Sub-Satellite
  Longitudes if GEO<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  mso-border-top-alt:.5pt;mso-border-left-alt:1.5pt;mso-border-bottom-alt:.5pt;
  mso-border-right-alt:1.5pt;mso-border-color-alt:windowtext;mso-border-style-alt:
  solid;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin'>$LONGITUDEGEO<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:9;height:.2in'>
  <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:.5pt;mso-border-left-alt:
  1.5pt;mso-border-bottom-alt:.5pt;mso-border-right-alt:1.5pt;mso-border-color-alt:
  windowtext;mso-border-style-alt:solid;padding:0in 5.4pt 0in 5.4pt;height:
  .2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Degree
  of Onboard Processing<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  mso-border-top-alt:.5pt;mso-border-left-alt:1.5pt;mso-border-bottom-alt:.5pt;
  mso-border-right-alt:1.5pt;mso-border-color-alt:windowtext;mso-border-style-alt:
  solid;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin'>$DEGREEPROCESSING<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:10;height:.2in'>
  <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:.5pt;mso-border-left-alt:
  1.5pt;mso-border-bottom-alt:.5pt;mso-border-right-alt:1.5pt;mso-border-color-alt:
  windowtext;mso-border-style-alt:solid;padding:0in 5.4pt 0in 5.4pt;height:
  .2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Multiple
  Access Scheme<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  mso-border-top-alt:.5pt;mso-border-left-alt:1.5pt;mso-border-bottom-alt:.5pt;
  mso-border-right-alt:1.5pt;mso-border-color-alt:windowtext;mso-border-style-alt:
  solid;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin'>$MULTIPLEACCESSSCHEME<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:11;height:.2in'>
  <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:.5pt;mso-border-left-alt:
  1.5pt;mso-border-bottom-alt:.5pt;mso-border-right-alt:1.5pt;mso-border-color-alt:
  windowtext;mso-border-style-alt:solid;padding:0in 5.4pt 0in 5.4pt;height:
  .2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Number
  of Beams<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  mso-border-top-alt:.5pt;mso-border-left-alt:1.5pt;mso-border-bottom-alt:.5pt;
  mso-border-right-alt:1.5pt;mso-border-color-alt:windowtext;mso-border-style-alt:
  solid;padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin'>-<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:12;mso-yfti-lastrow:yes;height:.2in'>
  <td width=270 style='width:202.25pt;border:solid windowtext 1.5pt;border-top:
  none;mso-border-top-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;
  height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'>Type
  of Beams<o:p></o:p></span></p>
  </td>
  <td width=156 style='width:117.0pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.5pt;border-right:solid windowtext 1.5pt;
  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext 1.5pt;
  padding:0in 5.4pt 0in 5.4pt;height:.2in'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New";mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin'>-<o:p></o:p></span></p>
  </td>
 </tr>
</table>

</div>`;
