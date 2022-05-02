function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  // target.addEventListener(type, listener)
  inp.addEventListener("input", addItems);
  inp.addEventListener("focus", addItems);
  // inp on input and focus will trigger addItems

  // add items is an event
  function addItems(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values
      self defined function */
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:
      autocomplete-container ->  autocomplete-list
      */
      $(a).insertAfter(this);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {

              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;

              if (inp.onchange != null) {
                /*trigger onchange on the input*/
                inp.onchange();
              }

              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          // appends b as the last child of a
          a.appendChild(b);
        }
      }
  }
  /*execute a function presses any key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      // this object === inp object
      var x = document.getElementById(this.id + "autocomplete-list");
      // x = object that has id autocompleted
      // there can be at most one elemet with a specific id in a document

      // if this object is not null then x = child object
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x); // make the child element active
        var dropdown = document.getElementById("autocomplete-list");
        if (dropdown != null && dropdown.children.length > 0) {
          if (currentFocus > 2) {
            dropdown.scrollBy(0, 42);
          } else {
            dropdown.scrollTo(0, 0);
          }
        }
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
        var dropdown = document.getElementById("autocomplete-list");
        if (dropdown != null && dropdown.children.length > 0) {
          if (currentFocus < x.length - 3) {
            dropdown.scrollBy(0, -42);
          } else {
            dropdown.scrollTo(0, dropdown.scrollHeight);
          }
        }
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a onchange on the input*/
          if (x) {
            x[currentFocus].click();
          }
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      });
}
