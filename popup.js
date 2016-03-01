var settings = {
	base_url: 'http://api.whatthetrend.com/api/v2/trends.json',
	twitter_base_url: 'https://twitter.com/hashtag/',
	twitter_base_url_end: '?src=tren'
}

document.addEventListener('DOMContentLoaded', function() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://api.whatthetrend.com/api/v2/trends.json');
	xhr.send();
	xhr.onload = function() {
	    var json = xhr.responseText;                         // Response
	    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
	    json = JSON.parse(json);                             // Parse JSON
	    
	    // process the data and display the information
		console.log(json);
		var selected_trend = process(json);
		display(selected_trend);

	};	
});

/* this function will randomly select one of the trends and
 * return that trend to the html page
 */
function process(json) {
	// get size
	var num_trends = json.trends.length;

	// select random number
	var selected_num = Math.floor(Math.random() * (num_trends));

	// return trend
	return json.trends[selected_num] || null;
}

/* this function will display the trend information onto the
 * html page
 */
function display(trend) {
	if(trend) {
		var trendName = document.getElementById('trend-name');
		trendName.innerText = trend.name;

		if(trend.category_name) {
			var trendCategory = document.getElementById('trend-category');
			trendCategory.innerText = 'Category: ' + trend.category_name;
		}

		if(trend.description) {
			var trendDescription = document.getElementById('trend-description');
			trendDescription.innerText = trend.description.text;
		} else {
			var trendDescription = document.getElementById('trend-description');
			trendDescription.innerText = 'There is no description for this trend yet';
		}

		var trendTweets = document.getElementById('trend-tweets');
		trendTweets.innerHTML = 'Search for ' + trend.name + ' on Twitter';
		// need to remove the # from the start of the tweet or the search
		// link will break
		var trendNoHashtag = trend.name.substring(0,1) == '#' ?
								trend.name.substring(1,trend.name.length) :
								trend.name;
		trendTweets.href = settings.twitter_base_url +
							trendNoHashtag + 
							settings.twitter_base_url_end;
	} else {
		var trendName = document.getElementById('trend-name');
		trendName.innerText = 'Error trying to load trending topics. Please try again.';
	}
}

/* this eventListener allows us to create a new tab when we click on 
 * a link in a chrome extension 
 */
window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
})
