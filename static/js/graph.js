queue()
   .defer(d3.json, "/donorsUS/projects")
   .await(makeGraphs);

function makeGraphs(error, projectsJson) {

   //Clean projectsJson data
    var donorsUSProjects = projectsJson;
    var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
    donorsUSProjects.forEach(function (d) {
        d["date_posted"] = dateFormat.parse(d["date_posted"]);
        d["date_posted"].setDate(1);
        d["total_donations"] = +d["total_donations"];
    });

    //Create a Crossfilter instance
    var ndx = crossfilter(donorsUSProjects);
    //var dim = ndx.dimension('total_donations');

   var dateDim = ndx.dimension(function (d) {
       return d["date_posted"];
   });

   var cityDim = ndx.dimension(function (d) {
       return d["school_city"];

   });

   var stateDim = ndx.dimension(function (d) {
       return d["school_state"];
   });
   var totalDonationsDim = ndx.dimension(function (d) {
       return d["total_donations"];
   });

   var povertyDim = ndx.dimension(function (d) {
       return d["poverty_level"];
   });


   //Calculate metrics
    var totalDonationsByState = stateDim.group().reduceSum(function (d) {
       return d["total_donations"];
   });

    var totalDonationsByCity = cityDim.group().reduceSum(function (d) {
       return d["total_donations"];
    });


var totalDonationsByPovertyType = povertyDim.group().reduceSum(function(d){
           return d['total_donations'];
});

 function remove_empty_bins(group) {
    return {
        all:function () {
            return group.all().filter(function(d) {
                return d.value > 1500;
           });
        }
    };
  }

  // Total New York

   var totalDonationsByCityYork = cityDim.group().reduceSum(function (d) {
       return d["total_donations"];
   });

   var totalDonationsByYork = dateDim.group().reduceSum(function (d) {
       return d["total_donations"];
   });

   var minDate = dateDim.bottom(1)[0]["date_posted"];
   var maxDate = dateDim.top(1)[0]["date_posted"];
   var filtered_group = remove_empty_bins(totalDonationsByCity);
   stateDim.filter('NY');

      //ChartsY
  var timeChart = dc.barChart("#time-chart");
   var YorkChart = dc.lineChart("#york-Chart");
    var povertyTypeChart = dc.pieChart("#poverty-type-pie-chart");

   timeChart
       //.width(800)
       .height(200)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(totalDonationsByState)
       .group(filtered_group)
       .transitionDuration(500)
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .elasticY(true)
       .xAxisLabel("City")
       .yAxis().ticks(4);

    YorkChart
       .width(800)
       .height(200)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(totalDonationsByCityYork)
       .group(totalDonationsByYork)
       .transitionDuration(500)
       .x(d3.time.scale().domain([minDate, maxDate]))
       .elasticY(true)
       .xAxisLabel("Year")
       .yAxis().ticks(4);
povertyTypeChart
         .height(220)
       .radius(90)
       .innerRadius(40)
       .transitionDuration(1500)
       .dimension(povertyDim)
       .group(totalDonationsByPovertyType);




   dc.renderAll();

}