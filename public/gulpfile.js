// Defining base paths
var basePaths = {
  bower: './bower_components/',
  nodemodules: './node_modules/',
  dev: './src/',
  distCss: './css/',
  distJs: './js/',
  components: './components/'
};

// Define vendors and utilities
var fs = require('fs'),
    forEach = require('lodash.foreach');

// Config Browser-Sync
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var browserSyncOptions = {
    proxy: "localhost/TecnologiasWeb/public/index.html",
    notify: false
};

var browserSyncWatchFiles = [
    './src/css/**/**',
    './src/js/**/**',
    './*.html'
];

browserSync.init(browserSyncWatchFiles, browserSyncOptions);

var gulp = require('gulp');
var rename = require("gulp-rename");

// Vendors
var vendors = [
    {
      name: 'jQuery',
      js: {
        path: '/dist/jquery.min.js'
      },
      provider: 'bower_components'
    },
    {
      name: 'systemjs',
      js: {
        path: '/dist/system.js'
      },
      provider: 'node_modules'
    },
    {
      name: 'ed-grid',
      js: {
        path: '/dist/js/materialize.min.js'
      },
      css: {
        dev: true,
        src: '/scss/**/**',
        file: 'styles',
        newFile: 'ed-grid.css'
      },
      provider: 'bower_components'
    },
    {
      name: 'materialize',
      js: {
        path: '/dist/js/materialize.min.js'
      },
      css: {
        dev: true,
        src: '/sass/**/**',
        file: 'materialize'
      },
      provider: 'bower_components'
    },
    {
      name: 'css-hamburgers',
      css: {
        dev: true,
        src: '/_sass/hamburgers/**/**',
        file: 'hamburgers'
      },
      provider: 'bower_components'
    },
    {
      name: 'Swiper',
      js: {
        path: '/dist/js/swiper.min.js'
      },
      css: {
        path: '/dist/css/swiper.min.css'
      },
      provider: 'bower_components'
    },
    {
      name: 'lodash.foreach',
      js: {
        path: '/index.js'
      },
      provider: 'node_modules'
    },
    {
      name: 'normalize-css',
      css: {
        path: '/normalize.css'
      },
      provider: 'bower_components'
    }
  ];

  gulp.task('copy-vendors-files', function() {
      forEach(vendors, function( item, index ) {
        var pathBase = '';

        if( item.provider == 'bower_components' ){
          pathBase = basePaths.bower;
        }
        else{
          pathBase = basePaths.nodemodules;
        }

        if( typeof item.js != 'undefined' ){
          var jsoptions = item.js;

          gulp.src( pathBase + item.name + '/' + item.js.path )
              .pipe( gulp.dest(basePaths.components + item.name) );

          if( typeof jsoptions.supportTS != 'undefined' ){
            // Rename path file for typescript
          }
        }

        if( typeof item.css != 'undefined' ){
          var cssoptions = item.css;

          gulp.src( pathBase + item.name + '/' + item.css.path )
              .pipe( gulp.dest(basePaths.components + item.name) );

          if( typeof cssoptions.dev != 'undefined' ){
            (function( basePaths, item, cssoptions ){
              fs.stat(basePaths.dev + 'css/packages/' + item.name + '/' + cssoptions.file, function( err, stat ) {
                  if( err != null ) {
                    gulp.src(basePaths.bower + item.name + item.css.src)
                        .pipe(gulp.dest(basePaths.dev + 'css/packages/' + item.name));
                  }
              });
            }( basePaths, item, cssoptions ) )
          }
        }
      });
  });

  var sass = require('gulp-sass');

  gulp.task('css-packages-dev', function () {
    forEach(vendors, function( item, index ) {
      if( typeof item.css != 'undefined' ){
        var cssoptions = item.css;

        if( typeof cssoptions.dev != 'undefined' ){
          if(typeof cssoptions.newFile == 'undefined'){
            gulp.src( basePaths.dev + 'css/packages/' + item.name + '/' + cssoptions.file + '.scss' )
                .pipe( sass().on('error', sass.logError) )
                .pipe( gulp.dest(basePaths.distCss) );
          }
          else{
            gulp.src( basePaths.dev + 'css/packages/' + item.name + '/' + cssoptions.file + '.scss' )
                .pipe( sass().on('error', sass.logError) )
                .pipe( rename(cssoptions.newFile) )
                .pipe( gulp.dest(basePaths.distCss) );
          }
        }
      }
    });
  });

// PostCSS
  var postcss = require('gulp-postcss');
  var autoprefixer = require('autoprefixer');
  var partialImport = require('postcss-partial-import')({ /* options */ });
  var inlineComment = require('postcss-inline-comment');
  var precss = require('precss'); //use Sass-like markup in your CSS files
  var sourcemaps = require('gulp-sourcemaps');

  gulp.task('css', function () {
      gulp.src( basePaths.dev + 'css/*.css' )
          .pipe( sourcemaps.init() )
          .pipe( postcss([ partialImport, autoprefixer, precss ]) )
          .pipe( sourcemaps.write('.') )
          .pipe( gulp.dest(basePaths.distCss) )
          .pipe(reload({stream: true}));
  });

// TypeScript
  var ts = require("gulp-typescript");
  var tsProject = ts.createProject("tsconfig.json");

  gulp.task("scripts", function () {
      return tsProject.src()
          .pipe( ts(tsProject) )
          .js.pipe( gulp.dest("./" + tsProject.options.outDir) )
          .pipe(reload({stream: true}));
  });

// Watch
  gulp.task('watch', function () {
    gulp.watch( basePaths.dev + 'css/**/*.css', ['css']);
    gulp.watch( basePaths.dev + 'js/**/*.ts', ['scripts']);
  });

// Default
gulp.task('default', ['copy-vendors-files', 'css-packages-dev', 'css', 'scripts', 'watch']);
