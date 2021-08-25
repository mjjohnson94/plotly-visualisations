//////////////////////////////////// Bar Chart Visualisation /////////////////////////////////////

/// Creating a function named buildPlot:

function buildPlots(id) {

        /// Reading in the JSON file using the d3.json method:
        d3.json("samples.json").then (JSONData =>{
            /// Printing results to ensure the JSON file can be seen in the console. 
            console.log(JSONData)

            /// Creating a variable to store the top 10 OTU IDs with the highest frequency within the data
            /// Using the slice() method to manipulate the OTUTop10 data so only the first 10 records are displayed
            var OTUTop10 = JSONData.samples[0].otu_ids.slice(0, 10);

            /// Creating a variable for the trace which will contain the inputs required to build the data visualisation: 
            var BarTrace = {

                /// Setting the sample values as the X Axis 
                /// Using the reverse() method to rearrange the data so it is more compatible with the visualisation 
                x: JSONData.samples[0].sample_values.slice(0,10).reverse(),

                /// Setting the Y Axis
                /// Using the map() method to apply the arrow function to each item within the array OTUTop10
                /// The function itself takes x which is each item in the array and adds that value to the end of "OTU id" for the axis labels
                y: OTUTop10.map(x => "OTU id:" + x),

                /// Passing the text parameter which makes the plot interactive (when hovering over the bar, additioanl text is displayed about the data)
                text: JSONData.samples[0].otu_labels.slice(0,10),
                
                /// Designing the bar markers on the plot and changing to horizontal orientation as it looks better with this data set: 
                marker: {
                color: 'rgb(158,202,225)'},
                type:"bar",
                opacity: 0.6,
                orientation: "h",
            };

            /// Creating a variable which will hold the trace 
            var BarData = [BarTrace];
    
            /// Designing the layout of the plot:
            var BarLayout = {
                title: "Top 10 OTU: Highest Recorded Frequency",
                yaxis:{
                    tickmode:"linear",
                },

                /// Manipulating the layout on the HTML page 
                margin: {
                    l: 125,
                    r: 125,
                    t: 125,
                    b: 30
                }
            };
    
            /// Building the plot, selecting the type and including the data and layout variables created earlier:
        Plotly.newPlot("bar", BarData, BarLayout);


//////////////////////////////////// Bubble Chart Visualisation /////////////////////////////////////

            

                /// Creating a variable for the trace which will contain the inputs required to build the data visualisation:         
                var BubbleTrace = {

                /// Setting the OTU IDS as the X Axis values
                x: JSONData.samples[0].otu_ids,

                /// Setting the Sample Values as the Y Axis values
                y: JSONData.samples[0].sample_values,

                /// Passing markers into the mode parameter as this is required for the Bubble Chart
                mode: "markers",
                marker: {
                    /// Setting Sample Values as the marker size (larger the value, larger the bubble on the visualisation)
                    size: JSONData.samples[0].sample_values,

                    /// Setting the colour as OTU IDS
                    color: JSONData.samples[0].otu_ids
                },

                /// Passing the OTU lables into the text parameter to create hover text functionality
                text:  JSONData.samples[0].otu_labels
    
            };
    
             /// Designing the layout of the plot:
            var BubbleLayout = {
                xaxis:{title: "OTU id"},
                height: 600,
                width: 1000
            };
    
            /// Creating a variable which will hold the trace 
            var BubbleData = [BubbleTrace];
    
        /// Building the plot, selecting the type and including the data and layout variables created earlier:
        Plotly.newPlot("bubble", BubbleData, BubbleLayout); 
        
        });
    }  


    /// Creating a function named demographicData
    function demographicData(id) {


    /// Reading in the JSON file using the d3.json method:
        d3.json("samples.json").then((data)=> {

    /// Creating a variable to store the metadata information from the data set. This includes id, Ethnicity, Gender, Age, Location, BBTYPE, WFREQ. 
    /// This data will be displayed on the HTML page
            var metadata = data.metadata;
            
            /// Printing the results to ensure the data is returned correctly
            console.log(metadata)
    
            /// Using the filter function to extract the data required for the Demographic Info visualisation
            /// Converting the results to a string, otherwise the data does not load to the web page (null value error)
            var metaDataResults = metadata.filter(x => x.id.toString() === id)[0];
        
            /// Using the d3 Select method to select the sample-metadata id in the HTML page as this is where the data will be rendered
           var demographicInfo = d3.select("#sample-metadata");
            
            /// Emptying the data form the table to enable new results to be loaded based on the user input
            demographicInfo.html("");
    
            /// Using the Object.entries which will return a key, value pairs, this function is applied to each record
            /// Using the forEach method to iterate through each record within the data
            Object.entries(metaDataResults).forEach((x) => {   

                /// Appending the results to the H5 element on the HTML page, changing the results to capital letters with toUpperCase & reformatting the text / spacing
                demographicInfo.append("h5").text(x[0].toUpperCase() + ": " + x[1] + "\n");    
            });
        });
    }




    /// Creating a function named optionChanged which is linked to the DOM, when the user selects a new ID, the data will be rendered accordingly for that specific input. 
    function optionChanged(id) {
        buildPlots(id);
        demographicData(id);
    }
    
    /// Creatign an init function to initiate the data rendering.
    function init() {

        /// Using the d3 select function to select the selDataset ID which is the element within the DOM where the user can change the Test Subject ID through an interactive drop down menu
        var dropdownList = d3.select("#selDataset");
    
        /// Reading in the JSON file using the d3.json method:
        d3.json("samples.json").then((data)=> {

            /// Printing results to ensure the JSON file can be seen in the console. 
            console.log(data)
    
            /// Appending the data contained in the JSON file for each Subject ID to the DOM
            data.names.forEach(function(name) {
                dropdownList.append("option").text(name).property("value");
            });
    
            /// Calling the functions:
            buildPlots(data.names[0]);
            demographicData(data.names[0]);
        });
    }
    
    init();