//old - var domain = 'https://lsm.utoronto.ca/images/Photos/Website/room_pics/';
// Room pics in https://lsm.utoronto.ca/images/Photos/Website/roomviews/IN/IN209/IN209_View1.JPG
var domain = 'https://lsm.utoronto.ca/images/Photos/Website/roomviews/';

var seasonsFullform = {
  1: 'Winter',
  2: 'Summer',
  4: 'Fall'
};

var scopesFullform = {
  0: 'accessibility',
  1: 'finishes',
  2: 'furniture',
  3: 'av',
  4: 'lighting',
  5: 'environmental',
}

// Polyfill for startsWith()
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

function formattedDate(season1, season2, year) {
  return seasonsFullform[season1] + ' ' + year;
}

// class for room object
function Room(roomNumber, building, type, date) {
  this.roomNumber = roomNumber;
  this.building = building;
  this.type = type; //type is 'Pilot', 'Completed', or 'Ongoing'
  this.date = date;
  this.has360Image = roomsWith360Images[this.building] !== undefined &&
    roomsWith360Images[this.building].indexOf(this.roomNumber) >= 0 ? true : false;
}

// makes an HTML card from the card object
Room.prototype.makeCard = function(sortType) {
  var card = document.createElement('DIV');
  card.className = 'card';
  card.id = this.building + this.roomNumber;

  // creating the thumbnail for the card
  var roomImage = document.createElement('IMG');
  if (this.type != 'Ongoing') {
    roomImage.src = domain + this.building + '/' + this.building + this.roomNumber + '/' + this.building + this.roomNumber+ '_View1.jpg'
  } else {
    roomImage.src = 'images/room_images/' + this.building + '-' + fullform[this.building] +
    '/' + this.type + '/' + this.roomNumber + '_' + this.date.split('/')[0] + '-' + this.date.split('/')[1] + '.jpg';
  }

  roomImage.alt = this.building + ' ' + this.roomNumber;
  card.appendChild(roomImage);

  // adding the room number title to the card
  var textDiv = document.createElement('DIV');
  textDiv.className = 'text-div';
  var cardHeading = document.createElement('H4');
  cardHeading.textContent = roomImage.alt;
  textDiv.appendChild(cardHeading);

  if (this.type == 'Ongoing') {
    card.classList.add('card-incomplete');

    // adding the date to be completed to the card if the rooms are not sorted by date
    if (sortType != 'date') {
      var dateHeading = document.createElement('p');
      var temp = this.date.split('/');
      var temp2 = temp[1].split('-');
      var year = temp2[1];
      dateHeading.textContent = formattedDate(temp[0], temp2[0], year);
      textDiv.appendChild(dateHeading);
    }
  } else if (this.type == 'Deferred') {
    card.classList.add('card-deferred');
    // adding the date to be completed to the card if the rooms are not sorted by date
    if (sortType != 'date') {
      var dateHeading = document.createElement('p');
      var temp = this.date.split('/');
      var temp2 = temp[1].split('-');
      var year = temp2[1];
      dateHeading.textContent = formattedDate(temp[0], temp2[0], year);
      textDiv.appendChild(dateHeading);
    }
  }
  card.appendChild(textDiv);

  // clicking a card for a room to open the viewer
  card.addEventListener('click', addViewer.bind(this, card));
  return card;
}

// the room that the viewer is currently open for and its parent element
var current = null;
var parent = null;

