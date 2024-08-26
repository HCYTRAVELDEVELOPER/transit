/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

//var nameData = "messages_1";
var nameData = null;
var nameTableTokens = null;
var token = null;
var sendFirstMessage = false;
var saveToken = true;
var limitMessages= 12;
var photoGenericProfile = 'images/profile_placeholder.png';

// Signs-in Friendly Chat.
function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

// Initiate firebase auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  var photo = photoGenericProfile;
    var get = getGET();
    if(get !== false) {
        if(typeof get.photo !== "undefined") {
            photo = get.photo;
        }
    }
//var photo = firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
return photo;
}

// Returns the signed-in user's display name.
function getUserID() {
    var id_user = "12345";
    var get = getGET();
    if(get !== false) {
        if(typeof get.id_user !== "undefined") {
            id_user = get.id_user;
        }
    }
//  name = firebase.auth().currentUser.displayName;
  return id_user;
}

function getUserMail() {
    var email = "Invitado";
    var get = getGET();
    if(get !== false) {
        if(typeof get.email !== "undefined") {
            email = get.email;
        }
    }
//  name = firebase.auth().currentUser.displayName;
  return email;
}
// Returns the signed-in user's display name.
function getUserName() {
    var name = "Invitado";
    var get = getGET();
    if(get !== false) {
        if(typeof get.name !== "undefined") {
            name = get.name;
        }
    }
//  name = firebase.auth().currentUser.displayName;
  return name;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Saves a new message on the Firebase DB.
function saveMessage(messageText) {
  // Add a new message entry to the database.
  return firebase.firestore().collection(nameData).add({
    room: get.room,
    id_user: getUserID(),
    userName: getUserMail(),
    name: getUserName(),
    text: messageText,
    profilePicUrl: getProfilePicUrl(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    fecha: getActualFullDate()
  }).catch(function(error) {
    console.error('Error writing new message to database', error);
  });
}

// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  // Create the query to load the last 12 messages and listen for new ones.
  var query = firebase.firestore()
                  .collection(nameData)
                  .orderBy('timestamp', 'desc')
                  .limit(limitMessages);
  // Start listening to the query.
  query.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
//        deleteMessage(change.doc.id);
      } else {
        var message = change.doc.data();
        displayMessage(change.doc.id, message.timestamp, message.name, message.text, message.profilePicUrl, message.imageUrl, message.fecha);
          setHoursMsg(".fecha");
      }
    });
    
  });
}

function loadTokens(callback) {
  var query = firebase.firestore().collection(nameTableTokens);
  query.onSnapshot(function(snapshot) {
      var tokens = [];
    snapshot.docChanges().forEach(function(change) {
        var token = change.doc.data();
        tokens.push(token);
    });
        callback(tokens);
  });
}

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
function saveImageMessage(file) {
  // 1 - We add a message with a loading icon that will get updated with the shared image.
  firebase.firestore().collection(nameData).add({
     room: get.room,
    id_user: getUserID(),
    userName: getUserMail(),
    name: getUserName(),
    imageUrl: LOADING_IMAGE_URL,
    profilePicUrl: getProfilePicUrl(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    fecha: getActualFullDate()
  }).then(function(messageRef) {
    // 2 - Upload the image to Cloud Storage.
    
    var filePath = messageRef.id + '/' + file.name;
    return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
      // 3 - Generate a public URL for the file.
      return fileSnapshot.ref.getDownloadURL().then((url) => {
        // 4 - Update the chat message placeholder with the image's URL.
        
        console.log(url);
          var m = {};
        m.tipo = "saveMessageChat";
        m.message = "";
        m.image = url;
        m.room = get.room;
        m.roomNameData = nameData;
        window.parent.postMessage(m, '*');
        
        return messageRef.update({
          imageUrl: url,
          storageUri: fileSnapshot.metadata.fullPath
        });
      });
    });
  }).catch(function(error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  });
}

