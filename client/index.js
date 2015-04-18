/* global Firebase:true */

'use strict';

var root;

$(document).ready(init);

function init(){
  root = new Firebase('https://battleship-greygatch.firebaseio.com/');
}

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

  root.authWithPassword({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error logging in:', error);
    }else{
      redrawCharacters();
    }
  });
}

function logoutUser(){
  root.unauth();
  myKey = null;
  $('#characters > tbody > tr.active').removeClass('active');
}
