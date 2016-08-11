System.register(['./Courses/Courses.ts'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Courses_ts_1;
    var courses, App;
    return {
        setters:[
            function (Courses_ts_1_1) {
                Courses_ts_1 = Courses_ts_1_1;
            }],
        execute: function() {
            courses = new Courses_ts_1.Courses();
            App = (function () {
                function App() {
                }
                return App;
            }());
        }
    }
});
