# dash-cli-remote

This is a proof of concept of a remote command line for dash wallet/masternode using firebase as broker

# how it works

  - the client (index.html) communicates with firebase requesting to execute a specific command
  - the server (masternode.js) is a nodejs server which communicates with firebase, receiving command requests. It then executes the requested command and sends back the output of it.

# what can be the outputs of this proof of concept
  - online wallet
  - online masternode monitor
  - centralized dash network API
  - online POS plugin
  - ...
  - 

# why use firebase
[Firebase](https://www.firebase.com/) opens the possibility to communicate with a wallet without openning any ports on your router.

# Setup your own dash-cli
  - Install DASH wallet and run it
  - Create an account at [Firebase](https://www.firebase.com/)
  - At the dashboard create a new app
  - Clone this github to your computer
  - Replace url in masternode.js by the url of your app
  - Replace url(s) in main.js by the url of your app
  - [Follow this tutorial on how to deploy the code to Firebase servers](https://www.firebase.com/docs/hosting/quickstart.html)
  - [Install Firebase npm package](https://www.npmjs.com/package/firebase) 
  ``` sh
  $ npm install firebase
  ```
  - run masternode.js
  ``` sh
  $ nodejs masternode.js
  ```
  - got to https://your_app_name.firebaseapp.com to talk to your wallet
