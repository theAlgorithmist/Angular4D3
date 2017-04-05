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
 * Basic Actions in the auto data table analysis demo
 */
export class DataActions
{
  static GET_CHART_DATA: string = "GET_CHART_DATA";

  constructor()
  {
    // empty
  }

  public static isAction(action: string): boolean
  {
    return action == DataActions.GET_CHART_DATA;
  }
}