$(
	function(){
		$("#submit-button").click(function() {
			getAll();
		});
		
		getAll();
	}
);


function getAll() {
	
	drawOSPie();
	drawBrowserPie();
	drawDevicePie();
}

function drawOSPie(){

	$.getJSON( 
	
		"/analytics/ospie", 
		getData(),
		
		function( data ) {
			console.log(data);
			var plotObj = $.plot($("#os-chart-pie"), data, {
				series: {
					pie: {
						show: true
					}
				},
				grid: {
					hoverable: true 
				},
				tooltip: true,
				tooltipOpts: {
					content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
					shifts: {
						x: 20,
						y: 0
					},
					defaultTheme: false
				}
			});
		});
}

function drawBrowserPie(){

	$.getJSON( 
	
		"/analytics/browserpie", 
		getData(),
		
		function( data ) {
			console.log(data);
			var plotObj = $.plot($("#browser-chart-pie"), data, {
				series: {
					pie: {
						show: true
					}
				},
				grid: {
					hoverable: true 
				},
				tooltip: true,
				tooltipOpts: {
					content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
					shifts: {
						x: 20,
						y: 0
					},
					defaultTheme: false
				}
			});
		});
}

function drawDevicePie(){

	$.getJSON( 
	
		"/analytics/devicepie", 
		getData(),
		
		function( data ) {
			console.log(data);
			var plotObj = $.plot($("#device-chart-pie"), data, {
				series: {
					pie: {
						show: true
					}
				},
				grid: {
					hoverable: true 
				},
				tooltip: true,
				tooltipOpts: {
					content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
					shifts: {
						x: 20,
						y: 0
					},
					defaultTheme: false
				}
			});
		});
}
function getData(){
	var startDate = $("#start-date").val();
	var endDate = $("#end-date").val();
	var campaign = $("#campaign-dropdown option:selected").val();
	var lineCampaign = $("#campaign-line-dropdown option:selected").val();
	
	
	return {
			start:startDate, 
			end:endDate, 
			campaignId:campaign,
			lineCampaign:lineCampaign
		};
	
}

