/**
 * AnalyticsController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


module.exports = {
  
  show: function(req, res, next) {
    
    return res.view({
      layout: "dashboard"
    });

  },
  
  campaigncount: function(req, res, next) {
    
    var data = getRequestData(req,res);
    var cCount = 0;
    var aCount = 0;
    
    
    if(data.campaignId) {

      Campaign.findOne (
    	data.campaignId,
      	function(err, campaign) {

	  cCount++;
	  aCount += campaign.limit - campaign.remainingLimit;
	  
	  return res.send({
	    campaignCount: cCount,
    	    serveCount: aCount,
	  });     		
      	}
      );
    } else {
      Campaign.find (
    	{advId : data.id},
      	function(err, campaign) {

	  for (i in campaign) {
	    cCount++;
	    aCount += campaign[i].limit - campaign[i].remainingLimit;
	  }

	  return res.send({
	    campaignCount: cCount,
    	    serveCount: aCount,
	  });     		
      	}
      );
    }
  },
  
  bannercount: function(req, res, next) {
    var data = getRequestData(req,res);
    var bCount = 0;
    
    if(data.campaignId) {

      Banner.countByCampaignId (
    	data.campaignId,
      	function(err, cnt) {
	  bCount = cnt;
	  
	  return res.send({
	    bannerCount: bCount,
	  });
      	}
      );
    } else {
      Banner.countByAdvertiserId (
    	data.id,
      	function(err, cnt) {
	  bCount = cnt;
	  
	  return res.send({
	    bannerCount: bCount,
	  });
      	}
      );
    }
  },
  
  drawarea: function(req, res, next) {
    var data = getRequestData(req,res);
    
    var temp = {};
    var dateArray = [];
    
    var returnObj = {};
    
    Impressions.find({advertiserId : data.id})
      .sort('timestamp')
      .exec(function(err, impressions){
    	for(i in impressions){

    	  var date = new Date(impressions[i].timestamp).toDateString();
    	  if(temp[date]){
    	    temp[date]++;
    	  } else {
    	    temp[date]=1;
    	    dateArray.push({d:date});
    	  }
    	}
    	
    	for(i in dateArray){
    	  dateArray[i].impressions = temp[dateArray[i].d];	
    	}
    	
    	returnObj.data = dateArray;
    	returnObj.xkey = 'd';
	returnObj.ykeys = ['impressions'];
	returnObj.labels =  ['Impressions'];
	returnObj.smooth = false;
	
	return res.send(returnObj);

      });
    

  },
  
  drawosline: function(req, res, next) {
    var data = getRequestData(req,res);
    
    var temp = {};
    var dateArray = [];
    
    var returnObj = {};
    
    Impressions.find({advertiserId : data.id})
      .sort('timestamp')
      .exec(function(err, impressions){

    	for(i in impressions){
    	  
    	  var os = impressions[i].os;
    	  
	  if(temp[os]){
	  }    	 	

    	  var date = new Date(impressions[i].timestamp).toDateString();
    	  if(temp[date]){
    	    temp[date]++;
    	  } else {
    	    temp[date]=1;
    	    dateArray.push({d:date});
    	  }
    	}
    	
    	for(i in dateArray){
    	  dateArray[i].impressions = temp[dateArray[i].d];	
    	}
    	
    	returnObj.data = dateArray;
    	returnObj.xkey = 'd';
	returnObj.ykeys = ['impressions'];
	returnObj.labels =  ['Impressions'];
	returnObj.smooth = false;
	
	return res.send(returnObj);

      });
    

  },
  
  home: function(req, res, next) {
    var id = req.session.Advertiser.id;
    var cCount = 0;
    var bCount = 0;
    var aCount = 0;
    
    Campaign.find (
      {advId : id},
      function(err, campaign) {

	for (i in campaign) {
	  cCount++;
	  aCount += campaign[i].limit - campaign[i].remainingLimit;
	}

    	Banner.countByAdvertiserId (
    	  id,
      	  
      	  function(err, cnt) {
	    bCount = cnt;
	    
	    return res.view({
    	      layout: false,
    	      campaignCount: cCount,
    	      serveCount: aCount,
    	      bannerCount: bCount,
    	      campaigns : campaign
  	    });
      	  }
     	);
     	
     	
      }
    );
  },
  
  dashboard: function(req, res, next) {
    
    return res.view({
      layout: "dashboard"
    });

  },
  
  charts: function(req, res, next) {
    
    return res.view({
      layout: false
    });

  },
  
  ospie:function(req, res, next){
    
    var data = getRequestData(req,res);
    var temp = {};
    var osArray = [];
    
    var returnObj = {};
    Impressions.find({advertiserId : data.id})
      .sort('os')
      .exec(function(err, impressions){
    	for(i in impressions){

    	  if(temp[impressions[i].os]){
    	    temp[impressions[i].os]++;
    	  } else {
    	    temp[impressions[i].os]=1;
    	    osArray.push({label:impressions[i].os});
    	  }
    	}
    	
    	for(i in osArray){
    	  osArray[i].data = temp[osArray[i].label];	
    	}
    	
    	returnObj = osArray;
	return res.send(returnObj);
      });
    
    
  },
  
  browserpie : function(req, res, next){
    
    var data = getRequestData(req,res);
    var temp = {};
    var browserArray = [];
    
    var returnObj = {};
    Impressions.find({advertiserId : data.id})
      .sort('browser')
      .exec(function(err, impressions){
    	for(i in impressions){

    	  if(temp[impressions[i].browser]){
    	    temp[impressions[i].browser]++;
    	  } else {
    	    temp[impressions[i].browser]=1;
    	    browserArray.push({label:impressions[i].browser});
    	  }
    	}
    	
    	for(i in browserArray){
    	  browserArray[i].data = temp[browserArray[i].label];	
    	}
    	
    	returnObj = browserArray;
	return res.send(returnObj);

      });
    
    
  },  

  devicepie : function(req, res, next){
    
    var data = getRequestData(req,res);
    var desktop = 0;
    var mobile = 0;
    
    var returnObj = {};
    Impressions.find({advertiserId : data.id})
      .sort('mobile')
      .exec(function(err, impressions){
    	for(i in impressions){

    	  if(impressions[i].mobile){
    	    mobile++;
    	  } else {
    	    desktop++;

    	  }
    	}
    	
    	var deviceArray = [{label:'Mobile',data:mobile},{label:'Desktop',data:desktop}];
    	
    	returnObj = deviceArray;
	return res.send(returnObj);

      });
    
    
  },
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AnalyticsController)
   */
  _config: {}

  
};

function getRequestData(req, res){
  
  var id = req.session.Advertiser.id;
  var start = req.param('start');
  var end = req.param('end');
  var campaign = req.param('campaignId');
  var lineCampaign = req.param('lineCampaign');
  
  var data = {};
  
  data.id = id; 
  data.startDate = start;
  data.endDate = end;
  data.campaignId = campaign;
  data.lineCampaign = lineCampaign;
  
  return data;
}
