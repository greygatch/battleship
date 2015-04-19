/* global Firebase:true */

'use strict';

var root, users, ships, myKey, imp;

$(document).ready(init);

function init(){
  root = new Firebase('https://battleship-greygatch.firebaseio.com/');
  users = root.child('users');
  ships = root.child('ships');
  // users.on('child_added', pushUser);

  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  $('#logout-user').click(logoutUser);
  $('#board2 td').on('click', fireGun)
  // ships.on('child_added', userAdded);
  // characters.on('child_added', userdded);
}

/***************
      TO-DO

3. mask opponent locations***

4. store something(s) on Firebase

5. SFX, animations, etc

***************/

function fireGun(){
  console.log(this);
}

function populateShips(){
  var ships = {
    carrier: 5,
    cruiser: 4,
    frigate: 3,
    transport: 2,
    fighter: 1
  }

  $('#board td').removeClass();

  for (var i in ships){
    var randomX = Math.floor(Math.random() * 9);
    var randomY = Math.floor(Math.random() * 9);



    for (var k = 0; k < ships[i] + 1; k++){
      while ($('#board td[data-x="'+(randomX + k)+'"][data-y="'+randomY+'"]').is('.imperial, .rebel')){
        randomX = Math.floor(Math.random() * 9);
        randomY = Math.floor(Math.random() * 9);
        console.log('holla');
      }
    }


    for (var j = 0 ; j < ships[i]; j++){
      var $td = null;

      if (randomX > (9 - ships[i])){
        randomX = parseInt(randomX / 2);
      }

      if (j === 0){
        $td = $('#board td[data-x="'+randomX+'"][data-y="'+randomY+'"]');
      }
      else{
        $td = $('#board td[data-x="'+ (randomX + j) +'"][data-y="'+ randomY + '"]');
      }

      // $td.css('background-color', 'red');
      $td.addClass(i);
      imp ? $td.addClass('imperial') : $td.addClass('rebel')

    }
  }
}

function positionCheck(){

}

function sideSelect(){

  $('img').removeClass('highlighted');
  $('')

  var $randomSide = $($('.logo')[Math.floor(Math.random() * 2)]);

  $randomSide.hasClass('imp') ? imp = true : imp = false;

  $randomSide.addClass('highlighted');
}

/***********************************/
function createUser(){
  var email = $('#email').val();
  var password = $('#password').val();
  root.createUser({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error creating user:', error);
    }
  });
}

function loginUser(){
  var email = $('#email').val();
  var password = $('#password').val();
  console.log('logging in...')

  root.authWithPassword({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error logging in:', error);
    }else{
      console.log('logged in.');
    }
  });
  var uid = root.getAuth().uid;
  sideSelect();
  populateShips();

  console.log(uid);
  users.push({
    uid: uid,
    imp: imp
  });
}


function logoutUser(){
  root.unauth();
  myKey = null;
  $('#characters > tbody > tr.active').removeClass('active');
  console.log('logged out');
}
