interface IPackage {
    name: string,
    production: string,
    main?: string,
    development?: string,
    defaultExtension?: string
}

interface IBarrel {
    name: string,
    path: string
}

class Configuration {
    configure(entryScript: string) {
        System.config({
            map: this.map,
            packages: this.packages,
            meta: {
                'app/*': {
                    scriptLoad: true
                }
            }         
        });

        return Promise.all(this.imports.map(pkg => System.import(pkg)))
            .then(() => System.import(entryScript))
            .then(() => console.log("All scripts have loaded"))
            .catch(console.error.bind(console));
    }

    queueImport(pkgs: string) {
        this.imports.push(pkgs);
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

    registerBarrels(barrels: IBarrel[]) {
        barrels.forEach(barrel => {
            this.packages[barrel.name] = {
                main: 'index',
                defaultExtension: 'js'
            };

            this.map[barrel.name] = barrel.path + '/' + barrel.name;
        });

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

    registerAngular2Packages() {
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


    private map: SystemJSLoader.Config = {};
    private packages: SystemJSLoader.Config = {};
    private ngVersion = '@2.0.0-rc.1';
    private devMode = false;
    private imports = [];

    private angularPackages = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/testing'
    ];
}

function useAppConfiguration() {
    var conf = new Configuration()
        .useDevelopment()
        .registerBarrels(<IBarrel[]>[
            {
                name: 'components',
                path: 'app'
            },
            {
                name: 'services',
                path: 'app/shared'
            },
            {
                name: 'helpers',
                path: 'app/shared'
            },
            {
                name: 'pipes',
                path: 'app/shared'
            }
        ])
        .registerLibraries(<IPackage[]>[
            {
                name: 'app',
                main: 'bootstrap.js',
                production: 'app'
            },
            {
                name: 'rxjs',
                main: 'rx.js',
                production: 'node_modules/rxjs'
            },
            {
                name: 'underscore',
                main: 'underscore.js',
                production: 'node_modules/underscore'
            },
            {
                name: 'marked',
                main: 'marked.js',
                production: 'node_modules/marked/lib'
            },
            {
                name: 'toMarkdown',
                main: 'to-markdown',
                production: 'node_modules/to-markdown/dist'
            }
        ])
        .registerAngular2Packages()
        .queueImport('underscore')
        .queueImport('marked')
        .queueImport('toMarkdown')
        .configure('app');
}

function useDialogConfiguration(initialScript: string) {
    var conf = new Configuration()
        .useDevelopment()
        .registerLibraries(<IPackage[]>[
            {
                name: 'app',
                main: 'bootstrap.js',
                production: 'app'
            },
            {
                name: 'underscore',
                main: 'underscore.js',
                production: 'node_modules/underscore'
            }
        ])
        .queueImport('underscore')
        .configure(initialScript);
}