import gulp from 'gulp'
import del from 'del'
import htmlmin from 'gulp-htmlmin'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import imagemin from 'gulp-imagemin'
import sourcemaps from 'gulp-sourcemaps'
import fs from 'fs'
import through from 'through2'
import named from 'vinyl-named'
import webpack from 'webpack-stream'
import replace from 'gulp-replace'
import phpMinify from '@cedx/gulp-php-minify'
const sass = gulpSass(dartSass)
let packageJson
let envJson

const paths = {
  root: {
    php: {
      src: 'src/**/*.php',
      dest: 'dist/'
    },
    html: {
      src: 'src/*.html',
      dest: 'dist/'
    },
    img: {
      src: 'src/img/*'
    }
  },
  public: {
    img: {
      dest: 'dist/public/img/'
    },
    scss: {
      src: 'src/*.scss',
      dest: 'dist/public/'
    }
  },
  dash: {
    js: {
      src: 'src/dash/app.js',
      dest: 'dist/dash/'
    },
    img: {
      dest: 'dist/dash/img/'
    },
    scss: {
      src: ['src/*.scss', 'src/dash/*.scss'],
      dest: 'dist/dash/'
    }
  }
}

// Get Package information from package.json
async function getPackageInfo () {
  packageJson = JSON.parse(fs.readFileSync('package.json'))
  envJson = JSON.parse(fs.readFileSync('dist/.env.json'))
  return Promise.resolve()
}

// Wipe the dist directory
export async function clean () {
  return del(['dist/public/', 'dist/dash/', 'dist/*.php', 'dist/*.html'])
}

// Minify PHP
async function php () {
  return gulp.src(paths.root.php.src, { read: false })
    .pipe(phpMinify({ silent: true }))
    .pipe(gulp.dest(paths.root.php.dest))
}

// Minify HTML
async function html () {
  return gulp.src(paths.root.html.src)
    .pipe(replace('{{public-domain}}', envJson['public-domain']))
    // .pipe(replace('{{link-to-dash}}', (envJson['link-to-dash'] ? '<p><small><a href="https://' + envJson['dash-domain'] + '">Manage</a></small></p>' : '')))
    .pipe(replace('{{link-to-dash}}', ''))
    .pipe(
      htmlmin({
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        includeAutoGeneratedTags: false,
        minifyURLs: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      })
    )
    .pipe(gulp.dest(paths.root.html.dest))
}

// Minify JavaScript
async function js () {
  return gulp.src(paths.dash.js.src)
    .pipe(named())
    .pipe(
      webpack({
        devtool: 'source-map',
        mode: 'production',
        module: {
          rules: [
            {
              test: /\.js$/i,
              loader: 'string-replace-loader',
              options: {
                multiple: [
                  { search: '{{package_name}}', replace: packageJson.name },
                  { search: '{{package_version}}', replace: packageJson.version }
                ]
              }
            }
          ]
        }
      })
    )
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      through.obj(function (file, enc, cba) {
        // Dont pipe through any source map files. They will be handled by gulp-sourcemaps.
        if (!/\.map$/.test(file.path)) {
          this.push(file)
        }
        cba()
      })
    )
    .pipe(sourcemaps.write('.', { addComment: false }))
    .pipe(gulp.dest(paths.dash.js.dest))
}

// Compile SCSS
async function scssPublic () {
  return gulp.src(paths.public.scss.src)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest(paths.public.scss.dest))
}
async function scssDash () {
  return gulp.src(paths.dash.scss.src)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest(paths.dash.scss.dest))
}

// Compress images
async function img () {
  return gulp.src(paths.root.img.src)
    .pipe(imagemin([imagemin.svgo()]))
    .pipe(gulp.dest(paths.public.img.dest))
    .pipe(gulp.dest(paths.dash.img.dest))
}

// Watch for changes
function watchSrc () {
  console.warn('Watching for changes... Press [CTRL+C] to stop.')
  gulp.watch(paths.root.php.src, php)
  gulp.watch(paths.root.html.src, html)
  gulp.watch(paths.public.scss.src, scssPublic)
  gulp.watch(paths.dash.scss.src, scssDash)
  gulp.watch(paths.root.img.src, img)
  gulp.watch(paths.dash.js.src, js)
}

export default gulp.series(
  getPackageInfo,
  js,
  img,
  scssPublic,
  scssDash,
  php,
  html
)

export const watch = gulp.series(getPackageInfo, watchSrc)
