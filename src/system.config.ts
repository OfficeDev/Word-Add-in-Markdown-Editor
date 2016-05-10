System.config({
    packages: {
        app: {
            format: 'register',
            defaultExtension: 'js'
        }        
    }
});

System.import('app/bootstrap')
      .then(null, console.error.bind(console));