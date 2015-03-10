function federalChart(){
	// configurable chart options
		var viewId='preview';
		var width=500;
		var height=450;
		var margin=[0,30,170,20];
		var root={'values':[]};
		var groupCount=2;
		var ToolTipContainer;
		var holding={};
		var  retDes=function(d) {
                 var ret = d.source_description;
                 ret = (String(ret).length > 25) ? String(ret).substr(0, 22) + "..." : ret;
                 return ret;
             };
		var toolTip=1;
		var header=1;
		var header1=1; var header2;
		var ToolTipContainer_Div={};
		var ToolTipContainer_But={};

		var ToolTipContainer_Spend={};
		var tree;
		var diagonal;
		var vis;
		var Fselect={};
		var colors=["#bd0026","#fecc5c", "#fd8d3c", "#f03b20", "#B02D5D",
        "#9B2C67", "#982B9A", "#692DA7", "#5725AA", "#4823AF",
        "#d7b5d8","#dd1c77","#5A0C7A","#5A0C7A"];
	function chart(selection) {
		selection.each(function(data) {
	
	console.log("Fselect",Fselect);

		
		debugFn2();
		d3select();
		
		initialize(groupCount);
		setup();
		togglesetup();
		});
		}	
	chart.viewId = function(value) {
		if (!arguments.length) return viewId;
		viewId = value;
		return chart;
	};	
	chart.width = function(value) {
		if (!arguments.length) return width;
		width = value;
		return chart;
	};	
	chart.height = function(value) {
		if (!arguments.length) return height;
		height = value;
		return chart;
	};	
	chart.margin = function(value) {
		if (!arguments.length) return margin;
		margin = value;
		return chart;
	};
	chart.root = function(value) {
		if (!arguments.length) return root;
		root = value;
		return chart;
	};
	chart.groupCount = function(value) {
		if (!arguments.length) return groupCount;
		groupCount = value;
		return chart;
		};
	chart.ToolTipContainer = function(value){
		if (!arguments.length) return ToolTipContainer;
		ToolTipContainer = value;
		return chart;
	};
		chart.retDes = function(value){
		if (!arguments.length) return retDes;
		retDes = value;
		return chart;
	};
	chart.Fselect = function(value){
		if (!arguments.length) return Fselect;
		Fselect = value;
		return chart;
	};
	chart.colors = function(value){
		if (!arguments.length) return colors;
		colors = value;
		return chart;
	};

	return chart;
	function debugFn2(){
    d3select = function() {
	toolTip=d3.select("#toolTip_" + viewId);
	header= d3.select("#toolTip_" + viewId + " #head");
	header1=d3.select("#toolTip_" + viewId + " #header1");
	header2= d3.select("#toolTip_" + viewId + " #header2");
        console.log("d3select ToolTipContainer",ToolTipContainer,'viewId',viewId);
console.log("d3select ToolTipContainer",ToolTipContainer);
        _.each(_.keys(ToolTipContainer), function(d, i) {
		var divLeft=i*140+'px';
            var pushObjDiv = d3.select("#toolTip_" + viewId + ' #toolAppend' + ' #toolDiv_' + viewId + '_' + (i + 1))
					.style({'width':'125px','left':divLeft ,'top':'10px','position':'absolute'});
        	ToolTipContainer_Div[d]=pushObjDiv;
            var pushObjBut = d3.select("#navigButton_" + (i + 1));
        	ToolTipContainer_But[d]=pushObjBut;
            var pushObjSpend = d3.select("#toolSpend_" + viewId + '_' + (i + 1));
        	ToolTipContainer_Spend[d]=pushObjSpend;
        });

        tree = d3.layout.tree();

        tree.children(function(d) {
            return d.values;
        });
        tree.size([height, width]);
        diagonal = d3.svg.diagonal()
            .projection(function(d) {
                return [d.y, d.x];
            });

        vis = d3.select("#body_" + viewId).append("svg:svg")
            .attr("width", width + parseInt(margin[1]) + parseInt(margin[3]))
            .attr("height", height + parseInt(margin[0]) + parseInt(margin[2]))
            .append("svg:g")
            .attr("transform", "translate(" + parseInt(margin[3]) + "," + parseInt(margin[2]) + ")");


    };
	
    togglesetup = function() {
        root.values.forEach(toggleAll);
		console.log("root.values[2]",root.values[2]);
        toggle(root.values[2]);

        for (var propertyName in ToolTipContainer_But) {

            var localButtonArr = _.keys(ToolTipContainer_But);
       
            d3.select("#navigButton_" + (propertyName + 1)).on("click", function(d) {
                d3.select("#navigButton_" + (propertyName + 1)).attr("class", "selected");
              
			       var restlocalButtonArr = _.reject(localButtonArr, function(num) {
                return num == propertyName;
            });
                Fselect['spendField'] = 'sum_' + ToolTipContainer[propertyName];
                Fselect['actField'] = 'sum_' + ToolTipContainer[propertyName];
                _.each(restlocalButtonArr, function(m) {
                    ToolTipContainer_But[m].attr("class", null);
                    ToolTipContainer_Div[m].attr("class", null);
                });
                setup();
                update(root, groupCount,viewId);
            });
        }
		

		update(root, groupCount,viewId);

    };
    initialize = function(groupCount) {
        var groupbyRange = _.map(_.range(1, groupCount + 1), function(m) {
            return 'groupby' + m;
        });
        _.each(groupbyRange, function(d, i) {
           holding[d + '_Max'] = {};
            holding[d + '_Radius'] = {};
        });
       alreadySummed = false;
        data_i = 0;

        var nodes = tree.nodes(root).reverse();
		console.log("nodes..",nodes);
        tree.children(function(d) {
            return d.children;
        });
	
        for (var i = 0; i < Fselect.sumField.length; i++) {
            _.each(groupbyRange, function(d) {
                holding[d + '_Max']['sum_' + Fselect.sumField[i]] = 0;
				
            });
        }

        sumNodes(root.children,groupCount,viewId);
    };

    setup = function() {

        var groupbyRange = _.map(_.range(1, groupCount + 1), function(m) {
            return 'groupby' + m;
        });
        _.each(groupbyRange, function(d, i) {
            holding[d + '_Radius'] = d3.scale.sqrt()
                .domain([0,holding[d+'_Max'][Fselect.spendField]])
                .range([1, 50]);

        });

    };
	} //end debug2Fn()
	

function toggleAll(d) {
    if (d.values && d.values.actuals) {
        d.values.actuals.forEach(toggleAll);
        toggle(d);
    } else if (d.values) {
        d.values.forEach(toggleAll);
        toggle(d);
    }
}

function setSourceFields(child, parent,viewId) {
    if (parent) {

        for (var i = 0; i < Fselect.sourceField.length; i++) {
            var sourceField = Fselect.sourceField[i];

            if (child[sourceField] != undefined) {
                child["source_" + sourceField] = child[sourceField];

            }
            parent["source_" + sourceField] = (child["source_" + sourceField]) ? child["source_" + sourceField] : child[sourceField];
        }
    }

}


function sumNodes(nodes, groupCount,viewId) {
    for (var y = 0; y < nodes.length; y++) {
        var node = nodes[y];
        if (node.children) {
            sumNodes(node.children,groupCount,viewId);
            for (var z = 0; z < node.children.length; z++) {
                var child = node.children[z];
                for (var i = 0; i < Fselect.sumField.length; i++) {
                    if (isNaN(node["sum_" + Fselect.sumField[i]])) node["sum_" + Fselect.sumField[i]] = 0;
                    node["sum_" + Fselect.sumField[i]] += Number(child["sum_" + Fselect.sumField[i]]);

                    //Set scales;
                    if ((node.parent)) {
                        for (var n = 1; n <= groupCount; n++) {
                            if (node.depth == n) {
                                holding['groupby'+n + '_Max']["sum_" + Fselect.sumField[i]] = Math.max(parseInt(holding['groupby'+n + '_Max']["sum_" + Fselect.sumField[i]]), Number(node["sum_" + Fselect.sumField[i]]));
							
                            }
                        }
                        setSourceFields(node, node.parent,viewId);
                    }
                }
            }
        } else {
            for (var i = 0; i < Fselect.sumField.length; i++) {
                node["sum_" + Fselect.sumField[i]] = Number(node[Fselect.sumField[i]]);
                if (isNaN(node["sum_" + Fselect.sumField[i]])) {
                    node["sum_" + Fselect.sumField[i]] = 0;
                }
            }
        }
        setSourceFields(node, node.parent,viewId);
    }

}

function update(source, groupCount,viewId) {

    var duration = d3.event && d3.event.altKey ? 5000 : 500;

    var nodes = tree.nodes(root).reverse();

    var depthCounter = 0;

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
        d.y = d.depth * 180;
        d.numChildren = (d.children) ? d.children.length : 0;

        if (d.depth == 1) {
            d.linkColor = colors[(depthCounter % (colors.length - 1))];
            depthCounter++;
        }

        if (d.numChildren == 0 && d._children) d.numChildren = d._children.length;

    });

    //Set link colors
    nodes.forEach(function(d) {
        var obj = d;

        while ((obj.source && obj.source.depth > 1) || obj.depth > 1) {
            obj = (obj.source) ? obj.source.parent : obj.parent;
        }

        d.linkColor = (obj.source) ? obj.source.linkColor : obj.linkColor;

    });

    // Update the nodes…
    var node = vis.selectAll("g.node")
        .data(nodes, function(d) {
            return d.id || (d.id = ++data_i);
        });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on("click", function(d) {
            if (d.numChildren > 50) {
                alert(d.key + " has too many departments (" + d.numChildren + ") to view at once.");
            } else {
                toggle(d);
                update(d,groupCount,viewId);
            }
        });

    nodeEnter.append("svg:circle")
        .attr("r", 1e-6)
        .on("mouseover", function(d) {
            node_onMouseOver(d, groupCount,viewId);
        })
        .on("mouseout", function(d) { // when the mouse leaves a circle, do the following
            toolTip.transition() // declare the transition properties to fade-out the div
                .duration(500) // it shall take 500ms
                .style("opacity", "0"); // and go all the way to an opacity of nil
        })
        .style("fill", function(d) {
            return d.source ? d.source.linkColor : d.linkColor;
        })
        .style("fill-opacity", ".8")
        .style("stroke", function(d) {
            return d.source ? d.source.linkColor : d.linkColor;
        });


    nodeEnter.append("svg:text")
        .attr("x", function(d) {
            return d.children || d._children ? -10 : 10;
        })
        .attr("dy", ".35em")
        .attr("text-anchor",
            function(d) {
                return d.children || d._children ? "end" : "start";
            })
        .text(function(d) {
            var groupbyRange = _.map(_.range(1, groupCount + 1), function(m) {
                return 'groupby' + m;
            });
            if (d.depth == 1) {
                var ret = d.key;
            }
            _.each(groupbyRange, function(m, n) {
                if (d.depth == (n + 2)) {
                    var ret = d['source_' + m];
                }
            });
            ret = (String(ret).length > 25) ? String(ret).substr(0, 22) + "..." : ret;
            return ret;
        })
        .on("mouseover", function(d) {
            node_onMouseOver(d, groupCount,viewId);
        })
        .on("mouseout", function(d) { // when the mouse leaves a circle, do the following
            toolTip.transition() // declare the transition properties to fade-out the div
                .duration(500) // it shall take 500ms
                .style("opacity", "0"); // and go all the way to an opacity of nil
        })
        .style("fill-opacity", "0");

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    nodeUpdate.select("circle")
        .attr("r", function(d) {
            var groupbyRange = _.map(_.range(1, groupCount + 1), function(m) {
                return 'groupby' + m;
            });
            var rSize;
            if (d.depth == 0) {
                rSize = 10;
            }
            _.each(groupbyRange, function(m, n) {
                if (d.depth == (n + 1)) {
                    var ret = holding[m + '_Radius'](d[Fselect.spendField]);
                    rSize = (isNaN(ret) ? 2 : ret);
                }
            });
            return rSize;
        })
        .style("fill", function(d) {
            return d.source ? d.source.linkColor : d.linkColor
        })
        .style("fill-opacity", function(d) {
            var ret = ((d.depth + 1) / 5);
            return ret;
        });

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
    var link = vis.selectAll("path.link")
        .data(tree.links(nodes), function(d) {
            return d.target.id;
        });

    var rootCounter = 0;

    // Enter any new links at the parent's previous position.
    link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            if (Number(d.target[Fselect.spendField]) > 0) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            } else {
                null;
            }
        })
        .style("stroke", function(d, i) {
            var groupbyRange = _.map(_.range(1, groupCount + 1), function(m) {
                return 'groupby' + m;
            });
            if (d.source.depth == 0) {
                rootCounter++;
                return (d.source.children[rootCounter - 1].linkColor);
            } else {
                return (d.source) ? d.source.linkColor : d.linkColor;
            }
        })
        .style("stroke-width", function(d, i) {
            var groupbyRange = _.map(_.range(1, groupCount + 1), function(m) {
                return 'groupby' + m;
            });
            var strokeSize;
            _.each(groupbyRange, function(m, n) {
                if (d.source.depth == n) {
			
                    var ret = holding[m + '_Radius'](d.target[Fselect.spendField]) * 2;
                    strokeSize = (isNaN(ret) ? 4 : ret);
                }
            });
            return strokeSize;
        })
        .style("stroke-opacity", function(d) {
            var ret = ((d.source.depth + 1) / 4.5)
            if (d.target[Fselect.spendField] <= 0) ret = .1;
            return ret;
        })
        .style("stroke-linecap", "round")
        .transition()
        .duration(duration);
    //      .attr("d", diagonal);


    // Transition links to their new position.
    var linkUpdate = link.transition()
        .duration(duration)
        .attr("d", diagonal);

    linkUpdate
        .style("stroke-width", function(d, i) {
            var groupbyRange = _.map(_.range(1, groupCount + 1), function(m) {
                return 'groupby' + m;
            });
            var strokeSize;
            _.each(groupbyRange, function(m, n) {
                if (d.source.depth == n) {
                    var ret = holding[m + '_Radius'](Number(d.target[Fselect.spendField])) * 2;
                    strokeSize = (isNaN(ret) ? 4 : ret);
                }
            });
            return strokeSize;
        })
     
        .style("stroke-opacity", function(d) {
            var ret = ((d.source.depth + 1) / 4.5)
            if (d.target[Fselect.spendField] <= 0) ret = .1;
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

}

function node_onMouseOver(d, groupCount,viewId) {
    toolTip.transition().duration(200).style("opacity", ".9");
    header.text(retDes(d));
    var groupbyRange = _.map(_.range(1, groupCount + 1), function(m) {
        return 'groupby' + m;
    });

    _.each(groupbyRange, function(m, n) {
        if (d.depth == (n + 1)) {
		//	header2.html(d['source_' + m]);
            header1.text(d['source_' + m]);
        } else header1.text("");
    });

    var formatNumber = d3.format(",^ $");
    var formatCurrency = function(d) {
        return formatNumber(d)
    };
    for (var propertyName in ToolTipContainer) {
        ToolTipContainer_Spend[propertyName].text(formatCurrency(d['sum_' + ToolTipContainer[propertyName]]));
        toolTip.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
    }

}

function toggleButton(button,viewId) {
    button.attr("class", "selected");
    for (var propertyName in ToolTipContainer_But) {

        var localButtonArr = _.keys(ToolTipContainer_But);
        var restlocalButtonArr = _.reject(localButtonArr, function(num) {
            return num == propertyName;
        });
        if (button == ToolTipContainer_But[propertyName]) {
            _.each(restlocalButtonArr, function(m) {
				ToolTipContainer_But[m].attr("class", "unselected");

            });
        }

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

}
