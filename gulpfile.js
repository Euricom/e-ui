var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    rimraf = require('rimraf'),
    config = {
        dist: 'dist',
        browsers: ['last 2 versions'],
        scripts: '/js/*.js',
        style_entry: './src/style.scss',
        styles: './src/**/*.scss',
        images: '/img/{,*/}*.{png,jpg,jpeg,gif,svg}'
    };

/* ------------------------------------------------------ */
/* lint - sourcemaps - sass - autoprefix - clean(minify)  */
/* ------------------------------------------------------ */
gulp.task('sass', function() {
    return gulp.src(config.style_entry)
        .pipe($.plumber())
        .pipe($.sourcemaps.init({ debug: true }))
        .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError)) // compact
        .pipe($.concat('main.css'))
        .pipe($.sourcemaps.write('../.maps')) //rel to final .dest path
        .pipe(gulp.dest(config.dist + '/css'))
});

/* -------------------------- */
/* Watch edits on sass- files */
/* -------------------------- */
gulp.task('watch', function() {
    gulp.watch(config.styles, ['sass', 'styledown']);
    // gulp.watch(config.scripts, ['jslint']);
    // gulp.watch(config.images, ['images']);
});

/* ------- */
/* Default */
/* ------- */
gulp.task('default', ['scsslint', 'sass', 'styledown', 'show-styledown'], function() {
    gulp.start('watch');
});

/* --------- */
/* StyleDown */
/* --------- */
gulp.task('styledown', function() {
    gulp.src('./src/**/*.scss')
        .pipe($.plumber())
        .pipe($.styledown({ config: 'sd_config.md', filename: 'index.html'}))
        .on('end', function(){ console.log($.styledown); })
        .pipe(gulp.dest('./dist'));
});

gulp.task('show-styledown', function() {
    gulp.src('./dist/index.html')
        .pipe($.open());
});

/* ------------ */
/* Scss linting */
/* ------------ */
gulp.task('scsslint', function() {
    return gulp.src([config.styles, '!./src/common/normalize.scss'])
        .pipe($.scssLint({ 'config': 'scsslint.yml' }))
});
