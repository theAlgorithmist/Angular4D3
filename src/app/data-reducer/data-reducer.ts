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
 * Reducer class for DataActions
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 // platform imports
 import { Injectable } from '@angular/core';

 // interfaces
 import { IReducer } from '../flux-redux/IReducer';

 // service layer
 import { ServiceLayer } from '../services/ServiceLayer'; 
 import { LogLevel     } from '../services/Logging';

 // model ModelPartitions
 import { ModelPartitions } from '../model/ModelPartitions';

 // actions import
 import { DataActions } from '../actions/DataActions';

 // rxjs
 import { Observable } from 'rxjs/Observable';
 import { Subject    } from 'rxjs/Subject';

 @Injectable()
 export class DataReducer implements IReducer
 {
   public _error: Subject<string> = new Subject<string>();

  /**
   * Construct a new Data Reducer for all data-related actions
   *
   * @return nothing
   */
   constructor(protected _serviceLayer: ServiceLayer)
   {
     // empty
   }

  /**
   * Data Actions reducer
   *
   * @param action: string Action type
   *
   * @param payload: Object (optional) Payload for the action
   *
   * @return Observable<Object>
   */
   public reduce(action: string, payload: Object, previous: Object): Observable<Object>
   {
     let validAction: boolean = true;

     switch (action)
     {
       case DataActions.GET_CHART_DATA:
        
         let chartData: Array<number> = previous[ModelPartitions.FREQUENCY];

         // data should only be fetched once
         if (chartData.length == 0)
         {
           // REPLACE THIS URL WITH THE LOCATION OF THE PHP FILE ON YOUR SERVER - THIS LINK WILL NOT WORK
           return this._serviceLayer.getData("http://algorithmist.net/a4d3/services/frequency.php")
                                    .catch( (err: any, caught:Observable<any>) => this.__errHandler(err, caught));
         }
       break;

       default:
         validAction = false;
       break;
     }

     // if invalid action, return empty Observable
     if (!validAction)
       return new Observable<Object>();
   }

   private __errHandler( error: Response | any, caught: Observable<any> ): any
   {
     // change this url to that of your service or other info. you would want to pass along on error
     this._error.next("http://algorithmist.net/a4d3/services/frequency.php");
   }
 }
