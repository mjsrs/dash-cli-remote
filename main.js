'use strict';
/*global $, Firebase*/
/*eslint no-console: 0*/

var timer;
var last_command = {index:-1, cmds:[]};
var allowed_commands = ['help', 'getinfo', 'masternode count'];
var presence = new Firebase("https://masternode.firebaseio.com/presence/");
var user = presence.push({ timestamp:  Firebase.ServerValue.TIMESTAMP, request: '', response: ''});
var commands = new Firebase("https://masternode.firebaseio.com/presence/" + user.key() + '/');
var connection = new Firebase("https://masternode.firebaseio.com/.info/connected");

$('#cmd_box').keydown(function(event) {
    switch(event.which){
    case 13:
        event.preventDefault();
        console.log('enter key pressed');
        console.log(event.currentTarget.value);
        var cmd = event.currentTarget.value;
        //clear input box
        event.currentTarget.value = '';
        //disable input while waiting for server response or timeout
        event.currentTarget.disabled = true;
        //update record
        user.update({ timestamp:  Firebase.ServerValue.TIMESTAMP, request: cmd, response: ''});
        //add command to last commands buffer
        last_command.cmds.unshift(cmd);
        //start server timeout
        timer = setTimeout(function(){
            $('p[id=response]').html('Error - server response timeout');
            $('#cmd_box').removeAttr('disabled');
            $('#cmd_box').focus();
        }, 5000);
        break;
    //arrow up -> navigate recent commands
    case 38:
        if (last_command.index + 1 <= last_command.cmds.length - 1) {
            last_command.index += 1;
            event.currentTarget.value = last_command.cmds[last_command.index];
        }
        break;
    //arrow down -> navigate recent commands
    case 40:
        if (last_command.index - 1 >= 0) {
            last_command.index -= 1;
            event.currentTarget.value = last_command.cmds[last_command.index];
        }
        break;
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
        if (snap.val() === '') {return;}
        clearTimeout(timer);
        console.log(snap.key() + ':' +snap.val());
        $('p[id=response]').html(snap.val());
        $('#cmd_box').removeAttr('disabled');
        $('#cmd_box').focus();
    }
});

//dare to break the server
/*setInterval(function() {
  var index = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
  var cmd = allowed_commands[index];
  console.log('sending command ' + cmd);
  user.update({ timestamp:  Firebase.ServerValue.TIMESTAMP, request: cmd, response: ''});
}, 1000);*/