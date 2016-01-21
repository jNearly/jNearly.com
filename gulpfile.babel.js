import gulp from 'gulp';

import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';

import babelify from 'babelify';
import browserify from 'browserify';
import fs from 'fs';

import generateDocsPlugin from './gulp/generateDocs';

var browserSync = require('browser-sync').create();

function css() {
	return gulp.src('app/assets/css/styles.css')
		.pipe(postcss([ autoprefixer(['last 2 versions', '> 5%']), postcssImport ]))
		.pipe(gulp.dest('app/assets/build'))
		.pipe(browserSync.stream());
}

function js() {
	let bundler = browserify({
		entries: 'app/assets/js/app.js',
		debug: true,
		transform: [babelify]
	});

	return bundler.bundle()
		.pipe(fs.createWriteStream('app/assets/build/app.js'));
}

function generateDocs() {
	return gulp.src('node_modules/jNearly/src/**/*.js')
		.pipe(generateDocsPlugin())
		.pipe(gulp.dest('app'));
}

gulp.task(css);
gulp.task(js);
gulp.task(generateDocs);

gulp.task('default', gulp.parallel(css, js, generateDocs));

if (process.argv.indexOf('--watch') !== -1) {
	gulp.watch('./app/assets/css/**/*.css', css);
	gulp.watch(['./app/assets/js/*.js', 'node_modules/jNearly/dist/jnearly.js'], js);
	gulp.watch(['./src/**/*.js', './templates/*.html'], generateDocs);

	browserSync.init({
		server: {
			baseDir: './app'
		}
	});

	gulp.watch(['app/assets/build/app.js', 'app/index.html'], function () {
		browserSync.reload();
	});
}
