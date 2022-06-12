function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {


    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    console.log(data);

    // 3. Create a variable that holds the samples array. 
    samples_data = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleResultArray = samples_data.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = sampleResultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // var otuIds = sampleResult.map(row => row.otu_ids);
    // var otuLabels = sampleResult.map(row => row.otu_labels);
    // var sampleValues = sampleResult.map(row => row.sample_values);

    var otuIds = sampleResult.otu_ids
    var otuLabels = sampleResult.otu_labels
    var sampleValues = sampleResult.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var otuIdsTop10 = otuIds.slice(0, 10).reverse()
    var otuLabelsTop10 = otuLabels.slice(0,10).reverse()
    var sampleValuesTop10 = sampleValues.slice(0,10).reverse()

    var yticks = otuIdsTop10.map(row => "OTU "+row);

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sampleValuesTop10,
      y: yticks,
      name: 'Top 10 Bacteria Cultures Found',
      type: 'bar',
      text: otuLabelsTop10,
      orientation: "h",
    }
    
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
    };

    var barConfig = {responsive: true}

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout, barConfig);

    traceBubble = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIds,
        colorscale: 'Earth',
        size: sampleValues
      }
    }

    // 1. Create the trace for the bubble chart.
    var bubbleData = [traceBubble];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { 
        title: 'OTU ID' 
      },
      hovermode: 'closest',
      margin: {
        l: 80,
        r: 80,
        b: 80,
        t: 100,
        pad: 0,
        //autoexpand: true
      }
    };

    var bubbleConfig = {responsive: true}

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, bubbleConfig); 

    console.log("secondpart")
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var metadataResultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataResult = metadataResultArray[0];


    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
    var washingFrequency = parseFloat(metadataResult.wfreq)


    var trace = {
      //domain: { x: [0, 1], y: [0, 1] },
      value: washingFrequency,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week" },
      type: "indicator",
      mode: "gauge+number",
      //delta: { reference: 380 },
      gauge: {
        axis: { 
          range: [null, 10], 
          tickmode: "array",
          tickvals: [0, 2, 4, 6, 8, 10],
          ticks: "outside"
        },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" }
        ]
      }
    }

    var data = [trace];
    
    //var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    gaugeConfig={responsive: true}
    Plotly.newPlot('gauge', data, {}, gaugeConfig);

  });
}
