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

// platform imports
import {  Component 
        , OnInit
        , AfterViewInit
        , ChangeDetectionStrategy
        , ChangeDetectorRef
        , ViewChild
       } from '@angular/core';

// components
import { LoadingComponent } from './loading/loading.component';

// base Flux component
import { FluxComponent } from './flux-redux/flux.component';

// Global store and dispatcher
import { D3DataModel    } from './model/Model';
import { FluxDispatcher } from './flux-redux/FluxDispatcher';

// actions and model partitions
import { DataActions     } from './actions/DataActions';
import { BasicActions    } from './actions/BasicActions';
import { ModelPartitions } from './model/ModelPartitions';

// chart directive
import { LetterChartDirective } from './letter-chart-directive/letter-chart-directive';

// rxjs imports
import { Subject      } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',

  templateUrl: 'app.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrls: ['app.component.css']
})

/**
 * Root component for A4 D3 demo 
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
 export class AppComponent extends FluxComponent implements OnInit, AfterViewInit
 {
   // data provider for this component
   protected _freqData: Object = {};

   // direct reference to the letter chart
   @ViewChild(LetterChartDirective) _chart: LetterChartDirective;

 /**
   * Construct the main app component
   *
   * @return Nothing
   */
   constructor(private _m: D3DataModel, private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef)
   {
     super(_d);

     // since there is no formal framework that ties the dispatcher and global store together, this step is done manually.  
     _d.model = _m;

     // make sure there is initial data in the provider
     this._freqData[ModelPartitions.LOADING] = true;
   }

  /**
   * Access loading status
   */
   public get loading(): boolean
   {
     return <boolean> this._freqData[ModelPartitions.LOADING];
   }

  /**
   * Component lifecycle - on init
   *
   * @return nothing - reserved for future use
   */
   public ngOnInit()
   {
     // for future use
   }

  /**
   * Component lifecycle - after view init
   *
   * @return nothing - dispatch action to request map paraams
   */
   public ngAfterViewInit()
   {
     this._d.dispatchAction(DataActions.GET_CHART_DATA, null);
   }

   // update the component based on a new state of the global store
   protected __onModelUpdate(data: Object): void
   {
     switch (data[ModelPartitions.ACTION])
     {
       case DataActions.GET_CHART_DATA:
         this._freqData = data;

         this.__updateChart();

         this._chgDetector.markForCheck();
       break;  

       case BasicActions.ERROR:
         // implement error display here
       break;
     }
   }

   // update the chart by creating and setting a data provider - NOTE THAT THIS IMPLEMENTATION PRESUMES A ONE-TIME CHART SETUP AND DISPLAY.
   protected __updateChart(): void
   {
     const freq: Array<number>    = this._freqData[ModelPartitions.FREQUENCY];   // frequency data
     const letters: Array<string> = this._freqData[ModelPartitions.LABELS];      // letters (x-axis labels)

     // create the data provider for the chart - suggestion: perform the data transform in the global store as this makes the current component easier to reuse
     let data: Array<Object> = new Array<Object>();
     let len: number         = freq.length;
     let maxF: number        = this.__maxValue(freq);
     let i: number;

     for (i=0; i<len; ++i)
       data.push( {name: letters[i], value: Math.round( (freq[i]/maxF)*100 ) } );

     this._chart.dataProvider = data;
   }

   protected __maxValue(arr: Array<number>): number
   {
     let value: number = arr[1];
     let len: number   = arr.length;
     let i: number;

     for (i=1; i<arr.length; ++i)
       value = Math.max(value, arr[i]);

     return value;
   }
 }

