$(document).ready(displayInfo);

function displayInfo() {
  var articleInfo = null;
  for (var i = 0; i < newsInfo.length; i++) {
    if (correctFormat(newsInfo[i].title) == getPostTitle()) {
      articleInfo = newsInfo[i];
      break;
    }
  }

  var title = correctFormat(articleInfo.title);
  var author = correctFormat(articleInfo.author);
  var date = articleInfo.date;
  var contentHTML = correctFormat(articleInfo.content);
  var image = articleInfo.image;
  var link = articleInfo.link;

  document.title = title;

  var mainTitle = '<h1 style="margin-top: 0">' + title + '</h1>';
  var dateAndAuthor = '<h6 style="margin-top: 30px; margin-bottom: 5px;"><span class="name">' + author + '</span> <span style="color: #CCC">|</span> <span class="date">' +
    date + '</span></h6>';
  var imageHTML = '';

  if (image != undefined) {
    imageHTML += '<div class="image-container">';
    imageTag = '<img style="height: 150px" src="images/news_images/';

    if (image.constructor === Array) {
      for (var j = 0; j < image.length; j++) {
        imageHTML += imageTag + image[j] + '"/>';
      }
    } else {
      imageHTML += imageTag + image + '"/>';
    }
    imageHTML += '</div>';
  }

  var linkHTML = link != undefined ? '<hr><p>Content originally from: <a class="link" target="_blank" href="' + link + '">' + link + '</a></p>' : '';

  var articleHTML = dateAndAuthor + mainTitle + '<div class="bar"></div>' + imageHTML + contentHTML + linkHTML;
  $('#full-article').html(articleHTML);
}

function getPostTitle() {
  return decodeURL(window.location.hash.substr(1));
}

function decodeURL(url) {
  return decodeURIComponent(url);
}

function correctFormat(str) {
  return str
    .replace(/’/g, '\'')
    .replace(/–/g, '-')
    .replace(/“/g, '"')
    .replace(/”/g, '"');
}
