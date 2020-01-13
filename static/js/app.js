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
        id.forEach(i=>{
            dropdownMenu.append("option").text(i);
        })
    })
}
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
    var otuids = ids.map(x => 'OTU '+ x.toString());
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
    //console.log(data);
    return data;
}

//bubble plot
function bubblePlot(sample){

    var otuids = sample[0].otu_ids;
    var sampleValues = sample[0].sample_values;
    var otulabels = sample[0].otu_labels;
    
    //Create the trace
    var trace ={
        y: sampleValues,
        x: otuids,
        mode: "markers",
        text: otulabels,
        marker:{
            color: otuids,
            size: sampleValues 
        }
    }
    var data = [trace];
    return data;
};

//gauge plot



//On change
d3.select("#selDataset").on("change", renderPage);

//Render Page
function renderPage(){
    //clear table
    demo.html("");
    json.then((data) =>{
        //Assign the value of the dropdown menu option to a variable
        var selectData = dropdownMenu.property("value");
        //Render Demographic info
        var mdata = data.metadata.filter(x => x.id === parseInt(selectData));
        metadata(mdata);
        //Render bar plot
        var otudata = data.samples.filter(x =>x.id === selectData);
        var x = [];
        var y = [];
        bardata = barPlot(otudata);
        Plotly.restyle("bar", "x", [bardata[0].x] );
        Plotly.restyle("bar", "y", [bardata[0].y] );
        //Render bubble plot
        var otudata = data.samples.filter(x =>x.id === selectData);
        bubbledata = bubblePlot(otudata);
        Plotly.restyle("bubble", "x", [bubbledata[0].x] );
        Plotly.restyle("bubble", "y", [bubbledata[0].y] );
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
        var layout = {
            margin: {
                l: 100,
                r: 20,
                t: 0,
                b: 40
              },
            width:400,
            height:500,
        }
        Plotly.newPlot("bar", barPlot(odata),layout);

        //Init bubble plot
        var otudata = data.samples.filter(x => x.id === initId.toString());
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
        Plotly.newPlot("bubble",bubblePlot(otudata),layout);

        //Gauge plot
        gaugePlot(mdata)
    })
}
init();




