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