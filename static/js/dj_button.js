
$(".para1").hide();
$("button").click(function() {
	$(this).next().slideToggle("slow");
});

