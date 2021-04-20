export default {
  id: 1,
  created_at: '2020-06-14T03:12:11.196Z',
  updated_at: '2020-06-14T03:12:11.196Z',
  grids: [
    {
      id: 1,
      name: 'Battery',
      icon: 'battery high',
      created_at: '2020-06-13T23:48:01.474Z',
      updated_at: '2020-07-25T18:14:29.033Z',
      columns: 6,
      rows: 8,
      tiles: [
        {
          __component: 'tile-components.computed-signal-tile',
          id: 1,
          signal: {
            id: 1,
            name: 'Pack Power',
            units: 'kW',
            created_at: '2020-06-13T23:44:50.121Z',
            updated_at: '2020-06-27T01:12:01.573Z',
            category: 1
          },
          tile: {
            id: 1,
            left: 3,
            top: 1,
            width: 2,
            height: 2,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'hero'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 1,
          signal: {
            id: 1,
            name: 'Pack Voltage',
            units: 'V',
            category: 1,
            mnemonic: 'BMS_packVoltage',
            created_at: '2020-06-13T23:43:41.162Z',
            updated_at: '2020-08-23T18:24:44.022Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 5,
            left: 3,
            top: 1,
            width: 2,
            height: 1,
            caption: null,
            style: 'floating',
            icon: 'star',
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 2,
          signal: {
            id: 2,
            name: 'Pack Current',
            units: 'A',
            category: 1,
            mnemonic: 'BMS_packCurrent',
            created_at: '2020-06-13T23:44:10.697Z',
            updated_at: '2020-07-26T04:43:24.518Z',
            favourite: false
          },
          showSignalName: false,
          showSignalUnits: true,
          tile: {
            id: 6,
            left: 4,
            top: 1,
            width: 1,
            height: 2,
            caption: '',
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 4,
          signal: {
            id: 13,
            name: 'Thermistor t max',
            units: 'DegC',
            category: null,
            mnemonic: 'BMS_thermistorTMax',
            created_at: '2020-07-03T01:59:04.143Z',
            updated_at: '2020-08-12T00:55:23.975Z',
            favourite: false
          },
          showSignalName: false,
          showSignalUnits: true,
          tile: {
            id: 8,
            left: 6,
            top: 1,
            width: 2,
            height: 1,
            caption: '',
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 5,
          signal: {
            id: 19,
            name: 'Nominal energy remaining',
            units: 'KWh',
            category: null,
            mnemonic: 'BMS_nominalEnergyRemaining',
            created_at: '2020-07-03T13:41:25.941Z',
            updated_at: '2020-07-26T04:42:58.495Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 9,
            left: 1,
            top: 1,
            width: 1,
            height: 1,
            caption: 'ENGY',
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        }
      ]
    },
    {
      id: 2,
      name: 'Drivetrain',
      icon: 'car',
      created_at: '2020-06-14T02:51:43.045Z',
      updated_at: '2020-07-25T18:32:39.353Z',
      columns: 8,
      rows: 8,
      tiles: [
        {
          __component: 'tile-components.signal-tile',
          id: 3,
          signal: {
            id: 5,
            name: 'Elec power',
            units: 'kW',
            category: null,
            mnemonic: 'DI_elecPower',
            created_at: '2020-06-14T04:48:37.695Z',
            updated_at: '2020-07-26T13:35:11.553Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 7,
            left: 4,
            top: 1,
            width: 1,
            height: 2,
            caption: 'Power',
            style: 'floating',
            icon: null,
            displayType: 'hero'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 6,
          signal: {
            id: 33,
            name: 'Sys regen power max',
            units: 'kW',
            category: null,
            mnemonic: 'DI_sysRegenPowerMax',
            created_at: '2020-07-05T04:02:43.395Z',
            updated_at: '2020-07-26T13:35:11.392Z',
            favourite: false
          },
          showSignalName: false,
          showSignalUnits: true,
          tile: {
            id: 10,
            left: 3,
            top: 1,
            width: null,
            height: null,
            caption: 'Max',
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 7,
          signal: {
            id: 32,
            name: 'Sys drive power max',
            units: 'kW',
            category: null,
            mnemonic: 'DI_sysDrivePowerMax',
            created_at: '2020-07-05T04:02:37.298Z',
            updated_at: '2020-07-26T13:35:11.512Z',
            favourite: false
          },
          showSignalName: false,
          showSignalUnits: true,
          tile: {
            id: 11,
            left: 6,
            top: 1,
            width: null,
            height: null,
            caption: 'Max',
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 8,
          signal: {
            id: 20,
            name: 'Inverter t',
            units: 'DegC',
            category: null,
            mnemonic: 'DI_inverterT',
            created_at: '2020-07-03T15:28:31.006Z',
            updated_at: '2020-07-26T14:16:41.048Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 12,
            left: 6,
            top: 2,
            width: null,
            height: null,
            caption: 'Inverter Temp',
            style: 'floating',
            icon: null,
            displayType: 'slab'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 9,
          signal: {
            id: 21,
            name: 'Stator t',
            units: 'DegC',
            category: null,
            mnemonic: 'DI_statorT',
            created_at: '2020-07-03T15:28:31.117Z',
            updated_at: '2020-07-26T14:16:41.039Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 13,
            left: 2,
            top: 2,
            width: null,
            height: null,
            caption: 'Stator Temp',
            style: 'floating',
            icon: null,
            displayType: 'slab'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 10,
          signal: {
            id: 54,
            name: 'Oil pump flow actual',
            units: 'LPM',
            category: null,
            mnemonic: 'DI_oilPumpFlowActual',
            created_at: '2020-07-26T14:21:49.424Z',
            updated_at: '2020-08-12T00:51:52.256Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 14,
            left: 6,
            top: 4,
            width: null,
            height: null,
            caption: 'Oil Flow',
            style: 'floating',
            icon: null,
            displayType: 'slab'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 11,
          signal: {
            id: 56,
            name: 'Oil pump fluid t',
            units: 'DegC',
            category: null,
            mnemonic: 'DI_oilPumpFluidT',
            created_at: '2020-07-26T14:28:19.865Z',
            updated_at: '2020-08-12T00:51:52.297Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 15,
            left: 8,
            top: 4,
            width: null,
            height: null,
            caption: 'Oil Temp',
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 12,
          signal: {
            id: 94,
            name: 'Torque command',
            units: 'Nm',
            category: null,
            mnemonic: 'DI_torqueCommand',
            created_at: '2020-08-12T12:53:43.905Z',
            updated_at: '2020-08-12T13:16:09.704Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 16,
            left: 1,
            top: 4,
            width: null,
            height: null,
            caption: 'Torque',
            style: 'floating',
            icon: null,
            displayType: 'slab'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 13,
          signal: {
            id: 95,
            name: 'Torque actual',
            units: 'Nm',
            category: null,
            mnemonic: 'DI_torqueActual',
            created_at: '2020-08-12T12:53:43.921Z',
            updated_at: '2020-08-12T13:16:09.783Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 17,
            left: 3,
            top: 4,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        }
      ]
    },
    {
      id: 3,
      name: 'Autopilot',
      icon: 'paper plane',
      created_at: '2020-08-20T17:56:44.618Z',
      updated_at: '2020-08-20T18:16:52.843Z',
      columns: 6,
      rows: 8,
      tiles: [
        {
          __component: 'tile-components.signal-tile',
          id: 14,
          signal: {
            id: 60,
            name: 'Virtual lane c0',
            units: 'm',
            category: null,
            mnemonic: 'DAS_virtualLaneC0',
            created_at: '2020-08-05T16:47:34.584Z',
            updated_at: '2020-08-20T19:15:27.782Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 18,
            left: 2,
            top: 1,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'hero'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 15,
          signal: {
            id: 57,
            name: 'Virtual lane c1',
            units: 'rad',
            category: null,
            mnemonic: 'DAS_virtualLaneC1',
            created_at: '2020-07-29T01:10:21.495Z',
            updated_at: '2020-08-20T19:15:28.094Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 19,
            left: 4,
            top: 1,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'hero'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 16,
          signal: {
            id: 86,
            name: 'Steering angle',
            units: 'deg',
            category: null,
            mnemonic: 'SCCM_steeringAngle',
            created_at: '2020-08-12T00:55:23.705Z',
            updated_at: '2020-08-20T18:41:03.439Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 20,
            left: 2,
            top: 3,
            width: null,
            height: null,
            caption: 'Steering',
            style: 'floating',
            icon: null,
            displayType: 'slab'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 17,
          signal: {
            id: 88,
            name: 'Steering angle speed',
            units: 'deg/s',
            category: null,
            mnemonic: 'SCCM_steeringAngleSpeed',
            created_at: '2020-08-12T00:55:23.725Z',
            updated_at: '2020-08-20T18:41:03.513Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 21,
            left: 4,
            top: 3,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 21,
          signal: {
            id: 58,
            name: 'Autopilot hands on state',
            units: '',
            category: null,
            mnemonic: 'DAS_autopilotHandsOnState',
            created_at: '2020-08-01T18:20:49.194Z',
            updated_at: '2020-08-20T18:41:27.384Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 25,
            left: 5,
            top: 3,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 18,
          signal: {
            id: 10,
            name: 'Brake Light',
            units: '',
            category: 2,
            mnemonic: 'VCLEFT_brakeLightStatus',
            created_at: '2020-06-27T19:51:16.073Z',
            updated_at: '2020-07-08T22:20:28.307Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 22,
            left: 2,
            top: 4,
            width: null,
            height: null,
            caption: 'Braking',
            style: 'floating',
            icon: null,
            displayType: 'slab'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 19,
          signal: {
            id: 98,
            name: 'Brake torque f l',
            units: 'Nm',
            category: null,
            mnemonic: 'ESP_brakeTorqueFL',
            created_at: '2020-08-12T21:23:03.704Z',
            updated_at: '2020-08-20T18:41:03.650Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 23,
            left: 4,
            top: 4,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 20,
          signal: {
            id: 99,
            name: 'Brake torque r l',
            units: 'Nm',
            category: null,
            mnemonic: 'ESP_brakeTorqueRL',
            created_at: '2020-08-12T21:23:03.728Z',
            updated_at: '2020-08-20T18:41:03.771Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 24,
            left: 5,
            top: 4,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        }
      ]
    },
    {
      id: 4,
      name: 'Track',
      icon: 'road',
      created_at: '2020-08-20T21:32:27.387Z',
      updated_at: '2020-08-20T21:32:27.387Z',
      columns: 8,
      rows: 8,
      tiles: [
        {
          __component: 'tile-components.signal-tile',
          id: 22,
          signal: {
            id: 114,
            name: 'Temperature f l',
            units: 'degC',
            category: null,
            mnemonic: 'TPMS_temperatureFL',
            created_at: '2020-08-20T19:15:27.327Z',
            updated_at: '2020-11-02T06:14:54.154Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 27,
            left: 2,
            top: 2,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 23,
          signal: {
            id: 116,
            name: 'Temperature f r',
            units: 'degC',
            category: null,
            mnemonic: 'TPMS_temperatureFR',
            created_at: '2020-08-20T19:15:27.363Z',
            updated_at: '2020-11-02T06:14:54.175Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 28,
            left: 7,
            top: 2,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 24,
          signal: {
            id: 118,
            name: 'Temperature r l',
            units: 'degC',
            category: null,
            mnemonic: 'TPMS_temperatureRL',
            created_at: '2020-08-20T19:15:27.372Z',
            updated_at: '2020-11-02T06:14:54.320Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 29,
            left: 2,
            top: 6,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.signal-tile',
          id: 25,
          signal: {
            id: 120,
            name: 'Temperature r r',
            units: 'degC',
            category: null,
            mnemonic: 'TPMS_temperatureRR',
            created_at: '2020-08-20T19:15:27.651Z',
            updated_at: '2020-11-02T06:14:54.197Z',
            favourite: false
          },
          showSignalName: true,
          showSignalUnits: true,
          tile: {
            id: 30,
            left: 7,
            top: 6,
            width: null,
            height: null,
            caption: null,
            style: 'floating',
            icon: null,
            displayType: 'pill'
          }
        },
        {
          __component: 'tile-components.tile',
          id: 26,
          left: 1,
          top: 1,
          width: null,
          height: null,
          caption: 'Tires',
          style: 'inset',
          icon: null,
          displayType: null
        }
      ]
    }
  ]
}