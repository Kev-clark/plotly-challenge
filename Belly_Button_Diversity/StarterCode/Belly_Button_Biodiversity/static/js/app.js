function buildMetadata(sample) {
  
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
     var selector=d3.select('#sample-metadata');
     selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
     var data=d3.json('/metadata/'+sample).then(function(x){
      for (let [key, value] of Object.entries(x)) {
        selector.append('tr')
        .text(`${key}: ${value}`);
      }});
         
    



    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

async function buildCharts(sample) {
const pieSelector = d3.select("pie");
pieSelector.html("");
const bubbleSelctor=d3.select("bubble");
bubbleSelctor.html("");
console.log(pieSelector.html)
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  const data= await d3.json('/samples/'+sample)
    // @TODO: Build a Bubble Chart using the sample data
  console.log(data)
  const
        otu_ids=data.otu_ids,
        otu_labels = data.otu_labels,
        sample_values = data.sample_values;
  
  
  const trace1 = {
    type: "scatter",
    mode: "markers",
    marker:{
      size:sample_values, 
        }, 
    text:otu_labels,
    
    x: otu_ids,
    y: sample_values,
    line: {
        color: "#17BECF"
    }};

  const testy = [trace1];

  const layout = {
        
        xaxis: {
            range: [0, otu_ids.max],
            type:"linear",
            text: "OTU IDS",
        },
        yaxis: {
            range:[0, sample_values.max],
            type: "linear"
        }
    };
    Plotly.newPlot("bubble", testy, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    const slicedDataIds=data.otu_ids.slice(0, 10);
    const slicedDataLabels=data.otu_labels.slice(0, 10);
    const slicedDataValues=data.sample_values.slice(0, 10);

    const pieTrace={
      labels:slicedDataIds,
      values:slicedDataValues,
      type:'pie'
    };
    const piedata=[pieTrace];
    const pielayout={
      title: "Pie"
    };
    Plotly.newPlot("pie", piedata, pielayout);

   
    
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
   
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