// Saves the messaging device token to the datastore.
function saveMessagingDeviceToken() {
//    if(token !== null) {
//        return;
//    }
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      token = currentToken;
      // Saving the Device Token to the datastore.
//      firebase.firestore().collection('fcmTokens').doc(currentToken).set({uid: firebase.auth().currentUser.uid});
      firebase.firestore().collection(nameTableTokens).doc(currentToken).set({uid: getUserMail(), token: currentToken});
    } else {
      // Need to request permissions to show notifications.
      console.log("Need to request permissions to show notifications.");
      requestNotificationsPermissions();
    }
  }).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
}

// Requests permissions to show notifications.
function requestNotificationsPermissions() {
  console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    saveMessagingDeviceToken();
  }).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
}

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
  event.preventDefault();
  var file = null;
  if(typeof event.dataTransfer !== "undefined") {
     file = event.dataTransfer.files[0];
    } else {
     file = event.target.files[0];
    }
  // Clear the selection in the file picker input.
  imageFormElement.reset();
  // Check if the file is an image.
//  if (!file.type.match('image.*')) {
//    var data = {
//      message: 'You can only share images',
//      timeout: 2000
//    };
//    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
//    return;
//  }
  // Check if the user is signed-in
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
    if(typeof e !== "undefined"){
  e.preventDefault();
    }
//                setTimeout(function() {
                    
  if (messageInputElement.value && checkSignedInWithMessage()) {
      var value = messageInputElement.value;
             resetMaterialTextfield(messageInputElement);
        toggleButton();
    saveMessage(value).then(function() {
      // Clear message text field and re-enable the SEND button.
//        resetMaterialTextfield(messageInputElement);
//        toggleButton();
      
      console.log("value", value);
        var m = {};
        m.tipo = "saveMessageChat";
        m.message = value;
        m.room = get.room;
        m.roomNameData = nameData;
        m.sendFirstMessage = sendFirstMessage;
        window.parent.postMessage(m, '*');
      
        sendFirstMessage = true;
      
if(saveToken === true) {
      var a = {};
      a.title = getUserName();
      a.sound = "default";
      a.data = "fcm_push_icon";
      a.icon = getProfilePicUrl();
      a.callback = "/nwlib6/nwproject/modules/webrtc/v6/chat/openWindowChat.php?url={" + window.location.origin + "/chat/index.html}";
      a.body = value;

    loadTokens(function(rta) {
      for(var i = 0; i < rta.length; i++) {
        var tokenSend = rta[i].token;
        if(token != tokenSend) {
         a.to = rta[i].token;
         sendNotificacion(a, function(res) {
         });
      }
    }
});
    }
    });
  }
//       }, 1000);
}

function sendNotificacion(array, callback) {
        var key = 'AAAAGdlePaM:APA91bHRnSqVwY6_DJaJ7jIyAXI8k8eoMx2j59qDbtsll4sw4G0vR-FpfB3uUe0GRQ-_pYmzYfu1BDbHHVI4n85D5JZBcbfAd19YOjCuwfJ8LN0Giy06V1QOVb8lK-InpbEztUyWK2im';
        var to = array.to;
        var notification = {
            'title': array.title,
            'body': array.body,
            'icon': array.icon,
            'others': {
                room_clean: get.room,
                room: nameData,
                id:getUserID(),
                email: getUserMail()
            },
            'click_action': array.callback
        };
        fetch('https://fcm.googleapis.com/fcm/send', {
            'method': 'POST',
            'headers': {
                'Authorization': 'key=' + key,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'notification': notification,
                'to': to,
            })
        }).then(function (response) {
                callback(response);
        }).catch(function (error) {
            console.error(error);
        });
    }

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
//  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    saveMessagingDeviceToken();
//  } else { // User is signed out!
//    // Hide user's profile and sign-out button.
//    userNameElement.setAttribute('hidden', 'true');
//    userPicElement.setAttribute('hidden', 'true');
//    signOutButtonElement.setAttribute('hidden', 'true');
//
//    // Show sign-in button.
//    signInButtonElement.removeAttribute('hidden');
//  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
    return true;
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="message-into">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
      '<div class="fecha"></div>' +
    '</div>'+
    '</div>';

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
    if(url === photoGenericProfile) {
        return photoGenericProfile;
    }
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return "/nwlib6/includes/phpthumb/phpThumb.php?src=" + url.replace(window.location.origin, "") + "&w=50";
//  return url;
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Delete a Message from the UI.
function deleteMessage(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}

