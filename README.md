#GumWrapper

## Introduction

A wrapper for getUserMedia, enabling easy cross-browser support for webcam access with JavaScript.

## Usage

First, create a new instance of `GumWrapper`, providing the id of a video element. The success and error callback arguments are optional.

    var gum = new GumWrapper({video: 'myVideo'}, showSuccess, showError);

Call the play method and you should be good to go!

    gum.play();

Open `example.html` to see the markup or [here's a demo](https://tagawa.github.io/GumWrapper/example.html) to see it in action.

## Dependencies

- The latest Firefox, Opera or Chrome/Chromium. N.b. if using Firefox 18 or 19, `media.peerconnection.enabled` needs to be set to `true` in `about:config`
- JavaScript turned on - note no other libraries required.

## License

Licensed under the MIT license.
