const margin = { top: 20, left: 50, right: 20, bottom: 20 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;


let data;
let reverse = false;
let type = d3.select('#group-by').node().value;

const descriptions = ["Bar chart displaying the number of stores worldwide for a several popular coffee chains. Starbucks has the largest number of stores at over twenty thousand, which is nearly double the number of stores that the next leading brand, Dunkin, has.", "Bar chart displaying the revenue in bilions of United States dollars for several popular coffee chains. Starbucks has the largest revenue at over sixteen billion dollars, which is more than four times as much as the next top-grossing chain, Tim Hortons"];

//const storesDesc = "Bar chart displaying the number of stores worldwide for a several popular coffee chains. Starbucks has the largest number of stores at over twenty thousand, which is nearly double the number of stores that the next leading brand, Dunkin, has.";
//const revenueDesc = "Bar chart displaying the revenue in bilions of United States dollars for several popular coffee chains. Starbucks has the largest revenue at over sixteen billion dollars, which is more than four times as much as the next top-grossing chain, Tim Hortons";

const svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("role", "graphics-document")
  .attr("aria-roledescription", "bar chart")
  //.attr("aria-label", descriptions[0])
  .append("g")
  .attr('tabindex', 0)
  .attr("aria-label", descriptions[0])
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xScale = d3
  .scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1);

const yScale = d3.scaleLinear().range([height, 0]);

svg.append('g')
  .attr('class', 'axis x-axis')
  .attr('aria-hidden', true)
  .attr("transform", "translate(0," + height + ")");

svg.append('g')
  .attr('class', 'axis y-axis')
  .attr('aria-hidden', true);

svg.append("text")
    .attr("class", "y-axis-title")
    .attr('aria-hidden', true)
    .attr("text-anchor", "middle")
    .attr('font-size', '12px')
    .attr("y", -10)
    .attr("x", 0);

function update(data, type, reverse){
  
  const descriptions = ["Bar chart displaying the number of stores worldwide for a several popular coffee chains. Starbucks has the largest number of stores at over twenty thousand, which is nearly double the number of stores that the next leading brand, Dunkin, has.", "Bar chart displaying the revenue in bilions of United States dollars for several popular coffee chains. Starbucks has the largest revenue at over sixteen billion dollars, which is more than four times as much as the next top-grossing chain, Tim Hortons"];
  
  console.log('data', data);

  data.sort((a, b)=>b[type] - a[type]);  
  
  if (reverse){
    data.reverse();
  }
  
  xScale.domain(data.map(d=>d.company));
  
  console.log(xScale.domain())
  
  
  yScale.domain([0, d3.max(data,d=>d[type])]);
  
 
  const bars = svg.selectAll('.bar')
    .data(data, d=>d.company);
  
  function getDesc(type) {
    let desc = new Array(2);
    if (type == "stores") {
      desc[0] = descriptions[0];
      desc[1] = "stores"
    } else {
      desc[0] = descriptions[1];
      desc[1] = "billion"
    }
    return desc;
  }
  
  bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('fill', '#1f76b4')
    .attr('x', d=>xScale(d.company))
    .attr('width', d=>xScale.bandwidth())
  	.attr("height",0)
	  .attr("y",height)
    .merge(bars)
    .transition()
    .delay((d,i)=>i*100)
    .duration(1000)
    .attr('x', d=>xScale(d.company))
    .attr('y', d=>yScale(d[type]))
    .attr('height', d=>height-yScale(d[type]))
    .attr('role', 'graphics-symbol')
    .attr('aria-roledescription', 'bar element')
    .attr('aria-label', d=>d.company + ", " + d[type] + " " + getDesc(type)[1] )
    .attr('tabindex', 0)
  
  bars.exit().remove();
  
  const xAxis = d3.axisBottom(xScale);
  
  svg.select('.x-axis')
    .transition()
    .duration(1000)
    .call(xAxis);
  
  const yAxis = d3.axisLeft(yScale);
  
  svg.select('.y-axis')
    .transition()
    .duration(1000)
    .call(yAxis);
  
  //const descriptions = ["Bar chart displaying the number of stores worldwide for a several popular coffee chains. Starbucks has the largest number of stores at over twenty thousand, which is nearly double the number of stores that the next leading brand, Dunkin, has.", "Bar chart displaying the revenue in bilions of United States dollars for several popular coffee chains. Starbucks has the largest revenue at over sixteen billion dollars, which is more than four times as much as the next top-grossing chain, Tim Hortons"]
  
  svg.attr("aria-label", getDesc(type)[0])
  
  d3.select('.y-axis-title').text(type==="stores"? "Stores" : "Billion USD")
    .attr('tabindex', 0)
    .attr("aria-label", "Maximum Y value, " + d3.max(data.map(d=>d[type])) + " " + getDesc(type)[1] + ", Minimum Y value, " + d3.min(data.map(d=>d[type])) + " " + getDesc(type)[1]);
  
  //d3.select(".y-axis-title").attr("aria-label", "Maximum Y value, " + d3.max(data.map(d=>d[type])) + ", Minimum Y value, " + d3.min(data.map(d=>d[type]))).attr('tabindex', 0);
  d3.select(".chart").attr(getDesc[type][0])
}


d3.csv("coffee-house-chains.csv", d3.autoType).then(_data => {
  data = _data;
  
  update(data, type, reverse);
  
});


d3.select('#group-by').on('change', (event)=>{
  type = d3.select('#group-by').node().value;
  update(data, type, reverse);
})

d3.select('#sort-btn').on('click', (event)=>{
  console.log('sort button clicked');
  reverse = !reverse;
  update(data, type, reverse);
})