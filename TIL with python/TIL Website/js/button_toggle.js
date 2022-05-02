$(document).ready(addToggleFunctionality);

function addToggleFunctionality() {
  var buttonGroups = document.getElementsByClassName('button-group');
  for (var i = 0; i < buttonGroups.length; i++) {
    var buttons = buttonGroups[i].children;

    var noButtonActive = true;
    for (var j = 0; j < buttons.length; j++) {
      if (buttons[j].classList.contains('btn-active')) {
        noButtonActive = false;
      }
    }

    for (var j = 0; j < buttons.length; j++) {
      buttons[j].addEventListener("click", makeActive.bind(this, buttons, j));
      // default selected button
      if (buttons[j].classList.contains('default') && noButtonActive) {
        makeActive(buttons, j);
      }
    }
  }
};

function makeActive(buttons, number) {
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('btn-active');
  }
  buttons[number].classList.add('btn-active');
}
