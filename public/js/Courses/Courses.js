/// <reference path="../../../typings/modules/jquery/jquery.d.ts" />
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Courses;
    return {
        setters:[],
        execute: function() {
            Courses = (function () {
                function Courses() {
                    this.getCourses();
                }
                Courses.prototype.getCourses = function () {
                    $.post('../../api/courses.json', function (data) {
                        console.log(data);
                    });
                };
                return Courses;
            }());
            exports_1("Courses", Courses);
        }
    }
});