function addViewer(card) {
  // deactivate currently open card and close open container
  if (current != null && parent.contains(current)) {
    current.parentElement.removeChild(current.parentElement.lastChild);
    current.classList.remove('card-active');
  }

  // add container if the currently open card wasn't clicked
  if (current != card) {
    card.classList.add('card-active');
    var container = document.createElement('DIV');
    container.className = 'ba-container';

    // 'x' icon
    var close = document.createElement('I');
    close.className = 'material-icons close';
    close.innerHTML = 'close';
    container.appendChild(close);

    close.onclick = function() {
      container.classList.add('animateout');
      setTimeout(function() {
        current.parentElement.removeChild(current.parentElement.lastChild);
        current.classList.remove('card-active');
        current.scrollIntoView();
        current = null;
        document.removeEventListener('keyup', moveFocus);
      }, 300);
    }

    // add the title of the viewer
    var title = document.createElement('p');
    title.className = 'ba-container-title';
    title.textContent = this.building + ' ' + this.roomNumber;
    container.appendChild(title);

    // adding the Completed/Upgrade Schedule date
    var dateText = document.createElement('P');
    dateText.className = 'date-text';
    var temp = this.date.split('/');
    var temp2 = temp[1].split('-');
    var year = temp2[1];
    var date = formattedDate(temp[0], temp2[0], year);

    if (this.type == 'Ongoing') {
      // commented for COVID by Deepika + tahasun+Gretta sept 2020 to change to paused 
	  //dateText.innerHTML =   '<strong>Upgrade scheduled:</strong> ' + date;
	  dateText.innerHTML =   '<strong>Upgrade scheduled:</strong> Paused'  ;
    } else if (this.type == 'Deferred') {
      dateText.innerHTML =   '<strong>Upgrade scheduled:</strong> Paused ';
    } else if (this.type == 'Pilot') {
      // show just the year for pilot project rooms
      dateText.innerHTML =   '<strong>Completed:</strong> ' + temp2[1];
    } else { // completed case
      dateText.innerHTML =   '<strong>Completed:</strong> ' + date;
    }

    container.appendChild(dateText);

    // returns an image element of the specified scope icon
    function createScopeIcon(scope, type) {
      var icon = document.createElement('IMG');
      icon.src = 'images/progress_icons/' + scope + '_progress_icon.svg';
      icon.alt = scope;
      icon.className = type + '-room-scope-icon';
      return icon;
    }

    // creating the scope icon images for the room
    var scopeIcons = document.createElement('DIV');
    var scopes = roomsToScopeDict[this.building + this.roomNumber];
    if (scopes != null && scopes.constructor !== Array) {
      if (this.type == 'Pilot') {
        scopes = scopes[this.date.split('-')[1]];
      } else {
        scopes = scopes[this.date];
      }
    }
    if (scopes != null) {
      for (var i = 0; i < scopes.length; i++) {
        if (scopes[i] == 1) {
          scopeIcons.appendChild(createScopeIcon(scopesFullform[i], this.type));
        }
      }
    }

    // adds large image if room is not completed yet and before/after viewer if room is completed
    if ((this.type == 'Ongoing') || (this.type == 'Deferred')) {
      console.log("type: " + this.type);
      var imagesAndIconsContainer = document.createElement('DIV');
      imagesAndIconsContainer.className = 'images-icons-container';

      scopeIcons.className = 'ongoing-scope-icons-container';
      imagesAndIconsContainer.appendChild(scopeIcons);

      // displays enlarged image of thumbnail
      imagesAndIconsContainer.appendChild(addImages(this));

      container.appendChild(imagesAndIconsContainer);
    } else {
      scopeIcons.className = 'complete-scope-icons-container';
      container.appendChild(scopeIcons);
      addContent(container, this);
    }

    card.parentElement.appendChild(container);
    // makes the before/after viewer work
    addSlidingFunctionality();

    // adds the buttons at the bottom of the viewer
    var viewerButtons = document.createElement('DIV');
    viewerButtons.className = 'viewer-buttons';

    if ((this.type != 'Ongoing' || this.type != 'Deferred') && this.has360Image) {
      var toggleButton = document.createElement('BUTTON');
      toggleButton.innerHTML = '<img src="images/360_icon.svg">360&#176; Viewer';
      toggleButton.id = 'toggle-button';
      toggleButton.className = 'icon-button';
      toggleButton.addEventListener('click', toggleViewer);
      viewerButtons.appendChild(toggleButton);
    }

    var feedbackButton = document.createElement('A');
    feedbackButton.target = '_blank';
    feedbackButton.className = 'button icon-button';
    feedbackButton.href = '../webapp/f?p=118:1:::::BLDG,ROOM:' + this.building + ',' + this.roomNumber;
    feedbackButton.innerHTML = '<img src="images/feedback.svg">Give feedback';

    viewerButtons.appendChild(feedbackButton);
    container.appendChild(viewerButtons);
    var hash = '#' + this.building + this.roomNumber;
    window.history.pushState(null, null, hash);
    container.scrollIntoView(); // scroll to the viewer automatically

    setTimeout(function() {
      move(); // move the search bar
    }, 50)

    // opens a 2s message saying how to close the viewer
    var closeMessage = document.getElementsByClassName('close-viewer-message')[0];
    closeMessage.style.opacity = 1;
    closeMessage.style.visibility = 'visible';
    setTimeout(function() {
      closeMessage.style.opacity = 0;
      closeMessage.style.visibility = 'hidden';
    }, 2000);

    document.addEventListener('keyup', moveFocus); // allows pressing arrow keys to change rooms

    current = card;
    parent = card.parentElement;
    return;
  }
  // if the same card was clicked twice, then it removes the card from 'current'
  current = null;
  document.removeEventListener('keyup', moveFocus);
}

