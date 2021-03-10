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
};