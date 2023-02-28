/**
 * @fileoverview An Express router that handles all API requests.
 * Each request corresponds to an associated method in
 * AnalysisController or AuthController.
 */
import { Router } from "express";
import upload from "./upload";
import fs, { write } from "fs";

function mapToArray<K,V>(o : Map<K,V>) : V[] {
  let x : V[] = [];
  o.forEach(elt => x.push(elt));
  return x;
}


interface LinkSegment {
  linkId : number;
  connectionId : number | null;
}

interface RichLinkSegment {
  linkId : number;
  connectionId : number | null;
  linkPosition ? : number;
  userId : number;
  networkId : number;
  name : string;
}

interface LinkGroup {
  linkId : number;
  userId : number;
  networkId : number;
  name : string;
  segments : RichLinkSegment[]
}

/**
 * A wrapper around an Express Router object that contains routes for
 * handling API requests. The controllers are provided via dependency
 * injection.
 */
export class Api {
  router: Router;
  links : Map<number,LinkGroup>;
  constructor() {
    this.router = Router();
    this.links = new Map<number,LinkGroup>();
    // Authentication routes
    // Allows user to create an account
    // CURRENTLY UNUSED
    this.router.post("/signup", async (req, res) => {
      const { name, email, password, phone } = req.body;
      const status = 200;
      const result = {};
      res.status(status).send(result);
    });
    // Allows admin user to create a user account
    this.router.post("/admin-create-user", async (req, res) => {
      const { name, email, phone, admin, engineer } = req.body;
      const status = 200;
      const result = {};
      res.status(status).send(result);
    });
    //
    this.router.post("/delete-user", async (req, res) => {
      const { email } = req.body;
      const status = 200;
      const result = {};
      res.status(status).send(result);
    });
    // Allows a user to log in
    this.router.post("/signin", async (req, res) => {
      const { email, password } = req.body;
      const status = 200;
      const result = { status: status, result: "111111" };
      res.status(status).send(result);
    });
    // Verifies that a user entered the correct SMS verification code
    this.router.post("/sms-verify", async (req, res) => {
      const { sms_code } = req.body;
      const status = 200;
      const obj = {
        sms_code: "111111",
        intro: false,
        email: "test@teltrium.com",
        name: "Test User",
      };
      res.status(status).send(obj);
    });
    this.router.post("/updateConnectivity", async (req, res) => {
      const status = 200;
      const obj = {};
      res.status(status).send(obj);
    });
    // Sends SMS code to a user as the first step in changing a password
    this.router.post("/change-password-number", async (req, res) => {
      const { phone } = req.body;
      const status = 200;
      const result = {};
      res.status(status).send(result);
    });
    // Allows a user to change their password
    this.router.post("/change-password-with-verification", async (req, res) => {
      const { email, oldpassword, password } = req.body;
      const status = 200;
      const result = {};
      res.status(status).send(result);
    });
    // Allows a user to change their password
    this.router.post("/change-password", async (req, res) => {
      const { email, oldpassword, password } = req.body;
      const status = 200;
      const result = {};
      res.status(status).send(result);
    });
    // Allows a user to change their user information
    this.router.post("/change-user-info", async (req, res) => {
      const { email, name, phone, oldpassword, origemail } = req.body;
      const status = 200;
      const result = {};
      res.status(status).send(result);
    });
    this.router.post("/manage-user", async (req, res) => {
      const { email, origEmail, name, phone, admin, engineer } = req.body;
      const status = 200;
      const result = {};
      res.status(status).send(result);
    });
    //
    this.router.post("/getUserName", async (req, res) => {
      const { email } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    //
    this.router.post("/getUserPhone", async (req, res) => {
      const { email } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    //
    this.router.post("/getIntroStatus", async (req, res) => {
      const { email } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    //
    this.router.post("/getEngineerStatus", async (req, res) => {
      const { email } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    //
    this.router.post("/getAdminStatus", async (req, res) => {
      const { email } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    // Allows user to hide Intro popup on subsequent logins
    this.router.post("/requestIntroDisable", async (req, res) => {
      const { email, checkedShow } = req.body;
      const status = 200;
      const result = {};
      res.status(status).send(result);
    });
    //
    this.router.post("/getUserList", async (req, res) => {
      const { email } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    /**
     * This API function accepts an email to identify the user and
     * returns all of the user's preferences.
     * @param {number} email
     * @returns {object} Returns an object of the user preferences.
     */
    this.router.post("/requestUserPreferences", async (req, res) => {
      const { email } = req.body;
      const preference = {
        project: [
          {
            id: "s537j3i1-s9a2-6354-3s8d-95sdf7sd9513",
            projectName: "myProjectName1",
            missionName: "myMissionName1",
            missionDescription: "This is the mission description",
            saves: [
              {
                id: "s537j3i1-s9a2-6354-3s8d-95sdf7sd9520",
                dateTime: 1629818310,
                selectedTabRight: "networkSelection",
                selectedTabCenter: "groundStations",
                selectedFrequencyBandId: 2,
                selectedNetworks: [],
                isBaseline: true,
                parameters: {
                  isOrbital: true,
                  altitude: 300,
                  inclination: 30,
                  latitude: 30,
                  longitude: 30,
                },
                specifications: {
                  availability: 124,
                  throughput: 26000,
                  tolerableGap: 6,
                  trackingServiceRangeError: 20,
                },
                constraints: {
                  launchYear: 2030,
                  powerAmplifier: 1,
                },
                networkFilters: {
                  name: "ksat",
                  type: "relay",
                  operationalYear: 2000,
                  supportedFrequencies: "X-Band",
                  location: "Europe",
                },
                groundStationFilters: {
                  name: "svalbard",
                  networks: "ksat",
                  operationalYear: 2000,
                  supportedFrequencies: "X-Band",
                  location: "Europe",
                },
              },
              {
                id: "s537j3i1-s9a2-6354-3s8d-95sdf7sd9521",
                dateTime: 1598282310,
                selectedTabRight: "networkSelection",
                selectedTabCenter: "groundStations",
                selectedFrequencyBandId: 2,
                selectedNetworks: [],
                isBaseline: false,
                parameters: {
                  isOrbital: true,
                  altitude: 300,
                  inclination: 30,
                  latitude: 30,
                  longitude: 30,
                },
                specifications: {
                  availability: 124,
                  throughput: 26000,
                  tolerableGap: 6,
                  trackingServiceRangeError: 20,
                },
                constraints: {
                  launchYear: 2030,
                  powerAmplifier: 1,
                },
                networkFilters: {
                  name: "ksat",
                  type: "relay",
                  operationalYear: 2000,
                  supportedFrequencies: "X-Band",
                  location: "Europe",
                },
                groundStationFilters: {
                  name: "svalbard",
                  networks: "ksat",
                  operationalYear: 2000,
                  supportedFrequencies: "X-Band",
                  location: "Europe",
                },
              },
            ],
          },
          {
            id: "e973f0f7-d7a6-4641-9d8d-43bcf2da5332",
            projectName: "myProjectName2",
            missionName: "myMissionName2",
            missionDescription: "This is the mission description",
            saves: [
              {
                id: "s537j3i1-s9a2-6354-3s8d-95sdf7sd9522",
                dateTime: 1598282310,
                selectedTabRight: "networkSelection",
                selectedTabCenter: "groundStations",
                selectedFrequencyBandId: 2,
                selectedNetworks: [],
                isBaseline: false,
                parameters: {
                  isOrbital: true,
                  altitude: 300,
                  inclination: 30,
                  latitude: 30,
                  longitude: 30,
                },
                specifications: {
                  availability: 124,
                  throughput: 26000,
                  tolerableGap: 6,
                  trackingServiceRangeError: 20,
                },
                constraints: {
                  launchYear: 2030,
                  powerAmplifier: 1,
                },
                networkFilters: {
                  name: "ksat",
                  type: "relay",
                  operationalYear: 2000,
                  supportedFrequencies: "X-Band",
                  location: "Europe",
                },
                groundStationFilters: {
                  name: "svalbard",
                  networks: "ksat",
                  operationalYear: 2000,
                  supportedFrequencies: "X-Band",
                  location: "Europe",
                },
              },
              {
                id: "s537j3i1-s9a2-6354-3s8d-95sdf7sd9523",
                dateTime: 1598282310,
                selectedTabRight: "networkSelection",
                selectedTabCenter: "groundStations",
                selectedFrequencyBandId: 3,
                selectedNetworks: [],
                isBaseline: true,
                parameters: {
                  isOrbital: true,
                  altitude: 300,
                  inclination: 30,
                  latitude: 30,
                  longitude: 30,
                },
                specifications: {
                  availability: 124,
                  throughput: 26000,
                  tolerableGap: 6,
                  trackingServiceRangeError: 20,
                },
                constraints: {
                  launchYear: 2030,
                  powerAmplifier: 1,
                },
                networkFilters: {
                  name: "ksat",
                  type: "relay",
                  operationalYear: 2000,
                  supportedFrequencies: "X-Band",
                  location: "Platform",
                },
                groundStationFilters: {
                  name: "svalbard",
                  networks: "ksat",
                  operationalYear: 2000,
                  supportedFrequencies: "X-Band",
                  location: "Platform",
                },
              },
            ],
          },
        ],
      };
      res.status(200).send({ preference });
    });
    /**
     * This API function accepts an email to identify the user and
     * data describing the user's preferences.
     * @param {number} email
     * @returns {boolean} Returns true if successful, and false otherwise.
     */
    this.router.post("/updateUserPreferences", async (req, res) => {
      const { email, preference } = req.body;
      const result = preference;
      res.status(200).send({ preference });
    });
    this.router.get("/getFrequencyBandSpecs", async (_req, res) => {
      const data = [
        {
            id: 1,
            name: "S-band",
            minFrequency_MHz: 2200,
            maxFrequency_MHz: 2290,
            elevationConstraint_deg: 5
        },
        {
            id: 2,
            name: "X-band",
            minFrequency_MHz: 8025,
            maxFrequency_MHz: 8400,
            elevationConstraint_deg: 10
        },
        {
            id: 3,
            name: "Ka-band",
            minFrequency_MHz: 25500,
            maxFrequency_MHz: 27000,
            elevationConstraint_deg: 10
        },
        {
            id: 4,
            name: "Ku-band",
            minFrequency_MHz: 12000,
            maxFrequency_MHz: 20000,
            elevationConstraint_deg: 10
        },
        {
            id: 5,
            name: "L-band",
            minFrequency_MHz: 1000,
            maxFrequency_MHz: 2000,
            elevationConstraint_deg: 5
        },
        {
            id: 6,
            name: "V-band",
            minFrequency_MHz: 40000,
            maxFrequency_MHz: 75000,
            elevationConstraint_deg: 10
        }
    ];
      res.status(200).send(data);
    });
    this.router.get("/getUser", async (req, res) => {
      const { email } = req.query;
      res.status(200).send({
          email: 'test@teltrium.com',
          name: 'test',
          phone: '10000000000',
          isAdmin: true,
          isEngineer: true
      });
  });
  this.router.get("/getUserAccount", async (req, res) => {
    const result = {
      isAdmin: true,
      isEngineer: true
  };
  res.status(200).send(result);
});
    /**
     * @typedef {Object} GroundStationSummary
     * @property {number} id
     * @property {string} name
     * @property {string} networks
     * @property {number} numAntennas
     * @property {string} supportedFrequencies
     * @property {string} location
     */
    /**
     * Returns data for the GroundStation Dashboard view.
     * @returns {GroundStationSummary[]}
     * id
     */
    this.router.get("/requestGroundStationDashboard", async (_req, res) => {
      const data = [
        {
          id: 125,
          name: "Test Ground Station #1",
          networks: "Test System #1",
          numAntennas: 1,
          supportedFrequencies: "X-Band, S-Band",
          location: "Platform",
        },
        {
          id: 5612,
          name: "Test Ground Station #2",
          networks: "Test System #1, Test System #2",
          numAntennas: 6,
          supportedFrequencies: "X-Band, Ka-Band",
          location: "Europe",
        },
        {
          id: 6512,
          name: "Test Ground Station #3",
          networks: "Test System #2, Test System #3",
          numAntennas: 2,
          supportedFrequencies: "S-Band",
          location: "Africa",
        },
        {
          id: 9513,
          name: "Test Ground Station #4",
          networks: "Test System #3",
          numAntennas: 3,
          supportedFrequencies: "S-Band, Ka-Band",
          location: "Europe",
        },
        {
          id: 6232,
          name: "Test Ground Station #5",
          networks: "Test System #1",
          numAntennas: 5,
          supportedFrequencies: "S-Band",
          location: "South America",
        },
        {
          id: 7533,
          name: "Test Ground Station #6",
          networks: "Test System #2",
          numAntennas: 2,
          supportedFrequencies: "S-Band, Ka-Band",
          location: "Antarctica",
        },
      ];
      res.status(200).send(data);
    });
    /**
     * @typedef {Object} ExploreSummary
     * @property {string} system
     * @property {string} ioc_year
     * @property {string} altitude
     * @property {string} total_satellites
     * @property {string} max_return_data_rate
     * @property {string} ssl_return_link_freq
     */
    /**
     * Returns data for the Explore Dashboard view.
     * @returns {ExploreSummary[]}
     */
    this.router.get("/requestExploreDashboard", async (_req, res) => {
      const result : any = [
      ];
      res.status(200).send(result);
    });
    /**
     * @typedef {Object} ExploreDetail
     * @property {Object} master
     * @property {Object} detail
     * @property {{ admin: boolean }} admin
     * @property {Object} csvData
     */
    /**
     * Returns data for the Explore Detail view.
     * @param {string} id System identifier.
     * @param {string} email Email of the current user.
     * @returns {ExploreDetail}
     */
    this.router.post("/requestExploreDetail", async (req, res) => {
      const { id, email } = req.body;
      const result = {
        master: [
          { key: "Constellation Topology", value: "Constellation Topology" },
          { key: "Ground Topology", value: "Ground Topology" },
          { key: "Navigation", value: "Navigation" },
          { key: "Other: Modeling", value: "Other: Modeling" },
          {
            key: "Relay Communications Topology - Forward Link",
            value: "Relay Communications Topology - Forward Link",
          },
          {
            key: "Relay Communications Topology - General",
            value: "Relay Communications Topology - General",
          },
          {
            key: "Relay Communications Topology - Return Link",
            value: "Relay Communications Topology - Return Link",
          },
          {
            key: "System Level Capabilities and Target Customers",
            value: "System Level Capabilities and Target Customers",
          },
        ],
        detail: {
          system_name: "Test System #1",
          system_value: [
            {
              section_key: "Constellation Topology",
              section_name: "Constellation Topology",
              section_value: [
                {
                  key: "Constellation Topology",
                  sub_key: "general_constellation_topology_descriptive",
                  name: "General Constellation Topology - Descriptive",
                  value:
                    "Modeled as three representative Eutelsat satellites at 133W, 115W, 12W; noting that the Eutelsat fleet is larger.",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Constellation Topology",
                  sub_key: "num_of_shells_defined_by_altitude",
                  name: "Number of Shells (Defined by Altitude)",
                  value: "1",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Constellation Topology",
                  sub_key: "altitude_km_shell1_shelln",
                  name: "Altitude of each Shell (km) (Shell #1, Shell #2, ...)",
                  value: "35786",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Constellation Topology",
                  sub_key: "num_of_planes_per_shell_shell1_shelln",
                  name: "Number of Planes Per Shell (Shell #1, Shell #2, ...)",
                  value: "1",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Constellation Topology",
                  sub_key: "inclination_by_plane_plane1_planen",
                  name: "Inclination (deg) by Plane (Plane #1, Plane #2, ...)",
                  value: "0",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Constellation Topology",
                  sub_key: "num_of_satellites_per_plane_plane_1_planen",
                  name: "Number of Satellites Per Plane (Plane #1, Plane #2, ...)",
                  value: "3",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Constellation Topology",
                  sub_key: "total_number_of_satellites",
                  name: "Total Number of Satellites",
                  value: "3",
                  explanation: "",
                  references: "",
                },
              ],
            },
            {
              section_key: "Ground Topology",
              section_name: "Ground Topology",
              section_value: [
                {
                  key: "Ground Topology",
                  sub_key: "num_of_gt_locations",
                  name: "Number of Ground Terminal Locations",
                  value: "GTs are user-based",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Ground Topology",
                  sub_key: "geographic_locations",
                  name: "Geographic Location",
                  value: "Global",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Ground Topology",
                  sub_key: "data_distribution",
                  name: "Data Distribution",
                  value: "End-user terminal driven",
                  explanation: "",
                  references: "",
                },
              ],
            },
            {
              section_key: "Navigation",
              section_name: "Navigation",
              section_value: [
                {
                  key: "Navigation",
                  sub_key:
                    "radiometric_tracking_or_positioning_capability_num_m_none",
                  name: "Tracking Service, 3-sigma Range Error (m)",
                  value: "None",
                  explanation: "",
                  references: "",
                },
              ],
            },
            {
              section_key: "Other: Modeling",
              section_name: "Other: Modeling",
              section_value: [
                {
                  key: "Other: Modeling",
                  sub_key: "prec_dbw",
                  name: "Prec Threshold at the Relay Satellite (dBW)",
                  value: "-129.5",
                  explanation:
                    "Return link Prec threshold at the relay satellite for a user to be successfully supported",
                  references: "",
                },
                {
                  key: "Other: Modeling",
                  sub_key: "system_modeling_approach_narrative",
                  name: "System Modeling Approach Narrative",
                  value:
                    "The system is modeled based on the relays capability to track users. \r\n" +
                    "The system can track the user within a limited cone angle reported in the FCC filing, outside of which coverage is \r\n" +
                    "considered unprovidable. For any user requirements the link is optimized based on available modulation/coding scheme and the data rate.",
                  explanation:
                    "Out of two steerable beams and 9 fixed beams, modelling of\r\n" +
                    " one steerable beam was chosen based on service regions of steerable beams and lack of pointing information for fixed beam modelling. The steerable beam parameters were referenced from the Schedule S document.\r\n" +
                    "  Sensor cone angle of 8.6 deg was assumed such that it covers the entire satellite’s field of view and matches with the respective coverage area from the filings.\r\n" +
                    "Through trial-and-error, it was determined that a parabolic antenna in conjunction with the peak gain of 37.03dB from the Schedule S closely approximates the contour of \r\n" +
                    "Eutelsat4 beam on the Earth’s surface. User transmitter was continuously tracked by the sensor such that the transmitter has access to the receive beam in the entire sensor cone area.",
                  references: "",
                },
                {
                  key: "Other: Modeling",
                  sub_key: "model_implements_user_tracking_y_n",
                  name: "Model Implements User Tracking (Y/N)",
                  value: "Y",
                  explanation: "",
                  references: "",
                },
              ],
            },
            {
              section_key: "Relay Communications Topology - Forward Link",
              section_name: "Relay Communications Topology - Forward Link",
              section_value: [
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "max_forward_data_rate_mbps",
                  name: "Max Forward Data Rate (Mbps)",
                  value: "",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "forward_link_modulation",
                  name: "Forward Link Modulation",
                  value: "4",
                  explanation: "DVB-S2",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "forward_link_coding",
                  name: "Forward Link Coding",
                  value: "1",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "sgl_forward_link_frequency_mhz",
                  name: "SGL Forward Link Frequency (MHz)",
                  value: "14041",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "sgl_gateway_eirp_dbw",
                  name: "SGL Gateway EIRP (dBW)",
                  value: "70.54",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "sgl_relay_g_t_db_k",
                  name: "SGL Relay G/T (dB/K)",
                  value: "6",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "sgl_forward_link_bandwidth_db_hz",
                  name: "SGL Forward Link Bandwidth (dB-Hz)",
                  value: "78.6",
                  explanation: "72 MHz- FCC filing link budget",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "ssl_forward_link_frequency_mhz",
                  name: "SSL Forward Link Frequency (MHz)",
                  value: "12541",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "ssl_relay_eirp_dbw",
                  name: "SSL Relay EIRP (dBW)",
                  value: "48",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "user_terminal_g_t_db_k",
                  name: "User Terminal G/T (dB/K)",
                  value: "12.62",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "ssl_forward_link_bandwidth_db_hz",
                  name: "SSL Forward Link Bandwidth (dB-Hz)",
                  value: "78.6",
                  explanation: "72 MHz- FCC filing link budget",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "user_terminal_c_i_db",
                  name: "User Terminal C/I (dB)",
                  value: "21.85",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "forward_link_implementation_loss",
                  name: "Forward Link Implementation Loss (dB)",
                  value: "0",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Forward Link",
                  sub_key: "forward_link_required_eb_no",
                  name: "Forward Link Required Eb/No (dB)",
                  value: "5.41",
                  explanation: "",
                  references: "",
                },
              ],
            },
            {
              section_key: "Relay Communications Topology - General",
              section_name: "Relay Communications Topology - General",
              section_value: [
                {
                  key: "Relay Communications Topology - General",
                  sub_key: "general_communications_topology_descriptive",
                  name: "General Communications Topology - Descriptive",
                  value:
                    "Shared analog bandwidth provider, where each GEO satellite is providing direct-to-user broadcast services.",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - General",
                  sub_key: "user_experience_comments_descriptive",
                  name: "User Experience Comments - Descriptive",
                  value: "Not Applicable.",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - General",
                  sub_key: "degree_of_onboard_processing",
                  name: "Degree of Onboard Processing ",
                  value: "",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - General",
                  sub_key: "multiple_access_scheme",
                  name: "Multiple Access Scheme",
                  value: "1",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - General",
                  sub_key: "num_beams",
                  name: "Number of Beams",
                  value: "11",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - General",
                  sub_key: "type_of_beams",
                  name: "Type of beams",
                  value: "Mix of fixed and global beams",
                  explanation: "9 fixed beams, one global beam ",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - General",
                  sub_key:
                    "sgl_range_km_common_parameter_for_return_and_forward_link",
                  name: "SGL Range (km)",
                  value: "",
                  explanation: "Common parameter for Return and Forward Link",
                  references: "",
                },
              ],
            },
            {
              section_key: "Relay Communications Topology - Return Link",
              section_name: "Relay Communications Topology - Return Link",
              section_value: [
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "max_return_data_rate_mbps",
                  name: "Max Return Data Rate (Mbps)",
                  value: "3",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "return_link_modulation",
                  name: "Return Link Modulation",
                  value: "2",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "return_link_coding",
                  name: "Return Link Coding",
                  value: "1",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "ssl_return_link_frequency_mhz",
                  name: "SSL Return Link Frequency (MHz)",
                  value: "14041",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "user_terminal_eirp_dbw",
                  name: "User Terminal EIRP (dBW)",
                  value: "48.14",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "ssl_relay_g_t_db_k",
                  name: "SSL Relay G/T (dB/K)",
                  value: "",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "ssl_return_link_bandwidth_db_hz",
                  name: "SSL Return Link Bandwidth (dB-Hz)",
                  value: "65.56",
                  explanation: "3600 KHz bandwidth",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "sgl_return_link_frequency_mhz",
                  name: "SGL Return Link Frequency (MHz)",
                  value: "12541",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "sgl_relay_eirp_dbw",
                  name: "SGL Relay EIRP (dBW)",
                  value: "45",
                  explanation:
                    "There are 14 TX beams with different EIRP value ranges between 45 dBW to 57.6 dBW.",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "gateway_g_t_db_k",
                  name: "Gateway G/T (dB/K)",
                  value: "10.6",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "sgl_return_link_bandwidth_db_hz",
                  name: "SGL Return Link Bandwidth (dB-Hz)",
                  value: "",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key:
                    "return_link_required_eb_no_db_relay_or_gateway_dependent_on_bent_pipe_or_regenerative",
                  name: "Return Link Required Eb/No (dB)",
                  value: "4.2",
                  explanation:
                    "Relay or Gateway - dependent on bent pipe or regenerative",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "return_link_implementation_loss",
                  name: "Return Link Implementation Loss (dB)",
                  value: "3",
                  explanation: "",
                  references: "",
                },
                {
                  key: "Relay Communications Topology - Return Link",
                  sub_key: "return_link_user_constraint_loss",
                  name: "Return Link User Constraint Loss (dB)",
                  value: "0",
                  explanation: "",
                  references: "",
                },
              ],
            },
            {
              section_key: "System Level Capabilities and Target Customers",
              section_name: "System Level Capabilities and Target Customers",
              section_value: [
                {
                  key: "System Level Capabilities and Target Customers",
                  sub_key: "system_name_model_number",
                  name: "System Name",
                  value: "Eutelsat",
                  explanation: "",
                  references: "",
                },
                {
                  key: "System Level Capabilities and Target Customers",
                  sub_key: "type_location_of_intended_users",
                  name: "Type / Location of Intended Users",
                  value:
                    "Global users spanning fixed and mobile - video broadcast, data, mobility, IoT.",
                  explanation: "",
                  references: "",
                },
                {
                  key: "System Level Capabilities and Target Customers",
                  sub_key: "mobile_fixed",
                  name: "Mobile / Fixed",
                  value: "Mobile / Fixed",
                  explanation: "",
                  references: "",
                },
                {
                  key: "System Level Capabilities and Target Customers",
                  sub_key: "geographic_distribution",
                  name: "Geographic Distribution",
                  value: "Regional",
                  explanation:
                    "Each satellite has regionalized coverage; combination of satellites provides near-global coverage focusing on landmass/population centers. ",
                  references: "",
                },
                {
                  key: "System Level Capabilities and Target Customers",
                  sub_key: "initial_operating_capability_year",
                  name: "Initial Operating Capability (Year)",
                  value: "1989",
                  explanation: "First 4 satellites were operational by 1989.",
                  references: "",
                },
                {
                  key: "System Level Capabilities and Target Customers",
                  sub_key: "data_rate_descriptive",
                  name: "Data Rate - Descriptive",
                  value:
                    "Varies by satellite and service; moderate rate assumed; 3Mbps",
                  explanation: "",
                  references: "",
                },
              ],
            },
          ],
        },
        admin: { admin: true },
        csvData: [],
      };
      res.status(200).send(result);
    });
    /**
     * @typedef {Object} DTESummary
     * @property {string} system
     * @property {string} location
     * @property {string} year
     * @property {string} numLocations
     * @property {string} freqBands
     */
    /**
     * Returns data for the DTE Dashboard view.
     * @returns {DTESummary[]}
     */
    this.router.get("/requestDTEDashboard", async (_req, res) => {
      const result = [
        {
          id: 23454,
          system: "DTE Network 1",
          location: "United States",
          year: 2020,
          numLocations: 2,
          freqBands: "S-band",
        },
        {
          id: 23455,
          system: "DTE Network 2",
          location: "United States",
          year: 2000,
          numLocations: 3,
          freqBands: "S-band",
        },
        {
          id: 23456,
          system: "DTE Network 3",
          location: "United States",
          year: 2005,
          numLocations: 1,
          freqBands: "S-band, X-band",
        },
      ];
      res.status(200).send(result);
    });
    /**
     * @typedef {Object} DTEDetail
     * @property {Object} master
     * @property {Object} detail
     * @property {{ admin: boolean }} admin
     * @property {Object} csvData
     */
    /**
     * Returns data for the DTE Detail view.
     * @param {string} id System identifier.
     * @param {string} email Email of the current user.
     * @returns {DTEDetail}
     */
    this.router.post("/requestDTEDetail", async (req, res) => {
      const { id, email } = req.body;
      const result = {
        master: [
          { key: "Network Overview", value: "Network Overview" },
          { key: "TestGS", value: "TestGS" },
          {
            key: "DTE Network 3",
            value: "DTE Network 3",
          },
        ],
        detail: {
          system_name: "DTE Network 3",
          system_value: [
            {
              section_key: "Network Overview",
              section_name: "Network Overview",
              section_value: [
                {
                  key: "Network Overview",
                  sub_key: "system_name_model_number",
                  name: "System Name",
                  value: "NEN",
                  explanation: "",
                  references: "",
                  antennaId: null,
                  frequencyBand: null,
                  modDemod: null,
                },
                {
                  key: "Network Overview",
                  sub_key: "operational_year",
                  name: "Operational (Year)",
                  value: "2006",
                  explanation: "Unknown, currently using SCaN founding date",
                  references: "",
                  antennaId: null,
                  frequencyBand: null,
                  modDemod: null,
                },
                {
                  key: "Network Overview",
                  sub_key: "network_model",
                  name: "Network Model",
                  value: "Dedicated / Shared",
                  explanation: "",
                  references: "",
                  antennaId: null,
                  frequencyBand: null,
                  modDemod: null,
                },
                {
                  key: "Network Overview",
                  sub_key: "number_of_locations",
                  name: "Number of Locations",
                  value: "1",
                  explanation: "1 station currently included*",
                  references: "",
                  antennaId: null,
                  frequencyBand: null,
                  modDemod: null,
                },
                {
                  key: "Network Overview",
                  sub_key: "tracking_services",
                  name: "Tracking Services",
                  value: "",
                  explanation: "",
                  references: "",
                  antennaId: null,
                  frequencyBand: null,
                  modDemod: null,
                },
              ],
            },
            {
              section_key: "Platform",
              section_name: "Platform",
              section_value: [
                {
                  key: "Platform",
                  sub_key: "station_name_model_number",
                  name: "Name",
                  value: "Platform",
                  explanation:"",
                  references: "",
                  antennaId: "Station Overview",
                  frequencyBand: null,
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:null,
                  rfFrontEnd_Id:null,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "location_regional",
                  name: "Location",
                  value: "North West",
                  explanation: "",
                  references: "",
                  antennaId: "Station Overview",
                  frequencyBand: null,
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:null,
                  rfFrontEnd_Id:null,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "number_antennas",
                  name: "Number of people",
                  value: "800M",
                  explanation:"",
                  references: "",
                  antennaId: "Station Overview",
                  frequencyBand: null,
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:null,
                  rfFrontEnd_Id:null,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_coordinate",
                  name: "Coordinates",
                  value: "37.9249° N, 75.4765° W",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "Antenna Overview",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:null,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "supported_frequency_general",
                  name: "President",
                  value: "Joe Biden",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "Antenna Overview",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:null,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_size",
                  name: "population Size",
                  value: "250M",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "Antenna Overview",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:null,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_frequency",
                  name: "Name",
                  value: "RF Front End 1",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "RF Front End 1",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:1,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_gt",
                  name: "Number of Cities",
                  value: "5",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "RF Front End 1",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:1,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_beamwidth",
                  name: "Top team",
                  value: "Lakers",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "RF Front End 1",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:1,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_subcarrier_frequency",
                  name: "Climate",
                  value: "Dry",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "RF Front End 1",
                  modDemod: "Mod/Demod",
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:1,
                  modDemod_Id:1
                },
                {
                  key: "Platform",
                  sub_key: "antenna_data_rate",
                  name: "Famous for",
                  value:"Hollywood",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "RF Front End 1",
                  modDemod: "Mod/Demod",
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:1,
                  modDemod_Id:1
                },
                {
                  key: "Platform",
                  sub_key: "antenna_frequency",
                  name: "Name",
                  value: "RF Front End 2",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "RF Front End 2",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:2,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_gt",
                  name: "Number of Cities",
                  value: "2",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "RF Front End 2",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:2,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_beamwidth",
                  name: "Top Team",
                  value: "Nuggets",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "RF Front End 2",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:2,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_subcarrier_frequency",
                  name: "Climate",
                  value: "Cold",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "RF Front End 2",
                  modDemod: 'Mod/Demod',
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:2,
                  modDemod_Id:2
                },
                {
                  key: "Platform",
                  sub_key: "antenna_data_rate",
                  name: "Famous for",
                  value:"Sking",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 1",
                  frequencyBand: "RF Front End 2",
                  modDemod: 'Mod/Demod',
                  platform_Id:1,
                  antenna_Id:1,
                  rfFrontEnd_Id:2,
                  modDemod_Id:2
                },
                {
                  key: "Platform",
                  sub_key: "antenna_coordinate",
                  name: "Coordinates",
                  value: "37.9239°N, 75.4761°W",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 2",
                  frequencyBand: "Antenna Overview",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:2,
                  rfFrontEnd_Id:null,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "supported_frequency_general",
                  name: "President",
                  value: "Justin Trudeau",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 2",
                  frequencyBand: "Antenna Overview",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:2,
                  rfFrontEnd_Id:null,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_size",
                  name: "popualtion size",
                  value: "110M",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 2",
                  frequencyBand: "Antenna Overview",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:2,
                  rfFrontEnd_Id:null,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_frequency",
                  name: "Name",
                  value: "RF Front End 3",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 2",
                  frequencyBand: "RF Front End 3",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:2,
                  rfFrontEnd_Id:3,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_gt",
                  name: "Number of Cities",
                  value: "3",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 2",
                  frequencyBand: "RF Front End 3",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:2,
                  rfFrontEnd_Id:3,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_beamwidth",
                  name: "Top team",
                  value: "Raptors",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 2",
                  frequencyBand: "RF Front End 3",
                  modDemod: null,
                  platform_Id:1,
                  antenna_Id:2,
                  rfFrontEnd_Id:3,
                  modDemod_Id:null
                },
                {
                  key: "Platform",
                  sub_key: "antenna_subcarrier_frequency",
                  name: "Climate",
                  value: "Cold",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 2",
                  frequencyBand: "RF Front End 3",
                  modDemod: "Mod/Demod",
                  platform_Id:1,
                  antenna_Id:2,
                  rfFrontEnd_Id:3,
                  modDemod_Id:3
                },
                {
                  key: "Platform",
                  sub_key: "antenna_data_rate",
                  name: "Famous for",
                  value:"CN Tower",
                  explanation: "",
                  references: "",
                  antennaId: "Antenna 2",
                  frequencyBand: "RF Front End 3",
                  modDemod: "Mod/Demod",
                  platform_Id:1,
                  antenna_Id:2,
                  rfFrontEnd_Id:3,
                  modDemod_Id:3
                },
              ],
            },
          ],
        },
        admin: { admin: true },
        csvData: [],
      };
      res.status(200).send(result);
    });
    this.router.post("/requestRelationship", async (req, res) => {
      const { id } = req.body;
      const result=[
        {
           id: 1,
           platform_1:"Platform",
           platform_1_id:1,
           antenna_1: "Antenna 1",
           antenna_1_id: 1,
           rfFrontEnd_1:null,
           rfFrontEnd_1_id:null,
           modDemod_1:null,
           modDemod_1_id:null,
           platform_2:"Platform",
           platform_2_id:1,
           antenna_2: "Antenna 1",
           antenna_2_id: 1,
           rfFrontEnd_2:"RF Front End 1",
           rfFrontEnd_2_id:1,
           modDemod_2:null,
           modDemod_2_id:null,
           isconnected: true,
           down:true, //if up then false    
         },
         {
           id: 2,
           platform_1:"Platform",
           platform_1_id:1,
           antenna_1: "Antenna 1",
           antenna_1_id: 1,
           rfFrontEnd_1:null,
           rfFrontEnd_1_id:null,
           modDemod_1:null,
           modDemod_1_id:null,
           platform_2:"Platform",
           platform_2_id:1,
           antenna_2: "Antenna 1",
           antenna_2_id: 1,
           rfFrontEnd_2:"RF Front End 2",
           rfFrontEnd_2_id:2,
           modDemod_2:null,
           modDemod_2_id:null,
           isconnected: true,
           down:true, //if up then false
          },
         {
           id: 3,
           platform_1:"Platform",
           platform_1_id:1,
           antenna_1: "Antenna 1",
           antenna_1_id: 1,
           rfFrontEnd_1:"RF Front End 1",
           rfFrontEnd_1_id:1,
           modDemod_1:null,
           modDemod_1_id:null,
           platform_2:"Platform",
           platform_2_id:1,
           antenna_2: "Antenna 2",
           antenna_2_id: 2,
           rfFrontEnd_2:"RF Front End 3",
           rfFrontEnd_2_id:3,
           modDemod_2:null,
           modDemod_2_id:null,
           isconnected: true,
           down:true, //if up then false
          },
          {
           id: 4,
           platform_1:"Platform",
           platform_1_id:1,
           antenna_1: "Antenna 1",
           antenna_1_id: 1,
           rfFrontEnd_1:"RF Front End 2",
           rfFrontEnd_1_id: 2,
           modDemod_1:null,
           modDemod_1_id:null,
           platform_2:"Platform",
           platform_2_id: 1,
           antenna_2: "Antenna 2",
           antenna_2_id: 2,
           rfFrontEnd_2:"RF Front End 3",
           rfFrontEnd_2_id: 3,
           modDemod_2:null,
           modDemod_2_id:null,
           isconnected: true,
           down:true, //if up then false
          },
          {
           id: 5,
           platform_1:"Platform",
           platform_1_id:1,
           antenna_1: "Antenna 2",
           antenna_1_id: 2,
           rfFrontEnd_1:"RF Front End 3",
           rfFrontEnd_1_id: 3,
           modDemod_1:null,
           modDemod_1_id:null,
           platform_2:"Platform",
           platform_2_id:1,
           antenna_2: "Antenna 2",
           antenna_2_id: 2,
           rfFrontEnd_2:null,
           rfFrontEnd_2_id:null,
           modDemod_2:null,
           modDemod_2_id:null,
           isconnected: true,
           down:false, //if up then false
          },
          {
            id: 6,
            platform_1:"Platform",
            platform_1_id:1,
            antenna_1: "Antenna 1",
            antenna_1_id: 1,
            rfFrontEnd_1:"RF Front End 1",
            rfFrontEnd_1_id: 1,
            modDemod_1:null,
            modDemod_1_id:null,
            platform_2:"Platform",
            platform_2_id:1,
            antenna_2: "Antenna 1",
            antenna_2_id: 1,
            rfFrontEnd_2: "RF Front End 1",
            rfFrontEnd_2_id:1,
            modDemod_2: "Mod/Demod 1",
            modDemod_2_id: 1,
            isconnected: true,
            down:true, //if up then false
           },
           {
            id: 7,
            platform_1:"Platform",
            platform_1_id:1,
            antenna_1: "Antenna 1",
            antenna_1_id: 1,
            rfFrontEnd_1:"RF Front End 2",
            rfFrontEnd_1_id: 2,
            modDemod_1:null,
            modDemod_1_id:null,
            platform_2:"Platform",
            platform_2_id:1,
            antenna_2: "Antenna 1",
            antenna_2_id: 1,
            rfFrontEnd_2: "RF Front End 2",
            rfFrontEnd_2_id:2,
            modDemod_2: "Mod/Demod 2",
            modDemod_2_id: 2,
            isconnected: true,
            down:true, //if up then false
           },
           {
            id: 8,
            platform_1:"Platform",
            platform_1_id:1,
            antenna_1: "Antenna 2",
            antenna_1_id: 2,
            rfFrontEnd_1:"RF Front End 3",
            rfFrontEnd_1_id: 3,
            modDemod_1: "Mod/Demod 3",
            modDemod_1_id: 3,
            platform_2:"Platform",
            platform_2_id:1,
            antenna_2: "Antenna 2",
            antenna_2_id: 2,
            rfFrontEnd_2: "RF Front End 3",
            rfFrontEnd_2_id:3,
            modDemod_2: null,
            modDemod_2_id: null,
            isconnected: true,
            down:false, //if up then false
           }
     ];
      res.status(200).send(result);
    });
    /**
     * @typedef {Object} UpdatedAttribute
     * @property {number|string} id
     * @property {number|string} system_id
     * @property {number|string} group_id
     * @property {string} name
     * @property {string} value
     * @property {string} notes
     * @property {string} refs
     */
    /**
     * Updates System Attribute data.
     * @param {UpdatedAttribute} params Describes the updated System Attribute.
     * @returns {string}
     */
    this.router.post("/updateSystemAttribute", async (req, res) => {
      const params = req.body;
      const result = {};
      res.status(200).send(result);
    });
    /**
     * @typedef {Object} MissionParams
     * @property {number} altitude
     * @property {number} inclination
     * @property {number} latitude
     * @property {number} longitude
     * @property {number} availabilityThreshold
     * @property {number} dataVolumeNeed
     * @property {number} gapThreshold
     * @property {number} navAccuracyNeed
     * @property {number} launchYear
     * @property {number} powerAmplifier
     */
    /**
     * @typedef {Object} RankingWeights
     * @property {{ label: string, value: string }} availability
     * @property {{ label: string, value: string }} data_volume
     * @property {{ label: string, value: string }} average_gap
     * @property {{ label: string, value: string }} pointing_feasibility
     * @property {{ label: string, value: string }} systemIOCTime
     * @property {{ label: string, value: string }} freqViability
     */
    /**
     * @typedef {Object} ComparisonResults
     * @property {Array} rows Rows of the comparison table.
     * @property {Array} columns Column headers of the comparison table.
     * @property {Object} tooltips Tooltips for each parameter.
     * @property {string} resultId Id of the current result set.
     * @property {Object} keyList Convert between parameter names and keys.
     * @property {string[]} csvData Formatted data for export.
     * @property {string} fileName Name of the export file.
     */
    /**
     * Returns System Comparison data.
     * @param {project} pass the project object. This call will filter through saves and return items marked for comparison
     * @returns {ComparisonResults}
     */
    this.router.post("/requestComparison", async (req, res) => {
      const { project } = req.body;
      const result = {
        dataIDs: [
          { networkId: 9, system_attribute_version_id: 1 },
          { networkId: 3, system_attribute_version_id: 3 },
          { networkId: 12, system_attribute_version_id: 1 },
          { networkId: 6, system_attribute_version_id: 2 },
          { networkId: 7, system_attribute_version_id: 2 },
          { networkId: 1, system_attribute_version_id: 3 },
          { networkId: 10, system_attribute_version_id: 1 },
          { networkId: 4, system_attribute_version_id: 2 },
          { networkId: 19, system_attribute_version_id: 1 },
          { networkId: 5, system_attribute_version_id: 4 },
          { networkId: 2, system_attribute_version_id: 4 },
          { networkId: 11, system_attribute_version_id: 1 },
          { networkId: 8, system_attribute_version_id: 1 },
        ],
        rows: [
          {
            group: "Ranking",
            rows: [
              [
                "Relative Overall Performance",
                "1st",
                "2nd",
                "3rd",
                "4th",
                "5th",
                "6th",
                "7th",
                "8th",
                "9th",
                "10th",
                "11th",
                "12th",
                "13th",
              ],
              [
                "Relative Ranking Score",
                "315.11",
                "311.26",
                "311.02",
                "310.61",
                "310.48",
                "310.34",
                "306.99",
                "276.39",
                "246.73",
                "159.59",
                "49.85",
                "46.02",
                "11.44",
              ],
              [
                "Mission Requirements Not Met",
                1,
                1,
                1,
                1,
                1,
                0,
                2,
                1,
                1,
                1,
                0,
                1,
                2,
              ],
            ],
          },
          {
            group: "Constellation Overview",
            rows: [
              [
                "Altitude (km)",
                "8500 cart_result_success",
                "8062 cart_result_success",
                "8062 cart_result_success",
                "35786 cart_result_success",
                "35786 cart_result_success",
                "35786 cart_result_success",
                "35786 cart_result_success",
                "35786 cart_result_success",
                "35786 cart_result_success",
                "1414 cart_result_success",
                "780 cart_result_success",
                "35786 cart_result_success",
                "1110 cart_result_success",
              ],
              [
                "Fwd Link Frequency Band (MHz)",
                "50,400 - 51,400",
                "28,600 - 29,100",
                "28,600 - 29,100",
                "22,550 - 23,540",
                "27,500 - 30,000",
                "2,025.8 - 2,117.9",
                "19,700 - 20,200",
                "6,425 - 6,575",
                "14,000-14,250",
                "5,091 - 5,250",
                "1,616 - 1,626.5",
                "13,750 - 14,500",
                "10,700 - 12,700",
              ],
              [
                "Rtn Link Frequency Band (MHz)",
                "50,400 - 51,400",
                "18,800 - 19,300",
                "17,700 - 18,600",
                "25,250 - 27,500",
                "17,700 - 20,200",
                "2,200 - 2,300",
                "29,500 - 30,000",
                "1,626.5 - 1,660.5",
                "12,500 - 12,750",
                "2,483.5 - 2,500",
                "1,616 - 1,626.5",
                "13,750 - 14,500",
                "14,000 - 14,500",
              ],
              [
                "Spectrum Regulatory Status - Fwd Link Frequency",
                "No Current Regulatory Status",
                "Pending Regulatory Action",
                "Pending Regulatory Action",
                "Approved",
                "Pending Regulatory Action",
                "Approved",
                "Pending Regulatory Action",
                "No Current Regulatory Status",
                "No Current Regulatory Status",
                "No Current Regulatory Status",
                "No Current Regulatory Status",
                "No Current Regulatory Status",
                "Pending Regulatory Action",
              ],
              [
                "Spectrum Regulatory Status - Rtn Link Frequency",
                "No Current Regulatory Status",
                "Pending Regulatory Action",
                "Pending Regulatory Action",
                "Approved",
                "Pending Regulatory Action",
                "Approved",
                "Pending Regulatory Action",
                "No Current Regulatory Status",
                "Pending Regulatory Action",
                "No Current Regulatory Status",
                "No Current Regulatory Status",
                "No Current Regulatory Status",
                "No Current Regulatory Status",
              ],
              [
                "Operational (Year)",
                "2022 cart_result_success",
                "2014 cart_result_success",
                "2022 cart_result_success",
                "2001 cart_result_success",
                "2014 cart_result_success",
                "1989 cart_result_success",
                "2023 cart_result_success",
                "2006 cart_result_success",
                "1990 cart_result_success",
                "2014 cart_result_success",
                "2020 cart_result_success",
                "2020 cart_result_success",
                "2022 cart_result_success",
              ],
            ],
          },
          {
            group: "Performance",
            rows: [
              [
                "RF Coverage (%)",
                100,
                100,
                100,
                99.6,
                99.9,
                99.7,
                99,
                100,
                89.3,
                73.4,
                46.6,
                39.7,
                97.4,
              ],
              [
                "Mean Number of RF Contacts Per Orbit",
                0.5,
                0,
                1.1,
                0.2,
                0.2,
                0.3,
                4.6,
                0,
                4.9,
                37.9,
                32.4,
                22.1,
                0,
              ],
              [
                "Mean RF Contact Duration (seconds)",
                72654,
                64921,
                55630,
                65132,
                65098,
                86282,
                17982,
                42164,
                3238,
                300,
                206,
                300,
                72369,
              ],
              [
                "Average RF Coverage Gap (minutes)",
                "0.27 cart_result_success",
                "0 cart_result_success",
                "0 cart_result_success",
                "0 cart_result_success",
                "0 cart_result_success",
                "0 cart_result_success",
                "7.41 cart_result_fail",
                "0 cart_result_success",
                "3.47 cart_result_success",
                "0 cart_result_success",
                "3.15 cart_result_success",
                "0 cart_result_success",
                "0 cart_result_success",
              ],
              [
                "Max RF Coverage Gap (minutes)",
                0.14,
                0,
                0,
                5.6,
                0,
                0.36,
                0,
                0,
                0.05,
                9.87,
                14.11,
                20.56,
                0,
              ],
              [
                "Mean Response Time (seconds)",
                0.47,
                0,
                0,
                87.05,
                0,
                7.19,
                0,
                0,
                0,
                11.18,
                93.83,
                0,
                0,
              ],
              [
                "Effective Comms Time (%)",
                "10122 cart_result_success",
                "10000 cart_result_success",
                "10000 cart_result_success",
                "9912.6 cart_result_success",
                "9973.8 cart_result_success",
                "9938.3 cart_result_success",
                "10001.3 cart_result_success",
                "8864.2 cart_result_success",
                "7965.6 cart_result_success",
                "4982.2 cart_result_success",
                "1340.5 cart_result_success",
                "1335.9 cart_result_success",
                "0 cart_result_fail",
              ],
              [
                "Throughput (Gb/Day)",
                "2160 cart_result_success",
                "8640 cart_result_success",
                "8640 cart_result_success",
                "12903.24 cart_result_success",
                "431.44 cart_result_success",
                "516.8 cart_result_success",
                "8546.18 cart_result_success",
                "42.51 cart_result_success",
                "231.34 cart_result_success",
                "16.23 cart_result_success",
                "20.61 cart_result_success",
                "2742.4 cart_result_success",
                "84075.5 cart_result_success",
              ],
            ],
          },
          {
            group: "User Burden: Antenna Options",
            rows: [
              [
                "EIRP (dBW)",
                59.12,
                55.42,
                53.15,
                48.25,
                39.18,
                28.57,
                41.7,
                11.84,
                48.78,
                2.82,
                -0.31,
                54.08,
                33.77,
              ],
              [
                "Parabolic Antenna Diameter (m)",
                2.217,
                2.5,
                1.868,
                1.159,
                0.374,
                1.444,
                0.5,
                "Not an appropriate solution",
                2.411,
                "Not an appropriate solution",
                "Not an appropriate solution",
                4.414,
                0.415,
              ],
              [
                "Parabolic Antenna Mass (kg)",
                10.993,
                12.879,
                8.659,
                3.931,
                "Mass calculation model not available",
                5.836,
                "Mass calculation model not available",
                "Mass calculation model not available",
                12.286,
                "Mass calculation model not available",
                "Mass calculation model not available",
                25.651,
                "Mass calculation model not available",
              ],
              [
                "Electronically Steerable Antenna Size (m²)",
                0.046,
                0.089,
                0.064,
                0.044,
                0.013,
                0.65,
                0.018,
                0.18,
                0.177,
                0.069,
                0.052,
                0.321,
                0.03,
              ],
              [
                "Helical Antenna Height (m)",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                0.23,
                "Not a good solution",
                0.03,
                0.015,
                "Not a good solution",
                "Not a good solution",
              ],
              [
                "Patch Antenna Size (m²)",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                0.004,
                0.004,
                "Not a good solution",
                "Not a good solution",
              ],
              [
                "Dipole Antenna Size (m)",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                "Not a good solution",
                0.231,
                0.093,
                "Not a good solution",
                "Not a good solution",
              ],
            ],
          },
          {
            group: "User Burden: Mission Impacts",
            rows: [
              [
                "Tracking Rate (deg/s)",
                0.101,
                0.076,
                0.055,
                0.056,
                0.096,
                0.061,
                0.075,
                0.086,
                0.072,
                0.381,
                0.992,
                0.083,
                0,
              ],
              [
                "Slew Rate (deg/s)",
                48,
                57.9,
                85.7,
                128.1,
                160.3,
                131.6,
                159.6,
                174.3,
                160.5,
                179.5,
                0,
                59.5,
                78,
              ],
              [
                "Body Pointing Feasibility",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                false,
                true,
                true,
              ],
              [
                "Mechanical Pointing Feasibility",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
              ],
              [
                "Pointing-Adjusted RF Coverage (%)",
                101,
                104,
                105,
                100,
                100,
                100,
                99,
                103,
                90,
                72,
                45,
                40,
                98,
              ],
            ],
          },
          {
            group: "Nav and Tracking",
            rows: [
              [
                "Tracking Service, 3-sigma Range Error (m)",
                "N/A cart_result_fail",
                "N/A cart_result_fail",
                "N/A cart_result_fail",
                "N/A cart_result_fail",
                "N/A cart_result_fail",
                "8.2 cart_result_success",
                "N/A cart_result_fail",
                "N/A cart_result_fail",
                "N/A cart_result_fail",
                "N/A cart_result_fail",
                "20 cart_result_success",
                "N/A cart_result_fail",
                "N/A cart_result_fail",
              ],
              [
                "GNSS Availability",
                "Yes",
                "Yes",
                "Yes",
                "Yes",
                "Yes",
                "GNSS not required.",
                "Yes",
                "Yes",
                "Yes",
                "Yes",
                "GNSS not required.",
                "Yes",
                "Yes",
              ],
            ],
          },
        ],
        columns: [
          "Parameters",
          "OneWeb MEO",
          "O3B Legacy",
          "O3b 7MPower",
          "TDRS KaSA",
          "Inmarsat5",
          "TDRS SSA",
          "Viasat3",
          "Inmarsat4",
          "Eutelsat",
          "Globalstar",
          "IridiumNext",
          "IntelsatEpicNG",
          "SpaceX 1110",
        ],
        columnMapping: [
            "",
            "s537j3i1-s9a2-6354-3s8d-95sdf7sd9513",
            "s537j3i1-s9a2-6354-3s8d-95sdf7sd9521",
            "e973f0f7-d7a6-4641-9d8d-43bcf2da5332",
            "s537j3i1-s9a2-6354-3s8d-95sdf7sd9523",
            "s537j3i1-s9a2-6354-3s8d-95sdf7sd9513",
            "s537j3i1-s9a2-6354-3s8d-95sdf7sd9521",
            "e973f0f7-d7a6-4641-9d8d-43bcf2da5332",
            "s537j3i1-s9a2-6354-3s8d-95sdf7sd9523",
            "s537j3i1-s9a2-6354-3s8d-95sdf7sd9513",
            "s537j3i1-s9a2-6354-3s8d-95sdf7sd9521",
            "e973f0f7-d7a6-4641-9d8d-43bcf2da5332",
            "s537j3i1-s9a2-6354-3s8d-95sdf7sd9523",
            "s537j3i1-s9a2-6354-3s8d-95sdf7sd9513",         
        ],
        tooltips: {
          overallRanking:
            "Relative ranking considers if the system meets return link performance requirements (availability, throughput, gaps), readiness by mission launch date, and viability of frequency selection. Systems meeting more criteria are ranked higher.",
          rankingScore:
            "Ranking Score shows the system's value calculated by the ranking algorithm when normalizing each system's performance according to the greatest value in each metric, with higher scores generally indicated greater overall performance. The literal value is irrelevant, but is included as a means to more accurately gauge each system's performance relative to another's.",
          numFailedRequirements:
            "This field indicates the number of user-specified requirements that each system fails to meet, which are expanded upon in the detailed sections below. It should be noted that failure to meet mission requirements does not mean the network is completely incapable of supporting the mission, but that performance expectations will likely need to be lowered if the associated network is intended for use.",
          altitudeCheck:
            'Description: Altitude of the relay constellation in km.<br/><br/>Analysis notes: This value is compared against the user altitude. Most commercial systems are designed for terrestrial/mobile users and our analysis assumes that space users have to adapt to that service structure, and therefore would not be supported if operating at an altitude above the constellation (result indicates a red "X").',
          forwardLinkFrequency:
            'Description: The forward link frequency of the service in MHz.<br/><br/>Analysis notes: NASA has successfully pursued a future World Radiocommunication Conference (WRC) agenda item for the 2023 WRC to gain regulatory recognition for space-to-space user links within certain frequency bands currently allocated to the Fixed Satellite Service and Mobile Satellite Service.  The green check indicates the system operates in a band that is included in the WRC-23 process, and the red "X" indicates that it is not-- resulting in user operations that would be conducted on an experimental, non-protected basis.',
          returnLinkFrequency:
            'Description: The return link frequency of the service in MHz.<br/><br/>Analysis notes: NASA has successfully pursued a future World Radiocommunication Conference (WRC) agenda item for the 2023 WRC to gain regulatory recognition for space-to-space user links within certain frequency bands currently allocated to the Fixed Satellite Service and Mobile Satellite Service.  The green check indicates the system operates in a band that is included in the WRC-23 process, and the red "X" indicates that it is not-- resulting in user operations that would be conducted on an experimental, non-protected basis.',
          systemIOCTime: `Description: Date that anticipated services would be ready for NASA users.<br/><br/>Analysis notes: The "Ready by" Year is based on publicly available information about the initial operating capabilty of the system plus an assumption that a one year period would be required to certify and "onboard" the provider before it was ready for NASA users to use the service. The result is compared to the user's anticipated launch date.`,
          forwardLinkFrequencyBand:
            "Description: The forward link frequency band of the service.<br/><br/>Analyses notes: Source - FCC frequency filings or comparable references.",
          returnLinkFrequencyBand:
            "Description: The return link frequency band of the service.<br/><br/>Analyses notes: Source - FCC frequency filings or comparable references.",
          forwardLinkRegulatoryStatus:
            "Description: Regulatory status indicators include three cases.<br/><br/>• Approved - if space to space use of the network's frequencies is already approved.<br/>• Pending Regulatory Action - indicates that the systems frequencies (or portions thereof) are within the bands being considered at the World Radiocommunications Conference in 2023 to allow for space-to-space use in the future.<br/>• No Current Regulatory Status - not currently approved, no active regulation changs in work, but may not prohibit or exclude future regulatory changes.",
          returnLinkRegulatoryStatus:
            "Description: Regulatory status indicators include three cases.<br/><br/>• Approved - if space to space use of the network's frequencies is already approved.<br/>• Pending Regulatory Action - indicates that the systems frequencies (or portions thereof) are within the bands being considered at the World Radiocommunications Conference in 2023 to allow for space-to-space use in the future.<br/>• No Current Regulatory Status - not currently approved, no active regulation changs in work, but may not prohibit or exclude future regulatory changes.",
          coverage:
            "Description: RF Coverage is captured as a percentage, representing the duration that the user satellite has enough signal power to close the communications link with the commercial communications system, over a defined period.<br/><br/>Analysis notes: RF coverage is based on physical link modeling and the attributes of the commercial system as defined by available Federal Communications Commission filings.",
          mean_contacts:
            "Description: Mean Number of Contacts Per Orbit is representative of how many network contacts a user would experience per orbit based on user orbit relative to the commercial system’s configuration.<br/><br/>Analysis notes: This value is derived from the physical link modeling and resultant RF coverage contact statistics.",
          mean_coverage_duration:
            "Description: The average duration of an individual RF coverage contact event, measured in seconds.<br/><br/>Analysis notes: The average duration of an RF coverage contact is determined by the physical link model which is based on the evaluation of the user satellite having enough signal power to close the communications link with the commercial system.",
          average_gap:
            "Description: The average gap in RF coverage the user will experience, measured in minutes.<br/><br/>Analysis notes: The average gap in RF coverage as determined by the physical link model which is based on evaluation of the user satellite having enough signal power to close the communications link with the commercial system.",
          max_gap:
            "Description: The maximum gap in RF coverage the user will experience, measured in minutes.<br/><br/>Analysis notes: The maximum gap in RF coverage as determined by the physical link model which is based on the evaluation of the user satellite having enough signal power to close the communications link with the commercial system.",
          mean_response_time:
            "Description: Mean response time measures, on average, how long a user might have to wait for the next RF coverage connection, based on the distribution of gap durations in the observed scenario.<br/><br/>Analysis notes: Mean response time is calculated using the results of the physical link modeling and RF coverage intervals and gaps.",
          availability:
            "Description: Percent of time that the user can communicate with the network.<br/><br/>Analysis notes: Effective communication time is the result of multiple factors including RF coverage (time with sufficient power), signal acquisition time, and network registration and other network processing effects. The resultant percentage is compared to the user input need for network availability.",
          data_volume:
            "Description: Potential data volume transmitted in Gb/day.<br/><br/>Analysis notes: Throughput is derived from the effective communication time and system data rates.",
          eirp: "Description: The user Effective Isotropic Radiated Power (EIRP) in dBW.<br/><br/>Analysis note: The user EIRP is calculated based on the relay service Prec and the user orbital characteristics.",
          parabolicDiameter:
            "Description: The user parabolic antenna diameter calculated in meters.<br/><br/>Analysis notes: The parabolic antenna size is calculated based on the required gain to meet the EIRP for any specific mission. A 60% efficiency is assumed for the antenna.",
          parabolicMass:
            "Description: The user parabolic antenna mass calculated in kilograms.<br/><br/>Analysis notes: The parabolic antenna mass is calculated based on a common/industry mass-estimating relationship driven by antenna diameter.",
          steerableSize:
            "Description: The electronically steerable antenna size calculated in square meters.<br/><br/>Analysis notes: It is assumed the antenna is rectangular and the number of antenna elements are on the order of n^2. The number of elements are calculated based on the antenna required gain, assuming a conventional patch antenna with the size of lambda/2 represents the elements, and the distance between the elements are considered to be lambda/2.",
          helicalHeight:
            "Description: The Helical antenna  height in meter.<br/><br/>Analysis notes: The Helix antenna height is calculated based on the gain formula for a conventional helix antenna.",
          patchSize:
            "Description: The patch antenna size in square meters (m²).<br/><br/>Analysis notes: An FR4 substrate with a dielectric constant of 4.4 is considered for the antenna. It is assumed the length and width of the patch are equal.",
          dipoleSize:
            "Description: The length of the dipole antenna in meters (m).<br/><br/>Analysis notes: The length of the dipole antenna was considered based on two options (i.e. L=0.5 of lambda, and L=1.25 of lambda).",
          tracking_rate:
            "Description: Angular adjustment rate required for a user antenna to maintain RF coverage with the current servicing relay satellite.",
          slew_rate:
            "Description: Angular adjustment rate required for the user antenna to reorient in preparation for the next satellite. Can be considered the necessary angular speed to change between relay satellites without losing service.<br/><br/>Analysis notes: Slew rates are based on STK reported coverage angles which can often result in a requirement for large instantaneous angular adjustments in order to reorient the user antenna towards the next servicing relay satellite, resulting in inflated and sometimes unrealistic results.",
          bodyPointingThreshold:
            "Description: Based on the pointing rate, the feasibility of the spacecraft accommodating those rates through body pointing.<br/><br/>Analysis notes: The pointing reference rate is compared to industry rule of thumb values: If < 0.5 deg/sec: Impact to spacecraft is minimal; reaction wheels may be enough for small vehicles. If > 0.5 deg/sec: Structural impact on appendages, weight and cost increases; gyros and/or thrusters are required.",
          mechanicalPointingThreshold:
            "Description: Based on the pointing rate, the feasibility of the spacecraft accommodating those rates through the use of a mechanism (gimbal etc.).<br/><br/>Analysis notes: The pointing reference rate is compared to a small sample set of COTS antenna pointing mechanisms which range in tracking rates from 0.02 deg/sec to 3.75 deg /sec.",
          reduced_coverage:
            "Description: The percent RF coverage available if the user cannot exceed the pointing rate reference threshold. The approach for this metric is under further development and will be revised.<br/><br/>Analysis notes: The processed results of the physical link simulations include a pointing-rate-adjusted value for RF coverage by removing contact times in which the pointing rate exceeds the reference value which is the pointing rate average plus two standard deviations. Example- RF Coverage result of 90% and Pointing-Adjusted-RF Coverage result of 80% means there is a 10% loss in coverage due to tracking and slew rates that exceed the threshold. The approach for this metric is under further development and will be revised.",
          trackingCapability:
            "Description: Denotes the available service provided by the commercial system.<br/><br/>Analysis notes: The majority do not provide tracking or position services and will return a negative result (N/A).",
          gnssUsage:
            "Description: If the commercial system cannot meet the accuracy need, the user may need to rely on GNSS solutions, although this is not the only option.<br/><br/>Analysis notes: The evaluation process indicates the applicability/usability of GNSS solutions based on altitude and information about the current GNSS space service volume.",
        },
        resultId: "3003030300.9990.162020301",
        keyList: {
          "Altitude (km)": "altitudeCheck",
          "Fwd Link Frequency Band (MHz)": "forwardLinkFrequencyBand",
          "Rtn Link Frequency Band (MHz)": "returnLinkFrequencyBand",
          "Spectrum Regulatory Status - Fwd Link Frequency":
            "forwardLinkRegulatoryStatus",
          "Spectrum Regulatory Status - Rtn Link Frequency":
            "returnLinkRegulatoryStatus",
          "Operational (Year)": "systemIOCTime",
          "RF Coverage (%)": "coverage",
          "Mean Number of RF Contacts Per Orbit": "mean_contacts",
          "Mean RF Contact Duration (seconds)": "mean_coverage_duration",
          "Average RF Coverage Gap (minutes)": "average_gap",
          "Max RF Coverage Gap (minutes)": "max_gap",
          "Mean Response Time (seconds)": "mean_response_time",
          "Effective Comms Time (%)": "availability",
          "Throughput (Gb/Day)": "data_volume",
          "EIRP (dBW)": "eirp",
          "Parabolic Antenna Diameter (m)": "parabolicDiameter",
          "Parabolic Antenna Mass (kg)": "parabolicMass",
          "Electronically Steerable Antenna Size (m²)": "steerableSize",
          "Helical Antenna Height (m)": "helicalHeight",
          "Patch Antenna Size (m²)": "patchSize",
          "Dipole Antenna Size (m)": "dipoleSize",
          "Tracking Rate (deg/s)": "tracking_rate",
          "Slew Rate (deg/s)": "slew_rate",
          "Body Pointing Feasibility": "bodyPointingThreshold",
          "Mechanical Pointing Feasibility": "mechanicalPointingThreshold",
          "Pointing-Adjusted RF Coverage (%)": "reduced_coverage",
          "Tracking Service, 3-sigma Range Error (m)": "trackingCapability",
          "GNSS Availability": "gnssUsage",
          "Relative Overall Performance": "overallRanking",
          "Relative Ranking Score": "rankingScore",
          "Mission Requirements Not Met": "numFailedRequirements",
        },
        csvData: [
          ["Mission Parameters"],
          ["Altitude (km)", 300],
          ["Inclination (deg)", 30],
          [""],
          ["Results"],
          [
            "Group",
            "Parameters",
            "OneWeb MEO",
            "O3B Legacy",
            "O3b 7MPower",
            "TDRS KaSA",
            "Inmarsat5",
            "TDRS SSA",
            "Viasat3",
            "Inmarsat4",
            "Eutelsat",
            "Globalstar",
            "IridiumNext",
            "IntelsatEpicNG",
            "SpaceX 1110",
          ],
          [
            "Ranking",
            "Relative Overall Performance",
            "1st",
            "2nd",
            "3rd",
            "4th",
            "5th",
            "6th",
            "7th",
            "8th",
            "9th",
            "10th",
            "11th",
            "12th",
            "13th",
          ],
          [
            "Ranking",
            "Relative Ranking Score",
            "315.11",
            "311.26",
            "311.02",
            "310.61",
            "310.48",
            "310.34",
            "306.99",
            "276.39",
            "246.73",
            "159.59",
            "49.85",
            "46.02",
            "11.44",
          ],
          [
            "Ranking",
            "Mission Requirements Not Met",
            "1",
            "1",
            "1",
            "1",
            "1",
            "0",
            "2",
            "1",
            "1",
            "1",
            "0",
            "1",
            "2",
          ],
          [
            "Constellation Overview",
            "Altitude (km)",
            "8500",
            "8062",
            "8062",
            "35786",
            "35786",
            "35786",
            "35786",
            "35786",
            "35786",
            "1414",
            "780",
            "35786",
            "1110",
          ],
          [
            "Constellation Overview",
            "Fwd Link Frequency Band (MHz)",
            "50,400 - 51,400",
            "28,600 - 29,100",
            "28,600 - 29,100",
            "22,550 - 23,540",
            "27,500 - 30,000",
            "2,025.8 - 2,117.9",
            "19,700 - 20,200",
            "6,425 - 6,575",
            "14,000-14,250",
            "5,091 - 5,250",
            "1,616 - 1,626.5",
            "13,750 - 14,500",
            "10,700 - 12,700",
          ],
          [
            "Constellation Overview",
            "Rtn Link Frequency Band (MHz)",
            "50,400 - 51,400",
            "18,800 - 19,300",
            "17,700 - 18,600",
            "25,250 - 27,500",
            "17,700 - 20,200",
            "2,200 - 2,300",
            "29,500 - 30,000",
            "1,626.5 - 1,660.5",
            "12,500 - 12,750",
            "2,483.5 - 2,500",
            "1,616 - 1,626.5",
            "13,750 - 14,500",
            "14,000 - 14,500",
          ],
          [
            "Constellation Overview",
            "Spectrum Regulatory Status - Fwd Link Frequency",
            "No Current Regulatory Status",
            "Pending Regulatory Action",
            "Pending Regulatory Action",
            "Approved",
            "Pending Regulatory Action",
            "Approved",
            "Pending Regulatory Action",
            "No Current Regulatory Status",
            "No Current Regulatory Status",
            "No Current Regulatory Status",
            "No Current Regulatory Status",
            "No Current Regulatory Status",
            "Pending Regulatory Action",
          ],
          [
            "Constellation Overview",
            "Spectrum Regulatory Status - Rtn Link Frequency",
            "No Current Regulatory Status",
            "Pending Regulatory Action",
            "Pending Regulatory Action",
            "Approved",
            "Pending Regulatory Action",
            "Approved",
            "Pending Regulatory Action",
            "No Current Regulatory Status",
            "Pending Regulatory Action",
            "No Current Regulatory Status",
            "No Current Regulatory Status",
            "No Current Regulatory Status",
            "No Current Regulatory Status",
          ],
          [
            "Constellation Overview",
            "Operational (Year)",
            "2022",
            "2014",
            "2022",
            "2001",
            "2014",
            "1989",
            "2023",
            "2006",
            "1990",
            "2014",
            "2020",
            "2020",
            "2022",
          ],
          [
            "Performance",
            "RF Coverage (%)",
            "100",
            "100",
            "100",
            "99.6",
            "99.9",
            "99.7",
            "99",
            "100",
            "89.3",
            "73.4",
            "46.6",
            "39.7",
            "97.4",
          ],
          [
            "Performance",
            "Mean Number of RF Contacts Per Orbit",
            "0.5",
            "0",
            "1.1",
            "0.2",
            "0.2",
            "0.3",
            "4.6",
            "0",
            "4.9",
            "37.9",
            "32.4",
            "22.1",
            "0",
          ],
          [
            "Performance",
            "Mean RF Contact Duration (seconds)",
            "72654",
            "64921",
            "55630",
            "65132",
            "65098",
            "86282",
            "17982",
            "42164",
            "3238",
            "300",
            "206",
            "300",
            "72369",
          ],
          [
            "Performance",
            "Average RF Coverage Gap (minutes)",
            "0.27",
            "0",
            "0",
            "0",
            "0",
            "0",
            "7.41",
            "0",
            "3.47",
            "0",
            "3.15",
            "0",
            "0",
          ],
          [
            "Performance",
            "Max RF Coverage Gap (minutes)",
            "0.14",
            "0",
            "0",
            "5.6",
            "0",
            "0.36",
            "0",
            "0",
            "0.05",
            "9.87",
            "14.11",
            "20.56",
            "0",
          ],
          [
            "Performance",
            "Mean Response Time (seconds)",
            "0.47",
            "0",
            "0",
            "87.05",
            "0",
            "7.19",
            "0",
            "0",
            "0",
            "11.18",
            "93.83",
            "0",
            "0",
          ],
          [
            "Performance",
            "Effective Comms Time (%)",
            "10122",
            "10000",
            "10000",
            "9912.6",
            "9973.8",
            "9938.3",
            "10001.3",
            "8864.2",
            "7965.6",
            "4982.2",
            "1340.5",
            "1335.9",
            "0",
          ],
          [
            "Performance",
            "Throughput (Gb/Day)",
            "2160",
            "8640",
            "8640",
            "12903.24",
            "431.44",
            "516.8",
            "8546.18",
            "42.51",
            "231.34",
            "16.23",
            "20.61",
            "2742.4",
            "84075.5",
          ],
          [
            "User Burden: Antenna Options",
            "EIRP (dBW)",
            "59.12",
            "55.42",
            "53.15",
            "48.25",
            "39.18",
            "28.57",
            "41.7",
            "11.84",
            "48.78",
            "2.82",
            "-0.31",
            "54.08",
            "33.77",
          ],
          [
            "User Burden: Antenna Options",
            "Parabolic Antenna Diameter (m)",
            "2.217",
            "2.5",
            "1.868",
            "1.159",
            "0.374",
            "1.444",
            "0.5",
            "Not an appropriate solution",
            "2.411",
            "Not an appropriate solution",
            "Not an appropriate solution",
            "4.414",
            "0.415",
          ],
          [
            "User Burden: Antenna Options",
            "Parabolic Antenna Mass (kg)",
            "10.993",
            "12.879",
            "8.659",
            "3.931",
            "Mass calculation model not available",
            "5.836",
            "Mass calculation model not available",
            "Mass calculation model not available",
            "12.286",
            "Mass calculation model not available",
            "Mass calculation model not available",
            "25.651",
            "Mass calculation model not available",
          ],
          [
            "User Burden: Antenna Options",
            "Electronically Steerable Antenna Size (m²)",
            "0.046",
            "0.089",
            "0.064",
            "0.044",
            "0.013",
            "0.65",
            "0.018",
            "0.18",
            "0.177",
            "0.069",
            "0.052",
            "0.321",
            "0.03",
          ],
          [
            "User Burden: Antenna Options",
            "Helical Antenna Height (m)",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "0.23",
            "Not a good solution",
            "0.03",
            "0.015",
            "Not a good solution",
            "Not a good solution",
          ],
          [
            "User Burden: Antenna Options",
            "Patch Antenna Size (m²)",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "0.004",
            "0.004",
            "Not a good solution",
            "Not a good solution",
          ],
          [
            "User Burden: Antenna Options",
            "Dipole Antenna Size (m)",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "Not a good solution",
            "0.231",
            "0.093",
            "Not a good solution",
            "Not a good solution",
          ],
          [
            "User Burden: Mission Impacts",
            "Tracking Rate (deg/s)",
            "0.101",
            "0.076",
            "0.055",
            "0.056",
            "0.096",
            "0.061",
            "0.075",
            "0.086",
            "0.072",
            "0.381",
            "0.992",
            "0.083",
            "0",
          ],
          [
            "User Burden: Mission Impacts",
            "Slew Rate (deg/s)",
            "48",
            "57.9",
            "85.7",
            "128.1",
            "160.3",
            "131.6",
            "159.6",
            "174.3",
            "160.5",
            "179.5",
            "0",
            "59.5",
            "78",
          ],
          [
            "User Burden: Mission Impacts",
            "Body Pointing Feasibility",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "false",
            "true",
            "true",
          ],
          [
            "User Burden: Mission Impacts",
            "Mechanical Pointing Feasibility",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
            "true",
          ],
          [
            "User Burden: Mission Impacts",
            "Pointing-Adjusted RF Coverage (%)",
            "101",
            "104",
            "105",
            "100",
            "100",
            "100",
            "99",
            "103",
            "90",
            "72",
            "45",
            "40",
            "98",
          ],
          [
            "Nav and Tracking",
            "Tracking Service, 3-sigma Range Error (m)",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "8.2",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "20",
            "N/A",
            "N/A",
          ],
          [
            "Nav and Tracking",
            "GNSS Availability",
            "Yes",
            "Yes",
            "Yes",
            "Yes",
            "Yes",
            "GNSS not required.",
            "Yes",
            "Yes",
            "Yes",
            "Yes",
            "GNSS not required.",
            "Yes",
            "Yes",
          ],
        ],
        fileName: "300_30.csv",
        userBurden: {
          "1": {
            P_rec: -129.5,
            A_r: 35786,
            theta: 0,
            f_MHz: 14041,
            R_kbps: 3000,
            lambda: 0.021365999572680008,
            gOverT: 2,
            cOverNo: 106,
            implementationLoss: 3,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "2": {
            P_rec: -138.88,
            A_r: 1414,
            theta: 0,
            f_MHz: 1626.5,
            R_kbps: 256,
            lambda: 0.18444512757454656,
            gOverT: -10.22,
            cOverNo: 65.78,
            implementationLoss: 2.6,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "3": {
            P_rec: -140.55,
            A_r: 35786,
            theta: 0,
            f_MHz: 1660.5,
            R_kbps: 492,
            lambda: 0.18066847335140018,
            gOverT: 12.7,
            cOverNo: 78.57,
            implementationLoss: 3,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "4": {
            P_rec: -128.54,
            A_r: 35786,
            theta: 0,
            f_MHz: 14125,
            R_kbps: 80000,
            lambda: 0.021238938053097345,
            gOverT: 11.3,
            cOverNo: 98.06,
            implementationLoss: 3,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "5": {
            P_rec: -129.06,
            A_r: 780,
            theta: 0,
            f_MHz: 1626.44,
            R_kbps: 512,
            lambda: 0.184451931826566,
            gOverT: -11.2,
            cOverNo: null,
            implementationLoss: 2.79,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 5.9,
          },
          "6": {
            P_rec: -113.4,
            A_r: 8062,
            theta: 0,
            f_MHz: 30000,
            R_kbps: 100000,
            lambda: 0.01,
            gOverT: 7,
            cOverNo: 95.98,
            implementationLoss: 3.12,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "7": {
            P_rec: -119.74,
            A_r: 8500,
            theta: 0,
            f_MHz: 50200,
            R_kbps: 25000,
            lambda: 0.00597609561752988,
            gOverT: -1,
            cOverNo: 118.02,
            implementationLoss: 2.79,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "8": {
            P_rec: -123,
            A_r: 1110,
            theta: 0,
            f_MHz: 14500,
            R_kbps: 1000000,
            lambda: 0.020689655172413793,
            gOverT: 9.8,
            cOverNo: null,
            implementationLoss: 3.12,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "9": {
            P_rec: -110,
            A_r: 35786,
            theta: 0,
            f_MHz: 30000,
            R_kbps: 100000,
            lambda: 0.01,
            gOverT: 30.9,
            cOverNo: 119.73,
            implementationLoss: 3,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "10": {
            P_rec: -162.3,
            A_r: 35786,
            theta: 0,
            f_MHz: 27500,
            R_kbps: 150000,
            lambda: 0.01090909090909091,
            gOverT: 26.5,
            cOverNo: 95.3,
            implementationLoss: 3,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "11": {
            P_rec: -162.3,
            A_r: 35786,
            theta: 0,
            f_MHz: 2287.5,
            R_kbps: 6000,
            lambda: 0.13114754098360656,
            gOverT: 9.5,
            cOverNo: 95.3,
            implementationLoss: 3,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "12": {
            P_rec: -108.95,
            A_r: 8062,
            theta: 0,
            f_MHz: 29100,
            R_kbps: 100000,
            lambda: 0.010309278350515464,
            gOverT: 4.43,
            cOverNo: 96.22,
            implementationLoss: 3.12,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: 4.2,
          },
          "19": {
            P_rec: -139.4,
            A_r: 35786,
            theta: 0,
            f_MHz: 30000,
            R_kbps: 5000,
            lambda: 0.01,
            gOverT: 12.6,
            cOverNo: 86.31,
            implementationLoss: 3,
            polarizationLoss_dB: 1,
            propagationLosses_dB: 0,
            otherLosses_dB: 0,
            ebNo: -3.65,
          },
        },
        surfaces: {
          "1": {
            mean_contacts: [],
            reduced_coverage: [],
            max_gap: [],
            average_gap: [],
            slew_rate: [],
            mean_response_time: [],
            tracking_rate: [],
            coverage: [],
            mean_coverage_duration: [],
          },
          "2": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "3": {
            mean_contacts: [],
            reduced_coverage: [],
            max_gap: [],
            average_gap: [],
            slew_rate: [],
            mean_response_time: [],
            tracking_rate: [],
            availability: [],
            coverage: [],
            mean_coverage_duration: [],
          },
          "4": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "5": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "6": {
            mean_contacts: [],
            reduced_coverage: [],
            max_gap: [],
            average_gap: [],
            slew_rate: [],
            mean_response_time: [],
            tracking_rate: [],
            coverage: [],
            mean_coverage_duration: [],
          },
          "7": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "8": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "9": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "10": {
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "11": {
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "12": {
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "19": {
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
        },
        surfaceSlices: {
          "1": {
            mean_contacts: [],
            reduced_coverage: [],
            max_gap: [],
            average_gap: [],
            slew_rate: [],
            mean_response_time: [],
            tracking_rate: [],
            coverage: [],
            mean_coverage_duration: [],
          },
          "2": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "3": {
            mean_contacts: [],
            reduced_coverage: [],
            max_gap: [],
            average_gap: [],
            slew_rate: [],
            mean_response_time: [],
            tracking_rate: [],
            availability: [],
            coverage: [],
            mean_coverage_duration: [],
          },
          "4": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "5": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "6": {
            mean_contacts: [],
            reduced_coverage: [],
            max_gap: [],
            average_gap: [],
            slew_rate: [],
            mean_response_time: [],
            tracking_rate: [],
            coverage: [],
            mean_coverage_duration: [],
          },
          "7": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "8": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "9": {
            availability: [],
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "10": {
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "11": {
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "12": {
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
          "19": {
            average_gap: [],
            coverage: [],
            max_gap: [],
            mean_contacts: [],
            mean_coverage_duration: [],
            mean_response_time: [],
            reduced_coverage: [],
            slew_rate: [],
            tracking_rate: [],
          },
        },
      };
      res.status(200).send(result);
    });
    /**
     * @typedef {Object} GitCommit
     * @property {string} name
     * @property {string} comment
     * @property {string} commit_date
     * @property {string} author_email
     * @property {string} readme
     */
    /**
     * Returns data for the Git repository viewer.
     * @param {string} filter System name.
     * @returns {GitCommit[]}
     */
    this.router.post("/requestGitRepo", async (req, res) => {
      const { filter } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    /**
     * Returns array of system names.
     * @returns {string[]}
     */
    this.router.get("/requestSystems", async (_req, res) => {
      const result = {
        1: "Viasat3",
        2: "Test System #1",
        3: "Test DTE #1",
      };
      res.status(200).send(result);
    });
    this.router.post("/systemNameToKey", async (req, res) => {
      const { system } = req.body;
      const result = { systemId: 1 };
      res.status(200).send(result);
    });
    this.router.post("/deleteSystem", async (req, res) => {
      const { systemName } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/deleteGroundStation", async (req, res) => {
      const { systemName, groundStationName } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/deleteAntenna", async (req, res) => {
      const { groundStationName, antennaName } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/deleteFrequencyBand", async (req, res) => {
      const { antennaName, frequencyBandName } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/deleteModDemod", async (req, res) => {
      const { antennaName, frequencyBandName, modDemodName } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/getAttributeValues", async (req, res) => {
      const { sub_key } = req.query;
      const status = 200;
      const result = [
        {
          id: 1,
          name: "QPSK",
        },
        {
          id: 2,
          name: "16 QAM",
        },
        {
          id: 3,
          name: "BPSK",
        },
        {
          id: 4,
          name: "8 PSK",
        },
        {
          id: 5,
          name: "16 PSK",
        },
        {
          id: 6,
          name: "PM/PCM",
        },
      ];
      res.status(200).send(result);
    });
    this.router.post("/createSystem", async (req, res) => {
      const { systemName, networkType } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/createGroundStation", async (req, res) => {
      const { GSName, dteName } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/createAntenna", async (req, res) => {
      const { antennaName, GSName } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/getGroundStations", async (req, res) => {
      const { networkId } = req.body;
      const result = [
        {
          id: 125,
          name: "Test Ground Station #1",
          networks: "Test System #1",
          numAntennas: 1,
          supportedFrequencies: "X-Band, S-Band",
          location: "Platform",
        },
        {
          id: 5612,
          name: "Test Ground Station #2",
          networks: "Test System #1, Test System #2",
          numAntennas: 6,
          supportedFrequencies: "X-Band, Ka-Band",
          location: "Europe",
        },
        {
          id: 6512,
          name: "Test Ground Station #3",
          networks: "Test System #2, Test System #3",
          numAntennas: 2,
          supportedFrequencies: "S-Band",
          location: "Africa",
        },
        {
          id: 9513,
          name: "Test Ground Station #4",
          networks: "Test System #3",
          numAntennas: 3,
          supportedFrequencies: "S-Band, Ka-Band",
          location: "Europe",
        },
        {
          id: 6232,
          name: "Test Ground Station #5",
          networks: "Test System #1",
          numAntennas: 5,
          supportedFrequencies: "S-Band",
          location: "South America",
        },
        {
          id: 7533,
          name: "Test Ground Station #6",
          networks: "Test System #2",
          numAntennas: 2,
          supportedFrequencies: "S-Band, Ka-Band",
          location: "Antarctica",
        },
      ];
      res.status(200).send(result);
    });
    this.router.post("/duplicateGroundStation", async (req, res) => {
      const { GSId, dteId } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/getAntennas", async (req, res) => {
      const { networkId, groundStationName } = req.body;
      const result = [
        {
          id: 1,
          name: "Antenna1",
        },
        {
          id: 2,
          name: "Antenna2",
        },
        {
          id: 3,
          name: "Antenna3",
        },
        {
          id: 4,
          name: "Antenna4",
        },
        {
          id: 5,
          name: "Antenna5",
        },
        {
          id: 6,
          name: "Antenna6",
        },
      ];
      res.status(200).send(result);
    });
    this.router.post("/getAvailableAntennas", async (req, res) => {
      const { groundStationId } = req.body;
      const result = [
        {
          id: 1,
          name: "Antenna1",
        },
        {
          id: 2,
          name: "Antenna2",
        },
        {
          id: 3,
          name: "Antenna3",
        },
        {
          id: 4,
          name: "Antenna4",
        },
        {
          id: 5,
          name: "Antenna5",
        },
        {
          id: 6,
          name: "Antenna6",
        },
      ];
      res.status(200).send(result);
    });
    this.router.post("/duplicateAntenna", async (req, res) => {
      const { antennaId, GSName, dteId } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/createfrequencyBand", async (req, res) => {
      const { frequencyBandName, antennaName } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/createModDemod", async (req, res) => {
      const { modDemodName, frequencyBandName, antennaName } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    /**
     * @typedef {Object} Metric
     * @property {number} altitude
     * @property {number} inclination
     * @property {number} value
     */
    /**
     * @typedef {Object} RegPlot
     * @property {{ type: string, label: string, plot_value: Metric[] }} data
     * @property {{ reg: number[] }} coefficients
     * @property {number} maxAltitude
     * @property {string} text
     */
    /**
     * Returns data for a regression plot.
     * @param {string} system System name.
     * @param {string} metric Metric name.
     * @returns {RegPlot}
     */
    this.router.post("/requestRegressionPlot", async (req, res) => {
      const { type, system, version, model, metric } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/requestTerrestrialPlot", async (req, res) => {
      const { system, version, model } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    /**
     * @typedef {Object} SystemEval
     * @property {number} maxAltitude
     * @property {{ reg: number[] }} coefficients
     * @property {{ group: string, data: any[] }[]} data
     * @property {} userBurden
     * @property {} userBurdenEqns
     * @property {} equations
     */
    /**
     * Returns System Evaluation data.
     * @param {string} system System identifier.
     * @param {string|number} altitude User altitude in km.
     * @param {string|number} inclination User inclination in deg.
     * @returns {SystemEval}
     */
    this.router.post("/requestSystemEval", async (req, res) => {
      const { system } = req.body;
      const modCodTable = {
        BPSK: {
          Uncoded: 1,
          "Rate 1/2": 0.5,
          "Rate 1/3": 0.333,
          "Rate 2/3": 0.666,
          "Rate 3/4": 0.75,
        },
        QPSK: {
          Uncoded: 2,
          "Rate 1/2": 1,
          "Rate 1/3": 0.666,
          "Rate 2/3": 1.332,
          "Rate 3/4": 1.5,
          "Rate 4/5": 1.6,
        },
        "8 PSK": {
          Uncoded: 3,
          "Rate 1/2": 1.5,
          "Rate 1/3": 0.999,
          "Rate 2/3": 1.998,
          "Rate 3/4": 2.25,
        },
        "16 PSK": {
          Uncoded: 4,
          "Rate 1/2": 2,
          "Rate 1/3": 1.332,
          "Rate 2/3": 2.664,
          "Rate 3/4": 3,
        },
        "4 QAM": {
          Uncoded: 2,
          "Rate 1/2": 1,
          "Rate 1/3": 0.666,
          "Rate 2/3": 1.332,
          "Rate 3/4": 1.5,
        },
        "16 QAM": {
          Uncoded: 4,
          "Rate 1/2": 2,
          "Rate 1/3": 1.332,
          "Rate 2/3": 2.664,
          "Rate 3/4": 3,
        },
        "32 PSK": {
          Uncoded: 5,
          "Rate 1/2": 2.5,
          "Rate 1/3": 1.665,
          "Rate 2/3": 3.33,
          "Rate 3/4": 3.75,
        },
        "32 QAM": {
          Uncoded: 6,
          "Rate 1/2": 2.5,
          "Rate 1/3": 1.665,
          "Rate 2/3": 3.33,
          "Rate 3/4": 3.75,
        },
      };
      const ebNoTable = {
        BPSK: {
          "Rate 1/2": 4.2,
          "Rate 1/4": 3.8,
          "Rate 1/3": 4,
          "Rate 2/3": 4.5,
          "Rate 3/4": 4.7,
        },
        QPSK: {
          Uncoded: 9.6,
          "Rate 1/2": 4.2,
          "0.83": 4.8,
          "Rate 4/5": 4.8,
          "Rate 1/4": 3.8,
          "Rate 1/3": 4,
          "Rate 2/3": 4.5,
          "Rate 3/4": 4.7,
        },
        "8 PSK": {
          "Rate 1/2": 9.4,
          "Rate 1/4": 7.3,
          "Rate 1/3": 8.2,
          "Rate 2/3": 10,
          "Rate 3/4": 10.4,
        },
        "16 PSK": {
          "Rate 1/2": 13.35,
          "Rate 1/4": 11.9,
          "Rate 1/3": 12.2,
          "Rate 2/3": 14,
          "Rate 3/4": 14.5,
        },
        "4 QAM": {
          "Rate 1/2": 6.5,
          "Rate 1/4": 3.8,
          "Rate 1/3": 4,
          "Rate 2/3": 7,
          "Rate 3/4": 7.5,
        },
        "16 QAM": {
          "Rate 1/2": 10,
          "0.775": 10.8,
          "0.852": 12.7,
          "Rate 1/4": 9.1,
          "Rate 1/3": 9.5,
          "Rate 2/3": 10.5,
          "Rate 3/4": 11,
        },
        "32 PSK": {
          "Rate 1/2": 11,
          "Rate 1/4": 10.4,
          "Rate 1/3": 10.7,
          "Rate 2/3": 11.8,
          "Rate 3/4": 12.3,
        },
        "32 QAM": {
          "Rate 1/2": 12.8,
          "Rate 1/4": 11.8,
          "Rate 1/3": 12.2,
          "Rate 2/3": 13.5,
          "Rate 3/4": 14,
        },
      };
      let result: any = {
        networkType: "relay",
        coefficients: {
          availability: [1, 1, 1, 1, 8640],
          average_gap: [4.064382, 0.00007681316, 0.01239941, -1.555887e-7],
          coverage: [0.04016366, -0.0001408164, -0.003588713, -0.000001294843],
          max_gap: [-56.47491, 0.03211795, 1.510044, 0.0002251228, 4000, 5000],
          slew_rate: [9.495119, -0.01405042, -0.0109575, -0.00001173496],
          tracking_rate: [-2.682977, -0.0001000022, 0.001415642, 3.34195e-7],
          mean_response_time: [
            -1845.769, 0.8129378, 27.542, 0.007231335, 4000, 5000,
          ],
          reduced_coverage: [
            0.04016366, -0.0001408164, -0.003588713, -0.000001294843,
          ],
          mean_contacts: [2.073939, -0.00002311058, -0.006751533, -6.444548e-7],
          mean_coverage_duration: [
            9.022169, -0.00009417396, -0.01387736, 4.379196e-7,
          ],
          data_volume: [1, 1, 1, 1, 8640],
        },
        systemParams: {
          id: 1,
          system: 1,
          P_rec: -112.75,
          G_relay: 62.3,
          A_r: 35786,
          theta: 8.66,
          T_sys: 1380,
          f_MHz: 30000,
          R_kbps: 100000,
          d1: 41074,
          eirp1: 39.26,
          lambda: 0.01,
          beam_type: "steering",
          systemName: "Viasat3",
          version: 1,
          model: 1,
          networkType: "relay",
          bandwidthMHz: 500.0345349769783,
          defaultEbNo: 4.2,
          inclination: 0,
          fwdLinkFreqMHz: 20200,
          rtnLinkFreqMHz: 30000,
          operationalYear: 2023,
          trackingAccuracy: "N/A",
          multipleAccess: "TDMA",
          gOverT: 30.9,
          cOverNo: 119.73,
          implementationLoss: 1,
          modCodOptions: [],
        },
        linkParams: {
          modCodTable: modCodTable,
          ebNoTable: ebNoTable,
        },
        modelData: {
          orbital: {
            coverage: {
              type: "coverage",
              label: "Coverage (%)",
              points: [
                {
                  altitude: 300,
                  inclination: 30,
                  value: 90,
                },
                {
                  altitude: 400,
                  inclination: 30,
                  value: 80,
                },
                {
                  altitude: 500,
                  inclination: 30,
                  value: 70,
                },
              ],
            },
            average_gap: {
              type: "average_gap",
              label: "Average Gap (min)",
              points: [
                {
                  altitude: 300,
                  inclination: 30,
                  value: 5,
                },
                {
                  altitude: 400,
                  inclination: 30,
                  value: 10,
                },
                {
                  altitude: 500,
                  inclination: 30,
                  value: 15,
                },
              ],
            },
          },
          terrestrial: {},
        },
      };
      const orbital = {
        data: {
          coverageMinutes: {
            type: "coverageMinutes",
            label: "RF Coverage (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          contactsPerDay: {
            type: "contactsPerDay",
            label: "Contacts Per Day",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          averageCoverageDuration: {
            type: "averageCoverageDuration",
            label: "Average Contact Duration (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          maxCoverageDuration: {
            type: "maxCoverageDuration",
            label: "Max Coverage Duration (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          averageGapDuration: {
            type: "averageGapDuration",
            label: "Average Gap (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          maxGapDuration: {
            type: "maxGapDuration",
            label: "Max Gap (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          meanResponseTime: {
            type: "meanResponseTime",
            label: "Mean Response Time (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
        },
        table: {
          coverageMinutes: [
            [null, 300, 400, 500, 600],
            [0, 0, 0, 0, 0],
            [30, 14.5, 24.25, 31.75, 41.5],
          ],
          contactsPerDay: [
            [null, 300, 400, 500, 600],
            [0, 0, 0, 0, 0],
            [
              30, 0.05833333358168602, 0.06666667014360428, 0.07083333283662796,
              0.0833333358168602,
            ],
          ],
          averageCoverageDuration: [
            [null, 300, 400, 500, 600],
            [0, 0, 0, 0, 0],
            [
              30, 4.142857074737549, 6.0625, 7.470588207244873,
              8.300000190734863,
            ],
          ],
          maxCoverageDuration: [
            [null, 300, 400, 500, 600],
            [0, 0, 0, 0, 0],
            [30, 5, 8, 9, 11],
          ],
          averageGapDuration: [
            [null, 300, 400, 500, 600],
            [0, 5761, 5761, 5761, 5761],
            [30, 380.20001220703125, 333.1764831542969, 313, 266.4285583496094],
          ],
          maxGapDuration: [
            [null, 300, 400, 500, 600],
            [0, 5761, 5761, 5761, 5761],
            [30, 1251, 1183, 1110, 1035],
          ],
          meanResponseTime: [
            [null, 300, 400, 500, 600],
            [0, 345600, 345600, 345600, 345600],
            [
              30, 8.215174674987793, 7.6110358238220215, 7.283504009246826,
              6.383574962615967,
            ],
          ],
        },
      };
      ///////////////////////////////////////////
      const systemParams = {
        systemName: "NEN",
        version: 1,
        networkType: "dte",
        elevationConstraint_deg: 5,
        gOverT: 22.799999237060547,
        implementationLoss: 3,
        R_kbps: 40000,
        bandwidthMHz: 1000,
        f_MHz: 2400,
        lambda: 0.125,
        defaultEbNo: 4.2,
        otherLosses_dB: 0,
        polarizationLoss_dB: 0,
        propagationLosses_dB: 0,
        modCodOptions: [
          {
            coding: 'Uncoded',
            codingId: 1,
            modulation: 'QPSK',
            modulationId: 1
          }
        ]
      }; 
      const linkParams = { modCodTable: modCodTable, ebNoTable: ebNoTable };
      const modelData = {
        orbital: {
          coverageMinutes: {
            type: "coverageMinutes",
            label: "RF Coverage (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          contactsPerDay: {
            type: "contactsPerDay",
            label: "Contacts Per Day",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          averageCoverageDuration: {
            type: "averageCoverageDuration",
            label: "Average Contact Duration (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          maxCoverageDuration: {
            type: "maxCoverageDuration",
            label: "Max Coverage Duration (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          averageGapDuration: {
            type: "averageGapDuration",
            label: "Average Gap (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          maxGapDuration: {
            type: "maxGapDuration",
            label: "Max Gap (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          },
          meanResponseTime: {
            type: "meanResponseTime",
            label: "Mean Response Time (minutes)",
            points: [
              {
                altitude: 300,
                inclination: 30,
                value: 5,
              },
              {
                altitude: 400,
                inclination: 30,
                value: 10,
              },
              {
                altitude: 500,
                inclination: 30,
                value: 15,
              },
            ],
          }
        },
        terrestrial: {},
      };
      const predictedData = {
        values: {
          averageCoverageDuration: 100,
          averageGapDuration: 100,
          contactsPerDay: 100,
          coverageMinutes: 100,
          maxCoverageDuration: 100,
          maxGapDuration: 100,
          meanResponseTime: 100
        },
        surfaces: {
          averageCoverageDuration: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          averageGapDuration: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          contactsPerDay: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          coverageMinutes: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          maxCoverageDuration: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          maxGapDuration: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          meanResponseTime: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ]
        },
        surfaceSlices: {
          averageCoverageDuration: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          averageGapDuration: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          contactsPerDay: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          coverageMinutes: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          maxCoverageDuration: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          maxGapDuration: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ],
          meanResponseTime: [
            {
              altitude: 300,
              inclination: 30,
              value: 5,
            },
            {
              altitude: 400,
              inclination: 30,
              value: 10,
            },
            {
              altitude: 500,
              inclination: 30,
              value: 15,
            },
          ]
        }
      };
      //if (system === 3 || system === "3") {
      //  result = dte;
      //}
      res.status(200).send({
        systemParams: systemParams,
        linkParams: linkParams,
        modelData: modelData,
        predictedData: predictedData
      });
    });
    this.router.post("/runModel", async (req, res) => {
      const {
        networkId,
        version,
        metricTypes,
        altitude,
        inclination,
        maxAltitude,
      } = req.body;
      const result = {};
      res.status(200).send(result);
    });

    this.router.post("/getServiceLibrary", async (req, res) => {
      const result = {
        networks: [
          {
            id: 1,
            name: "Network 1",
            type: "relay",
            operationalYear: "2013",
            supportedFrequencies: "L-Band",
            totalPlatforms: "3",
            platforms: [
              {
                id: 11,
                name: "Platform 1.1",
                type: "satellite",
                totalServices: "2",
                location: "Global",
                services: [
                  {
                    id: 111,
                    name: "Service 1.1.1",
                    antenna: "PL1",
                    TxRx: "Rx",
                    frequencyBand: "L-Band"
                  },
                  {
                    id: 112,
                    name: "Service 1.1.2",
                    antenna: "PL2",
                    TxRx: "Tx",
                    frequencyBand: "L-Band"
                  }
                ]
              },
              {
                id: 12,
                name: "Platform 1.2",
                type: "satellite",
                totalServices: "1",
                location: "Global",
                services: [
                  {
                    id: 121,
                    name: "Service 1.2.1",
                    antenna: "PA1",
                    TxRx: "Rx",
                    frequencyBand: "L-Band"
                  },
                ]
              },
              {
                id: 13,
                name: "Platform 1.3",
                type: "satellite",
                totalServices: "2",
                location: "Global",
                services: [
                  {
                    id: 131,
                    name: "Service 1.3.1",
                    antenna: "PT1",
                    TxRx: "Rx",
                    frequencyBand: "L-Band"
                  },
                  {
                    id: 132,
                    name: "Service 1.3.2",
                    antenna: "PT2",
                    TxRx: "Tx",
                    frequencyBand: "L-Band"
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            name: "Network 2",
            type: "relay",
            operationalYear: "2004",
            supportedFrequencies: "L-Band, Ka-Band",
            totalPlatforms: "4",
            platforms: [
              {
                id: 21,
                name: "Platform 2.1",
                type: "satellite",
                totalServices: "2",
                location: "Global",
                services: [
                  {
                    id: 211,
                    name: "Service 2.1.1",
                    antenna: "PF1",
                    TxRx: "Rx",
                    frequencyBand: "L-Band"
                  },
                  {
                    id: 212,
                    name: "Service 2.1.2",
                    antenna: "PF2",
                    TxRx: "Tx",
                    frequencyBand: "L-Band"
                  }
                ]
              },
              {
                id: 22,
                name: "Platform 2.2",
                type: "satellite",
                totalServices: "3",
                location: "Global",
                services: [
                  {
                    id: 221,
                    name: "Service 2.2.1",
                    antenna: "PO1",
                    TxRx: "Rx",
                    frequencyBand: "L-Band"
                  },
                  {
                    id: 222,
                    name: "Service 2.2.2",
                    antenna: "PO2",
                    TxRx: "Tx",
                    frequencyBand: "Ka-Band"
                  },
                  {
                    id: 223,
                    name: "Service 2.2.3",
                    antenna: "PO2",
                    TxRx: "Rx",
                    frequencyBand: "Ka-Band"
                  }
                ]
              },
              {
                id: 23,
                name: "Platform 2.3",
                type: "satellite",
                totalServices: "1",
                location: "Global",
                services: [
                  {
                    id: 231,
                    name: "Service 2.3.1",
                    antenna: "PR1",
                    TxRx: "Tx",
                    frequencyBand: "L-Band"
                  },
                ]
              },
              {
                id: 24,
                name: "Platform 2.4",
                type: "satellite",
                totalServices: "2",
                location: "Global",
                services: [
                  {
                    id: 241,
                    name: "Service 2.4.1",
                    antenna: "PM1",
                    TxRx: "Rx",
                    frequencyBand: "L-Band"
                  },
                  {
                    id: 242,
                    name: "Service 2.4.2",
                    antenna: "PM2",
                    TxRx: "Tx",
                    frequencyBand: "Ka-Band"
                  }
                ]
              }
            ]
          },
          {
            id: 3,
            name: "Network 3",
            type: "dte",
            operationalYear: "1997",
            supportedFrequencies: "Ka-Band, S-Band, X-Band",
            totalPlatforms: "4",
            platforms: [
              {
                id: 31,
                name: "Platform 3.1",
                type: "satellite",
                totalServices: "2",
                location: "North America",
                services: [
                  {
                    id: 311,
                    name: "Service 3.1.1",
                    antenna: "LP1",
                    TxRx: "Rx",
                    frequencyBand: "S-Band"
                  },
                  {
                    id: 312,
                    name: "Service 3.1.2",
                    antenna: "LP1",
                    TxRx: "Tx",
                    frequencyBand: "S-Band"
                  }
                ]
              },
              {
                id: 32,
                name: "Platform 3.2",
                type: "satellite",
                totalServices: "7",
                location: "North America",
                services: [
                  {
                    id: 321,
                    name: "Service 3.2.1",
                    antenna: "LP1",
                    TxRx: "Rx",
                    frequencyBand: "S-Band"
                  },
                  {
                    id: 322,
                    name: "Service 3.2.2",
                    antenna: "LP2",
                    TxRx: "Tx",
                    frequencyBand: "S-Band"
                  },
                  {
                    id: 323,
                    name: "Service 3.2.3",
                    antenna: "LP2",
                    TxRx: "Rx",
                    frequencyBand: "S-Band"
                  },
                  {
                    id: 324,
                    name: "Service 3.2.4",
                    antenna: "LP3",
                    TxRx: "Tx",
                    frequencyBand: "Ka-Band"
                  },
                  {
                    id: 325,
                    name: "Service 3.2.5",
                    antenna: "LP4",
                    TxRx: "Tx",
                    frequencyBand: "X-Band"
                  },
                  {
                    id: 326,
                    name: "Service 3.2.6",
                    antenna: "LP4",
                    TxRx: "Rx",
                    frequencyBand: "X-Band"
                  },
                  {
                    id: 327,
                    name: "Service 3.2.7",
                    antenna: "LP5",
                    TxRx: "Rx",
                    frequencyBand: "X-Band"
                  }
                ]
              },
              {
                id: 33,
                name: "Platform 3.3",
                type: "satellite",
                totalServices: "1",
                location: "East Asia",
                services: [
                  {
                    id: 331,
                    name: "Service 3.3.1",
                    antenna: "LA1",
                    TxRx: "Rx",
                    frequencyBand: "Ka-Band"
                  },
                ]
              },
              {
                id: 34,
                name: "Platform 3.4",
                type: "satellite",
                totalServices: "2",
                location: "Central America",
                services: [
                  {
                    id: 341,
                    name: "Service 3.4.1",
                    antenna: "LT1",
                    TxRx: "Rx",
                    frequencyBand: "X-Band"
                  },
                  {
                    id: 342,
                    name: "Service 3.4.2",
                    antenna: "LT1",
                    TxRx: "Tx",
                    frequencyBand: "X-Band"
                  }
                ]
              },
            ]
          },
          {
            id: 4,
            name: "Network 4",
            type: "dte",
            operationalYear: "2018",
            supportedFrequencies: "S-Band, X-Band",
            totalPlatforms: "2",
            platforms: [
              {
                id: 41,
                name: "Platform 4.1",
                type: "satellite",
                totalServices: "2",
                location: "Europe",
                services: [
                  {
                    id: 411,
                    name: "Service 4.1.1",
                    antenna: "LF1",
                    TxRx: "Rx",
                    frequencyBand: "S-Band"
                  },
                  {
                    id: 412,
                    name: "Service 4.1.2",
                    antenna: "LF1",
                    TxRx: "Tx",
                    frequencyBand: "S-Band"
                  }
                ]
              },
              {
                id: 42,
                name: "Platform 4.2",
                type: "satellite",
                totalServices: "3",
                location: "Australia",
                services: [
                  {
                    id: 421,
                    name: "Service 4.2.1",
                    antenna: "LO1",
                    TxRx: "Rx",
                    frequencyBand: "X-Band"
                  },
                  {
                    id: 422,
                    name: "Service 4.2.2",
                    antenna: "LO1",
                    TxRx: "Tx",
                    frequencyBand: "X-Band"
                  },
                  {
                    id: 423,
                    name: "Service 4.2.3",
                    antenna: "LO2",
                    TxRx: "Tx",
                    frequencyBand: "S-Band"
                  }
                ]
              }
            ]
          },
        ]
      };
      res.status(200).send(result);
    });

    this.router.post("/requestEngineerDashboard", async (req, res) => {
      const result = {
        modulations: [
          { id: 1, name: "QPSK" },
          { id: 2, name: "32 QAM" },
        ],
        codings: [
          { id: 1, name: "Uncoded" },
          { id: 2, name: "Rate 1/2" },
        ],
        frequencyBands: [
          { id: 1, name: "S-Band" },
          { id: 2, name: "X-Band" },
        ],
      };
      res.status(200).send(result);
    });
    this.router.post("/saveEngineerDashboardData", async (req, res) => {
      const { type, id } = req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/combineGroundStations", async (req, res) => {
      const { groundStations, frequencyBand, userAltitude, userInclination } =
        req.body;
      const result = {
        postProcessedData: {
          coveragePerDay_minutes: 122.01666666666667,
          contactsPerDay_minutes: 20.266666666666666,
          averageCoverageDuration_minutes: 6.020559210526316,
          maxCoverageDuration_minutes: 13,
          meanResponseTime_minutes: 68.27688078703704,
          averageGapDuration_minutes: 64.92610837438424,
          maxGapDuration_minutes: 382.5,
        },
        coveragePerStation: [
          { groundStation: 1, coverageMinutes: 29 },
          { groundStation: 2, coverageMinutes: 960 },
          { groundStation: 3, coverageMinutes: 1139 },
          { groundStation: 4, coverageMinutes: 779.5 },
        ],
      };
      res.status(200).send(result);
    });
    this.router.post("/checkGroundStations", async (req, res) => {
      res.setTimeout(0);
      const { groundStations, frequencyBand, userAltitude, userInclination } =
        req.body;
      const result = { state: 1 }; //1 indicates that all data exists, 0 that data is missing, -1 if currently processing
      res.status(200).send(result);
    });
    this.router.post("/saveGroundStations", async (req, res) => {
      res.setTimeout(0);
      const { groundStations, frequencyBand, userAltitude, userInclination } =
        req.body;
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/get-engineering-models", async (req, res) => {
      const { networkId, networkName, groundStationName, type } = req.query;
      res.status(200).send({
        models: {
          id: 1,
          filename: "testFile.zip",
          version: 1,
          dateUploaded: new Date().toLocaleDateString(),
          notes: "model.notes",
        },
      });
    });
    this.router.post("/edit-engineering-model-notes", async (req, res) => {
      const { modelId, notes } = req.body;
      res.status(200).send({});
    });
    this.router.post(
      "/upload-model",
      upload.single("file"),
      async (req, res) => {
        res.setTimeout(0);
        const { networkId, groundStationName, type } = req.body;
        //@ts-ignore
        const readStream = fs.createReadStream(req.file.path, {
          highWaterMark: 16 * 1024,
        });
        const data: Buffer[] = [];
        readStream.on("data", (chunk: Buffer) => {
          data.push(chunk);
        });
        readStream.on("end", async () => {
          const bytes = Buffer.concat(data);
          res.status(200).send({ response: "done" });
        });
        readStream.on("error", (err: any) => {
          res.status(500).send({});
        });
      }
    );
    this.router.get("/download-model", async (req, res) => {
      res.setTimeout(0);
      const { modelId, networkName, groundStationName, type } = req.query;
      var { Readable } = require("stream");
      const readStream = new Readable({
        read() {
          this.push(null);
        },
      });
      // What is the best path to write to? This differs in
      // development vs. production.
      const writeStream = fs.createWriteStream(`../front/build/test.zip`);
      readStream.pipe(writeStream).on("close", () => {
        res.status(200).send({ filename: "test.zip" });
      });
    });
    this.router.post(
      "/upload-data-file",
      upload.array("file"),
      async (req, res) => {
        res.setTimeout(0);
        const {
          networkType,
          networkId,
          networkAttributeId,
          modelId,
          prec,
          isNewVersion,
          missionType,
          groundStationId,
        } = req.body;
        res.status(200).send({ status: "done" });
      }
    );
    // Statistics dashboard
    // Return all systems and associated versions.
    this.router.get("/get-systems-and-versions", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    // Return all systems and associated precs used in modeling.
    this.router.get("/get-precs", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    // Return information about the latest model for each network.
    this.router.get("/get-version-ids", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    // Return all beam types used in modeling.
    this.router.get("/get-beams-types", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/get-ground-stations", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/get-modify-systems", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/get-modify-attr-versions", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/get-modify-models", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/get-modify-beams", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/processing", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/upload-regressions", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/systemNameToKey", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/get-systems", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/get-cart", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/get-file-id", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/events", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/get-versions", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/get-models", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/get-items", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/delete-record", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/delete-all", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/migrate", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/create-system", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/create-attribute-version", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post("/create-model", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get("/change-db", async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post('/add-link-budget-item', async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.post('/update-note', async (req, res) => {
      const result = {};
      res.status(200).send(result);
    });
    this.router.get('/get-link-budget', async (req, res) => {
      const linkBudgetItems = [
        {
          id: '093c8f5e-7cc3-4908-8a70-f2b8d36d162b',
          key: 'userEirp_dBW',
          parameter: 'User EIRP (dBW)',
          location: 1,
          value: -2,
          noteId: '09f15568-e7ac-44ea-9b1e-da319d86e5c7',
          notes: 'Notes'
        },
        {
          id: '1460c7a3-4712-4cd7-8db5-2e1a5d94fa12',
          key: 'freeSpaceLoss_dB',
          parameter: 'Free Space Loss (dB)',
          location: 1,
          value: 154,
          noteId: '1b9f265b-15b8-45ff-8434-f6e02d6e3f55',
          notes: 'Notes #2'
        }
      ];
      const result = {
        linkBudget: linkBudgetItems,
        isAdmin: 0,
        isEngineer: 0
      };
      res.status(200).send(result);
    });
    this.router.post('/update-user-link-budget', async (req, res) => {
      res.status(200).send({});
    });
    this.router.post('/reorder-link-budget', async (req, res) => {
      res.status(200).send({});
    });
    this.router.post('/delete-link-budget-item', async (req, res) => {
      res.status(200).send({});
    });
    this.router.get('/get-engineering-models', async (req, res) => {
      const engineeringModels = [
        {
          id: 1,
          filename: 'test-model.zip',
          version: 1,
          dateUploaded: (new Date()).toLocaleDateString(),
          notes: 'notes'
        },
        {
          id: 2,
          filename: 'second-model.zip',
          version: 2,
          dateUploaded: (new Date()).toLocaleDateString(),
          notes: 'more notes'
        }
      ];
      res.status(200).send({ models: engineeringModels });
    });
    this.router.post('/edit-engineering-model-notes', async (req, res) => {
      res.status(200).send({});
    });
    this.router.post('/upload-model', upload.single('file'), async (req, res) => {
      res.status(200).send({ response: 'done' });
    });
    this.router.get('/download-model', async (req, res) => {
      res.status(200).send({ filename: 'test-model.zip' });
    });
    
    this.links = new Map();
    let dummyLinkData = [
      {
          "userId": 4,
          "networkId": 13,
          "linkId": 0,
          "name": "testLink0",
          "segments": [
              {
                  "linkId": 0,
                  "name": "testLink0",
                  "networkId": 13,
                  "connectionId": 7,
                  "userId": 4
              },
              {
                  "linkId": 0,
                  "name": "testLink0",
                  "networkId": 13,
                  "connectionId": 2,
                  "userId": 4
              },
              {
                  "linkId": 0,
                  "name": "testLink0",
                  "networkId": 13,
                  "connectionId": 3,
                  "userId": 4
              },
              {
                  "linkId": 0,
                  "name": "testLink0",
                  "networkId": 13,
                  "connectionId": 4,
                  "userId": 4
              },
              {
                  "linkId": 0,
                  "name": "testLink0",
                  "networkId": 13,
                  "connectionId": 8,
                  "userId": 4
              }
          ]
      },
      {
          "userId": 4,
          "networkId": 13,
          "linkId": 1,
          "name": "testLink1",
          "segments": [
              {
                  "linkId": 1,
                  "name": "testLink1",
                  "networkId": 13,
                  "connectionId": 7,
                  "userId": 4
              },
              {
                  "linkId": 1,
                  "name": "testLink1",
                  "networkId": 13,
                  "connectionId": 1,
                  "userId": 4
              },
              {
                  "linkId": 1,
                  "name": "testLink1",
                  "networkId": 13,
                  "connectionId": 2,
                  "userId": 4
              },
              {
                  "linkId": 1,
                  "name": "testLink1",
                  "networkId": 13,
                  "connectionId": 4,
                  "userId": 4
              },
              {
                  "linkId": 1,
                  "name": "testLink1",
                  "networkId": 13,
                  "connectionId": 5,
                  "userId": 4
              }
          ]
      }
    ];
    dummyLinkData.forEach((elt) => {
      this.links.set(elt.linkId, elt);
    });

/**
 * Creat link segments. Essentially, add a list of connections to
 * the specified link.
 * @param req 
 * @param res 
 */
    this.router.post('/createLinkSegments', async (req , res) => {
    let {
        linkSegments,
        userId,
        networkId,
        linkName
    } = req.body;
    let returnId = null;
    userId=4;
    networkId=13;
    try {
        if(linkSegments == null || !Array.isArray(linkSegments)) {
            res.status(400).json({error:`Must provide linkSegments an array of link segments`});
            return;
        }
        let linkId = linkSegments[0].linkId;
        const inconsistentLinkId = linkSegments.reduce((a,c) => c.linkId != linkId || a , false);
        if(inconsistentLinkId) {
            res.status(400).json({error:`Must provide no more than one link id.`});
            return;
        }
        if(linkId == null) {
            if(userId == null || networkId == null || linkName == null) {
                res.status(400).json({error:`Must provide a userId, linkName, and networkId if attempting to create new Link.`});
                return;
            }
            this.links.set(this.links.size, {
              linkId:this.links.size,
              userId,
              networkId,
              name:linkName,
              segments:[]
            });
            let newId = {id:this.links.size-1};
            if(newId) {
                linkId = newId.id;
                returnId = linkId;
            } else {
                throw new Error(`Failed to create new Link`);
            }
        }
    
        for(let i = 0; i < linkSegments.length; i++) {
            let {connectionId} = linkSegments[i];
            this.links.get(linkId)?.segments.push({linkId,connectionId,userId,networkId,name:linkName});
        }
        res.status(200);
        if(returnId != null) {
            res.json({linkId:returnId});
        } else {
            res.send();
        }
    } catch (err) {
        res.status(500).json({error:`Encountered an issue while creating link segments, cancelled...:${err}`});
    }
    });

    this.router.post('/getLinks', async (req, res) => {
      let {
          userId,
          networkId,
          linkId
      } = req.body;
      networkId=13;
      userId=4;
      try {
          let allLinks = mapToArray(this.links);
          if(userId != null) {
            allLinks = allLinks.filter(elt => elt.userId === userId);
          }
          if(networkId != null) {
            allLinks = allLinks.filter(elt => elt.networkId === networkId);
          }
          if(linkId != null) {
            allLinks = allLinks.filter(elt => elt.linkId === linkId);
          }
          let results : LinkGroup[] = allLinks;
          if(results.length > 0) {
              res.status(200).json(results);
          } else {
              throw new Error(`No results found`);
          }
      } catch (err) {
          res.status(500).json({error:`Encountered an error getting links: ${err}`});
      }
  });

  this.router.post('/deleteLink', async (req, res) => {
    const {linkId} = req.body;

    if(linkId == null) {
        res.status(400).json({error:"Must provide linkId"});
        return;
    }

    try {
        let x = this.links.delete(linkId)
        if(x) {
          res.status(200).json({count:1});
        } else {
          res.status(400).json({error:"No records to delete"});
        }
    } catch (err) {
        res.status(500).json({error:`Encountered an error deleting link ${linkId}: ${err}`});
    }
    });
  }

  
  
}


export const api = new Api();


