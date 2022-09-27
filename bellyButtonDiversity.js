


function populateMetaData(i){
    //console.log(i);
    // Using d3.json to find the metaData
    d3.json("samples.json").then((data)=>{
        let metaData = data.metadata;
        //console.log(metaData);// this prints all of the metadata in the json
        // we need to filter based on the id 
        //that equals to the option selected in the drop down menu like eg id=name=940, which gives us the other details 
        let demoInfo = metaData.filter(sampleDetail=> sampleDetail.id == i);
        //console.log(demoInfo);// this gives us an array of a single demographic information
        // access index 0 from the demoInfo
        let resultDemoInfo = demoInfo[0];
        //console.log(resultDemoInfo); 

        // Inorder for the Demographic info table not keep appending the values
        // we would need to clear the field for the next option to populate
        // in order to clear we would use .html("")
        d3.select("#sample-metadata").html("");


        // using Object.entry to get value key pairs
        Object.entries(resultDemoInfo).forEach(([key,value])=>{
            d3.select("#sample-metadata").append("h6").text(`${key.toUpperCase()}: ${value}`);

        });

    });

}

// make a function for the barchart

function barChart(i){
    //console.log(i); //check to see if it prints the name of the sample 
    //from the init function and by calling the barchart function
    d3.json("samples.json").then((data)=>{
        let samplesData = data.samples;
        //console.log(samplesData); // this gives us the array of each sample with its 
        //id,otu_ids, otu_labels and sample_values 
        let sampleArray = samplesData.filter(results => results.id == i );
        //console.log(sampleArray); // prints out the array of the first sample and its details 
        // we need index 0 from the array and fetch all of the data related to it
        let sampleArrayResult = sampleArray[0];
        //console.log(sampleArrayResult); // This gives us the details (inside the console)
        //of the id when changed in the drop down menu
        
        // We need to isolate the otu_ids, _out_labels and sample_values 
        // in order to make the barChart

        // Hence,

        let otu_ids = sampleArrayResult.otu_ids;
        //console.log(otu_ids);  // check to see if it gives us all the otu ids of our 1 subject id
        let otu_labels = sampleArrayResult.otu_labels;
        //console.log(otu_labels); // prints out all the bacteria's so we're good!
        let sample_values = sampleArrayResult.sample_values;
        //console.log(sample_values); // gives the sample_value of our id 

        // Now, lets make the BAR CHART!
        // we would need yticks for making a horizontal bar chart 

        let yticks = otu_ids.slice(0,10).map(id=> `OTU ${id}`);
        //console.log(yticks); // gives us an array of otu ids of the top 10 
        let xValues = sample_values.slice(0,10);
        //console.log(xValues); give us an array of 10 items 
        let textLabels = otu_labels.slice(0,10);
        //console.log(textLabels); // hover over text 


        let barsChart = {
            y : yticks.reverse(),
            x : xValues.reverse(),
            text : textLabels.reverse(),
            type : "bar",
            orientation : "h"

        }

        let layout = {
            title : "Top 10 Belly Button Diversity Bacteria",
            xaxis : {
                title : "Sample Values"   
            },
            yaxis: {
                title: "OTU IDS"
            }
        }

        Plotly.newPlot("bar",[barsChart],layout);


    })

}

// Now, we need to make a Function that builds a bubble chart

function bubbleChart(i){
    //console.log(i); check to see if it works
    // we will fetch the same data used the bar chart function 
    d3.json("samples.json").then((data)=>{
        let samplesData = data.samples;
        //console.log(samplesData); // this gives us the array of each sample with its 
        //id,otu_ids, otu_labels and sample_values 
        let sampleArray = samplesData.filter(results => results.id == i );
        //console.log(sampleArray); // prints out the array of the first sample and its details 
        // we need index 0 from the array and fetch all of the data related to it
        let sampleArrayResult = sampleArray[0];
        //console.log(sampleArrayResult); // This gives us the details (inside the console)
        //of the id when changed in the drop down menu
        
        // We need to isolate the otu_ids, _out_labels and sample_values 
        // in order to make the barChart

        // Hence,

        let otu_ids = sampleArrayResult.otu_ids;
        //console.log(otu_ids);  // check to see if it gives us all the otu ids of our 1 subject id
        let otu_labels = sampleArrayResult.otu_labels;
        //console.log(otu_labels); // prints out all the bacterias
        let sample_values = sampleArrayResult.sample_values;
        //console.log(sample_values); // gives the sample_value of our id 

        // Now, we start creating the bubble chart
        let bubbles = {
            y : sample_values,
            x : otu_ids,
            text : otu_labels,
            mode : "markers",
            marker : {
                size : sample_values,
                color : otu_ids,
                colorscale : "Earth"
            }
        }

        let layout ={
            title : "Bacteria Culture per Sample",
            hovermode : "closest",
            xaxis : {title: "OTU ID"}
        }

        Plotly.newPlot("bubble", [bubbles],layout);
        


    });

}



function init(){
    //load the data from the samples.json file that was provided
    let data = d3.json("samples.json");
    //console.log(data) // prints out the promise inside the console

    //access the dropdown selector from the index.html file 
    var selector = d3.select("#selDataset");
    //console.log(select);
    d3.json("samples.json").then((data)=>{
        //console.log(data);
        // access the names for the drop down selector menu
        let namesOfSamples = data.names;
        //console.log(namesOfSamples);// this gives us an array of the names
        for (let i = 0; i < namesOfSamples.length; i++) {
             selector.append("option").text(namesOfSamples[i]).property("value", namesOfSamples[i]);
        }

        let sample1 = namesOfSamples[0];
        //console.log(sample1); // check to see if the name 
        //of the 1st sample prints out on the console
        populateMetaData(sample1);
        barChart(sample1);
        bubbleChart(sample1);

    });

}

// function that updates the dashboard 
function optionChanged(item){
    //console.log(item); // names of the samples print out when option is changed on the drop down selector 
    // call to build meta data function 
    populateMetaData(item);
    // call the bar chart function to build the bar chart
    barChart(item);
    // call the bubble chart function
    bubbleChart(item);
}
// call the init function
init();