// handling arrow key presses
var moveFocus = function(event) {
  var key = event.which || event.keyCode;
  if (key == 27) { // escape key is pressed
    document.getElementsByClassName('close')[0].click();
  }
  if (key == 37) { // left arrow key pressed
    // if the first card in the heading is reached
    if (current.previousSibling == null) {
      // check if there is a heading before
      var headings = Array.prototype.slice.call(document.getElementsByClassName('category-heading'));
      var indexOfOpenHeading = headings.indexOf(parent.previousSibling);
      if (indexOfOpenHeading > 0) {
        // check if the previous heading is open and if it is not, then open it
        var previousHeading = headings[indexOfOpenHeading - 1]
        if (currentlyOpen.indexOf(previousHeading) == -1) {
          previousHeading.click();
        }
        // open the first room in the previous heading
        previousHeading.nextSibling.firstChild.click();
      }
    } else {
      // open the previous card in the same heading
      current.previousSibling.click();
    }
  } else if (key == 39) { // right arrow key pressed
    // if the last card in the heading is reached
    if (current.nextSibling.classList.contains('ba-container')) {
      // check if there is another heading after
      if (parent.nextElementSibling != null) {
        // check if the next heading is open and if it is not, then open it
        if (currentlyOpen.indexOf(parent.nextSibling) == -1) {
          parent.nextSibling.click();
        }
        // open the first room in the next heading
        parent.nextSibling.nextSibling.firstChild.click();
      }
    } else {
      // open the next card in the same heading
      current.nextSibling.click();
    }
  }
}

// creates the before/after slider and the 360 image
function addContent(container, room) {
  var slider = document.createElement('DIV');
  slider.className = 'ba-slider';

  var beforeText = document.createElement('DIV');
  var afterText = document.createElement('DIV');
  beforeText.className = 'ba_text before_text';
  afterText.className = 'ba_text after_text';
  beforeText.textContent = 'Before';
  afterText.textContent = 'After';

  var baImages = addImages(room); // returns an array with the before image and then the after image
  slider.appendChild(baImages[1]);
  slider.appendChild(afterText);

  var resize = document.createElement('DIV');
  resize.className = 'resize';
  resize.appendChild(baImages[0]);
  resize.appendChild(beforeText);

  slider.appendChild(resize);

  var handle = document.createElement('SPAN');
  handle.className = 'handle';
  slider.appendChild(handle);
  container.appendChild(slider);

  if (room.has360Image) {
    var image360 = document.createElement('DIV');
    image360.id = room.building + room.roomNumber + '-360';
    image360.className = 'image-360';

    image360.innerHTML = '<h3 style="text-align: center; text-transform: none">Feature coming soon...</h3>';

    container.appendChild(image360);
    image360.style.display = 'none';
    // setTimeout(function() {
    //   load360(room);
    // }, 100);
  }
}

