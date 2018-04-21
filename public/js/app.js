console.log('This file is responsible for running your JavaScript')

//google maps api setup here


function handleResponse(position) {
  console.log(position)
  buildMap(position.coords.latitude, position.coords.longitude)
  renderMeditationMarkers(features)
}

var map 
function buildMap(latitude, longitude) {
  map = new google.maps.Map(document.querySelector('#map'), {
    center: {
      lat: latitude,
      lng: longitude,
    },
    zoom: 12,
  })

  var marker = new google.maps.Marker({
    position: {
      lat: latitude,
      lng: longitude, 
    },
    map: map,
  });
}
//create an array of objects and pass the array below...
//this would be pre-selected locations to start off in the database.
//MEDITATION MARKERS HERE
function renderMeditationMarkers(places) {
	places.forEach(function(place) {
    
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    
		var marker = new google.maps.Marker({
      position: place.position, 
      map: map,
      icon: iconBase + 'info-i_maps.png',
      title: place.name,
    });
  })
}


var features = [
  {   
    //bethesda fountain central park
    position: new google.maps.LatLng(40.774364, -73.970775),
    type: 'info'
  }, { 
    //pier 51
    position: new google.maps.LatLng(40.7385, -74.0096399),
    type: 'info'
  }, {
    //samsung rooftop
    position: new google.maps.LatLng(40.7405242,-74.007537),
    type: 'info'
  }, {
    //battery park city
    position: new google.maps.LatLng(40.7055751,-74.0186149),
    type: 'info'
  }, {
    //1 hotel brooklyn bridge
    position: new google.maps.LatLng(40.7017018,-73.9979668),
    type: 'info'
  }, {
    //prospect park
    position: new google.maps.LatLng(40.6602077,-73.9711445),
    type: 'info'
  }, {
    //governor's island outlook hill
    position: new google.maps.LatLng(40.686249,-74.0253079),
    type: 'info'
  }, {
    //fort tryon park
    position: new google.maps.LatLng(40.8625648,-73.9334882),
    type: 'info'
  }, {
    //wave hill in the bronx
    position: new google.maps.LatLng(40.7367093,-74.0066865),
    type: 'info'
  },
];



//chat bot example if I want to integrate somehow
//https://hubot.github.com/

//Get a reference to the root of the Firebase Database
var messageAppReference = firebase.database()

$('#message-form').submit(function(event) {
  event.preventDefault()

var message = $('#message').val()   

// Create a section for messages data in your db
var messagesReference = messageAppReference.ref('messages')

  messagesReference.push({
    message: message,
    votes: 0,
    // add a `user` property to each message
    user: firebase.auth().currentUser.displayName,
  })

  $('#message').val('')
})

function getUserMessages() {
  // listens for changes to the `messages` node in the DB
  messageAppReference.ref('messages').on('value', function (results) {
  $('.message-board').empty()

    results.forEach(function (msg) {
      // "un-wrap" data from firebase using .val()
      var message = msg.val()
      var votes = message.votes
      var user = msg.val().user
      var id = msg.key
      // create a <li> element
      console.log(message, id)
      var $li = $('<li>').text(message.message + ' - ' + user)
    
      // Create up vote element
      var $upVoteElement = $('<i class="fa fa-thumbs-up pull-right"></i>');

      $upVoteElement.on('click', function () {
        updateMessage(id, ++votes);
      })

      // Create down vote element
      var $downVoteElement = $('<i class="fa fa-thumbs-down pull-right"></i>')

      $downVoteElement.on('click', function () {
        updateMessage(id, --votes);
      })

      //create delete element 
      var $deleteElement = $('<i class="fa fa-trash pull-right delete"></i>')

      $deleteElement.on('click', function () {
        deleteMessage(id);
      })

      $li.append($deleteElement)
      $li.append($downVoteElement)
      $li.append($upVoteElement) 
      $li.append('<div class="pull-right">' + votes + '</div>')
          
      $('.message-board').append($li)
    })
  })
}

function updateMessage(id, votes) {
  // find message whose objectId is equal to the id we're searching with
  var messageReference = messageAppReference.ref('messages/' + id)

  // update votes property
  messageReference.update({
    votes: votes,
  })
}

function deleteMessage(id) {
  // find message whose objectId is equal to the id we're searching with
  var messageReference = messageAppReference.ref('messages/' + id)

  messageReference.remove()
}

getUserMessages()

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth())

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function() {
      return false;
    },
  },
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
}

ui.start('#firebaseui-auth-container', uiConfig)

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $('#sign-in-container').hide()
    $('#message-board-container').show()
    //only if a user is signed in, then show the map
    navigator.geolocation.getCurrentPosition(handleResponse)
    //only if user is signed in, then show this container
    $('#main').show()
  } else {
    $('#sign-in-container').show()
    $('#message-board-container').hide()
  }
})

$('#sign-out').click(function() {
  firebase.auth().signOut()
})