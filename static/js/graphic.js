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

   var dateDim = ndx.dimension(function (d) {
       return d["date_posted"];
   });

 var stateDim = ndx.dimension(function (d) {
       return d["school_state"];
   });

   var resourceTypeDim = ndx.dimension(function (d) {
       return d["resource_type"];
   });
   var primaryDim = ndx.dimension(function (d) {
       return d["primary_focus_area"];

});
    var gradeDim = ndx.dimension(function (d) {
       return d["grade_level"];

});
   //Calculate metrics


var totalDonationsByResourceType = resourceTypeDim.group().reduceSum(function(d){
           return d['total_donations'];
   });
var totalDonationsByPrimaryarea = primaryDim.group().reduceSum(function(d){
             return d['total_donations'];

});
var totalDonationsBygrade = gradeDim.group().reduceSum(function(d){
             return d['total_donations'];

});


  // Total New York




   var minDate = dateDim.bottom(1)[0]["date_posted"];
   var maxDate = dateDim.top(1)[0]["date_posted"];

   stateDim.filter('NY');





   //Charts
   var resourceTypeChart = dc.pieChart("#resource-type-pie-chart");
   var primaryfocusChart = dc.rowChart("#primary_focus_area_chart");
   var gradeTypeChart = dc.pieChart("#grade-type-pie-chart");


resourceTypeChart
       .height(220)
       .radius(90)
       .innerRadius(40)
       .transitionDuration(1500)
       .dimension(resourceTypeDim)
       .group(totalDonationsByResourceType);

primaryfocusChart
       .width(300)
       .height(250)
       .dimension(primaryDim)
       .group(totalDonationsByPrimaryarea)
       .xAxis().ticks(4);

gradeTypeChart
       .height(220)
       .radius(90)
       .innerRadius(40)
       .transitionDuration(1500)
       .dimension(gradeDim)
       .group(totalDonationsBygrade);


   dc.renderAll();
}