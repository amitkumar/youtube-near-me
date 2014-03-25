var G = {};

$(function(){
	G.mapDiv = document.getElementById('map'),
	G.location = new google.maps.LatLng(37.4419, -122.1419),
	G.browserGeoLocation = false,
	G.videos = [];

	G.map = new google.maps.Map(G.mapDiv, {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

	G.infowindow = new google.maps.InfoWindow({

	});
	
	// Try W3C Geolocation
	if(navigator.geolocation) {
		browserGeoLocation = true;
		navigator.geolocation.getCurrentPosition(function(position) {
		G.location = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		G.map.setCenter(G.location);
		G.retrieveVideos();
		}, function() {

		});
	}
	
	google.maps.event.addListener(G.map, 'dragend', function(){ 
		G.location = G.map.getCenter();
		G.retrieveVideos();
	});
	

	G.retrieveVideos = function (){
		// youtube search

		$.ajax({
			url: 'https://gdata.youtube.com/feeds/api/videos',
			data: {
				'orderby' :'published',
				'max-results' : 10,
				'alt' : 'json',
				'location-radius' : '1km',
				'location' : G.location.lat() + ',' + G.location.lng() + '!'
			},
			success: function(data){
				var i, point, item;
				
				for (i = 0; i < G.videos.length; i++){
					G.videos[i].marker.setMap(null);
					delete G.videos[i];
				}
				
				G.videos = data.feed.entry;
				for (i = 0; i < G.videos.length; i++){
					(function(){
						var item = G.videos[i];
						var point = item['georss$where']['gml$Point']['gml$pos']['$t'].split(' ');
						
						item.point = new google.maps.LatLng(point[0], point[1]);
						item.marker = new google.maps.Marker({
				      		map: G.map,
					      	position: item.point,
							animation: google.maps.Animation.DROP,
					   	});
						google.maps.event.addListener(item.marker, 'click', function(e){
						var title = item.title.$t;
						var date = new Date(item.published.$t);
						date = (date.getMonth() + '-' + date.getDay() + '-' + date.getYear());
						console.log(item);
							G.player.loadVideoByUrl(item['media$group']['media$content'][0].url);
				
							G.infowindow.setContent('<h2>' + title + '</h2><h2>' + item.published.$t + '</h2>');
							G.infowindow.open(G.map, this);
						});
						//['media$group']['media$content'][0]
						}());
				}
			},
			dataType: 'json'
		});
	}
});

G.player = {};
function onYouTubePlayerAPIReady() {
  G.player = new YT.Player('player', {
    height: '400',
    width: '640',
    videoId: 'u1zgFlCw8Aw',
    events: {
      'onReady': G.onPlayerReady,
      'onStateChange': G.onPlayerStateChange
    }
  });
}

G.onPlayerReady = function(){
	
}

G.onPlayerStateChange = function(){
	
}
