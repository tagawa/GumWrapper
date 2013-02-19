
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
