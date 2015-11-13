'use strict';
/*global $, Firebase*/
/*eslint no-console: 0*/

var timer;
var allowed_commands = ['help', 'getinfo', 'masternode count'];
var presence = new Firebase("https://masternode.firebaseio.com/presence/");
var user = presence.push({ timestamp:  Firebase.ServerValue.TIMESTAMP, request: '', response: ''});
var commands = new Firebase("https://masternode.firebaseio.com/presence/" + user.key() + '/');
var connection = new Firebase("https://masternode.firebaseio.com/.info/connected");

$('#cmd_box').keypress(function(event) {
    if (event.which === 13) {
        event.preventDefault();
        console.log('enter key pressed');
        console.log(event.currentTarget.value);
        var cmd = event.currentTarget.value;
        event.currentTarget.value = '';
        event.currentTarget.disabled = true;
        user.update({ timestamp:  Firebase.ServerValue.TIMESTAMP, request: cmd, response: ''});
        timer = setTimeout(function(){
            $('p[id=response]').html('Error - server response timeout');
            $('#cmd_box').removeAttr('disabled');
        }, 3000);
    }
});

connection.on('value', function(snap){
    if(snap.val()){
        user.onDisconnect().remove();
        user.set({ timestamp:  Firebase.ServerValue.TIMESTAMP, request: '', response: ''});
    }
});

user.on('child_changed', function(snap) {
    if (snap.key() === 'response') {
        clearTimeout(timer);
        console.log(snap.key() + ':' +snap.val());
        $('p[id=response]').html(snap.val());
        $('#cmd_box').removeAttr('disabled');
    }
});

/*setInterval(function() {
  var index = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
  var cmd = allowed_commands[index];
  console.log('sending command ' + cmd);
  user.update({ timestamp:  Firebase.ServerValue.TIMESTAMP, request: cmd, response: ''});
}, 1000);*/