function addImages(room) {
  var imageUrl = 'images/room_images/' + room.building + '-' + fullform[room.building] +
    '/' + room.type + '/' + room.roomNumber + '_' + room.date.split('/')[0] + '-' + room.date.split('/')[1] + '.jpg';
  var imageText = room.building + ' ' + room.roomNumber;

  if (room.type == 'Ongoing' || room.type == 'Deferred') {
    var image = document.createElement('IMG');
    image.className = 'ongoing-image';
    image.src = imageUrl;
    image.alt = imageText;
    return image;
  } else {
    var beforeImage = document.createElement('IMG');
    var afterImage = document.createElement('IMG');
    beforeImage.src = imageUrl;
    afterImage.src = domain + room.building + '/' + room.building + room.roomNumber + '/' + room.building + room.roomNumber + '_View1.jpg';
    beforeImage.alt = imageText + ' Before';
    afterImage.alt = imageText + ' After';
    return [beforeImage, afterImage];
  }
}

// create 360 viewer using Google VR View
function load360(room) {
  var imageUrl = 'images/room_images/' + room.building + '-' + fullform[room.building] +
    '/360_images/' + room.roomNumber + '.jpg';

  var vrView = new VRView.Player('#' + room.building + room.roomNumber + '-360', {
    image: imageUrl,
    width: '100%',
    height: '500px'
  });
}

// toggle between the before/after and the 360 viewer
function toggleViewer() {
  var button = document.getElementById('toggle-button');
  if (button.textContent.substring(0, 3) == '360') {
    button.innerHTML = '<img src="images/ba_icon.svg">Before/After Viewer';
    document.getElementsByClassName('ba-slider')[0].style.display = 'none';
    document.getElementsByClassName('image-360')[0].style.display = 'block';
  } else {
    button.innerHTML = '<img src="images/360_icon.svg">360&#176; Viewer';
    document.getElementsByClassName('image-360')[0].style.display = 'none';
    document.getElementsByClassName('ba-slider')[0].style.display = 'block';
  }
}

// class for the rooms object
function Rooms(roomsDict) {
  this.rooms = this.makeRoomObjects(roomsDict);
  // sorts this.roooms alphabetically
  this.sortRooms();
  this.categorizedByDate = {};
  this.categorizedByBuilding = {};
  if (roomsDict != undefined) {
    // populates this.categorizedByDate and this.categorizedByBuilding
    this.categorizeRooms('date');
    this.categorizeRooms('building');
  }
}

// returns a list with Room objects given the dictionary in the form {Building: {Type: {Room Number: Date}}}
Rooms.prototype.makeRoomObjects = function(dict) {
  var rooms = [];

  for (var building in dict) {
    for (var type in dict[building]) {
      for (var room in dict[building][type]) {
        var dates = dict[building][type][room];
        for (var i = 0; i < dates.length; i++) {
          rooms.push(new Room(room, building, type, dates[i]));
        }
      }
    }
  }
  return rooms;
}

Rooms.prototype.sortRooms = function() {
  this.rooms.sort(function(a, b) {
    var buildingA = a.building;
    var numberA;

    // if room number is like 'B150', only the number (150) is considered
    if (!isNaN(parseInt(a.roomNumber.charAt(0)))) {
      numberA = parseInt(a.roomNumber);
    } else {
      numberA = parseInt(a.roomNumber.substr(1));
    }

    var buildingB = b.building;
    var numberB;
    if (!isNaN(parseInt(b.roomNumber.charAt(0)))) {
      numberB = parseInt(b.roomNumber);
    } else {
      numberB = parseInt(b.roomNumber.substr(1));
    }

    // first sort by building and then by room number
    return buildingA < buildingB ? -1 : buildingA > buildingB ? 1 : (numberA - numberB != 0 ? numberA - numberB : (a.type == 'Ongoing' ? 1 : -1));
  });
}

// categorizes the room objects in the rooms list by sortType
Rooms.prototype.categorizeRooms = function(sortType) { // sortType is either 'date' or 'building'
  var dictType = sortType == 'date' ? this.categorizedByDate : this.categorizedByBuilding;

  for (var i = 0; i < this.rooms.length; i++) {
    if (this.rooms[i].type == 'Pilot' && sortType == 'date') {
      if (dictType['Pilot'] == undefined) {
        dictType['Pilot'] = [];
      }
      dictType['Pilot'].push(this.rooms[i]);
    } else {
      if (dictType[this.rooms[i][sortType]] == undefined) {
        dictType[this.rooms[i][sortType]] = [];
      }
      dictType[this.rooms[i][sortType]].push(this.rooms[i]);
    }
  }
}

