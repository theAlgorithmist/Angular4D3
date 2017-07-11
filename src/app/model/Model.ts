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
 * Global store for the Angular 4 D3 micro-application
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 // platform imports
 import { Injectable } from '@angular/core';
 import { Response   } from '@angular/http';

 // interfaces
 import { IReduxModel } from '../flux-redux/IReduxModel';

 // actions import
 import { BasicActions } from '../actions/BasicActions';
 import { DataActions  } from '../actions/DataActions';

 // how is the global store partitioned into slices
 import { ModelPartitions } from './ModelPartitions';

 // reducers
 import { DataReducer  } from '../data-reducer/data-reducer';
 import { BasicReducer } from '../basic-reducer/basic-reducer';

 // rxjs
 import { Subject    } from 'rxjs/Subject';
 import { Observable } from 'rxjs/Observable';

 type autodatatype = string | number;

 @Injectable()
 export class D3DataModel implements IReduxModel
 {
   // singleton instance; this is not necessary, but allows the model to be used outside the Angular DI system
   private static _instance: D3DataModel;

   // reference to actual store - this remains private to support compile-time immutability
   private _store: Object = new Object();

   // current action
   private _action: string = BasicActions.NONE;

   // subscribers to model updates
   private _subscribers:Array<Subject<any>>;

  /**
   * Construct a new Auto model
   *
   * @return nothing
   */
   constructor(private _dataReducer: DataReducer, private _basicReducer: BasicReducer)
   {
     if (D3DataModel._instance instanceof D3DataModel) 
       return D3DataModel._instance;
     
     // define the structure of the global application store
     this._store[ModelPartitions.ACTION]    = BasicActions.NONE;
     this._store[ModelPartitions.FREQUENCY] = new Array<number>();
     this._store[ModelPartitions.LABELS   ] = new Array<string>();
     this._store[ModelPartitions.LOADING  ] = true;

     this._subscribers = new Array<Subject<any>>();

     this._dataReducer._error.subscribe(this.__onDataError);

     // singleton instance
     D3DataModel._instance = this;
   }

  /**
   * Subscribe a new Subject to the model
   *
   * @param subject: Subject<any> A Subject with at least an 'next' handler
   *
   * @return Nothing - The Subject is added to the subscriber list
   */
   public subscribe( subject: Subject<any> ): void
   {
     // for a full-on, production app, would want to make this test tighter
     if (subject)
       this._subscribers.push(subject);
   }

  /**
   * Unsubscribe an existing Subject from the model
   *
   * @param subject: Subject<any> Existing subscribed Subject
   *
   * @return Nothing - If found, the Subject is removed from the subscriber list (typically executed when a component is destructed)
   */
   public unsubscribe( subject: Subject<any> ): void
   {
     // for a full-on, production app, would want to make this test tighter
     if (subject)
     {
       let len: number = this._subscribers.length;
       let i: number;

       for (i=0; i<len; ++i)
       {
         if (this._subscribers[i] === subject)
         {
           this._subscribers[i].unsubscribe();
           this._subscribers.splice(i,1);
           break;
         }
       }
     }
   }

  /**
   * Dispatch an Action to the model, which causes the model to be changed - application of a reducer - and then a slice of the new model
   * is sent to all subscribers.  This includes the action that caused the reduction.  A copy of model data is always sent to perserve
   * immutability.
   *
   * @param action: string Action type
   *
   * @param payload: Object (optional) Payload for the action, which may be used by a reducer
   *
   * @return Nothing - All subscribers are notified after the model is updated
   */
   public dispatchAction(action: string, payload: Object=null): void
   {
     this._action = action;

     // reduce the global store based on this action; note that we are segregating reducers based on action, not data type
     let previous: Object = JSON.parse( JSON.stringify(this._store) );

     if (BasicActions.isAction(this._action))
     {
       // Basic Actions reducer
       this.__updateStore ( this._basicReducer.reduce(this._action, payload, previous) );
    
     }
     else if (DataActions.isAction(this._action))
     {
       // Data Actions reducer
       this._dataReducer.reduce(this._action, payload, previous)
                        .subscribe( data => this.__updateStore(data) )
     }                 
   }

   // update the global store
   private __updateStore(data: Object): void
   {
     let result: Object = {};
     if (data instanceof Response)
       result = data.json();

     switch (this._action)
     {
       case DataActions.GET_CHART_DATA:
         this._store[ModelPartitions.ACTION] = DataActions.GET_CHART_DATA;

         let frequency: Object = typeof result === 'string' ?  JSON.parse(result) : result;

         let letters: Array<string> = new Array<string>();
         let freq: Array<number>    = new Array<number>();

         // data returned from service is an array of Objects
         let letterFrequency: Array<Object> = frequency['frequency'];
         letterFrequency.forEach( (obj: Object, index: number): void => {letters.push(obj['l']); freq.push(+obj['f'])} );

         this._store[ModelPartitions.LABELS]    = letters;
         this._store[ModelPartitions.FREQUENCY] = freq;
         this._store[ModelPartitions.LOADING  ] = false;
       break;

       case BasicActions.LOG:
         return;
     }

     this.__updateSubscribers();
   }

   // send updates to all subscribers
   private __updateSubscribers(): void
   {
     // send copy of a slice of the current store to subscribers; you can get as medieval as you want about immutability
     let store: Object             = {};
     store[ModelPartitions.ACTION] = this._store['action'];

     switch ( this._action )
     {
       case DataActions.GET_CHART_DATA:
         store[ModelPartitions.LABELS    ] = JSON.parse( JSON.stringify(this._store[ModelPartitions.LABELS   ]) ); 
         store[ModelPartitions.FREQUENCY ] = JSON.parse( JSON.stringify(this._store[ModelPartitions.FREQUENCY]) ); 
         store[ModelPartitions.LOADING   ] = <boolean> this._store[ModelPartitions.LOADING];
       break;
     }

     this._subscribers.map( (s:Subject<any>) => s.next(store) );
   }

   // handle data errors
   private __onDataError(value: string): void
   {
     // send the error condition to subscribers - this allows a general error component to report the condition to the user in a more friendly manner
     this._subscribers.map( (s:Subject<any>) => s.next( {action: BasicActions.ERROR, msg: "Data fetch error from: " + value} ) );
   }
 }
