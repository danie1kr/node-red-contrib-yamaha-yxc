# node-red-contrib-yamaha-yxc
A node red module for controlling Yamaha MusicCast devices via yamaha-yxc-nodejs

# Node Red details
This project contains one node which injects the YamahaYXC into incoming messages.
The node takes any `msg` as an input.
The output `msg` is enriched with the `msg.yamaha` object.
    
This node gives you the YamahaYXC object exposing the API in the msg object as `msg.yamaha`.
You can use this node in the following nodes, e.g. in a function node.
To power up your Yamaha device in the main zone, just call `msg.yamaha.power("on", "main")`.
Be aware that yamaha-yxc-nodejs returns promises, so the full function would more look like this: 
```javascript
msg.yamaha.power("on", "main").then(() => { 
	msg.payload = "zone main is on"; 
	node.send(msg); 
}); 
return;
```

# Example
A example flow [here](example.flow) demonstrates the idea.
It uses the `node-red-contrib-avr-yamaha` to power on the receiver, gets the `yamaha-yxc-nodejs` device, selects the 1st preset of the list and finally sets the volume to -50db, again using the avr node.

# Referencess
* [yamaha-yxc-nodejs](https://github.com/foxthefox/yamaha-yxc-nodejs) docs on git - full description of `msg.yamaha` property
* [node-red-contrib-avr-yamaha](https://github.com/krauskopf/node-red-contrib-avr-yamaha) on git - thanks to krauskopf for all the inspiration
