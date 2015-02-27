!function(){

    /*      window.root = {};
	window.FSelect={spendField:"sum_Federal",actField:"sum_Federal",sumField: ["Federal","GovXFer","State","Local"], sourceFields: ["Category","Level1","Level2","Level3","Level4"]};


    window.colors = ["#bd0026","#fecc5c", "#fd8d3c", "#f03b20", "#B02D5D",
        "#9B2C67", "#982B9A", "#692DA7", "#5725AA", "#4823AF",
        "#d7b5d8","#dd1c77","#5A0C7A","#5A0C7A"];

	*/

d3select =function(w,h,m){  

		window.toolTip = d3.select(document.getElementById("toolTip"));
				window.header = d3.select(document.getElementById("head"));
		window.header1 = d3.select(document.getElementById("header1"));
		window.header2 = d3.select(document.getElementById("header2"));
				window.federalButton=d3.select(document.getElementById("federalButton"));
		window.stateButton=d3.select(document.getElementById("stateButton"));
		window.localButton=d3.select(document.getElementById("localButton"));
		    window.federalDiv=d3.select(document.getElementById("federalDiv"));
    window.stateDiv=d3.select(document.getElementById("stateDiv"));
    window.localDiv=d3.select(document.getElementById("localDiv"));
	
    window.fedSpend = d3.select(document.getElementById("fedSpend"));

    window.stateSpend = d3.select(document.getElementById("stateSpend"));

    window.localSpend = d3.select(document.getElementById("localSpend"));
	    tree = d3.layout.tree();

          tree.children(function (d) { return d.values; });
          tree.size([h, w]);
		window.diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });  
			
		  window.vis = d3.select("#body").append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");	 
		
			
		  
	
}

