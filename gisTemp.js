var parseDate = d3.timeParse("%Y");
var formatTime = d3.timeFormat("%Y");

d3.csv("ExcelFormattedGISTEMPData2CSV.csv")
			.row(function(d){ return {Year: parseDate(d.Year), Glob: Number(d.Glob/100)}; })
			.get(function(error, data)
			{
				var height = 300;
				var width = 700;
				
				var max = d3.max( data, function(d){ return d.Glob; });
				var min = d3.min( data, function(d){ return d.Glob; });
				var maxDate = d3.max( data, function(d){ return d.Year; });
				var minDate = d3.min( data, function(d){ return d.Year; });
				
								
				var y = d3.scaleLinear()
						.domain([min, max])
						.range([height, 0]);
						
				var x = d3.scaleTime()
						.domain([minDate, maxDate])
						.range([0,width]);
						
				var axisHeight = y(0);
						
				var yAxis = d3.axisLeft(y);
				var xAxis = d3.axisBottom(x);
				
				var svg = d3.select("body").append("svg").attr("height","100%").attr("width","100%");
				
				var margin = {left:80, right:50, top:40, bottom:0};
				
				var chartGroup = svg.append("g")
							.attr("transform", "translate("+margin.left+", "+margin.top+")");
							
				var line = d3.line()
							.x(function(d){ return x(d.Year); })
							.y(function(d){ return y(d.Glob); });
							
				
							
				var div = d3.select("body").append("div")
							.attr("class", "tooltip")
							.style("opacity", 0);
							
				chartGroup.selectAll("circle")
					.data(data)
					.enter().append("circle")
					.attr("cx", function(d){ return x(d.Year); })
					.attr("cy", function(d){ return y(d.Glob); })
					.attr("r", "3")
					.on("mouseover", function(d) {
				   div.transition()
					 .duration(200)
					 .style("opacity", .9);
				   div .html( 
					 formatTime(d.Year) +                       
					 "<br/>"  + d.Glob)     
					 .style("left", (d3.event.pageX) + "px")             
					 .style("top", (d3.event.pageY - 28) + "px")
				   });
				
				svg.append("text")
				.attr("text-anchor", "middle")
				.attr("transform","translate("+(width/2)+","+margin.top+")")
				.style("font-size", "23px")
				.text("Global Mean Estimates based on Land and Ocean Data");
				
				svg.append("text")
				.attr("text-anchor", "middle")
				.attr("transform", "translate("+ (width) +","+(height-20)+")")
				.style("font-size", "18px")
				.style("fill", "red")
				.text("Year");
				
				svg.append("text")
				.attr("text-anchor", "middle")  
				.attr("transform", "translate("+ (margin.left/2) +","+(height/2)+")rotate(-90)")
				.style("font-size", "18px")
				.style("fill", "red")
				.text("Temperature Anomaly (\xB0C)");
				
var legend = svg.selectAll("g")
        .data(data)
        .enter()
		.append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", width*.15)
        .attr("y", height - 200)
        .attr("width", 20)
        .attr("height", 20);

    legend.append("text")
		.attr("class", "text")
        .attr("x", width*.19)
        .attr("y", height - 190)
        .text("Annual Mean");


	

				
				chartGroup.append("path")					
					.attr("class", "line").attr("d", line(data));
				
				chartGroup.append("g").attr("class", "x axis").attr("transform", "translate(0, "+axisHeight+")").call(xAxis);
				chartGroup.append("g").attr("class", "y axis").call(yAxis);
			});