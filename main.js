'use strict';
/*global $, Firebase*/
/*eslint no-console: 0*/

var timer;
var exports = {public:[]};
var last_command = {index:-1, cmds:[]};
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
        sendCmd(event.currentTarget.value);
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
        var input = $('#cmd_box');
        if (snap.val() === '') {return;}
        clearTimeout(timer);
        console.log(snap.key() + ':' +snap.val());
        $('p[id=response]').html(snap.val());
        input.val('');
        input.removeAttr('disabled');
        input.focus();
    }
});

var sendCmd = function(cmd) {
    //clear input box
    var input = $('#cmd_box');
    //disable input while waiting for server response or timeout
    input.prop('disabled', true);
    //update record
    user.update({ timestamp:  Firebase.ServerValue.TIMESTAMP, request: cmd, response: ''});
    //no more than 100 commands
    if (last_command.cmds.length > 99) {
        //remove oldest command
        last_command.cmds.pop();
    }
    //add command to last_commands buffer
    last_command.cmds.unshift(cmd);
    last_command.index = -1;
    //start server timeout
    timer = setTimeout(function(){
        $('p[id=response]').html('Error - server response timeout');
        input.val('');
        input.removeAttr('disabled');
        input.focus();
    }, 5000);
};

//dare to break the server
/*setInterval(function() {
    var index = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    var cmd = exports.public[index];
    console.log('sending command ' + cmd);
    user.update({ timestamp:  Firebase.ServerValue.TIMESTAMP, request: cmd, response: ''});
}, 1000);*/
