'use strict';
/* global require*/
/*eslint no-console: 0*/
var Firebase = require('firebase');          //https://www.npmjs.com/package/firebase
var exec = require('child_process').exec;
var cmds = require('./cmds');

var url = 'https://masternode.firebaseio.com/presence/';
var masternode = new Firebase(url);

masternode.on('child_changed', function(child) {
    if (child.val().request === '') {return;}

    console.log(Date() + 'cmd received: ' + child.val().request);

    //is cmd in public commands?
    var index = cmds.public.indexOf(child.val().request);
    if (index >= 0) {
        var cmd = 'dash-cli -datadir=/opt/data -conf=/opt/data/dash.conf ' + cmds.public[index];
        //execute requested command
        exec(cmd, {maxBuffer: 1024 * 500},
            function(error, stdout, stderr) {
                if (error !== null) {
                    console.log(error);
                    //return command error
                    child.ref().update({response: stderr});
                    return;
                }else{
                    //return command output
                    child.ref().update({response: stdout});
                }
            }
        );
    }else{
        //return command not available
        child.ref().update({response: 'Command not available.'});
        console.log('Command not available.');
    }
});
