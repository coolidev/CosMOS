// export const initialRows = [
//     {
//         group: 'Ranking',
//         rows: [['Rank'], ['Score'], ['Requirements Met']]
//     },
//     {
//         group: 'Parameters',
//         rows: [['Altitude (km)'], ['Inclination (deg)'], ['Eccentricity'], ['Frequency Band'], ['Modulation'], ['Coding'], ['Standards Compliance']]
//     },
//     {
//         group: 'Performance',
//         rows: [
//             ['RF Coverage (%)'],
//             ['Mean Number of RF Contacts Per Orbit'],
//             ['Mean RF Contact Duration (minutes)'],
//             ['Average Gap (minutes)'],
//             ['Max RF Coverage Gap (minutes)'],
//             ['Mean Response Time (minutes)'],
//             ['Effective Comms Time (%)'],
//             ['Data Rate (Mbps)'],
//             ['Throughput (GB/Day)']
//         ]
//     },
//     {
//         group: 'User Burden: Antenna Options',
//         rows: [
//             ['User EIRP (dBW)'],
//             ['Parabolic Antenna Diameter (m)'],
//             ['Parabolic Antenna Mass (kg)'],
//             ['Electronically Steerable Antenna Size (m²)'],
//             ['Helical Antenna Height (m)'],
//             ['Patch Antenna Size (m²)'],
//             ['Dipole Antenna Size (m)']
//         ]
//     },
//     {
//         group: 'User Burden: Mission Impacts',
//         rows: [
//             ['Tracking Rate (deg/s)'],
//             ['Slew Rate (deg/s)'],
//             ['Pointing-Adjusted RF Coverage (%)'],
//             ['Body Pointing Feasibility'],
//             ['Mechanical Pointing Feasibility']
//         ]
//     },
//     {
//         group: 'Nav and Tracking',
//         rows: [['Tracking Accuracy (m)'], ['GNSS Availability']]
//     }
//   ];
  
//   export const initialDteRows = [
//     {
//         group: 'Ranking',
//         rows: [['Rank'], ['Score'], ['Requirements Met']]
//     },
//     {
//         group: 'Parameters',
//         rows: [['Altitude (km)'], ['Inclination (deg)'], ['Eccentricity'], ['Frequency Band'], ['Modulation'], ['Coding'], ['Standards Compliance']]
//     },
//     {
//         group: 'Performance',
//         rows: [
//             ['RF Coverage (%)'],
//             ['Mean Number of RF Contacts Per Orbit'],
//             ['Mean RF Contact Duration (minutes)'],
//             ['Average Gap (minutes)'],
//             ['Max RF Coverage Gap (minutes)'],
//             ['Mean Response Time (minutes)'],
//             ['Effective Comms Time (%)'],
//             ['Data Rate (Mbps)'],
//             ['Throughput (GB/Day)']
//         ]
//     },
//     {
//         group: 'User Burden: Antenna Options',
//         rows: [
//             ['User EIRP (dBW)'],
//             ['Parabolic Antenna Diameter (m)'],
//             ['Parabolic Antenna Mass (kg)'],
//             ['Electronically Steerable Antenna Size (m²)'],
//             ['Helical Antenna Height (m)'],
//             ['Patch Antenna Size (m²)'],
//             ['Dipole Antenna Size (m)']
//         ]
//     },
//     {
//         group: 'Nav and Tracking',
//         rows: [['Tracking Accuracy (m)'], ['GNSS Availability']]
//     }
// ];
//Skeleton for the Comparison table for Orbital Missions
export const COMPARISON_TABLE_ORBITAL = {
    tableStructure: {
      group: [
        {
          info: "",
          name: "Parameters",
          key: "parameters",
          items: [
            {
              name: "Altitude",
              key: "altitude",
              rowBreakdownOptions: []
            },
            {
              name: "Inclination",
              key: "inclination",
              rowBreakdownOptions: []
            },
            {
              name: "Eccentricity",
              key: "eccentricity",
              rowBreakdownOptions: []
            },
            {
              name: "Frequency Band",
              key: "frequencyBand",
              rowBreakdownOptions: []
            },
            {
              name: "Modulation",
              key: "modulation",
              rowBreakdownOptions: []
            },
            {
              name: "Coding",
              key: "coding",
              rowBreakdownOptions: []
            },
            {
              name: "Standards Compliance",
              key: "standardsCompliance",
              rowBreakdownOptions: []
            }
          ]
        },
        {
          info: "",
          name: "Performance",
          key: "performance",
          items: [
            {
              name: "RF Coverage",
              key: "rfCoverage",
              rowBreakdownOptions: []
            },
            {
              name: "Mean Number of Contacts",
              key: "meanContacts",
              rowBreakdownOptions: []
            },
            {
              name: "Mean Contact Duration",
              key: "meanContactDuration",
              rowBreakdownOptions: []
            },
            {
              name: "Average Gap",
              key: "averageGap",
              rowBreakdownOptions: []
            },
            {
              name: "Maximum Gap Time",
              key: "maxGap",
              rowBreakdownOptions: []
            },
            {
              name: "Mean Response Time",
              key: "meanResponseTime",
              rowBreakdownOptions: []
            },
            {
              name: "Effective Comms Time",
              key: "effectiveCommsTime",
              rowBreakdownOptions: []
            },
            {
              name: "Data Rate",
              key: "dataRate",
              rowBreakdownOptions: []
            },
            {
              name: "Throughput",
              key: "throughput",
              rowBreakdownOptions: []
            },
          ]
        },
        {
          info: "",
          name: "Antenna Options (User Burden)",
          key: "antennaOptions",
          items: [
            {
              name: "EIRP",
              key: "eirp",
              rowBreakdownOptions: []
            },
            {
              name: "Parabolic Antenna Diameter",
              key: "parabolicAntennaDiameter",
              rowBreakdownOptions: []
            },
            {
              name: "Parabolic Antenna Mass",
              key: "parabolicAntennaMass",
              rowBreakdownOptions: []
            },
            {
              name: "Electronic Antenna Size",
              key: "electronicAntennaSize",
              rowBreakdownOptions: []
            },
            {
              name: "Helical Antenna Height",
              key: "helicalAntennaHeight",
              rowBreakdownOptions: []
            },
            {
              name: "Patch Antenna Size",
              key: "patchAntennaSize",
              rowBreakdownOptions: []
            },
            {
              name: "Dipole Antenna Size",
              key: "dipoleAntennaSize",
              rowBreakdownOptions: []
            }
          ]
        },
        {
          info: "",
          name: "Nav and Tracking",
          key: "navAndTracking",
          items: [
            {
              name: "Tracking Accuracy",
              key: "trackingAccuracy",
              rowBreakdownOptions: []
            },
            {
              name: "GNSS Availability",
              key: "gnssAvailability",
              rowBreakdownOptions: []
            }
          ]
        }
      ],
      rowBreakdownOptions: []
    },
    columnData: [],
    columnSequence: []
  };

  //Skeleton for the Comparison table for Terrestrial Mission
