// Test
var json = d3.json("data/samples.json");
json.then(data =>console.log(data));

//init variable
var dropdownMenu = d3.select("#selDataset");
var demo=d3.select("#sample-metadata");

//drop down function
function dropdown(){
    json.then((data) => {
        var id = data.names;
        id.forEach(i=>dropdownMenu.append("option").text(i))
    })
};
dropdown();

//metadata function
function metadata(mdata){
    Object.entries(mdata[0]).forEach(([key,value]) =>{
    demo.append("h6").text(`${key}:${value}`);
    })
}

//bar plot function
function barPlot(sample){

    var ids = sample[0].otu_ids;
    var otuids = ids.map(x => 'OTU '+ x);
    var sampleValues = sample[0].sample_values;
    var otulabels = sample[0].otu_labels;
    //Create the Trace
    var trace = {
        x: sampleValues.slice(0,10).reverse(),
        y: otuids.slice(0,10).reverse(),
        hovertext: otulabels.slice(0,10).reverse(),
        hoverinfo: "hovertext",
        type: "bar",
        orientation: "h"
    };
    //Create the data array for the plot
    var data = [trace];
    //Create layout
    var layout = {
        margin: {
            l: 100,
            r: 20,
            t: 20,
            b: 20
        },
        width:400,
        height:500,
    };
    //console.log(data);
    return Plotly.newPlot("bar", data, layout);
}

//bubble plot function
function bubblePlot(sample){

    var otuids = sample[0].otu_ids;
    var sampleValues = sample[0].sample_values;
    var otulabels = sample[0].otu_labels;
    
    //Create the trace
    var trace ={
        x: otuids,
        y: sampleValues,
        text: otulabels,
        mode: "markers",
        // colorscale: 'YIGnBu',
        marker:{
            color: otuids,          
            size: sampleValues,
            autocolorscale: false,
            colorscale: 'Earth'
        }
    };
    var data = [trace];
    var layout = {
        // title: 'Bubble Chart Hover Text',
        showlegend: false,
        xaxis: {
            title: {
              text: 'OTU ID',
            }
        },
        margin: {
            // l: 100,
            // r: 20,
            t: 20,
            // b: 40
          },

    } ;
    return Plotly.newPlot("bubble",data,layout);
};

//Update Page
function optionChanged(selectData){
    //clear table
    demo.html("");
    json.then((data) =>{
        //Assign the value of the dropdown menu option to a variable
        // var selectData = dropdownMenu.property("value");
        //Update Demographic Info
        var mdata = data.metadata.filter(x => x.id === parseInt(selectData));
        metadata(mdata);

        //Update bar plot 
        //Define bar plot input variables
        var otudata = data.samples.filter(x =>x.id === selectData);
        var ids = otudata[0].otu_ids;
        var otuids = ids.map(x => 'OTU '+ x);
        var sampleValues = otudata[0].sample_values;
        var otulabels = otudata[0].otu_labels;
        var xBar = [];
        var yBar = [];
        var hovertextBar =[];
        //Define update varibles
        xBar = sampleValues.slice(0,10).reverse(),
        yBar = otuids.slice(0,10).reverse(),
        hovertextBar = otulabels.slice(0,10).reverse(),
        //Restyle bar plot
        Plotly.restyle("bar", "x", [xBar] );
        Plotly.restyle("bar", "y", [yBar] );
        Plotly.restyle("bar", "hovertext", [hovertextBar] );

        //Update bubble plot
        //Define bubble plot input varibales
        var xBubble = [];
        var yBubble = [];
        var textBubble = [];
        //Define update varibles
        xBubble = ids;
        yBubble = sampleValues;
        textBubble = otulabels;
        //Restyle bubble plot
        Plotly.restyle("bubble", "x", [xBubble] );
        Plotly.restyle("bubble", "y", [yBubble] );
        Plotly.restyle("bubble","text",[textBubble]);

        //Update Gauge plot
        //Define data varibles
        var wfreq = mdata[0].wfreq;
        textGauge = [];
        textGauge = wfreq;
        //Restyle gauge plot
        Plotly.restyle("gauge","text",[textGauge],0);
        var level = wfreq*20;
        var degrees = 180 - level;
        var radius = 0.5; 
        var radians = (degrees * Math.PI) / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        //define layout variables
        var mainPath = "M-.0 -0.05 L  .0 0.05 L";
        var pathX = String(x);
        var space = " ";
        var pathY = String(y);
        var pathEnd = " Z";
        var path = mainPath.concat(pathX, space, pathY, pathEnd);
        update = {
            shapes: [
                {
                    type: "path",
                    path: path,
                    fillcolor: "850000",
                    line: {
                        color: "850000"
                    }
                }
            ]
        };
        console.log(path); //test if gauge arm updated
        //Replayout gauge plot
        Plotly.relayout("gauge",update)
        
    })
}


//init
function init(){
    json.then((data) =>{
        //Init Demographic info
        initId = data.metadata[0].id;
        var mdata = data.metadata.filter(x => x.id === initId);
        metadata(mdata);

        //Init barplot
        var odata = data.samples.filter(x => x.id === initId.toString());
        barPlot(odata);

        //Init bubble plot
        bubblePlot(odata);

        //Gauge plot
        gaugePlot(mdata);
    })
}
init();




