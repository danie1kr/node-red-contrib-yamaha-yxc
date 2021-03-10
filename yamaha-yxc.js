module.exports = function(RED) {
	var YamahaYXC = require("yamaha-yxc-nodejs");

	// config
	function YamahaXYCNodeConfig(config) {
		RED.nodes.createNode(this, config);

		// Configuration options passed by Node Red
		this.address = config.address;
		this.name = config.name;

		this.yamaha = new YamahaYXC(this.address);

		// Define functions called by nodes
		var node = this;

		this.get = function(topic) { return node.yamaha.SendGetToDevice(topic); };
		this.post = function(topic, payload) { return node.yamaha.SendPostToDevice(topic, payload); };
	}
	RED.nodes.registerType("yamaha-yxc", YamahaXYCNodeConfig);

	// api
	function YamahaXYCNodeAPI(config) {
		RED.nodes.createNode(this, config);

	    // Save settings in local node
	    this.device = config.device;
	    this.deviceNode = RED.nodes.getNode(this.device);
	    this.name = config.name;

		// Define functions called by nodes
		var node = this;
    	if (this.deviceNode)
    	{
    		this.on('input', function(msg) {
    			msg.yamaha = this.deviceNode.yamaha;
				node.send(msg);
    		});
    	}
	}
	RED.nodes.registerType("yamaha-yxc-api", YamahaXYCNodeAPI);

	// get
  	function YamahaXYCNodeGet(config) {
    	RED.nodes.createNode(this, config);

	    // Save settings in local node
	    this.device = config.device;
	    this.deviceNode = RED.nodes.getNode(this.device);
	    this.name = config.name;
	    this.topic = config.topic;

    	var node = this;
    	if (this.deviceNode) {

			// Input handler, called on incoming flow
			this.on('input', function(msg) {
	        	// If no topic is given in the config, then we use the topic in the msg.
	        	var topic = (node.topic) ? node.topic : msg.topic;
	    		if (!topic) {
	          		node.error('No topic given. Specify either in the config or via msg.topic!');
	         		return;
	       		}

	        	// Get data from the device.
	        	node.deviceNode.get(topic).then(function(value) {
					msg.payload = value;
					node.send(msg);
				}).catch(function(error) {
	          		node.error("Failed to request data from AVR with error: " + error);       // 1 arg: send to debug output
	          		node.error("Failed to request data from AVR with error: " + error, msg);  // 2 arg: trigger catch node
	        	});
	      	});
	    } else {
			this.error(RED._("yamaha-yxc.errors.missing-config"));
	    }
	}
	RED.nodes.registerType("yamaha-yxc-get", YamahaXYCNodeGet);

	// put
	function YamahaYXCNodePut(config) {
	    RED.nodes.createNode(this, config);

	    // Save settings in local node
	    this.device = config.device;
	    this.deviceNode = RED.nodes.getNode(this.device);
	    this.name = config.name;
	    this.topic = config.topic;
	    this.payload = config.payload;

	    var node = this;
	    if (this.deviceNode) {

	  		// Input handler, called on incoming flow
	  		this.on('input', function(msg) {

		        // If no topic is given in the config, then we us the topic in the msg.
		        var topic = (node.topic) ? node.topic : msg.topic;
		        if (!topic) {
		         	node.error('No topic given. Specify either in the config or via msg.topic!');
		        	return;
		        }

				// If no payload is given in the config, then we us the payload in the msg.
				var payload = (node.payload) ? node.payload : msg.payload;
				if (payload === null || payload === undefined) {
				node.error('invalid payload: ' + payload.toString());
					return;
				}

		        /* Some commands need additional payload values. These might be given as JSON object or
		        // automatically added.
		        var jsonPayload = tryParseJSON(payload);
		        if (jsonPayload !== false) {
		          payload = jsonPayload
		        } else {
		          // Check if this topic needs additional payload values and add them to payload
		          var addPayloadFormat = references.hasAdditionalPayload(topic);
		          if (addPayloadFormat) {
		            payload = JSON.parse(addPayloadFormat.replace('%s', payload).trim());
		          }
		        }*/

		        // Put data to the device.
		        node.deviceNode.post(topic, payload).then(function(value) {
					// Continue the flow when data has been put...
					node.send(msg);
		        }).catch(function(error) {
					node.error("Failed to put data to AVR with error: " + error);       // 1 arg: send to debug output
					node.error("Failed to put data to AVR with error: " + error, msg);  // 2 arg: trigger catch node
		        });
	  		});
	    } else {
			this.error(RED._("yamaha-yxc.errors.missing-config"));
	    }
	}
	RED.nodes.registerType("yamaha-yxc-put", YamahaYXCNodePut);


  /* ---------------------------------------------------------------------------
   * Backend informations
   * -------------------------------------------------------------------------*/
  // references.provideReferences(RED)
};