var ngVer = '@2.0.0-rc.1';

var mode = {
    currentMode: 'dev',
    dev: {
        'app': 'www/app', // 'dist',
        'rxjs': 'node_modules/rxjs',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        '@angular': 'node_modules/@angular'
    },
    prod: {
        'app': 'www/app', // 'dist',
        'rxjs': 'https://npmcdn.com/rxjs@5.0.0-beta.6',
        'angular2-in-memory-web-api': 'https://npmcdn.com/angular2-in-memory-web-api'
    },
}

var map = mode[mode.currentMode];

var packages = {
    'app': {
        main: 'main.js',
        defaultExtension: 'js'
    },
    'rxjs': {
        defaultExtension: 'js'
    },
    'angular2-in-memory-web-api': {
        defaultExtension: 'js'
    }
};

var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/router-deprecated',
    '@angular/testing',
    '@angular/upgrade',
];

// add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
packageNames.forEach(function (pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
});

if (mode.currentMode === 'prod') {
    // add map entries for angular packages in the form '@angular/common': 'https://npmcdn.com/@angular/common@0.0.0-3?main=browser'
    packageNames.forEach(function (pkgName) {
        map[pkgName] = 'https://npmcdn.com/' + pkgName + ngVer;
    });
}

System.config({
    map: map,
    packages: packages
});

System.import('app/main')
    .then(null, console.error.bind(console));