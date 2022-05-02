$(document).ready(function() {
  var images = document.getElementsByClassName('zoom-image');
  var cards = document.getElementsByClassName('zoom-card');
  var modal = document.createElement('DIV');
  modal.className = 'modal';

  var content = document.createElement('DIV');
  content.className = 'modal_content';

  var modalHeader = document.createElement('DIV');
  modalHeader.className = 'modal_header';

  // 'x' button
  var close = document.createElement('I');
  close.className = 'material-icons close';
  close.innerHTML = 'close';
  modalHeader.appendChild(close);

  // text for the header of the modal
  var headerText = document.createElement('P');
  headerText.id = 'header_text';
  modalHeader.appendChild(headerText);
  content.appendChild(modalHeader);

  var body = document.createElement('DIV');
  body.className = 'modal_body';
  content.appendChild(body);

  modal.appendChild(content);

  function closeModal() {
    modal.classList.add('animateout');
    content.classList.add('animateout');
    setTimeout(function() {
      modal.parentElement.removeChild(modal);
      body.removeChild(body.firstChild);
      modal.classList.remove('animateout');
      content.classList.remove('animateout');
      document.body.style.overflow = 'auto';
    }, 220);
  }

  // When the user clicks on <span> (x), close the modal
  close.onclick = function() {
    closeModal();
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    }
  }

  // clicking on an image to enlarge it
  for (var i = 0; i < images.length; i++) {
    images[i].addEventListener("click", function() {
      var largeImg = document.createElement('IMG');
      largeImg.src = this.src;
      body.appendChild(largeImg);
      headerText.innerHTML = this.alt;
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
      addMessage();
    });
  }

  // clicking on a card to enlarge it
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function() {
      var largeImg = document.createElement('IMG');
      largeImg.src = this.children[0].src;
      body.appendChild(largeImg);
      headerText.innerHTML = this.children[1].innerHTML;
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
      addMessage();
    });
  }

  document.addEventListener('keydown', function(event) {
    var key = event.which || event.keyCode;
    if(key == 27) {
      if (document.getElementsByClassName('modal').length != 0) {
        closeModal();
      }
    }
  })
});

// showing instructions on how to close image when an image is clicked
function addMessage() {
  var closeMessage = document.createElement('DIV');
  closeMessage.className = 'close-viewer-message';
  closeMessage.innerHTML = "Press 'Esc' or click 'X' to close this viewer";
  document.body.appendChild(closeMessage);
  setTimeout(function() {
    closeMessage.style.opacity = 1;
    closeMessage.style.visibility = 'visible';
  }, 50);

  setTimeout(function() {
    closeMessage.style.opacity = 0;
    closeMessage.style.visibility = 'hidden';
    setTimeout(function() {
      document.body.removeChild(closeMessage);
    }, 800)
  }, 2000);
}
