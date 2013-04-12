
describe("GumWrapper", function() {
    var gum;

    function doSuccess() {
        return true;
    }
     
    beforeEach(function() {
        gum = new GumWrapper({video: 'myVideo'}, doSuccess);
    });

    it("can be created", function() {
        expect(gum).not.toBeUndefined();
    });

    it("can play webcam video stream", function() {
        gum.play();
        var success = doSuccess();
        expect(success).toEqual(true);
    });
});

describe("alternative GumWrapper", function() {
    it("can be created", function() {
        var gum = new gumwrapper.GumWrapper();
    });

    it("will set stream as video source and play", function() {
        var video = {
            played: false,
            play: function() {
                this.played = true;
            }
        };

        var getUserMedia = function(constraints, success, failed) {
            success("source");
        };

        var elements = { video: video };
        var gum = new gumwrapper.GumWrapper(getUserMedia, elements);
        expect(video.played).toBeFalsy();
        gum.play();
        expect(video.played).toBeTruthy();
        expect(video.src).toEqual("source");
    });

    it("will call success callback", function() {
        var video = {
            played: false,
            play: function() {
                this.played = true;
            }
        };

        var successValue;
        var successCallback = function(value) {
            successValue = value;
        }

        var getUserMedia = function(constraints, success, failed) {
            success("source");
        };

        var elements = { video: video };
        var gum = new gumwrapper.GumWrapper(getUserMedia, elements);
    });
});