// creates HTML elements for the headings and the cards and display them
Rooms.prototype.showRoomsBy = function(type) { // type is either 'date' or 'building'
  // resets all variables and clears any elements from content
  var content = document.getElementById('content');
  content.innerHTML = '';
  current = null; // refers to currently active card
  currentlyOpen = []; // refers to currently open headings
  document.removeEventListener('keyup', moveFocus);

  var dictType = type == 'date' ? this.categorizedByDate :
    this.categorizedByBuilding;
  var categories = Object.keys(dictType);

  if (type == 'date') {
    // sort by year first and then by season
    categories.sort(function(a, b) {
      var yearA = a == 'Pilot' ? 3000 : parseInt(a.slice(-4));
      var yearB = b == 'Pilot' ? 3000 : parseInt(b.slice(-4));
      var season1ForA = parseInt(a.charAt(0));
      var season2ForA = parseInt(a.charAt(2));
      var season1ForB = parseInt(b.charAt(0));
      var season2ForB = parseInt(b.charAt(2));

      return (yearA - yearB) != 0 ? ((yearA - yearB) == 0 ? (yearA - yearB) : (yearA - yearB) < 0 ? 1 : -1) : (season1ForA - season1ForB) != 0 ? ((season1ForA - season1ForB) == 0 ? (season1ForA - season1ForB) : (season1ForA - season1ForB) < 0 ? 1 : -1) : ((season2ForA - season2ForB) == 0 ? (season2ForA - season2ForB) : (season2ForA - season2ForB) < 0 ? 1 : -1);
    });
  } else if (type == 'building') {
    // sort alphabetically
    categories.sort();
  }

  // rendering the content (headings and the room cards)
  for (var i = 0; i < categories.length; i++) {
    // create heading for each category
    var heading = document.createElement('DIV');
    if (type == 'date'){
      heading.className = 'category-heading date';
    } else if (type == 'building') {
      heading.className = 'category-heading building';
    }

    // create the season icon
    if (!isNaN(categories[i].charAt(0))) {
      var seasonImage = document.createElement('IMG');
      seasonImage.src = 'images/' + seasonsFullform[categories[i].charAt(0)] + '.svg';
      seasonImage.className = 'heading-image';
      heading.appendChild(seasonImage);
    } else {
      // create the building icon
      var image = document.createElement('IMG');
      image.src = 'images/building.svg';
      image.className = 'heading-image';
      heading.appendChild(image);
    }

    var title;
    var margin;
    var stats;
    var key = categories[i];

    if (type == 'date') {
      if (categories[i] != 'Pilot') {
        title = formattedDate(key.charAt(0), key.charAt(2), key.slice(-4));
      } else {
        title = 'Pilot Project';
      }

      // gets the number of different buildings in a particular category
      var uniqueBuildings = [];
      for (var j = 0; j < dictType[key].length; j++) {
        var currBuilding = dictType[key][j].building;
        if (uniqueBuildings[uniqueBuildings.length - 1] != currBuilding) {
          uniqueBuildings.push(currBuilding);
        }
      }

      stats = dictType[key].length + ' Classrooms' + ' | ' + uniqueBuildings.length + ' Buildings';
    } else if (type == 'building') {
      var building = categories[i];
      title = fullform[building] + ' (' + building + ')';

      var finished = 0;
      var inProgress = 0;
      for (var j = 0; j < dictType[key].length; j++) {
        var currType = dictType[key][j].type;
        if (currType == 'Ongoing') {
          inProgress += 1;
        } else {
          finished += 1;
        }
      }

      stats = finished + ' Completed' + ' | ' + inProgress + ' Paused';
    }
    margin = title.toLowerCase().split(" ")[0];; // class="stats type">
    heading.innerHTML += '<p>' + title + '</p>' + '<div class="stats ' + margin + '">' + stats + '</div>';
    content.appendChild(heading);

    // container for the rooms in each building
    var roomsInBuilding = document.createElement('DIV');
    roomsInBuilding.className = 'rooms';
    content.appendChild(roomsInBuilding);
    heading.addEventListener('click', addCards.bind(this, heading, dictType, categories[i], type));
  }
}

