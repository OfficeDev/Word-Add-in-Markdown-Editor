System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    // Run a batch operation against the Word object model.
                    Word.run(function (context) {
                        // Create a proxy object for the document body.
                        var body = context.document.body;
                        // Queue a commmand to search the document.
                        var searchResults = context.document.body.search('stuff', { matchCase: false });
                        // Queue a commmand to load the results.
                        context.load(searchResults, 'text, font');
                        // Synchronize the document state by executing the queued commands,
                        // and return a promise to indicate task completion.
                        return context.sync().then(function () {
                            var results = 'Found count: ' + searchResults.items.length +
                                '; we highlighted the results.';
                            // Queue a command to change the font for each found item.
                            for (var i = 0; i < searchResults.items.length; i++) {
                                searchResults.items[i].font.color = '#FF0000'; // Change color to Red
                                searchResults.items[i].font.highlightColor = '#FFFF00';
                                searchResults.items[i].font.bold = true;
                            }
                            // Synchronize the document state by executing the queued commands,
                            // and return a promise to indicate task completion.
                            return context.sync().then(function () {
                                console.log(results);
                            });
                        });
                    })
                        .catch(function (error) {
                        console.log('Error: ' + JSON.stringify(error));
                        if (error instanceof OfficeExtension.Error) {
                            console.log('Debug info: ' + JSON.stringify(error.debugInfo));
                        }
                    });
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <h1>Angular 2 Boilerplate</h1>\n        <p>Hello Worlds!</p>\n    ",
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFVQTtnQkFDQTtvQkFDSSx1REFBdUQ7b0JBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxPQUFPO3dCQUVsQiwrQ0FBK0M7d0JBQy9DLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO3dCQUVqQywyQ0FBMkM7d0JBQzNDLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQzt3QkFFOUUsd0NBQXdDO3dCQUN4QyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQzt3QkFFMUMsbUVBQW1FO3dCQUNuRSxvREFBb0Q7d0JBQ3BELE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDOzRCQUN2QixJQUFJLE9BQU8sR0FBRyxlQUFlLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNO2dDQUN0RCwrQkFBK0IsQ0FBQzs0QkFFcEMsMERBQTBEOzRCQUMxRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0NBQ2xELGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUEsQ0FBSSxzQkFBc0I7Z0NBQ3ZFLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7Z0NBQ3ZELGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7NEJBQzVDLENBQUM7NEJBRUQsbUVBQW1FOzRCQUNuRSxvREFBb0Q7NEJBQ3BELE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDO2dDQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUN6QixDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUM7eUJBQ0QsS0FBSyxDQUFDLFVBQVUsS0FBSzt3QkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUMvQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xFLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQztnQkEvQ0Q7b0JBQUMsZ0JBQVMsQ0FBQzt3QkFDUCxRQUFRLEVBQUUsUUFBUTt3QkFDbEIsUUFBUSxFQUFFLDhFQUdUO3FCQUNKLENBQUM7O2dDQUFBO2dCQTJDRixtQkFBQztZQUFELENBMUNBLEFBMENDLElBQUE7WUExQ0QsdUNBMENDLENBQUEiLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ215LWFwcCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGgxPkFuZ3VsYXIgMiBCb2lsZXJwbGF0ZTwvaDE+XG4gICAgICAgIDxwPkhlbGxvIFdvcmxkcyE8L3A+XG4gICAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbmNvbnN0cnVjdG9yKCkge1xuICAgIC8vIFJ1biBhIGJhdGNoIG9wZXJhdGlvbiBhZ2FpbnN0IHRoZSBXb3JkIG9iamVjdCBtb2RlbC5cbiAgICBXb3JkLnJ1bihmdW5jdGlvbiAoY29udGV4dCkge1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBwcm94eSBvYmplY3QgZm9yIHRoZSBkb2N1bWVudCBib2R5LlxuICAgICAgICAgICAgdmFyIGJvZHkgPSBjb250ZXh0LmRvY3VtZW50LmJvZHk7XG5cbiAgICAgICAgICAgIC8vIFF1ZXVlIGEgY29tbW1hbmQgdG8gc2VhcmNoIHRoZSBkb2N1bWVudC5cbiAgICAgICAgICAgIHZhciBzZWFyY2hSZXN1bHRzID0gY29udGV4dC5kb2N1bWVudC5ib2R5LnNlYXJjaCgnc3R1ZmYnLCB7bWF0Y2hDYXNlOiBmYWxzZX0pO1xuXG4gICAgICAgICAgICAvLyBRdWV1ZSBhIGNvbW1tYW5kIHRvIGxvYWQgdGhlIHJlc3VsdHMuXG4gICAgICAgICAgICBjb250ZXh0LmxvYWQoc2VhcmNoUmVzdWx0cywgJ3RleHQsIGZvbnQnKTtcblxuICAgICAgICAgICAgLy8gU3luY2hyb25pemUgdGhlIGRvY3VtZW50IHN0YXRlIGJ5IGV4ZWN1dGluZyB0aGUgcXVldWVkIGNvbW1hbmRzLFxuICAgICAgICAgICAgLy8gYW5kIHJldHVybiBhIHByb21pc2UgdG8gaW5kaWNhdGUgdGFzayBjb21wbGV0aW9uLlxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuc3luYygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHRzID0gJ0ZvdW5kIGNvdW50OiAnICsgc2VhcmNoUmVzdWx0cy5pdGVtcy5sZW5ndGggK1xuICAgICAgICAgICAgICAgICAgICAnOyB3ZSBoaWdobGlnaHRlZCB0aGUgcmVzdWx0cy4nO1xuXG4gICAgICAgICAgICAgICAgLy8gUXVldWUgYSBjb21tYW5kIHRvIGNoYW5nZSB0aGUgZm9udCBmb3IgZWFjaCBmb3VuZCBpdGVtLlxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VhcmNoUmVzdWx0cy5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hSZXN1bHRzLml0ZW1zW2ldLmZvbnQuY29sb3IgPSAnI0ZGMDAwMCcgICAgLy8gQ2hhbmdlIGNvbG9yIHRvIFJlZFxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hSZXN1bHRzLml0ZW1zW2ldLmZvbnQuaGlnaGxpZ2h0Q29sb3IgPSAnI0ZGRkYwMCc7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFJlc3VsdHMuaXRlbXNbaV0uZm9udC5ib2xkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTeW5jaHJvbml6ZSB0aGUgZG9jdW1lbnQgc3RhdGUgYnkgZXhlY3V0aW5nIHRoZSBxdWV1ZWQgY29tbWFuZHMsXG4gICAgICAgICAgICAgICAgLy8gYW5kIHJldHVybiBhIHByb21pc2UgdG8gaW5kaWNhdGUgdGFzayBjb21wbGV0aW9uLlxuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0LnN5bmMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIE9mZmljZUV4dGVuc2lvbi5FcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEZWJ1ZyBpbmZvOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IuZGVidWdJbmZvKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