function createAndInsertMessage(id, timestamp, name) {
  var className = cleanUserNwC(name);
  var container = document.createElement('div');
  container.innerHTML = MESSAGE_TEMPLATE;
  var div = container.firstChild;
  div.setAttribute('id', id);
  var classUser = "message--mee";
  if(name !== getUserName()) {
     classUser = "message--other";
  }
  
  addClass(div, classUser);

  // If timestamp is null, assume we've gotten a brand new message.
  // https://stackoverflow.com/a/47781432/4816918
  timestamp = timestamp ? timestamp.toMillis() : Date.now();
  div.setAttribute('timestamp', timestamp);

  // figure out where to insert new message
  const existingMessages = messageListElement.children;
  if (existingMessages.length === 0) {
    messageListElement.appendChild(div);
  } else {
  if (existingMessages.length > 10) {
      cargarmas.style.display = "block";
  }
    let messageListNode = existingMessages[0];

    while (messageListNode) {
        
  var type = messageListNode.getAttribute("type");
   if(type !== null) {
      break;
  }
      const messageListNodeTime = messageListNode.getAttribute('timestamp');

      if (!messageListNodeTime) {
        throw new Error(
          `Child ${messageListNode.id} has no 'timestamp' attribute`
        );
      }
      if (messageListNodeTime > timestamp) {
        break;
      }
      messageListNode = messageListNode.nextSibling;
    }
    messageListElement.insertBefore(div, messageListNode);
  }
  return div;
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl, fecha) {
  var div = document.getElementById(id) || createAndInsertMessage(id, timestamp, name);

  // profile picture
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
  }

  div.querySelector('.name').textContent = name;
  div.querySelector('.fecha').textContent = fecha;
  div.querySelector('.fecha').setAttribute("data-date", fecha);
  var messageElement = div.querySelector('.message');

  if (text) {
      if(text.indexOf(".mp3") !== -1) {
          text = '<audio class="player_audio" src="' + text + '" controls=""></audio>';
        messageElement.innerHTML = text;
      } else {
          var haveUrl = haveUrlString(text);
          if(haveUrl === true) {
              messageElement.innerHTML = renderHTML(text);
          } else {
              messageElement.textContent = text;
          }
      }
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else 
  if (imageUrl) {
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    });
    image.className = "imgInMsg";
    image.onclick = function() {
          window.open(this.src, "_BLANK");
    }
    image.src = imageUrl + '&' + new Date().getTime();
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
//  setTimeout(function() {div.classList.add('visible')}, 1);
  div.classList.add('visible');
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
  if (messageInputElement.value) {
    submitButtonElement.removeAttribute('disabled');
  } else {
    submitButtonElement.setAttribute('disabled', 'true');
  }
}

function cargarmasfunc() {
     var get = getGET();
    var d = document.querySelectorAll(".message-container");
    for(var i = 0; i < d.length; i++) {
        d[i].remove();
    }
    var m = {};
    m.tipo = "loadMoreMessages";
    m.room = get.room;
    window.parent.postMessage(m, '*');   
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
}


var get = getGET();

nameData = "messages_" + get.room;
nameTableTokens = "fcmTokens_" + get.room;

