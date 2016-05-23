interface IPackage {
    name: string,
    production: string
    main?: string,
    development?: string,
    defaultExtension?: string
}

class Configuration {
    configure() {
        this.registerAngular2Packages();

        System.config({
            map: this.map,
            packages: this.packages
        });

        return this.multiImport()
            .then(null, console.error.bind(console));
    }

    queueImport(packageName: string) {
        this.imports.push(packageName);
        return this;
    }

    useDevelopment() {
        console.info('Importing development libraries from node_modules.')
        this.devMode = true;
        return this;
    }

    useProduction() {
        console.info('Importing production libraries from CDNs.')
        this.devMode = false;
        return this;
    }

    registerLibraries(packages: IPackage[]) {
        packages.forEach(pkg => {
            this.packages[pkg.name] = {
                main: pkg.main || '',
                defaultExtension: pkg.defaultExtension || 'js'
            };

            this.map[pkg.name] = this.devMode ? pkg.development || pkg.production : pkg.production;
        });

        return this;
    }

    private map = {};
    private packages = {};
    private ngVersion = '@2.0.0-rc.1';
    private devMode = false;
    private imports = [];

    private angularPackages = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/testing',
        '@angular/upgrade',
    ];

    private registerAngular2Packages() {
        var devModeFlag = true;

        this.angularPackages.forEach(pkgName => {
            // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }           
            this.packages[pkgName] = {
                main: 'index.js',
                defaultExtension: 'js'
            };

            if (this.devMode) {
                if (devModeFlag) {
                    this.map['@angular'] = 'node_modules/@angular';
                    devModeFlag = false;
                }
            }
            else {
                // add map entries for angular packages in the form '@angular/common': 'https://npmcdn.com/@angular/common@0.0.0-3?main=browser'                
                this.angularPackages.forEach(pkgName => {
                    this.map[pkgName] = 'https://npmcdn.com/' + pkgName + this.ngVersion;
                });
            }
        });

        return this;
    }

    private multiImport() {
        var firstPackage = this.imports.splice(0, 1)[0];
        var promise = System.import(firstPackage);
        this.imports.forEach(pkg => {
            promise = promise.then(() => { return System.import(pkg); });
        });

        return promise;
    }
}

new Configuration()
    .useProduction()
    .registerLibraries(<IPackage[]>[
        {
            name: 'app',
            main: 'main.js',
            production: 'www/app'
        },
        {
            name: 'rxjs',
            development: 'node_modules/rxjs',
            production: 'https://npmcdn.com/rxjs@5.0.0-beta.6'
        },
        {
            name: 'marked',
            main: 'marked.js',
            production: 'node_modules/marked/lib'
        }
    ])
    .queueImport('app/main')
    .queueImport('marked')
    .configure();