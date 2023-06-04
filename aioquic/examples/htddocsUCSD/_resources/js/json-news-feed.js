var xmlhttp = new XMLHttpRequest();
// Parameters: category, limit, offset
// Category number corresponds to UC San Diego Today topic categories; separate multiple categories with |
var url = "https://today.ucsd.edu/news-and-features-api?category=114&limit=3";

xmlhttp.onreadystatechange = function() {
   if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
         var newsData = JSON.parse(xmlhttp.responseText);
         for (var index = 0; index < 3; index++) {
            var headId = "head" + index;
            var imgId = "img" + index;
            var dateId = "date" + index;
            var urlId = "url" + index;
            if (newsData[index].entry_date >= 1660546800000) {
               image = newsData[index].teaser_photo;
               var lastSegIndex = image.lastIndexOf('/');
               var firstSeg = image.slice(0, lastSegIndex);
               var lastSeg = image.slice(lastSegIndex)
               var feedImage = firstSeg + '/_ucsd-feed' + lastSeg;
               image = feedImage;
            } else {
               if (newsData[index].feature_image) {
                  image = newsData[index].feature_image;
               } else if (newsData[index].primary_photo) {
                  image = newsData[index].primary_photo;
               } else {
                  image = "https://returntolearn.ucsd.edu/_images/homepage/news-placeholder.jpg";
               }
            }
            document.getElementById(imgId).src = image;
				document.getElementById(headId).innerText = newsData[index].title;
            document.getElementById(dateId).innerText = timeConverter(newsData[index].entry_date);
            var urls = document.getElementsByClassName(urlId);
            var newsUrl = "https://today.ucsd.edu" + "/story/" + newsData[index].url_title;;
            for (var j = 0; j < urls.length; j++) {
               urls[j].setAttribute("href", newsUrl);
           }
           if (newsData[index].pp_alt) {
             document.getElementById(imgId).alt = newsData[index].pp_alt;
          }
        }
      }
    }
};

xmlhttp.open("GET", url, true);
xmlhttp.send();

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = month + ' ' + date + ', ' + year;
  return time;
}