// Shortcuts to DOM Elements.
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var submitDictation = document.getElementById("dictation");
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');
var dropImageUp = document.getElementById('dropImageUp');
var cargarmas = document.getElementById('cargarmas');

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);
//signOutButtonElement.addEventListener('click', signOut);
//signInButtonElement.addEventListener('click', signIn);
submitDictation.addEventListener('click', initRecordVoice);
cargarmas.addEventListener('click', cargarmasfunc);

// Toggle for the button.
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);

// Events for image upload.
imageButtonElement.addEventListener('click', function(e) {
  e.preventDefault();
  mediaCaptureElement.click();
});

mediaCaptureElement.addEventListener('change', onMediaFileSelected);


messageInputElement.onfocus = function(){
          var m = {};
        m.tipo = "focusInChat";
        m.id = getUserID();
        m.room = get.room;
        m.inWindow = inWindow;
//        window.parent.postMessage(m, '*');
};
messageInputElement.addEventListener("blur", function() {
      var m = {};
        m.tipo = "focusOutChat";
        m.id = getUserID();
        m.room = get.room;
        m.inWindow = inWindow;
//        window.parent.postMessage(m, '*');
});

var inWindow = true;
  window.addEventListener('focus', function () {
            inWindow = true;
        });

        window.addEventListener('blur', function () {
            inWindow = false;
        });

// Checks that Firebase has been imported.
checkSetup();

// initialize Firebase
//initFirebaseAuth();

//authStateObserver();

var saveToken = true;
if(get) {
    if(get.saveToken === "false") {
      saveToken = false;
     }
    if(typeof get.limitMessages !== "undefined") {
      limitMessages = parseInt(get.limitMessages);
     }
}
if(saveToken) {
 saveMessagingDeviceToken();
}

loadMessages();

 document.addEventListener("drag", function(e) {
       e.preventDefault();
          console.log(e);
  }, false);
  
  document.addEventListener("dragstart", function( event ) {
  }, false);

  document.addEventListener("dragend", function( event ) {
  }, false);

  document.addEventListener("dragover", function( event ) {
      event.preventDefault();
      addClass(dropImageUp, "dropImageUp_show");
  }, false);

  document.addEventListener("dragenter", function( event ) {
      addClass(dropImageUp, "dropImageUp_show");
  }, false);

  document.addEventListener("dragleave", function( event ) {
      removeClass(dropImageUp, "dropImageUp_show", true);
  }, false);

  document.addEventListener("drop", function( event ) {
      event.preventDefault();
      removeClass(dropImageUp, "dropImageUp_show", true);
      onMediaFileSelected(event);
  }, false);
  

setInterval(function () {
            setHoursMsg(".fecha");
        }, 10000);


//var messaging = firebase.messaging();
//messaging.onMessage((payload) => {
//  console.log('Message received. ', payload);
//      var theBody = payload.notification.body;
//                var theIcon = payload.notification.icon;
//                var theTitle = payload.notification.title;
//                var callback = payload.notification.click_action;
//                notificationPushNwrtc(theBody, theIcon, theTitle, callback);
//});

//var messaging = firebase.messaging();
//messaging.onMessage(function(payload) {
//        var m = {};
//        m.tipo = "newMessageChat";
//        m.data = payload;
//        m.id = getUserID();
//        m.room = get.room;
//        m.inWindow = inWindow;
//        window.parent.postMessage(m, '*');
//});

     window.addEventListener('message', function (e) {
            if (typeof e.data !== "undefined") {
                var r = e.data;
                console.log(" addEventListener", r);
                if (r.tipo === "addMessage") {
                     messageInputElement.value = r.text;
                     onMessageFormSubmit();
                } else
                if (r.tipo === "loadMessages") {
           for(var i = 0; i < r.data.length; i++) {
                var message = r.data[i];
                displayMessage(message.id, toTimestamp(message.timestamp), message.name, message.text, message.profilePicUrl, message.imageUrl, message.fecha);
                setHoursMsg(".fecha");
                     
           }        
                }
            }
        });