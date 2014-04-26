$(
  function(){
    $("#submit-button").click(function() {
      getAll();
    });
    
    getAll();
  }
);


function getAll() {
  campaignCount();
  bannerCount();
  drawArea();
}

function campaignCount() {
  $.getJSON( 
    "/analytics/campaigncount", 
    getData(),
    function( data ) {
      $("#campaign-count").html(data.campaignCount);
      $("#serve-count").html(data.serveCount);
    });
}

function bannerCount() {
  $.getJSON( 
    "/analytics/bannercount",
    getData(), 
    function( data ) {
      $("#banner-count").html(data.bannerCount);
    });
}

function drawArea() {
  $.getJSON( 
    "/analytics/drawarea", 
    getData(),
    function( data ) {
      data.element = "morris-chart-area";
      console.log(data);
      Morris.Line(data);
    }
  );
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