togglesetup = function(){
	window.root.values.forEach(toggleAll);
         toggle(window.root.values[2]);
     window.stateButton.on("click",function (d) {
            window.stateButton.attr("class","selected")
            window.federalButton.attr("class",null);
            window.localButton.attr("class",null);
            window.stateDiv.attr("class","selected")
            window.federalDiv.attr("class",null);
            window.localDiv.attr("class",null);
            window.Fselect.spendField="sum_State";
            window.Fselect.actField="sum_State";
            setup();
            update(window.root);
	
        });
        window.localButton.on("click",function (d) {
            window.localButton.attr("class","selected")
            window.stateButton.attr("class",null);
            window.federalButton.attr("class",null);
            window.localDiv.attr("class","selected")
            window.federalDiv.attr("class",null);
            window.stateDiv.attr("class",null);
            window.Fselect.spendField="sum_Local";
            window.Fselect.actField="sum_Local";
            setup();
            update(window.root);
        });
        window.federalButton.on("click",function (d) {
            window.federalButton.attr("class","selected")
            window.stateButton.attr("class",null);
            window.localButton.attr("class",null);
            window.federalDiv.attr("class","selected")
            window.stateDiv.attr("class",null);
            window.localDiv.attr("class",null);
            window.Fselect.spendField="sum_Federal";
            setup();
            update(window.root);
        });
        update(window.root);

}
  
  
  
  	initialize=function(){
  window.level1Max={};
    window.level2Max={};
   window.level3Max={};
    window.level4Max={};
	window.level5Max={};
	    window.level1Radius;
    window.level2Radius;
    window.level3Radius;
    window.level4Radius;
	window.level5Radius;
    window.alreadySummed=false;
	window.data_i=0;
	          var nodes = tree.nodes(window.root).reverse();

        tree.children(function (d){ return d.children;});

            for (var i=0; i < window.Fselect.sumField.length; i++) {
                window.level1Max["sum_" + window.Fselect.sumField[i]]=0;
                window.level2Max["sum_" + window.Fselect.sumField[i]]=0;
                window.level3Max["sum_" + window.Fselect.sumField[i]]=0;
                window.level4Max["sum_" + window.Fselect.sumField[i]]=0;
				window.level5Max["sum_" + window.Fselect.sumField[i]]=0;
            }
            sumNodes(window.root.children);
        }

         setup = function() {

            window.level1Radius=d3.scale.sqrt()
                    .domain([0, window.level1Max[window.Fselect.spendField]])
                    .range([1,50]);

            window.level2Radius=d3.scale.sqrt()
                    .domain([0, window.level2Max[window.Fselect.spendField]])
                    .range([1,50]);

            window.level3Radius=d3.scale.sqrt()
                    .domain([0, window.level3Max[window.Fselect.spendField]])
                    .range([1,50]);

            window.level4Radius=d3.scale.sqrt()
                    .domain([0, window.level4Max[window.Fselect.spendField]])
                    .range([1,50]);

            window.level5Radius=d3.scale.sqrt()
                    .domain([0, window.level5Max[window.Fselect.spendField]])
                    .range([1,40]);
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
		
            for (var i=0; i < window.Fselect.sourceField.length; i++) {
                var sourceField=window.Fselect.sourceField[i];
				
                if (child[sourceField] != undefined) {
                    child["source_" + sourceField] = child[sourceField];
				
                }
                parent["source_" + sourceField] = (child["source_" + sourceField]) ? child["source_" + sourceField] : child[sourceField];
            }
        }

    }
	
	
    function sumNodes(nodes)  {
        for (var y=0; y < nodes.length; y++) {
            var node=nodes[y];
            if (node.children) {
                sumNodes(node.children);
                for (var z=0; z < node.children.length; z++) {
                    var child=node.children[z];
                    for (var i=0; i < window.Fselect.sumField.length; i++) {
                        if (isNaN(node["sum_" + window.Fselect.sumField[i]])) node["sum_" + window.Fselect.sumField[i]]=0;
                        node["sum_" + window.Fselect.sumField[i]]+=Number(child["sum_" + window.Fselect.sumField[i]]);

                        //Set scales;

                      //  console.log("sum_" + window.Fselect.sumField[i] + " " + node["sum_"+window.Fselect.sumField[i]]);

                        if ((node.parent)) {
                            if (node.depth==1) {
                                window.level1Max["sum_" + window.Fselect.sumField[i]]=Math.max(window.level1Max["sum_" + window.Fselect.sumField[i]],Number(node["sum_" + window.Fselect.sumField[i]]));
                            }
                            else if (node.depth==2) {
                                window.level2Max["sum_" + window.Fselect.sumField[i]]=Math.max(window.level2Max["sum_" + window.Fselect.sumField[i]],Number(node["sum_" + window.Fselect.sumField[i]]));
                            }
                            else if (node.depth==3) {
                                window.level3Max["sum_" + window.Fselect.sumField[i]]=Math.max(window.level3Max["sum_" + window.Fselect.sumField[i]],Number(node["sum_" + window.Fselect.sumField[i]]));
                            }
                            else if (node.depth==4) {
                                window.level4Max["sum_" + window.Fselect.sumField[i]]=Math.max(window.level4Max["sum_" + window.Fselect.sumField[i]],Number(node["sum_" + window.Fselect.sumField[i]]));
                            }
							else if (node.depth==5) {
                                window.level5Max["sum_" + window.Fselect.sumField[i]]=Math.max(window.level5Max["sum_" + window.Fselect.sumField[i]],Number(node["sum_" + window.Fselect.sumField[i]]));
                            }
                            setSourceFields(node,node.parent);
                        }

                    }
                }
            }
            else {
                for (var i=0; i < window.Fselect.sumField.length; i++) {
                    node["sum_"+window.Fselect.sumField[i]]=Number(node[window.Fselect.sumField[i]]);
                    if (isNaN(node["sum_"+window.Fselect.sumField[i]])) {
                        node["sum_"+window.Fselect.sumField[i]] = 0;
                    }
                }
            }
            setSourceFields(node,node.parent);
        }

    }
	
    function update(source) {

        var duration = d3.event && d3.event.altKey ? 5000 : 500;

        var nodes = tree.nodes(window.root).reverse();

        var depthCounter=0;

        // Normalize for fixed-depth.
        nodes.forEach(function(d) {
            d.y = d.depth * 180;
            d.numChildren=(d.children) ? d.children.length : 0;

            if (d.depth==1) {
                d.linkColor=window.colors[(depthCounter % (window.colors.length-1))];
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
        var node = window.vis.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++window.data_i); });
		
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
    }}();




















