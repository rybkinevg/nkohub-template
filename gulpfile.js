const { src, dest, parallel, series, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const fileinclude = require('gulp-file-include');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const svgSprite = require('gulp-svg-sprite');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const tiny = require('gulp-tinypng-compress');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revdel = require('gulp-rev-delete-original');
const htmlmin = require('gulp-htmlmin');

/**
 * Генерация путей до файлов
 */

/**
 * Функция генерации путей
 *
 * @param dev (название папки исходников)
 * @param build (название папки сборки)
 * @param sub = undefined (название подпапки в исходниках)
 * @return объект с выстроенными путями
 */

const generatePath = (dev, build, sub = null) => {

    const path = {
        src: {},
        dest: {},
        watch: {}
    };

    // Названия папок
    path.devName = dev;
    path.buildName = build;

    // Путь до папок
    path.dev = `./${path.devName}`;
    path.build = `./${path.buildName}`;
    path.sub = (sub !== null) ? (`/${sub}`) : '';

    // Стили
    path.src.styles = path.dev + path.sub + '/sass/**/*.sass';
    path.dest.styles = path.build + path.sub + '/css/';
    path.watch.styles = path.src.styles;

    // Скрипты
    path.src.scripts = path.dev + path.sub + '/js/main.js';
    path.dest.scripts = path.build + path.sub + '/js/';
    path.watch.scripts = path.dev + path.sub + '/js/**/*.js';

    // Ресурсы
    path.src.resources = path.dev + '/resources/**';
    path.dest.resources = path.build;
    path.watch.resources = path.src.resources;

    // Разметка
    path.src.html = path.dev + '/*.html';
    path.dest.html = path.build;
    path.watch.htmlTemplates = path.dev + '/html/**/*.html';
    path.watch.html = path.src.html;

    // Шрифты
    path.src.fonts = path.dev + path.sub + '/fonts/**.ttf';
    path.src.fontsSassFile = path.dev + path.sub + '/sass/_fonts.sass';
    path.dest.fonts = path.build + path.sub + '/fonts/';
    path.watch.fonts = path.dev + path.sub + '/fonts/**';

    // Картинки
    path.src.img = [
        `${path.dev}${path.sub}/img/**.jpg`,
        `${path.dev}${path.sub}/img/**.png`,
        `${path.dev}${path.sub}/img/**.jpeg`
    ];
    path.dest.img = path.build + path.sub + '/img/';
    path.watch.img = path.src.img;

    // SVG
    path.src.svg = path.dev + path.sub + '/img/svg/**.svg';
    path.dest.svg = path.build + path.sub + '/img/';
    path.watch.svg = path.src.svg;

    return path;
}

// Вызов генератора путей, нужно передать папку разработки, папку сборки, подпапку
const path = generatePath('dist', 'docs', 'assets');

// Ключ с сайта https://tinypng.com/
const tinyPngKey = 'JNys0cXzYPDKxZspFvlGV2CGM4GN2xnf';

/**
 * DEV сборка
 */

// Разметка
const htmlInclude = () => {
    return src(path.src.html)
        .pipe(fileinclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(dest(path.dest.html))
        .pipe(browserSync.stream());
}

// Стили
const styles = () => {
    return src(path.src.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on("error", notify.onError()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(path.dest.styles))
        .pipe(browserSync.stream());
}

// Скрипты
const scripts = () => {
    return src(path.src.scripts)
        .pipe(webpackStream(
            {
                mode: 'development',
                output: {
                    filename: 'main.js',
                },
                module: {
                    rules: [{
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }]
                },
            }
        ))
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end'); // Don't stop the rest of the task
        })

        .pipe(sourcemaps.init())
        .pipe(uglify().on("error", notify.onError()))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(path.dest.scripts))
        .pipe(browserSync.stream());
}

// Ресурсы
const resources = () => {
    return src(path.src.resources)
        .pipe(dest(path.dest.resources))
}

// Шрифты
const fonts = () => {
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.dest.fonts));
}

const checkWeight = (fontname) => {
    let weight = 400;
    switch (true) {
        case /Thin/.test(fontname):
            weight = 100;
            break;
        case /ExtraLight/.test(fontname):
            weight = 200;
            break;
        case /Light/.test(fontname):
            weight = 300;
            break;
        case /Regular/.test(fontname):
            weight = 400;
            break;
        case /Medium/.test(fontname):
            weight = 500;
            break;
        case /SemiBold/.test(fontname):
            weight = 600;
            break;
        case /Semi/.test(fontname):
            weight = 600;
            break;
        case /Bold/.test(fontname):
            weight = 700;
            break;
        case /ExtraBold/.test(fontname):
            weight = 800;
            break;
        case /Heavy/.test(fontname):
            weight = 700;
            break;
        case /Black/.test(fontname):
            weight = 900;
            break;
        default:
            weight = 400;
    }
    return weight;
}

