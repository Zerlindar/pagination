/**
 * Created by Administrator on 2016/2/21.
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    ngMin = require('gulp-ngmin'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    //sass = require('gulp-sass'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    //livereload = require('gulp-livereload'),
    open = require('gulp-open'),
    stripDebug = require('gulp-strip-debug');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
const config={
  JS_WATCH:['./assets/js/*.js','./module/*/*.js'],
  LESS_WATCH:['./assets/less/*.less','./module/*/*.less', './assets/less/*.css'],
  JS_PATH:[
    'bower_components/moment/moment.js',
    'bower_components/moment/locale/zh-cn.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/alertifyjs/dist/js/ngAlertify.js'
  ],
  CSS_PATH:[
    'bower_components/alertifyjs/dist/css/alertify.css',
  ],
  JS_CLEAR:[
    "dist/*.js"
  ],
  CSS_CLEAR: [
    "dist/*.css"
  ]
}

//帮助
gulp.task('help',function(){

    console.log('	gulp			    文件变动监控打包');

    console.log('	gulp help			gulp参数说明');

    console.log('	gulp sass			编译sass');

    console.log('	gulp sass-min			编译压缩sass');

})
gulp.task("clean", function(){
  gulp.src(config.JS_CLEAR)
    .pipe(clean());
  gulp.src(config.CSS_CLEAR)
    .pipe(clean());
})
//插件相关打包压缩->固定插件执行一次
gulp.task('min',function(){
  gulp.src(config.JS_PATH)
    .pipe(uglify({outSourceMap:false}))
    .pipe(stripDebug())  //console
    .pipe(uglify({outSourceMap:false}))
    .pipe(concat('plugin.min.js'))
    .pipe(gulp.dest('./dist'));
  gulp.src(config.CSS_PATH)
    .pipe(sourcemaps.init())
    .pipe(concat('plugin.min.css'))
    .pipe(minifycss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
})

//生产环境输出
gulp.task('p',['angular-min', 'less-min']);
//默认开发环境
gulp.task('default',['watch-angular', 'watch-less']);
//监视编译angular
gulp.task('watch-angular',function(){
  console.log("编译js中...")
    gulp.watch(config.JS_WATCH,['angular'])
})
//监视less
gulp.task('watch-less',function(){
  gulp.watch(config.LESS_WATCH,['less']);
})
//less编译，普通版（未压缩）
gulp.task('less',function(){
  gulp.src(config.LESS_WATCH)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(gulp.dest('./src/css'))
    .pipe(concat('production.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
})
//less编译，压缩版
gulp.task('less-min',function(){
  gulp.src(config.LESS_WATCH)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(gulp.dest('./src/css'))
    .pipe(minifycss())
    .pipe(concat('production.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
})

//angular 编译-合并
gulp.task('angular',function(){
    gulp.src(config.JS_WATCH)
        .pipe(ngAnnotate())
        .pipe(concat('controller.js'))
        .pipe(gulp.dest('./dist'))
})
//angular 编译合并压缩
gulp.task('angular-min',function(){
    gulp.src(config.JS_WATCH)
        .pipe(ngAnnotate())
        .pipe(ngMin({dynamic:false}))
        .pipe(stripDebug())  //console
        .pipe(uglify({outSourceMap:false}))
        .pipe(concat('controller.min.js'))
        .pipe(gulp.dest('./dist'))
  console.log("编译js结束.")

})
