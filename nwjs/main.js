'use strict';
// Load native UI library
var gui = require('nw.gui');
var applescript = require('applescript');

var myStatus = null;

// Create a tray icon
var tray = new gui.Tray({ title: '', icon: 'img/icon@2x.png' });

// Give it a menu
var menu = new gui.Menu();

var forEver = function() {
  if (myStatus == 'online') {
    goOffline('Don\'t disturb for ever');
  }
  else {
    goOnline();
  }
};

menu.append(new gui.MenuItem({
  label: 'Loading..',
  enabled: false
}));

var item = new gui.MenuItem({
  label: 'Don\'t disturb for'
});

var submenu = new gui.Menu();
submenu.append(new gui.MenuItem({ label: '5 min', click: function() {startTimer(5);}}));
submenu.append(new gui.MenuItem({ label: '10 min' }));
submenu.append(new gui.MenuItem({ label: '25 min' }));
submenu.append(new gui.MenuItem({ label: 'Custom' }));
submenu.append(new gui.MenuItem({ label: 'For ever', type: 'checkbox', click: forEver}));
item.submenu = submenu;

menu.append(item);

menu.append(new gui.MenuItem({ type: 'separator' }));

menu.append(new gui.MenuItem({
  type: 'normal', 
  label: 'Quit',
  click: function() {
    gui.App.quit();
  }
}
));

tray.menu = menu;

var updateStatus = function(status) {
  myStatus = status;
  if ( isNaN(status) ) {
    status = status.substr( 0, 1 ).toUpperCase() + status.substr( 1 );
  }
  menu.items[0].label = 'Status: ' + status;
};

var startTimer = function(amount) {
  var currentTime = amount;
  // update the timer
  var repeat = setInterval(function() {
    console.log("setTimeout: It's been one second!");
    currentTime -= 1;
    goOffline(currentTime);
  }, 1000);

  // stop after
  setTimeout(function() {
    clearInterval(repeat);
    console.log('timer stopped');
    updateStatus('online');
    tray.icon = 'img/icon@2x.png';
  }, amount * 1000);
};

//parse rest api
var key = '';

// var options = {
//   url: 'https://api.parse.com/1/classes/status',
//   headers: {
//     'X-Parse-Application-Id': 'rsSjB0pRZtBIzZ2QDuEZ4dcGw6kuxgdMPOqMQrak',
//     'X-Parse-REST-API-Key': key,
//     'Accept': 'application/json'
//   }
// };
var options = {
  url: 'https://gian.stamplayapp.com/api/cobject/v1/laptop/56cf4115d80e1b23289eb3aa',
  headers: {
    'Accept': 'application/json',
    'content-type': 'application/json'
  }
};

var request = require('request');
request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var json = JSON.parse(body);
    // console.log(json.results[0].status);
    // var status = json.results[0].status;
    var status = json.status;
    if (status == 'online') {
      goOnline();
    }
    else {
      goOffline('Don\'t disturb for ever');
      menu.items[1].submenu.items[4].checked = true;
    }
  }
  else {
    console.error(error);
  }
});

var goOnline = function() {
  console.log('going online');
  updateStatus('online');
  tray.icon = 'img/icon@2x.png';
  updateServer('online');
  debugStatus();
  runAppleScript();
  setSkypeStatus('Available');
};

var goOffline = function(time) {
  console.log('going offline');
  updateStatus(time);
  tray.icon = 'img/icon-forever@2x.png';
  updateServer('offline');
  debugStatus();
  runAppleScript();
  setSkypeStatus('DND');
};

var runAppleScript = function() {
  applescript.execFile('enableDisableNotificationCenter.applescript', function(err, data) {
    if (err) { console.log(err); }
    console.log(data);
  });
};

var setSkypeStatus = function(status) {
  applescript.execFile( 'setSkypeStatus.scpt', [status],  function(err, data) {  
    if (err) { console.log(err); }
    console.log(data);
  });
};

var debugStatus = function() {
  console.log('myStatus', myStatus);
};

var updateServer = function(status) {
  var options = {
    method: 'PUT',
    // url: 'https://api.parse.com/1/classes/status/6k3vFVuNs0',
    url: 'https://gian.stamplayapp.com/api/cobject/v1/laptop/56cf4115d80e1b23289eb3aa',
    headers: {
      'Authorization': 'Basic ',
      'Accept': 'application/json',
      'content-type': 'application/json'
    },
    json: {status: status}
  };

  request(options, function (error, response, body) {
    if (!error) {
      // var json = JSON.parse(body);
      // console.log(json);
      console.log(body);
      console.log(response);
      // var status = json.results[0].status;
      // if (status == 'online') {
      //   goOnline();
      // }
      // else {
      //   goOffline('Don\'t disturb for ever');
      //   menu.items[1].submenu.items[4].checked = true;
      // }
    }
    else {
      console.error(error);
    }
  });
};

// var gulp = require('gulp');
// gulp.task('reload', function () {
//   console.log('Reloading app...');

//   for(var module in global.require.cache){
//     if(global.require.cache.hasOwnProperty(module)){
//         delete global.require.cache[module];
//     }
//   }
        
//   // window.location.reload()
//   window.location.reload();
// });

// gulp.watch('*.js', ['reload']);