const cb = () => { }

const fontsStyle = (done) => {
    let file_content = fs.readFileSync(path.src.fontsSassFile);

    fs.writeFile(path.src.fontsSassFile, '', cb);
    fs.readdir(path.dest.fonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.');
                fontname = fontname[0];
                let font = fontname.split('-')[0];
                let weight = checkWeight(fontname);

                if (c_fontname != fontname) {
                    fs.appendFile(path.src.fontsSassFile, '@include font-face("' + font + '", "' + fontname + '", ' + weight + ');\r\n', cb);
                }
                c_fontname = fontname;
            }
        }
    })

    done();
}

// SVG
const svgSprites = () => {
    return src(path.src.svg)
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg" //sprite file name
                }
            },
        }))
        .pipe(dest(path.dest.svg));
}

// Картинки
const imgToApp = () => {
    return src(path.src.img)
        .pipe(dest(path.dest.img))
}

// Смотритель
const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: path.build
        },
    });

    watch(path.watch.styles, styles);
    watch(path.watch.scripts, scripts);
    watch(path.watch.html, htmlInclude);
    watch(path.watch.htmlTemplates, htmlInclude);
    watch(path.watch.resources, resources);
    watch(path.watch.img[0], imgToApp);
    watch(path.watch.img[1], imgToApp);
    watch(path.watch.img[2], imgToApp);
    watch(path.watch.svg, svgSprites);
    watch(path.watch.fonts, fonts);
    watch(path.watch.fonts, fontsStyle);
}

// Удаление продакш каталога
const clean = () => {
    return del(path.build)
}

/**
 * BUILD сборка
 */

// Минификация картинок
const tinypng = () => {
    return src(path.src.img)
        .pipe(tiny({
            key: tinyPngKey,
            sigFile: `${path.dest.img}.tinypng-sigs`,
            parallel: true,
            parallelMax: 50,
            log: true,
        }))
        .pipe(dest(path.dest.img))
}

// Продакшен стили
const stylesBuild = () => {
    return src(path.src.styles)
        .pipe(sass({
            outputStyle: 'expanded'
        }).on("error", notify.onError()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest(path.dest.styles))
}

// Продакшен скрипты
const scriptsBuild = () => {
    return src(path.src.scripts)
        .pipe(webpackStream(
            {
                mode: 'development',
                output: {
                    filename: 'main.js',
                },
                module: {
                    rules: [{
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }]
                },
            }
        ))
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end'); // Don't stop the rest of the task
        })
        .pipe(uglify().on("error", notify.onError()))
        .pipe(dest(path.dest.scripts))
}

// Кэш суффикс
const cache = () => {
    return src(path.build + '/**/*.{css,js,svg,png,jpg,jpeg,woff2}', {
        base: path.build
    })
        .pipe(rev())
        .pipe(revdel())
        .pipe(dest(path.build))
        .pipe(rev.manifest('rev.json'))
        .pipe(dest(path.build));
};

// Перезапись файлов с кэш суффиксом
const rewrite = () => {
    const manifest = src(path.build + '/rev.json');

    return src(path.build + '/**/*.html')
        .pipe(revRewrite({
            manifest
        }))
        .pipe(dest(path.build));
}

// Минификация разметки
const htmlMinify = () => {
    return src(path.build + '/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest(path.build));
}

// Выгрузка на хостинг
const deploy = () => {
    let conn = ftp.create({
        host: '',
        user: '',
        password: '',
        parallel: 10,
        log: gutil.log
    });

    let globs = [
        path.build + '/**',
    ];

    return src(globs, {
        base: path.build,
        buffer: false
    })
        .pipe(conn.newer('')) // only upload newer files
        .pipe(conn.dest(''));
}

// Экспорт всех функций для доступа к каждой из терминала
exports.fileinclude = htmlInclude;
exports.styles = styles;
exports.scripts = scripts;
exports.watchFiles = watchFiles;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.clean = clean;

/**
 * Основные задачи
 */

// gulp
exports.default = series(clean, parallel(htmlInclude, scripts, fonts, resources, imgToApp, svgSprites), fontsStyle, styles, watchFiles);

// gulp build
exports.build = series(clean, parallel(htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgSprites), fontsStyle, stylesBuild);

// gulp fullbuild
exports.fullbuild = series(clean, parallel(htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgSprites), fontsStyle, stylesBuild, htmlMinify, tinypng);

// gulp cache
exports.cache = series(cache, rewrite);

// gulp deploy
exports.deploy = deploy;