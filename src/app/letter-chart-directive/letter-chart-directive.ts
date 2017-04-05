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
 * Bar Chart Directive for relative letter frequency graph
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { Directive
       , ElementRef
       , Attribute
      } from '@angular/core';

// D3
import * as d3 from 'd3';

@Directive({
  selector: 'freq-chart'
})

export class LetterChartDirective
{
  private _element: any;          // reference to native element
  private _width: number;         // chart width in px
  private _height: number;        // chart height in px

 /**
  * Construct a new BarGraph
  *
  * @param elementRef: ElementRef (Injected) Reference to the DOM element associated with this Directive (see selector)
  *
  * @param width: string Width attribute (width of chart in px)
  *
  * @param height: string Height attribute (height of chart in px)
  *
  * @return Nothing
  */
  constructor ( elementRef: ElementRef, @Attribute('width') width: string, @Attribute('height') height: string )
  {
    this._element = elementRef.nativeElement;  // reference to <bar-graph> element from the main template

    // cache input width and height - TBD: test for improper inputs
    this._width   = +width;                
    this._height  = +height;
  }

 /**
  * Assign a data provider for this chart
  *
  * @param data: Array<Object> Array of Objects with 'name' and 'value' properties that represent the letter and relative frequency (normalized from 0 to 100)
  *
  * @return nothing - The chart is created and display.  NOTE: This is a one-time chart display.  You may modify the D3 code to clear and rebuilt the chart as
  * an exercise.
  */
  public set dataProvider(data: Array<Object>)
  {
    // margins/width/height - as an exercise, add these to the data provider instead of hardcoding
    const margin = {top: 20, right: 20, bottom: 70, left: 50};
    const width  = this._width - margin.left - margin.right;
    const height = this._height - margin.top - margin.bottom;

    // x-scale, domain, and range
    let x: any = d3.scaleBand().domain( data.map( (d: Object): string => {return d['name']}) ).range([0, width]).padding(0.1);

    // y-scale, domain, and range
    let y: any = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    let xAxis: any = d3.axisBottom(x);
    let yAxis: any = d3.axisLeft(y).tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);

    // svg for chart
    let svg = d3.select(this._element)
                .attr( "class", "chart")
                .append("svg")
                .attr("width",  this._width-20)
                .attr( "height", this._height-20)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x-axis
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
    
    // y-axis
    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
         
    // bar chart
    svg.selectAll(".chart")
       .data(data)
       .enter().append("rect")
       .attr("x", function(d) { return x(d['name']); })
       .attr("y", function(d) { return y(d['value']); })
       .attr("height", function(d) { return height - y(d['value']); })
       .attr("width", x.bandwidth());

    // x-axis label
    svg.append("text")             
       .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
       .style("text-anchor", "middle")
       .text("English Alphabet Letters");

    // y-axis label
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left)
       .attr("x",0 - (height / 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text("Frequency (%)");    

    // chart title
    svg.append("text")
       .attr("transform", "translate(" + (width/2) + " , 0)")
       .style("text-anchor", "middle")
       .text("RELATIVE LETTER FREQUENCY");
  }
}
