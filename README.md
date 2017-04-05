# The Power of 4 - Angular 4 and D3 V4

It's time for another D3 demo, this time with Angular 4.0, the production CLI, and the up-to-date release of D3 (V4.7.4 as of creation of this project).  I wanted to emphasize integration with Angular as well as a solid application architecture, so this example requires only minimal undrerstanding of D3.  It is based up on the "Let's Make A Chart III" tutorial from the D3 site, with some expanded features and full compatibility with D3 version 4.

Goals for this demo include:


```sh
- Use the Angular2 CLI as the build tool
- Create a complete micro-application as the demonstration environment
- Adhere to concepts from Flux and Redux w/o 3rd party software
- Illustrate how to implement a service layer and logging
- Provide an example of on-push change detection
- Only minimal understanding of D3 is required
```

Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Angular: 4.0.0

Angular CLI: 1.0.0

D3: 4.7.4

## Installation

Installation involves all the usual suspects

  - npm and Angular CLI installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Version

1.0.0

### Building and Running the demo

After installation, _ng-build_ and _ng-serve_ are your friends.  Build production or dev. as you see fit.  

In keeping with the micro-application architecture, a PHP file is supplied with the distribution to provide a REST endpoint for loading letter frequency data.  This file must be installed on a server.  This file returns a CORS header, which allows the demo to be run locally with the CLI-supplied server.  Before building the application, edit the file _data-reducer/data-reducer.ts_ and locate the block of code:

```
// REPLACE THIS URL WITH THE LOCATION OF THE PHP FILE ON YOUR SERVER - THIS LINK WILL NOT WORK
return this._serviceLayer.getData("http://algorithmist.net/a4d3/services/frequency.php")
                         .catch( (err: any, caught:Observable<any>) => this.__errHandler(err, caught));
```

Replace the URL with the proper location of the PHP file on your server.  Othewrise, the load will fail.  That may actually be constructive as it provides an opportunity to see the Logger in action for a failed service request (view the console).


Once you make the necessary modifications, _localhost:4200_ runs the demo, at which point you should see

![Image of Angular4/D3 Demo]
(http://algorithmist.net/image/a4d3.png)


The demo has been tested in late-model Chrome on a Mac. 

When it comes to deconstructing the code, don't worry if you have little experience with D3.  If you have made it through the 'Let's Build A Chart' tutorial, then you know enough about D3 to work with and expand upon this demo.  In fact, the demo will likely serve you better than the tutorial as it has expanded features and is compatible with D3 V4.

I (purposely) did not employ any Angular 4-specific features in the creation of this demo.  In principle, it should run on 2.x versions of the framework.


### Concepts

The prior D3 and Angular CLI demo I placed online was an absolute minimal implementation to illustrate usage of D3 inside Angular 2+ .  This example is presented as a complete micro-application, which is complete overkill for just a D3 integration example, but is is valuable for illustrating other principles in tandem with D3.  As before, we defer D3 creation and rendering to a Directive.

The application adheres to the general principles of Flux and Redux, without the use of third-party software.  This provides you an opportunity to experiment with the internals of such an implementation.  The Redux-style global store segregates reducers on the basic of action class instead of data type.  This simply makes more sense to me on a personal basis. 

The demo includes a set of basic actions and a set of data actions.  Reducers are implemented as class methods.  Each class may specify dependencies in its constructor and instances are provided by the Angular DI machinery.  There is a basic actions class and a data actions class, both of which implement a _reduce()_ method.  A reducer returns either an _Object_ or an _Observable<Object>_ .

The data-reducer class, for example, employs a service layer and all data-service actions are deferred to the service layer.  The service layer, in turn, specifies a dependency on a Logger.  These are all dynamically injected by Angular and can be easily migrated from application to application, regardless of architecture.  

Logging during service calls is automatic.  Errors that occur during service requests are also logged, and a simple (reactive) mechanism is employed to alert the global store that an error occurred.  This generates a broadast of a _BasicActions.ERROR_ action that may be handled by any subscribing component.  So, round-tripping of service requests and error handling is easy in production.  You may also elect to expose logging actions to the global store by injecting the logger into the global store and then handling the action dispatch.

The logger, service layer, and reducer classes are setup to be global singletons (via a shared module) in the event you wish to use build upon the demo with lazy-loaded routes.

This demo presumes a load-once/chart-once display scheme with D3, so it makes sense to use on-push change detection for the component that displays the chart.  Once data is loaded and the chart is rendered, we would not expect reloading and re-rendering, so it is less efficient to constantly check bindings that never change.  See the _app.component.ts_ file for an illustration of on-push CD in a practical setting.  Note that CD for such a component is not triggered unless there is an event or timing activity on one of the component internals (even if the data reference changes).


## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <http://algorithmist.net>
[https://github.com/haoliangyu/angular2-leaflet-starter]: <https://github.com/haoliangyu/angular2-leaflet-starter>



