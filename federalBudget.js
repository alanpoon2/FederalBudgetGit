function federalBudgetChart(){
	//configurable chart options
	var height = 450,
		width = 620,
		margin=[0,30,170,20],
		prefixClass={'1':d3.formatPrefix(1000),'2':d3.formatPrefix(1),'3':d3.formatPrefix(1)};
	var formatClass={'1':{'cToggleAccept':'All', //salary
		'formatValue':function(val) {return ' '+d3.round(prefixClass['1']('Size').scale(val),2)+prefixClass['1']('Size').symbol;},
		'aggreValueByNest':'%Y-%b'
		}, '2':{'cToggleAccept':'All',     //
		'formatValue':function(val) {return ' '+d3.round(prefixClass['2']('Size').scale(val),2)+prefixClass['2']('Size').symbol;},
		'aggreValueByNest':'%Y-%b-%e'
		}, '3':{'cToggleAccept':'Sales',     //
		'formatValue':function(val) {return ' '+d3.round(prefixClass['3']('Size').scale(val),2)+prefixClass['3']('Size').symbol;},
		'aggreValueByNest':'%Y-%b-%e'
		}
		},
		viewId='preview',
		dataHolder={};
	
		function chart(selection) {
	
		// normally there is only one selection for a chart canvas
		// all data (as array) is passed to the chart to render streams
		selection.each(function(data) {
			console.info("init data:");
			console.info(data);			
					
			// Create the SVG container
			svg = d3.select("#"+viewId).append("svg")
				.attr("width", width)
				.attr("height", height);
			 treeChart = svg.append("svg:g");
			 defs = svg.append("defs");
			debugFn();
		filterInitation(defs);
		JsonProcess(treemap,treeChart,height,width,headerHeight,headerColor,color,insertLineBreakContent,xscale,yscale,formatValue,transitionDuration,viewId,insertToolTipContent);
	
			});
	}		
	
	chart.height = function(value) {
		if (!arguments.length) return height;
		height = value;
		return chart;
	};
	
	chart.width = function(value) {
		if (!arguments.length) return width;
		width = value;
		return chart;
	};
	chart.margin = function(value) {
		if (!arguments.length) return margin;
		margin = value;
		return chart;
	};
	chart.prefixClass = function(value) {
		if (!arguments.length) return prefixClass;
		prefixClass = value;
		return chart;
	};
	chart.formatClass = function(value) {
		if (!arguments.length) return formatClass;
		formatClass = value;
		return chart;
	};
	chart.dataHolder = function(value) {
		if (!arguments.length) return dataHolder;
		dataHolder = value;
		return chart;
	};

	function debugFn(){
	d3select =function(w,h,m,viewId){  
		window['federalBudget_'+viewId]['toolTip']=d3.select("#toolTip_"+viewId);
		window['federalBudget_'+viewId]['header']=d3.select("#toolTip_"+viewId+" head");
		window['federalBudget_'+viewId]['header1'] = d3.select("#toolTip_"+viewId+" header1");
		window['federalBudget_'+viewId]['header2'] = d3.select("#toolTip_"+viewId+" header2");
		window['federalBudget_'+viewId]['ToolTipContainer_Div']={};
		window['federalBudget_'+viewId]['ToolTipContainer_But']={};
		window['federalBudget_'+viewId]['ToolTipContainer_Spend']={};
		
		_.each(window['federalBudget_'+viewId]['ToolTipContainer'],function(d,i){
			var pushObjDiv=d3.select("#toolTip_"+viewId+' #toolAppend'+' toolDiv_'+viewId+'_'+(i+1));
		window['federalBudget_'+viewId]['ToolTipContainer_Div'][d]=pushObjDiv;
		var pushObjBut=d3.select("#navigButton_"+(i+1));
		window['federalBudget_'+viewId]['ToolTipContainer_But'][d]=pushObjBut;
		var pushObjSpend=d3.select("#toolSpend_"+viewId+'_'+(i+1));
		window['federalBudget_'+viewId]['ToolTipContainer_Spend'][d]=pushObjSpend;
		})

	    tree = d3.layout.tree();

          tree.children(function (d) { return d.values; });
          tree.size([h, w]);
		  window['federalBudget_'+viewId]['diagonal']=d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; }); 
		
			window['federalBudget_'+viewId]['vis']=d3.select("#body_"+viewId).append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");	 
			  
	
};
	togglesetup = function(viewId){
	window['federalBudget_'+viewId].root.values.forEach(toggleAll);
         toggle(window['federalBudget_'+viewId].root.values[2]);
	
		for (var propertyName in window['federalBudget_'+viewId]['ToolTipContainer_But']) {
		
	var localButtonArr=_.keys(window['federalBudget_'+viewId]['ToolTipContainer_But']);
	var restlocalButtonArr=_.reject(localButtonArr, function(num){ return num==propertyName; });
		window['federalBudget_'+viewId]['ToolTipContainer_But'][propertyName].on("click",function(d) {
		window['federalBudget_'+viewId]['ToolTipContainer_But'][propertyName].attr("class","selected");
		window['federalBudget_'+viewId]['ToolTipContainer_Div'][propertyName].attr("class","selected");
		window['federalBudget_'+viewId]['Fselect']['spendField']='sum_'+propertyName;
		window['federalBudget_'+viewId]['Fselect']['actField']='sum_'+propertyName;
		_.each(restlocalButtonArr,function(m){
		window['federalBudget_'+viewId]['ToolTipContainer_But'][m].attr("class",null);
		window['federalBudget_'+viewId]['ToolTipContainer_Div'][m].attr("class",null);
		});
		setup();
		update(window['federalBudget_'+viewId]['root']);
		});
	}
    

};
	initialize=function(groupCount){
	var groupbyRange=_.map(_.range(1,groupCount+1),function(m){ return 'groupby'+m;});
	_.each(groupbyRange,function(d,i){
	window['federalBudget_'+viewId][d+'_Max']={};
	window['federalBudget_'+viewId][d+'_Radius']={};
	});
	window['federalBudget_'+viewId]['alreadySummed']=false;
	window['federalBudget_'+viewId]['data_i']=0;
	
	          var nodes = tree.nodes(window['federalBudget_'+viewId].root).reverse();

        tree.children(function (d){ return d.children;});

            for (var i=0; i < window['federalBudget_'+viewId].Fselect.sumField.length; i++) {
    			_.each(groupbyRange,function(d,i){
				window['federalBudget_'+viewId][d+'_Max']['sum_'+window['federalBudget_'+viewId].Fselect.sumField[i]]=0;
				});
            }
            sumNodes(window['federalBudget_'+viewId].root.children);
        };

         setup = function(groupCount) {
			var groupbyRange=_.map(_.range(1,groupCount+1),function(m){ return 'groupby'+m;});
			_.each(groupbyRange,function(d,i){
			window['federalBudget_'+viewId][d+'_Radius']=d3.scale.sqrt()
                    .domain([0, window['federalBudget_'+viewId][d+'_Max'][window['federalBudget_'+viewId].Fselect.spendField]])
                    .range([1,50]);
					
			});
 
        };
}	
		
}


		
	function toggleAll(d) {
	if (d.values && d.values.actuals) {
		d.values.actuals.forEach(toggleAll);
		toggle(d);
	}
	else if (d.values) {
		d.values.forEach(toggleAll);
		toggle(d);
	}
}
	function setSourceFields(child,parent) {
        if (parent) {
		
            for (var i=0; i < window['federalBudget_'+viewId].Fselect.sourceField.length; i++) {
                var sourceField=window['federalBudget_'+viewId].Fselect.sourceField[i];
				
                if (child[sourceField] != undefined) {
                    child["source_" + sourceField] = child[sourceField];
				
                }
                parent["source_" + sourceField] = (child["source_" + sourceField]) ? child["source_" + sourceField] : child[sourceField];
            }
        }

    }
	
	
    function sumNodes(nodes,groupCount)  {
        for (var y=0; y < nodes.length; y++) {
            var node=nodes[y];
            if (node.children) {
                sumNodes(node.children);
                for (var z=0; z < node.children.length; z++) {
                    var child=node.children[z];
                    for (var i=0; i < window['federalBudget_'+viewId].Fselect.sumField.length; i++) {
                        if (isNaN(node["sum_" + window['federalBudget_'+viewId].Fselect.sumField[i]])) node["sum_" + window['federalBudget_'+viewId].Fselect.sumField[i]]=0;
                        node["sum_" + window['federalBudget_'+viewId].Fselect.sumField[i]]+=Number(child["sum_" + window['federalBudget_'+viewId].Fselect.sumField[i]]);

                        //Set scales;
						if((node.parent)){
						for (var i=1;i<=groupCount;i++){
							if(node.depth==i){
							   window['federalBudget_'+viewId][d+'_Max']["sum_" + window['federalBudget_'+viewId].Fselect.sumField[i]]=Math.max(window['federalBudget_'+viewId][d+'_Max']["sum_" + window.Fselect.sumField[i]],Number(node["sum_" + window['federalBudget_'+viewId].Fselect.sumField[i]]));
							}
						}
						setSourceFields(node,node.parent);
						}
                    }
                }
            }
            else {
                for (var i=0; i < window['federalBudget_'+viewId].Fselect.sumField.length; i++) {
                    node["sum_"+window['federalBudget_'+viewId].Fselect.sumField[i]]=Number(node[window['federalBudget_'+viewId].Fselect.sumField[i]]);
                    if (isNaN(node["sum_"+window['federalBudget_'+viewId].Fselect.sumField[i]])) {
                        node["sum_"+window['federalBudget_'+viewId].Fselect.sumField[i]] = 0;
                    }
                }
            }
            setSourceFields(node,node.parent);
        }

    }
	
    function update(source,groupCount) {

        var duration = d3.event && d3.event.altKey ? 5000 : 500;

        var nodes = tree.nodes(window['federalBudget_'+viewId].root).reverse();

        var depthCounter=0;

        // Normalize for fixed-depth.
        nodes.forEach(function(d) {
            d.y = d.depth * 180;
            d.numChildren=(d.children) ? d.children.length : 0;

            if (d.depth==1) {
                d.linkColor=window['federalBudget_'+viewId].colors[(depthCounter % (window['federalBudget_'+viewId].colors.length-1))];
                depthCounter++;
            }

            if (d.numChildren==0 && d._children) d.numChildren= d._children.length;

        });

        //Set link colors
        nodes.forEach(function (d) {
            var obj=d;

            while ((obj.source && obj.source.depth > 1) || obj.depth > 1) {
                obj=(obj.source) ? obj.source.parent : obj.parent;
            }

            d.linkColor=(obj.source) ? obj.source.linkColor : obj.linkColor;

        });

        // Update the nodes…
        var node = window['federalBudget_'+viewId].vis.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++window['federalBudget_'+viewId].data_i); });
		
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("svg:g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("click", function(d) {
                    if (d.numChildren > 50) {
                        alert(d.key + " has too many departments (" + d.numChildren + ") to view at once.");
                    }
                    else {
                        toggle(d);
                        update(d);
                    }
                });

        nodeEnter.append("svg:circle")
                .attr("r", 1e-6)
                .on("mouseover", function(d) { node_onMouseOver(d);})
                .on("mouseout", function(d) {							// when the mouse leaves a circle, do the following
                    window.toolTip.transition()									// declare the transition properties to fade-out the div
                            .duration(500)									// it shall take 500ms
                            .style("opacity", "0");							// and go all the way to an opacity of nil
                })
                .style("fill", function(d) { return d.source ? d.source.linkColor: d.linkColor;
                })
                .style("fill-opacity", ".8")
                .style("stroke", function(d) { return d.source ? d.source.linkColor: d.linkColor;
                    });


        nodeEnter.append("svg:text")
                .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                .attr("dy", ".35em")
                .attr("text-anchor",
                function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
				
                    if (d.depth ==1) {var ret = d.key;}
					else if (d.depth==2) {var ret = d.key+"_ _ _ _ _ _";}
					else if (d.depth==3) {var ret = d.source_Level2+d.key+"_ _ _ _";}
					else if (d.depth ==4) {var ret = d.source_Level2+d.source_Level3+d.key+"_ _";}
					else if (d.depth==5) {var ret = d.source_Level2+d.source_Level3+d.source_Level4+d.key;}
                    ret = (String(ret).length > 25) ? String(ret).substr(0,22)  + "..." : ret;
					
                    return ret;
                })
                .on("mouseover", function(d) { node_onMouseOver(d);})
                .on("mouseout", function(d) {							// when the mouse leaves a circle, do the following
                    toolTip.transition()									// declare the transition properties to fade-out the div
                            .duration(500)									// it shall take 500ms
                            .style("opacity", "0");							// and go all the way to an opacity of nil
                })
                .style("fill-opacity", "0");

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

        nodeUpdate.select("circle")
                .attr("r", function (d) {

                        if (d.depth==0) {
                            return 10;
                        }
                        else if (d.depth==1) {
                            var ret = window.level1Radius(d[window.Fselect.spendField]);
                            return (isNaN(ret) ? 2 : ret);
                        }
                        else if (d.depth==2) {
                            var ret = window.level2Radius(d[window.Fselect.spendField]);
							console.log("ret circle:",ret);
                            return (isNaN(ret) ? 2 : ret);
                        }
                        else if (d.depth==3) {
                            var ret = window.level3Radius(d[window.Fselect.spendField]);
                            return (isNaN(ret) ? 2 : ret);
                        }
                        else if (d.depth==4) {
                            var ret = window.level4Radius(d[window.Fselect.spendField]);
                            return (isNaN(ret) ? 2 : ret);
                        } else if (d.depth==5) {
                            var ret = window.level5Radius(d[window.Fselect.spendField]);
                            return (isNaN(ret) ? 2 : ret);
                        }
						
                })
                .style("fill", function(d) { return d.source ? d.source.linkColor: d.linkColor})
                .style("fill-opacity",  function(d) {
                    var ret = ((d.depth+1)/5);
                    return ret; });




        nodeUpdate.select("text")
                .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + source.y + "," + source.x + ")";
					
                })
                .remove();

        nodeExit.select("circle")
                .attr("r", 1e-6);

        nodeExit.select("text")
                .style("fill-opacity", 1e-6);

        // Update the links…
        var link = window.vis.selectAll("path.link")
                .data(tree.links(nodes), function(d) {
                    return d.target.id;
                });

        var rootCounter=0;

        // Enter any new links at the parent's previous position.
        link.enter().insert("svg:path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    if (Number(d.target[window.Fselect.spendField]) > 0) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    }
                    else {
                        null;
                    }
                })
                .style("stroke",function (d,i) {
                    if (d.source.depth==0) {
                        rootCounter++;
                        return (d.source.children[rootCounter-1].linkColor);
                    }
                    else {
                        return (d.source) ? d.source.linkColor : d.linkColor;
                    }
                })
                .style("stroke-width", function (d,i) {

                    if (d.source.depth==0) {
                        var ret = window.level1Radius(d.target[window.Fselect.spendField]) * 2;
                        return (isNaN(ret) ? 4 : ret);
                    }
                    else if (d.source.depth==1) {
                        var ret = window.level2Radius(d.target[window.Fselect.spendField]) * 2;
                        return (isNaN(ret) ? 4 : ret);
                    }
                    else if (d.source.depth==2) {
                        var ret = window.level3Radius(d.target[window.Fselect.spendField]) * 2;
                        return (isNaN(ret) ? 4 : ret);
                    }
                    else if (d.source.depth==3) {
                        var ret = window.level4Radius(d.target[window.Fselect.spendField]) * 2;
                        return (isNaN(ret) ? 4 : ret);
                    }
						else if (d.source.depth==4) {
                        var ret = window.level5Radius(d.target[window.Fselect.spendField]) * 2;
                        return (isNaN(ret) ? 4 : ret);
                    }
                 })
                .style("stroke-opacity", function(d){
                    var ret = ((d.source.depth+1)/4.5)
                    if (d.target[window.Fselect.spendField] <= 0) ret=.1;
                    return ret;
                })
                .style("stroke-linecap","round")
                .transition()
                .duration(duration);
          //      .attr("d", diagonal);


        // Transition links to their new position.
         var linkUpdate = link.transition()
                .duration(duration)
                .attr("d", diagonal);

         linkUpdate
                 .style("stroke-width", function (d,i) {
                     if (d.source.depth==0) {
                         var ret = window.level1Radius(Number(d.target[window.Fselect.spendField])) * 2;
                         return (isNaN(ret) ? 4 : ret);
                     }
                     else if (d.source.depth==1) {
                         var ret = window.level2Radius(Number(d.target[window.Fselect.spendField])) * 2;
                         return (isNaN(ret) ? 4 : ret);
                     }
                     else if (d.source.depth==2) {
                         var ret = window.level3Radius(Number(d.target[window.Fselect.spendField])) * 2;
                         return (isNaN(ret) ? 4 : ret);
                     }
                     else if (d.source.depth==3) {
                         var ret = window.level4Radius(Number(d.target[window.Fselect.spendField])) * 2;
                         return (isNaN(ret) ? 4 : ret);
                     }
					   else if (d.source.depth==4) {
                         var ret = window.level5Radius(Number(d.target[window.Fselect.spendField])) * 2;
                         return (isNaN(ret) ? 4 : ret);
                     }
                })
             //    .style("stroke-dasharray", function(d) {
             //       var ret=(d.target[window.Fselect.spendField] > 0) ? "" : "5,8";
             //       return ret;
             //    })
                 .style("stroke-opacity", function(d){
                     var ret = ((d.source.depth+1)/4.5)
                     if (d.target[window.Fselect.spendField] <= 0) ret=.1;
                     return ret;
                 })


        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
                .duration(duration)
                .attr("d", diagonal)
                .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });


        function node_onMouseOver(d) {
            window.toolTip.transition()
                    .duration(200)
                    .style("opacity", ".9");
            window.header.text(window.retDes(d));
            window.header1.text((d.depth > 1) ? d["source_Level2"] : "");
            window.header2.html((d.depth > 2) ? d["source_Level3"] : "");
			  var formatNumber = d3.format(",.3f");
			var formatCurrency = function(d) { return formatNumber(d) };

            if (d.depth > 4) window.header2.html(window.header2.html() + " - "  + d["source_Level5"]);

            window.fedSpend.text(formatCurrency(d["sum_Federal"]));

            window.stateSpend.text(formatCurrency(d["sum_State"]));

            window.localSpend.text(formatCurrency(d["sum_Local"]));

            window.toolTip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
        }




    }


    function toggleButton(button) {
        button.attr("class","selected");
        if (button == window.federalButton) {
            window.localButton.attr("class","unselected");
            window.stateButton.attr("class","unselected");
        }
        else if (button == window.stateButton) {
            window.localButton.attr("class","unselected");
            window.federalButton.attr("class","unselected");
        }
        else {
            window.federalButton.attr("class","unselected");
            window.stateButton.attr("class","unselected");
        }
    }


        // Toggle children.
    function toggle(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
    }




















