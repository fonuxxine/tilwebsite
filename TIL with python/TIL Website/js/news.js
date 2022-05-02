$(document).ready(populatePage);

var POST_LENGTH = 300;
var LATEST_POSTS_TO_DISPLAY = 3;
var POSTS_TO_DISPLAY = 4;
var newsArray = [];
var loadMoreClicked = 0;

function populatePage() {
  for (var i = 0; i < newsInfo.length; i++) {
    newsArray.push(newsInfo[i]);
  }

  // sort articles by date
  newsArray.sort(function(a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.date) - new Date(a.date);
  });

  populateLatestNews();

  generatePosts(Math.min(POSTS_TO_DISPLAY + POSTS_TO_DISPLAY * loadMoreClicked, newsInfo.length));

  document.getElementById('load-more').addEventListener('click', function() {
    loadMoreContent();
  });
}

function populateLatestNews() {
  var latestNewsHTML = '';

  for (var i = 0; i < Math.min(LATEST_POSTS_TO_DISPLAY, newsInfo.length); i++) {
    var article = newsArray[i];
    var title = correctFormat(article.title);
    var date = article.date;

    var dateHTML = '<h6 style="margin-top: 30px; margin-bottom: 5px;"><span class="date">' +
      date + '</span></h6>';

    latestNewsHTML += '<div class="latest-news-item">' + dateHTML + '<a href="full_article.html#' + encodeURL(title) + '">' +
      '<h4 class="latest-news-text">' + title + '</h4>' + '</a></div>';
  }

  $('.latest-news-content').html(latestNewsHTML);
}


function generatePosts(lastPost) {
  $('.news').html(createPosts(0, lastPost));

  if (lastPost == newsInfo.length) {
    $('#load-more').hide();
  }
}

function createPosts(startIndex, endIndex) {
  var articleHTML = '';

  // generate a post for each news item from startIndex to endIndex
  for (var i = startIndex; i < endIndex; i++) {
    var articleInfo = newsArray[i];

    var title = correctFormat(articleInfo.title);
    var author = correctFormat(articleInfo.author);
    var date = articleInfo.date;
    var summary = correctFormat(articleInfo.summary);
    var imageHTML = '';

    if (articleInfo.image != undefined) {
      imageHTML += '<div class="image-container">';
      if (articleInfo.image.constructor === Array) {
        for (var j = 0; j < articleInfo.image.length; j++) {
          imageHTML += '<img src="images/news_images/' + articleInfo.image[j] + '"/>';
        }
      } else {
        imageHTML += '<img src="images/news_images/' + articleInfo.image + '"/>';
      }
      imageHTML += '</div>';
    }

    articleHTML +=
      '<a href="full_article.html#' + encodeURL(title) + '"><div class="post"><h3>' + title + '</h3>' +
      '<h6><span class="name">' + author + ' </span><span style="color: #CCC">|</span> <span class="date">' +
      date + '</span></h6><div class="image-and-content">' + imageHTML + '<p>' + summary + '</p></div>' +
      '<a href="full_article.html#' + encodeURL(title) + '" class="link" style="font-size: 0.9em">Continue reading &#187;</a></div></a>';
  }

  return articleHTML;
}

function loadMoreContent() {
  generatePosts(Math.min(POSTS_TO_DISPLAY + POSTS_TO_DISPLAY * ++loadMoreClicked, newsInfo.length));
}

// display only the first POST_LENGTH characters of text
function reduceNewsText(text) {
  var originalText = text;

  if (originalText.length > POST_LENGTH) {
    var temp = originalText.substring(0, POST_LENGTH + 1);
    return temp.substring(0, temp.lastIndexOf(" ")) + " ...";
  }
}

// makes text URL friendly
function encodeURL(url) {
  return encodeURIComponent(url);
}

function correctFormat(str) {
  return str
    .replace(/’/g, '\'')
    .replace(/–/g, '-')
    .replace(/“/g, '"')
    .replace(/”/g, '"');
}
