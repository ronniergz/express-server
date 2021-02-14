const getButton = document.querySelector('#getButton');
const form = document.querySelector('#form');
const message = document.querySelector('#message');
const getResponse = document.querySelector('#getResponse');
const sendResponse = document.querySelector('#sendResponse');

// Get text string message from the server
const getMessage = () => {
  console.log("Getting message from server...");
  fetch('https://localhost:3443/api/message', {
    method: 'GET'
  }).then((res) => {
    if (res.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + res.status);
      return;
    }
    res
      .text()
      .then((data) => { getResponse.innerHTML = data });
  })
  .catch(function (err) {
    console.log('Fetch Error :-S', err);
  });
}

// send a message in JSON format to the server
const sendMessage = (e) => {
  e.preventDefault();
  
  console.log("Sending message to server...");
  console.log(e.target.message.value);

  fetch('https://localhost:3443/api/message', {
    method: 'POST',
    body: e.target.message.value,
    body: JSON.stringify({message: e.target.message.value}),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  }).then((res) => {
    if (res.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + res.status);
      return;
    }
    res
      .text()
      .then((text) => sendResponse.innerHTML = text)
  })
  .catch(function (err) {
    console.log('Fetch Error :-S', err);
  });
}

getButton.addEventListener('click', getMessage);
form.addEventListener('submit', sendMessage);
