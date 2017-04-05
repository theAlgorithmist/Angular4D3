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
 * Reducer class for BasicActions
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 // platform imports
 import { Injectable } from '@angular/core';

 // interfaces
 import { IReducer } from '../flux-redux/IReducer';

 // logging
 import { LoggingService } from '../services/Logging';
 import { LogLevel       } from '../services/Logging';

 // model ModelPartitions
 import { ModelPartitions } from '../model/ModelPartitions';

 // actions import
 import { BasicActions } from '../actions/BasicActions';

 // rxjs
 import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class BasicReducer implements IReducer
 {

  /**
   * Construct a new Basic Actions Reducer
   *
   * @return nothing
   */
   constructor(protected _logger: LoggingService)
   {
     // empty
   }

  /**
   * Basic Actions reducer
   *
   * @param action: string Action type
   *
   * @param payload: Object (optional) Payload for the action
   *
   * @return Observable<Object>
   */
   public reduce(action: string, payload: Object, previous: Object): Object
   {
     switch (action)
     {
       case BasicActions.LOG:
         let level: number = payload['level'  ] || LogLevel.INFO;
         let msg: string   = payload['message'] || "Logging Action";

         this._logger.log(level, msg);  // this is not a round-trip action, so no further processing is necessary
       break;
     }
     
     return {};
   }
 }
