describe("Platform", function() {
    "use strict";
    it("has native camera support", function() {
        var gotVideo = false;
        var failed = false;

        var mysuccessfunc = function() {
            gotVideo = true;
        };

        var myerrorfunc = function(e) {
            failed = e;
        };

        gumwrapper.platformGetUserMedia({video:true}, mysuccessfunc, myerrorfunc);

        waitsFor(function() {
            return gotVideo || failed;
        }, "Timeout waiting for stream", 20000);

        runs(function() {
            expect(failed).toBeFalsy();
            expect(gotVideo).toBeTruthy();
        });
    });
});
