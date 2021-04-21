This project is a React web app designed to be run on a Tesla Model 3/Y center screen.
It displays live CAN bus data from the car, without any unsightly wires or auxiliary
display.

It does this by hooking into the car's CAN bus under the rear console using a
Macchina M2 and custom firmware ([onyx-m2-firmware](https://github.com/johnmccalla/tesla-onyx-m2-firmware)), which uses your phone's hotspot to connect to the
[onyx-m2-server](https://github.com/johnmccalla/tesla-onyx-m2-server), which this app
connects to using the car's wireless connection (so it requires premium connectivity).

## Usage

The dashboard's home panel is a configurable grid of signals widgets. You may add and remove them using the signal, resize them, and move them around the display.

![Alt text](docs/favourites.png?raw=true "Favourites")

The signal viewer allows you to navigate all available signals and tap the ones you
want added to the favourites panel.

![Alt text](docs/signals.png?raw=true "Signals")

To navigate between panels, drag the main panel left to reveal the navigation menu.

![Alt text](docs/navmenu.png?raw=true "Nav Menu")

Additional "preset" panels may be added by modifying the grids in the `content` folder.
The following preset grids are provided:

  - `battery` Displays total pack energy, voltages, current, max temperature, and
    a large sampling of individual brick voltages
  - `drivetrain` Displays information about the drive inverter and motor
  - `autopilot` Displays information about the state of autopilot, and shows how
    its doing with lane keeping (the hero tiles), steering, braking, and torque control
  - `track` Displays information you'd want at the track, g-pad data, temps, etc

## Design

The interface is designed to resemble the Tesla UI. It used the same fonts and similar
styling, in both day and night mode. The background is designed to appear to be part of
browser's frame to give a seamless look.

## Installing

Clone the repo and install.

```
  git clone git@github.com:onyx-m2/onyx-m2-dashboard.git
  cd onyx-m2-dashboard
  npm install
```

The app is a standard `create-react-app` project, so everything works as you'd expect.
To run locally in development mode:

```
  npm start
```

To build a production version (that has service workers enabled for offline use and fast
loading)

```
  npm run build
```

To serve locally, use `serve` by doing `npm install -g serve` once, and
then `serve -s build`.

Upon first run, you'll be asked to configure the app. It needs an instance of the
Onyx M2 server to connect to, and its pin.

Of course, for the car to be able to connect to the app, it needs to be available on
the public internet. I recommend using `ngrok` for local development, although be
warned you'll need two tunnels (one for this app and one for the server).

## Deployment

There are many options that work well for this, as this is a `create-react-app`, and
builds out of the box with easy-to-use services such as `AWS Amplify` and
`Digital Ocean Static Apps`.

If you'd like to run off of my instance (it'll always reflect what's in the `main`
branch), please feel to so by simply pointing your browser at
https://dashboard.onyx-m2.net and configure it to use your canbus server instance.