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

## Design

The interface is designed to resemble the Tesla UI. It used the same fonts and similar
styling, in both day and night mode. The background is designed to appear to be part of
browser's frame to give a seamless look.

## Installing

Clone the repo and install.

```
  git clone git@github.com:johnmccalla/onyx-m2-dashboard.git
  cd onyx-m2-dashboard
  npm install
```

Next configure the app by creating a `.env` file.

```
PORT=4000
REACT_APP_M2_SECURE=false
REACT_APP_M2_HOSTNAME=localhost:8080
REACT_APP_M2_AUTHORIZATION=XXX
```

The `M2_HOSTNAME` is the hostname of the Onyx M2 Server to connect to, and `M2_SECURE`
determines if you'll connect using SSL, which is more and more of a requirement but
awkward for local development. The `M2_AUTHORIZATION` is a shared secret between the
firmware, server, and app allowing every component to authenticate. (This could be
improved.)

Of course, for the car to be able to connect to the app, it needs to be available on
the public internet. I recommend using `ngrok` for local development, although be
warned you'll need two tunnels (one for this app and one for the server).

Once all this is done, start the app

```
  npm start
```

I highly recommend running a production build in the car itself, see deployment section
for suggestions on how to do this.

## Deployment

I currently use `AWS Amplitude` for deployment, and am really happy with it. It pretty
much handles everything and can hook up to the GitHub repo for auto-deploying.

TODO: provide step by step instructions

If you'd rather server locally, use `serve` by doing `npm install -g serve` once, and
then build and serve the app.

```
  npm run build
  serve -s build -l 4000
```

Note that the app was created with `create-react-app`, so any deployment tool that
supports this very popular tooling should be compatible.