// return the cards that match the query
Rooms.prototype.getCardsByInput = function(query) {
  return this.rooms.filter(function(room) {
    var roomString = room.building + room.roomNumber;
    return roomString.startsWith(query);
  });
}

var currentlyOpen = [];
// create cards for the rooms and add to container
function addCards(heading, dict, category, type) {
  var roomContainer = heading.nextSibling;
  if (currentlyOpen.indexOf(heading) == -1) {
    dict[category].forEach(function(room) {
      roomContainer.appendChild(room.makeCard(type));
    });
    currentlyOpen.push(heading);
    heading.classList.add('open');

    // animating the cards when they show up
    new Animate({
      elements: roomContainer.getElementsByClassName('card'),
      animation: 'move-in 0.3s ease-out',
      gap: 20
    }).start();
    heading.scrollIntoView();
    setTimeout(function() {
      move(); // move the search bar
    }, 100)
  } else {
    closeHeading(heading);
  }
}

function closeHeading(heading) {
  var roomContainer = heading.nextSibling;
  roomContainer.innerHTML = '';
  currentlyOpen.splice(currentlyOpen.indexOf(heading), 1);
  heading.classList.remove('open');
  document.removeEventListener('keyup', moveFocus);
}

var lastQuery = '';
// display the cards that match the query
function showSearchedCards(query) {
  query = query.toUpperCase().replace(/\s+/g, '');
  if (lastQuery != query) {
    document.removeEventListener('keyup', moveFocus);
    current = null; // refers to currently active card

    lastQuery = query;

    // if user deletes query, categorize the rooms by date
    if (query == '') {
      document.getElementById('date_button').click();
      return;
    }

    // unselect the active button when something is typed and remove the cards from view
    var container = document.getElementById('content');
    container.innerHTML = '';
    var activeButton = document.getElementsByClassName('btn-active')[0];
    if (activeButton != null) {
      activeButton.classList.remove('btn-active');
    }

    // gets the matched cards and displays them
    var matched = roomObjects.getCardsByInput(query);
    for (var i = 0; i < matched.length; i++) {
      container.appendChild(matched[i].makeCard());
    }

    // animating the cards when they show up
    new Animate({
      elements: container.getElementsByClassName('card'),
      animation: 'move-in 0.5s ease-out',
      gap: 30
    }).start();
  }
}

var roomObjects;
var animation;
var roomsClickedArray = [];

$(function() {
  roomObjects = new Rooms(roomsDict);
  // gets the button selected by default and uses it to categorize the cards on page load
  var defaultSort = document.getElementsByClassName('default')[0].lastChild.textContent.toLowerCase();
  roomObjects.showRoomsBy(defaultSort);

  // An array containing all the rooms
  var rooms = [];

  for (var i = 0; i < roomObjects.rooms.length; i++) {
    rooms.push(roomObjects.rooms[i].building + roomObjects.rooms[i].roomNumber);
  }

  // initiate the autocomplete function on the "search-input" element, and pass along the rooms array as possible autocomplete values
  autocomplete(document.getElementsByClassName("search-input")[0], rooms);

  animation = new Animate({
    elements: document.getElementsByClassName('category-heading'),
    animation: 'move-in 0.4s ease-out',
    gap: 70
  });
  // for animating the headings on page load
  animation.start();

  document.getElementById('date_button').addEventListener('click', function() {
    roomObjects.showRoomsBy('date');
    // for animating the headings when date is clicked
    animation.start();
  });
  document.getElementById('building_button').addEventListener('click', function() {
    roomObjects.showRoomsBy('building');
    // for animating the headings when building is clicked
    animation.start();
  });
});

if (window.history && window.history.pushState) {
  $(window).on('popstate', function() {
    setTimeout(function() {
      document.getElementsByClassName('close')[0].click();
    }, 20);
  });

}
