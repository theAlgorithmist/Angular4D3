/** 
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This is the root application module for the Auto Data Analysis application
 *
 * @author Jim Armstrong (www.algorithmist.net)
 * 
 * @version 1.0
 */

// platform imports
import { Component     } from '@angular/core';
import { Directive     } from '@angular/core';
import { NgModule      } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule    } from '@angular/http';

// main application and supporting components/directives
import { AppComponent         } from './app.component';
import { LoadingComponent     } from './loading/loading.component';
import { LetterChartDirective } from './letter-chart-directive/letter-chart-directive';
 
// the shared model and dispatcher modules
import { SharedModelModule      } from './shared/sharedModel.module';
import { SharedDispatcherModule } from './shared/sharedDispatcher.module';

@NgModule({
  declarations: [
    AppComponent, LoadingComponent, LetterChartDirective
  ],

  imports: [
    BrowserModule,
    HttpModule,
    SharedModelModule.forRoot(),
    SharedDispatcherModule.forRoot()
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }

