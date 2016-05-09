System.register(['angular2/platform/browser', "./app.component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, app_component_1;
    var e;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            }],
        execute: function() {
            try {
                Office.initialize = function (reason) {
                    console.log('Office is initialized');
                    browser_1.bootstrap(app_component_1.AppComponent);
                };
            }
            catch (e) {
                browser_1.bootstrap(app_component_1.AppComponent);
            }
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztRQVVNLENBQUM7Ozs7Ozs7Ozs7WUFOUCxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLFVBQVUsR0FBRyxVQUFDLE1BQU07b0JBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztvQkFDckMsbUJBQVMsQ0FBQyw0QkFBWSxDQUFDLENBQUM7Z0JBQzVCLENBQUMsQ0FBQztZQUNOLENBQ0E7WUFBQSxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNOLG1CQUFTLENBQUMsNEJBQVksQ0FBQyxDQUFDO1lBQzVCLENBQUMiLCJmaWxlIjoiYm9vdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9hbmd1bGFyMi90eXBpbmdzL2Jyb3dzZXIuZC50c1wiLz5cbmltcG9ydCB7Ym9vdHN0cmFwfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9icm93c2VyJztcbmltcG9ydCB7QXBwQ29tcG9uZW50fSBmcm9tIFwiLi9hcHAuY29tcG9uZW50XCI7XG5cbnRyeSB7XG4gICAgT2ZmaWNlLmluaXRpYWxpemUgPSAocmVhc29uKT0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ09mZmljZSBpcyBpbml0aWFsaXplZCcpO1xuICAgICAgICBib290c3RyYXAoQXBwQ29tcG9uZW50KTtcbiAgICB9O1xufVxuY2F0Y2goZSkge1xuICAgIGJvb3RzdHJhcChBcHBDb21wb25lbnQpO1xufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
