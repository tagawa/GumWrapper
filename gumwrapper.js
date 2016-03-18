/*!
 * GumWrapper v0.14
 * By Daniel Davis under MIT License
 * https://github.com/tagawa/GumWrapper
 */

; GumWrapper = (function (window, document) {
    'use strict';

    var GumWrapper = function GumWrapper(options, success, error) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

        this.video = null;
        this.options = options || {};
        this.options.constraints = this.options.constraints || {
            audio: false,
            video: true
        };
        this.success = success;
        this.error = error;
        this.isGetUserMediaAvailable = !!(navigator.getUserMedia || (navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
    };

    // Define our error message
    GumWrapper.prototype.sendError = function sendError(message) {
        if (this.error) {
            var e = new Error();
            e.message = message;
            this.error(e);
        } else {
            console.error(message);
        }
    };

    // Try to play the media stream
    GumWrapper.prototype.play = function play() {
        var that = this;
        this.video = this.options.video && this.options.video.nodeName === "VIDEO" ?
            this.options.video :
            document.getElementById(this.options.video);
        if (!this.video) {
            this.sendError('Unable to find the video element.');
            return;
        }


        function successCallback(stream) {
            that.stream = stream;
            // Set the source of the video element with the stream from the camera
            if ('srcObject' in that.video) {
                that.video.srcObject = stream;
            } else if ('mozSrcObject' in that.video) {
                that.video.mozSrcObject = stream;
            } else {
                that.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
            }
            
            if (that.video.paused) {
                try {
                    that.video.play();
                } catch (e) {
                    if (!that.video.autoplay) {
                        that.video.autoplay = true;
                        that.video.srcObject = that.video.srcObject;
                    }
                }
            }
        }

        function errorCallback(error) {
            that.sendError('Unable to get webcam stream.');
        }

        // Call the getUserMedia method with our callback functions
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(this.options.constraints).then(successCallback, errorCallback);
        } else if (navigator.getUserMedia) {
            navigator.getUserMedia(this.options.constraints, successCallback, errorCallback);
        } else {
            that.sendError('Native web camera streaming (getUserMedia) not supported in this browser.');
        }

        // Check the video dimensions when data has loaded
        this.onloadeddata = function onloadeddata() {
            var attempts = 10;

            function checkVideo() {
                if (attempts > 0) {
                    if (that.video.videoWidth > 0 && that.video.videoHeight > 0) {
                        // Execute success callback function
                        if (that.success) {
                            that.success(that.video);
                        }
                    } else {
                        // Wait a bit and try again
                        window.setTimeout(checkVideo, 500);
                    }
                } else {
                    // Give up after 10 attempts
                    that.sendError('Unable to play video stream. Is webcam working?');
                }
                attempts--;
            }

            checkVideo();
        };
        this.video.addEventListener('loadeddata', this.onloadeddata, false);
    };

    GumWrapper.prototype.stop = function stop() {
        if (!this.video) {
            return;
        }

        if (this.onloadeddata) {
            this.video.removeEventListener('loadeddata', this.onloadeddata, false);
            this.onloadeddata = null;
        }

        this.video.pause();
        try {
            if (this.video.srcObject) {
                this.video.srcObject = null;
            }
            if (this.video.mozSrcObject) {
                this.video.mozSrcObject = null;
            }
        } catch (e) { }
        this.video.src = null;

        if (this.stream) {
            var tracks = this.stream.getTracks();
            for (var i = 0, len = tracks.length; i < len ; i++) {
                var track = tracks[i];
                track.stop();
                if (track.enabled) {
                    track.enabled = false;
                }
            }
            this.stream = null;
        }

        this.video = null;
    };

    return GumWrapper;
})(window, document);