export const COMPARISON_TABLE_TERRESTRIAL = {
    tableStructure: {
      group: [
        {
          info: "",
          name: "Parameters",
          key: "parameters",
          items: [
            {
              name: "Latitude",
              key: "latitude",
              rowBreakdownOptions: []
            },
            {
              name: "Longitude",
              key: "longitude",
              rowBreakdownOptions: []
            },
            {
              name: "Frequency Band",
              key: "frequencyBand",
              rowBreakdownOptions: []
            },
            {
              name: "Modulation",
              key: "modulation",
              rowBreakdownOptions: []
            },
            {
              name: "Coding",
              key: "coding",
              rowBreakdownOptions: []
            },
            {
              name: "Standards Compliance",
              key: "standardsCompliance",
              rowBreakdownOptions: []
            }
          ]
        },
        {
          info: "",
          name: "Performance",
          key: "performance",
          items: [
            {
              name: "RF Coverage",
              key: "rfCoverage",
              rowBreakdownOptions: []
            },
            {
              name: "Mean Number of Contacts",
              key: "meanContacts",
              rowBreakdownOptions: []
            },
            {
              name: "Mean Contact Duration",
              key: "meanContactDuration",
              rowBreakdownOptions: []
            },
            {
              name: "Average Gap",
              key: "averageGap",
              rowBreakdownOptions: []
            },
            {
              name: "Maximum Gap Time",
              key: "maxGap",
              rowBreakdownOptions: []
            },
            {
              name: "Mean Response Time",
              key: "meanResponseTime",
              rowBreakdownOptions: []
            },
            {
              name: "Effective Comms Time",
              key: "effectiveCommsTime",
              rowBreakdownOptions: []
            },
            {
              name: "Data Rate",
              key: "dataRate",
              rowBreakdownOptions: []
            },
            {
              name: "Throughput",
              key: "throughput",
              rowBreakdownOptions: []
            },
          ]
        },
        {
          info: "",
          name: "Antenna Options (User Burden)",
          key: "antennaOptions",
          items: [
            {
              name: "EIRP",
              key: "eirp",
              rowBreakdownOptions: []
            },
            {
              name: "Parabolic Antenna Diameter",
              key: "parabolicAntennaDiameter",
              rowBreakdownOptions: []
            },
            {
              name: "Parabolic Antenna Mass",
              key: "parabolicAntennaMass",
              rowBreakdownOptions: []
            },
            {
              name: "Electronic Antenna Size",
              key: "electronicAntennaSize",
              rowBreakdownOptions: []
            },
            {
              name: "Helical Antenna Height",
              key: "helicalAntennaHeight",
              rowBreakdownOptions: []
            },
            {
              name: "Patch Antenna Size",
              key: "patchAntennaSize",
              rowBreakdownOptions: []
            },
            {
              name: "Dipole Antenna Size",
              key: "dipoleAntennaSize",
              rowBreakdownOptions: []
            }
          ]
        },
        {
          info: "",
          name: "Nav and Tracking",
          key: "navAndTracking",
          items: [
            {
              name: "Tracking Accuracy",
              key: "trackingAccuracy",
              rowBreakdownOptions: []
            },
            {
              name: "GNSS Availability",
              key: "gnssAvailability",
              rowBreakdownOptions: []
            }
          ]
        }
      ],
      rowBreakdownOptions: []
    },
    columnData: [],
    columnSequence: []
  };

