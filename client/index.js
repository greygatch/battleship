/* global Firebase:true */

'use strict';

var root, users, ships, myKey, imp;

var turnBool = false;

var move = '/assets/Explosion8.wav';
var winSound = '/assets/swtheme.wav';
var $sound;
var $sound2;
$(document).ready(init);

function init(){


  // $('#board2 td').removeClass();

  root = new Firebase('https://battleship-greygatch.firebaseio.com/');
  users = root.child('users');
  ships = root.child('ships');
  // users.on('child_added', pushUser);

  root.onDisconnect().remove();

  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  $('#logout-user').click(logoutUser);
  $('#start').click(populateShips);
  $('#board2 td').on('click', fireGun);
  ships.on('child_added', enemyAdded);
  $sound = $('#sound');
  $sound2 = $('#sound2');
  // characters.on('child_added', userdded);
}

/***************
TO-DO
1. Design for 2 users
2. Push coordinates to FB
3. mask opponent locations***
4. SFX, animations, etc
***************/

function enemyAdded(snapshot){
  var myID = root.getAuth().uid;
  var enemyShip = snapshot.val();

  if (enemyShip.uid !== myID){
    $('#board2 td[data-x="'+ enemyShip.x+'"][data-y="'+enemyShip.y+'"]').addClass('hidden');
  }
  else{
    returnl
  }

}

function fireGun(){

  if ($(this).hasClass('hidden')){
    $(this).removeClass();
    $(this).css('background-image', 'url("http://www.tvboden.se/ssp_director/albums/album-4/hr/explosion.jpg")');
    $(this).css('background-size', 'cover');
    $sound.attr('src', move);
    $sound[0].play();
  }
  else{
    $(this).css('background-color', 'rgba(50, 50, 50, .7)');
  }

  if ($('.hidden').length === 0){

    $sound2.attr('src', winSound);
    $sound2[0].play();
    alert('win');
  }
}

function populateShips(){

  // $('#board2 td').removeClass();

  sideSelect();

  var ships = {
    carrier: 5,
    cruiser: 4,
    frigate: 3,
    transport: 2,
    fighter: 1
  };

  $('#board td').removeClass();
  // $('#board2 td').removeClass();

  for (var i in ships){
    var randomX = Math.floor(Math.random() * 9);
    var randomY = Math.floor(Math.random() * 9);
    var randomXY = Math.floor(Math.random() * 2);

    if (randomXY){
      for (var k = 0; k < ships[i]; k++){
        while ($('#board td[data-x="'+(randomX + k)+'"][data-y="'+randomY+'"]').is('.imperial, .rebel')){
          randomX = Math.floor(Math.random() * 9);
          randomY = Math.floor(Math.random() * 9);
          console.log('holla');
        }
      }

      for (var j = 0 ; j < ships[i]; j++){
        var $td = null;
        // var $td2 = null;

        while (randomX > (10 - ships[i])){
          randomX = randomX - 1;
        }

        if (j === 0){
          $td = $('#board td[data-x="'+randomX+'"][data-y="'+randomY+'"]');
          // $td2 = $('#board2 td[data-x="'+randomX+'"][data-y="'+randomY+'"]');
        }
        else{
          $td = $('#board td[data-x="'+ (randomX + j) +'"][data-y="'+ randomY + '"]');
          // $td2 = $('#board2 td[data-x="'+ (randomX + j) +'"][data-y="'+ randomY + '"]');
        }

        // $td.css('background-color', 'red');
        $td.addClass(i);
        // $td2.addClass(i);
        // $td2.addClass('hidden');
        imp ? $td.addClass('imperial') : $td.addClass('rebel')
        // imp ? $td2.addClass('imperial') : $td2.addClass('rebel')

      }
    }
    else{
      for (var k = 0; k < ships[i]; k++){
        while ($('#board td[data-x="'+ randomX +'"][data-y="'+(randomY + k)+'"]').is('.imperial, .rebel')){
          randomX = Math.floor(Math.random() * 9);
          randomY = Math.floor(Math.random() * 9);
          console.log('holla2');
        }
      }

      for (var j = 0 ; j < ships[i]; j++){
        var $td = null;

        while (randomY > (10 - ships[i])){
          randomY = randomY - 1;
        }

        if (j === 0){
          $td = $('#board td[data-x="' + randomX + '"][data-y="' + randomY + '"]');
          // $td2 = $('#board2 td[data-x="' + randomX + '"][data-y="' + randomY + '"]');
        }
        else{
          $td = $('#board td[data-x="' + randomX + '"][data-y="'+ (randomY + j) + '"]');
          // $td2 = $('#board2 td[data-x="' + randomX + '"][data-y="'+ (randomY + j) + '"]');
        }

        // $td.css('background-color', 'red');
        $td.addClass(i);
        // $td2.addClass(i);
        // $td2.addClass('hidden');
        imp ? $td.addClass('imperial') : $td.addClass('rebel');
        // imp ? $td2.addClass('imperial') : $td2.addClass('rebel');
      }
    }
  }
  var $boardElements = $('#board td');

  var ships = root.child('ships');
  var uid = root.getAuth().uid;

  $boardElements.each(function(e){
    if($($boardElements[e]).hasClass('rebel')){
      ships.push({
        imp: imp,
        uid: uid,
        x: $($boardElements[e]).data('x'),
        y: $($boardElements[e]).data('y')
      })
    }
    else if($($boardElements[e]).hasClass('imperial')){
      ships.push({
        imp: imp,
        uid: uid,
        x: $($boardElements[e]).data('x'),
        y: $($boardElements[e]).data('y')
      })
    }
  });


  users.push({
    uid: uid,
    imp: imp
  })
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
}


function logoutUser(){
  root.unauth();
  myKey = null;
  $('#characters > tbody > tr.active').removeClass('active');
  console.log('logged out');
}
