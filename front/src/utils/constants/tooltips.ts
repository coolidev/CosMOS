export const TooltipList = {
  // Parameters
  altitude: `The altitude of the user satellite (km)`,
  inclination: `The inclination of the user satellite (degrees)`,
  latitude: `Latitude of user station`,
  longitude: `Longitude of user station`,

  // Ranking
  overallRanking: `Relative ranking considers if the system meets return link performance requirements (availability, throughput, gaps), readiness by mission launch date, and viability of frequency selection. Systems meeting more criteria are ranked higher.`,
  rankingScore: `Ranking Score shows the system's value calculated by the ranking algorithm when normalizing each system's performance according to the greatest value in each metric, with higher scores generally indicated greater overall performance. The literal value is irrelevant, but is included as a means to more accurately gauge each system's performance relative to another's.`,
  numFailedRequirements: `This field indicates the number of user-specified requirements that each system fails to meet, which are expanded upon in the detailed sections below. It should be noted that failure to meet mission requirements does not mean the network is completely incapable of supporting the mission, but that performance expectations will likely need to be lowered if the associated network is intended for use.`,

  // Constellation Overview
  altitudeCheck: `Description: Altitude of the relay constellation in km.<br/><br/>Analysis notes: This value is compared against the user altitude. Most commercial systems are designed for terrestrial/mobile users and our analysis assumes that space users have to adapt to that service structure, and therefore would not be supported if operating at an altitude above the constellation (result indicates a red "X").`,
  forwardLinkFrequency: `Description: The forward link frequency of the service in MHz.<br/><br/>Analysis notes: NASA has successfully pursued a future World Radiocommunication Conference (WRC) agenda item for the 2023 WRC to gain regulatory recognition for space-to-space user links within certain frequency bands currently allocated to the Fixed Satellite Service and Mobile Satellite Service.  The green check indicates the system operates in a band that is included in the WRC-23 process, and the red "X" indicates that it is not-- resulting in user operations that would be conducted on an experimental, non-protected basis.`,
  returnLinkFrequency: `Description: The return link frequency of the service in MHz.<br/><br/>Analysis notes: NASA has successfully pursued a future World Radiocommunication Conference (WRC) agenda item for the 2023 WRC to gain regulatory recognition for space-to-space user links within certain frequency bands currently allocated to the Fixed Satellite Service and Mobile Satellite Service.  The green check indicates the system operates in a band that is included in the WRC-23 process, and the red "X" indicates that it is not-- resulting in user operations that would be conducted on an experimental, non-protected basis.`,
  systemIOCTime: `Description: Date that anticipated services would be ready for NASA users.<br/><br/>Analysis notes: The "Ready by" Year is based on publicly available information about the initial operating capabilty of the system plus an assumption that a one year period would be required to certify and "onboard" the provider before it was ready for NASA users to use the service. The result is compared to the user's anticipated launch date.`,
  forwardLinkFrequencyBand: `Description: The forward link frequency band of the service.<br/><br/>Analyses notes: Source - FCC frequency filings or comparable references.`,
  returnLinkFrequencyBand: `Description: The return link frequency band of the service.<br/><br/>Analyses notes: Source - FCC frequency filings or comparable references.`,
  forwardLinkRegulatoryStatus: `Description: Regulatory status indicators include three cases.<br/><br/>• Approved - if space to space use of the network's frequencies is already approved.<br/>• Pending Regulatory Action - indicates that the systems frequencies (or portions thereof) are within the bands being considered at the World Radiocommunications Conference in 2023 to allow for space-to-space use in the future.<br/>• No Current Regulatory Status - not currently approved, no active regulation changs in work, but may not prohibit or exclude future regulatory changes.`,
  returnLinkRegulatoryStatus: `Description: Regulatory status indicators include three cases.<br/><br/>• Approved - if space to space use of the network's frequencies is already approved.<br/>• Pending Regulatory Action - indicates that the systems frequencies (or portions thereof) are within the bands being considered at the World Radiocommunications Conference in 2023 to allow for space-to-space use in the future.<br/>• No Current Regulatory Status - not currently approved, no active regulation changs in work, but may not prohibit or exclude future regulatory changes.`,

  // Performance
  coverage: `Description: RF Coverage is captured as a percentage, representing the duration that the user satellite has enough signal power to close the communications link with the commercial communications system, over a defined period.<br/><br/>Analysis notes: RF coverage is based on physical link modeling and the attributes of the commercial system as defined by available Federal Communications Commission filings.`,
  mean_contacts: `Description: Mean Number of Contacts Per Orbit is representative of how many network contacts a user would experience per orbit based on user orbit relative to the commercial system’s configuration.​<br/><br/>Analysis notes: This value is derived from the physical link modeling and resultant RF coverage contact statistics.​`,
  mean_coverage_duration: `Description: The average duration of an individual RF coverage contact event, measured in seconds.​<br/><br/>Analysis notes: The average duration of an RF coverage contact is determined by the physical link model which is based on the evaluation of the user satellite having enough signal power to close the communications link with the commercial system.​`,
  average_gap: `Description: The average gap in RF coverage the user will experience, measured in minutes.<br/><br/>Analysis notes: The average gap in RF coverage as determined by the physical link model which is based on evaluation of the user satellite having enough signal power to close the communications link with the commercial system.`,
  max_gap: `Description: The maximum gap in RF coverage the user will experience, measured in minutes.​<br/><br/>Analysis notes: The maximum gap in RF coverage as determined by the physical link model which is based on the evaluation of the user satellite having enough signal power to close the communications link with the commercial system.​`,
  mean_response_time: `Description: Mean response time measures, on average, how long a user might have to wait for the next RF coverage connection, based on the distribution of gap durations in the observed scenario.<br/><br/>Analysis notes: Mean response time is calculated using the results of the physical link modeling and RF coverage intervals and gaps.​`,
  availability: `Description: Percent of time that the user can communicate with the network.<br/><br/>Analysis notes: Effective communication time is the result of multiple factors including RF coverage (time with sufficient power), signal acquisition time, and network registration and other network processing effects. The resultant percentage is compared to the user input need for network availability.`,
  throughput: `Description: Potential data volume transmitted in GB/Day.<br/><br/>Analysis notes: In most cases, throughput is equal to the throughput specification entered in the Mission Parameters panel. However, when the system's multiple access scheme is TDMA, the data rate is fixed, and the throughput is calculated using this data rate and the coverage provided by the system. Also note that the throughput for a network of multiple ground stations is set to the maximum data volume the user can transmit per day.`,
  dataRate: `Description: Data rate is calculated based on the specified throughput and the coverage the system provides.<br/><br/>Analysis notes: When the system's multiple access scheme is TDMA, the data rate is fixed based on the currently selected modulation and coding. In all other cases, the data rate varies depending on the throughput specified by the user in the Mission Parameters panel.`,

  // User Burden: Antenna Options
  eirp_dbw: `Description: The user Effective Isotropic Radiated Power (EIRP) in dBW.<br/><br/>Analysis note: The user EIRP is calculated based on the relay service Prec and the user orbital characteristics.`,
  parabolicDiameter: `Description: The user parabolic antenna diameter calculated in meters.<br/><br/>Analysis notes: The parabolic antenna size is calculated based on the required gain to meet the EIRP for any specific mission. A 60% efficiency is assumed for the antenna.`,
  parabolicMass: `Description: The user parabolic antenna mass calculated in kilograms.<br/><br/>Analysis notes: The parabolic antenna mass is calculated based on a common/industry mass-estimating relationship driven by antenna diameter.`,
  steerableSize: `Description: The electronically steerable antenna size calculated in square meters.<br/><br/>Analysis notes: It is assumed the antenna is rectangular and the number of antenna elements are on the order of n^2. The number of elements are calculated based on the antenna required gain, assuming a conventional patch antenna with the size of lambda/2 represents the elements, and the distance between the elements are considered to be lambda/2.`,
  helicalHeight: `Description: The Helical antenna  height in meter.<br/><br/>Analysis notes: The Helix antenna height is calculated based on the gain formula for a conventional helix antenna.`,
  patchSize: `Description: The patch antenna size in square meters (m²).<br/><br/>Analysis notes: An FR4 substrate with a dielectric constant of 4.4 is considered for the antenna. It is assumed the length and width of the patch are equal.`,
  dipoleSize: `Description: The length of the dipole antenna in meters (m).<br/><br/>Analysis notes: The length of the dipole antenna was considered based on two options (i.e. L=0.5 of lambda, and L=1.25 of lambda).`,

  // User Burden: Mission Impacts
  tracking_rate: `Description: Angular adjustment rate required for a user antenna to maintain RF coverage with the current servicing relay satellite.`,
  slew_rate: `Description: Angular adjustment rate required for the user antenna to reorient in preparation for the next satellite. Can be considered the necessary angular speed to change between relay satellites without losing service.<br/><br/>Analysis notes: Slew rates are based on STK reported coverage angles which can often result in a requirement for large instantaneous angular adjustments in order to reorient the user antenna towards the next servicing relay satellite, resulting in inflated and sometimes unrealistic results.`,
  bodyPointingFeasibility: `Description: Based on the pointing rate, the feasibility of the spacecraft accommodating those rates through body pointing.<br/><br/>Analysis notes: The pointing reference rate is compared to industry rule of thumb values: If < 0.5 deg/sec: Impact to spacecraft is minimal; reaction wheels may be enough for small vehicles. If > 0.5 deg/sec: Structural impact on appendages, weight and cost increases; gyros and/or thrusters are required.`,
  mechanicalPointingFeasibility: `Description: Based on the pointing rate, the feasibility of the spacecraft accommodating those rates through the use of a mechanism (gimbal etc.).<br/><br/>Analysis notes: The pointing reference rate is compared to a small sample set of COTS antenna pointing mechanisms which range in tracking rates from 0.02 deg/sec to 3.75 deg /sec.`,
  reduced_coverage: `Description: The percent RF coverage available if the user cannot exceed the pointing rate reference threshold. The approach for this metric is under further development and will be revised.<br/><br/>Analysis notes: The processed results of the physical link simulations include a pointing-rate-adjusted value for RF coverage by removing contact times in which the pointing rate exceeds the reference value which is the pointing rate average plus two standard deviations. Example- RF Coverage result of 90% and Pointing-Adjusted-RF Coverage result of 80% means there is a 10% loss in coverage due to tracking and slew rates that exceed the threshold. The approach for this metric is under further development and will be revised.`,

  // Nav and Tracking
  trackingCapability: `Description: Denotes the available service provided by the commercial system.<br/><br/>Analysis notes: The majority do not provide tracking or position services and will return a negative result (N/A).`,
  gnssUsage: `Description: If the commercial system cannot meet the accuracy need, the user may need to rely on GNSS solutions, although this is not the only option.<br/><br/>Analysis notes: The evaluation process indicates the applicability/usability of GNSS solutions based on altitude and information about the current GNSS space service volume.`,

  //Descriptions for the Tooltips in the QuickAccess/Mission panel
  eccentricity:
    'Describes the shape of an ellipse. A value of 0 represents a circular orbit; values greater than 0 but less than 1 represent ellipses of varying degrees of ellipticity',

  argumentOfPerigee:
    'The angle from the ascending node to the eccentricity vector measured in the direction of the satellites motion. The eccentricity vector points from the center of the Earth to perigee with a magnitude equal to the eccentricity of the orbit.',

  RAAN: 'The angle from the inertial X-axis to the ascending node. The ascending node is the point where the satellite passes through the inertial equator moving from south to north. Right ascension is measured as right-handed rotation about the inertial Z-axis.',

  LTAN: 'The time when the satellite crosses the equator when traveling from the south pole to the north pole (ascending)',

  trueAnomaly:
    'The angle between lines drawn from the center of mass to a planet, and the perihelion point, where the planet comes closest to the sun',

  serviceType:
    'The means of any radiocommunication service involving the use of one or more satellites',

  serviceThroughputRequirements:
    'The amount of data generated by and received by the mission user platform in a given unit of time whether status telemetry, command uploads, or mission data that needs to be transported',

  dataVolume:
    'The volume of data in a single file or file system can be described by a unit called a byte',

  data_Rate:
    'The amount of data that can be received, processed, and transmitted by a satellite',

  standardsCompliance:
    'Physical layer standards that support high data-rate satellite communications in the presence of RF impairments in space by providing specifications for framing structure, channel coding, modulation systems, and spectrum efficiency',

  meanNumberOfContactsPerOrbit:
    'Is representative of how many network contacts a user would experience per orbit based on user orbit relative to the commercial systems configuration',

  meanRFContactDuration:
    'The average duration of an individual RF coverage contact event, measured in seconds',

  averageGap:
    'The average gap in RF coverage the user will experience, measured in minutes',

  maxGap:
    'The maximum gap in RF coverage the user will experience, measured in minutes',

  meanResponseTime:
    'Measures, on average, how long a user might have to wait for the next RF coverage connection, based on the distribution of gap durations in the observed scenario',

  serviceEfficiency:
    'How persistent access to a network is. Typically expressed as a ratio or percent; however, qualitive terms are often used',

  gain: 'Describes how much power is transmitted in the direction of peak radiation to that of an isotropic source',

  EIRP: 'The Effective Isotropic Radiated Power (EIRP) in dBW. If this field is left empty, CART will calculate the EIRP for the worst case user',

  polarizationType:
    'The direction of the electromagnetic fields produced by the antenna as energy radiates away from it. These fields determine the direction in which the energy moves away from or is received by the antenna.',

  polarizationLoss:
    'The reduction in signal strength due to depolarization of a transmitted electromagnetic signal due to channel effects along the path between the transmit and receive antennas, in (dB)',

  pointingLoss:
    'The reduction in signal strength due to the antenna pointing error or antenna misalignment in (dB)',

  meanRFCoverage:
    'The duration that the user satellite has enough signal power to close the communication link with the desired system, over a defined period',

  transmitterPower:
    'The actual amount of power in (Watts) of the radio frequency energy that a transmitter produces at its output',

  otherLosses:
    'Any other associated system losses that have not been considered',

  passiveLosses: '',

  modulation:
    'The process of varying one or more properties of a periodic waveform, called the carrier signal, with a separate signal called the modulation signal that typically contains information to be transmitted. Optimized means that the selection that provides the highest data rate is automatically selected',

  coding:
    'A technique that adds redundant information to a message to support error detection (and error correction in some cases) on the transmitted signal and make it more robust against noise. Optimized means that the selection that provides the highest data rate is automatically selected',

  frequencyBand:
    'A specific range of frequencies in the radio frequency (RF) spectrum, which is divided among ranges from very low to very high frequencies',

  centerFrequency:
    'Measurement of a frequency based on the halfway point of an electromagnetic signal with a certain bandwidth from its minimum value to its maximum value',

  semiMajorAxis:
    'The semi-major axis is one-half of the longest diameter of an orbital ellipse, e.g., one-half of the distance between the apogee and perigee of an Earth orbit'
};
