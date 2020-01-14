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

//bar plot
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
            t: 0,
            b: 40
        },
        width:400,
        height:500,
    };
    
    //console.log(data);
    return Plotly.newPlot("bar", data, layout);
}

//bubble plot
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
            size: sampleValues 
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
            t: 0,
            // b: 40
          },

    } ;
    
    return Plotly.newPlot("bubble",data,layout);
};


//On change
d3.select("#selDataset").on("change", updatePlotly);

//Render Page
function updatePlotly(){
    //clear table
    demo.html("");
    json.then((data) =>{
        //Assign the value of the dropdown menu option to a variable
        var selectData = dropdownMenu.property("value");
        //Update Demographic Info
        var mdata = data.metadata.filter(x => x.id === parseInt(selectData));
        metadata(mdata);
        //Update bar plot 
        var otudata = data.samples.filter(x =>x.id === selectData);
        var ids = otudata[0].otu_ids;
        var otuids = ids.map(x => 'OTU '+ x);
        var sampleValues = otudata[0].sample_values;
        var otulabels = otudata[0].otu_labels;
        var xbar = [];
        var ybar = [];
        var hovertext =[];
        xBar = sampleValues.slice(0,10).reverse(),
        yBar = otuids.slice(0,10).reverse(),
        hovertextBar = otulabels.slice(0,10).reverse(),
        Plotly.restyle("bar", "x", [xBar] );
        Plotly.restyle("bar", "y", [yBar] );
        Plotly.restyle("bar", "hovertext", [hovertextBar] );
        //Update bubble plot
        var otudata = data.samples.filter(x =>x.id === selectData);
        var xBubble = [];
        var yBubble = [];
        var textBubble = [];
        xBubble = ids;
        yBubble = sampleValues;
        textBubble = otulabels;
        Plotly.restyle("bubble", "x", [xBubble] );
        Plotly.restyle("bubble", "y", [yBubble] );
        Plotly.restyle("bubble","text",[textBubble]);
        //Render Gauge plot
        gaugePlot(mdata);
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
        var otudata = data.samples.filter(x => x.id === initId.toString());
        bubblePlot(otudata);
        //Gauge plot
        gaugePlot(mdata);
    })
}
init();




