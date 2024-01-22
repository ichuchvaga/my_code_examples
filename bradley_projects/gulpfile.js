"use strict";

// Load plugins
const gulp = require("gulp");
const pug = require("gulp-pug");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const svgSprite = require('gulp-svg-sprite');
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const gulpif = require("gulp-if");
const errorHandler = require("./util/handle-errors.js");
const notify = require("gulp-notify");

let isDev = true;
let isProd = !isDev;

// Task to Build HTML
function html() {
  return gulp.src("./src/templates/pages/*.pug")
      .pipe(plumber({
          errorHandler: errorHandler
      }))
      .pipe(pug({
          pretty: true
      }))
      .pipe(gulp.dest("./build/"))
      .pipe(browserSync.stream());
}

// Task to Compile Sass
function styles() {
  return gulp.src(["./src/sass/style.sass"])
      .pipe(sass({
          outputStyle: "expanded"
      }).on("error", notify.onError()))
      .pipe(autoprefixer({
          Browserslist: ["> 0.1%"],
          cascade: false
      }))
      .pipe(gulpif(isProd, cleanCSS({
          level: 2
      })))
      .pipe(gulp.dest("./build/src/css"))
      .pipe(browserSync.stream());
}

// Task to scripts
function scripts() {
  return gulp.src("./src/js/**/*.js")
      .pipe(gulp.dest("./build/src/js"))
      .pipe(browserSync.stream());
}

// Task to Watch Templates Changes and Styles
function watch() {
  browserSync.init({
      server: {
          baseDir: "./build/",
        index: "projects.html"
      }
  });

  gulp.watch("./src/sass/**/*.s+(ass|css)", gulp.parallel(styles));
  gulp.watch("./src/templates/**/*.pug", gulp.parallel(html));
  //gulp.watch("./src/js/**/*.js", gulp.parallel(scripts));
}

// Task to Clean
/*function clean() {
  return del(["build/*"]);
}*/

// Define complex tasks
const build = gulp.series(
  //clean,
  gulp.parallel(
      html,
      styles,
      //scripts,
      //svg,
      //images,
      //fonts
  )
);

const dev = gulp.series(
  build,
  watch
);

// Export tasks
exports.html = html;
//exports.fonts = fonts;
exports.styles = styles;
//exports.scripts = scripts;
//exports.svg = svg;
//exports.images = images;
exports.watch = watch;

exports.build = build;
exports.default = dev;