var valid_array = [];
var sumbit = null;
var error_messages = {
  'email': {
    '-2': 'Email is not  valid.',
    '-3': 'Email is missing "@" symbol.'
  },
  'classroom': {
    '-2': 'Classroom length should be between 5 and 6 characters.',
    '-3': 'The first 2 letters should be alphabetic characters representing the building code.',
    '-4': 'The last 3-4 letters should represent the room number.'
  }
}

function delegate1(a, b) {
  return function() {
    validateElement(a, b);
  }
}

function form(form_name) {
  var elements = document.getElementById(form_name + '_form').getElementsByClassName('required');
  submit = document.forms[form_name]['submit'];

  for (var i = 0; i < elements.length; i++) {
    valid_array.push(false);
    // elements[i].removeEventListener('input', validateElement);

    elements[i].addEventListener('input', validateElement(event));
    elements[i].addEventListener('change', changeStyling.bind(this, elements[i]));
  }

  var text_inputs = document.querySelectorAll('#' + form_name + '_form input[type=text]');

  for (var i = 0; i < text_inputs.length; i++) {
    text_inputs[i].addEventListener('keypress', function(e) {
      var key = e.which || e.keyCode;
      if (key === 13 && !valid_array.every(function(curr) {return curr == true;}) && isValid(this) >= -1) { // 13 is the code for 'enter'
        errorDialog();
        for (var i = 0; i < elements.length; i++) {
          if (valid_array[i] == false) {
            validationError(elements[i]);
          }
        }
      }
    });
  }
}

var delay = 5000;
function errorDialog(el, errorCode) {
  // logic for the error dialog text
  var error_text = '';
  if (el == undefined) {
    error_text = 'Please fill out the required fields correctly.';
  } else {
    if(errorCode == -1) {
      error_text = 'Please fill out the ' + el.name + ' input.';
    } else {
      error_text = error_messages[el.name][errorCode];
    }
  }

  // displaying the error dialogs in a queue
  var dialog = document.createElement('DIV');
  dialog.className = 'error-dialog';
  dialog.textContent = error_text;
  var dialogs = document.getElementById('error-dialogs');
  dialogs.appendChild(dialog);
  $('.error-dialog:last-child')
    .animate({opacity: 100}, delay - 1000)
    .animate({opacity: 0}, 1000);
  window.setTimeout(function() {
    dialogs.removeChild(dialogs.firstChild);
  }, delay);
}

function changeStyling(el) {
  var errorCode = isValid(el);
  if (errorCode < 0) {
    validationError(el);
    errorDialog(el, errorCode);
  }
}


function validateElement(el, index) {
  if (isValid(el) == 1) {
    valid_array[index] = true;
    validated(el);
  } else {
    valid_array[index] = false;
  }

  if (valid_array.every(function(curr) {return curr == true;})) {
    submit.disabled = false;
  } else {
    submit.disabled = true;
  }
  console.log('h');
}


function isValid(el) {
  if (el.value == '') {
    console.log('i');
    return -1;
  }
  if (el.name == 'email') {
    return isGoodEmail(el.value);
  };
  if (el.name == 'classroom') {
    return isGoodFormat(el.value);
  };
  return 1;
}


function validationError(el) {
  el.classList.add('validationError');
}

function validated(el) {
  el.classList.remove('validationError');
}


function isGoodFormat(classroom) {
  classroom = classroom.replace(/\s/g,'');
  if (classroom.length > 7 || classroom.length < 5) {
    return -2;
  }

  var room_code = classroom.slice(0, 2);
  if (!/^[a-z]+$/i.test(room_code)) {
    return -3;
  }

  var room_number = classroom.slice(3);
  if (isNaN(room_number)) {
    return -4;
  };
  return 1;
}

function isGoodEmail(email) {
  if (email == '') {
    return -1;
  }
  if (email.indexOf('@') == -1) {
    return -3;
  }
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {return 1};
  return -2;
}

//creating autocomplete
var rooms = ['BA250', 'BA290', 'BA310', 'BA4100', 'HS100', 'HS300', 'OI3000', 'MP102', 'MP200'];

function Tree(root, children) {
  this.root = root;
  this.children = children != undefined ? children : [];
  this.print_children = function() {

  }
}
