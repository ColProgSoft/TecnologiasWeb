/// <reference path="../../../typings/modules/jquery/jquery.d.ts" />

export class Courses{
  constructor(){
    this.getCourses();
  }

  getCourses(){
    $.post( '../../api/courses.json', function( data ) {
      console.log(data)
    });
  }
}
