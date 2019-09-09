"use strict";

/*
 * Created with @iobroker/create-adapter v1.16.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");

// Load your modules here, e.g.:
// const fs = require("fs");
const LCD = require("lcdi2c");
let blinker;
var lcd;


//let lcd = new LCD(1, this.config.Address, 20, 4);
class Raspilc20x4lcd extends utils.Adapter {





  /**
   * @param {Partial<ioBroker.AdapterOptions>} [options={}]
   */
  constructor(options) {
    super({
      ...options,
      name: "raspilc20x4lcd",
    });
    this.on("ready", this.onReady.bind(this));
    this.on("objectChange", this.onObjectChange.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    // this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }

  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    // Initialize your adapter here




    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // this.config:
    //  this.log.info(this.config.mySelect);
    //  this.log.info(typeof this.config.mySelect);
    if (this.config.mySelect === "16x2") {
      lcd = new LCD(1, this.config.Address, 16, 2);
    } else if (this.config.mySelect === "20x4") {
      lcd = new LCD(1, this.config.Address, 20, 4);
    };
    lcd.clear();
    /*
    For every state in the system there has to be also an object of type state
    Here a simple template for a boolean variable named "testVariable"
    Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
    */
    await this.setObjectAsync("DisplayLine1", {
      type: "state",
      common: {
        name: "DisplayLine1",
        type: "string",
        role: "value",
        def: " ",
        read: true,
        write: true,
      },
      native: {},
    });

    await this.setObjectAsync("DisplayLine2", {
      type: "state",
      common: {
        name: "DisplayLine2",
        type: "string",
        role: "value",
        def: " ",
        read: true,
        write: true,
      },
      native: {},
    });

    await this.setObjectAsync("DisplayLine3", {
      type: "state",
      common: {
        name: "DisplayLine3",
        type: "string",
        role: "value",
        def: " ",
        read: true,
        write: true,
      },
      native: {},
    });

    await this.setObjectAsync("DisplayLine4", {
      type: "state",
      common: {
        name: "DisplayLine4",
        type: "string",
        role: "value",
        def: " ",
        read: true,
        write: true,
      },
      native: {},
    });

    await this.setObjectAsync("DisplayBlink", {
      type: "state",
      common: {
        name: "DisplayBlink",
        type: "boolean",
        role: "switch",
        def: false,
        read: true,
        write: true,
      },
      native: {},
    });

    await this.setObjectAsync("DisplayBlinkTime", {
      type: "state",
      common: {
        name: "DisplayBlinkTime",
        type: "number",
        role: "value",
        def: 500,
        read: true,
        write: true,
      },
      native: {},
    });

    await this.setObjectAsync("DisplayLightOn", {
      type: "state",
      common: {
        name: "DisplayLightOn",
        type: "boolean",
        role: "switch",
        def: true,
        read: true,
        write: true,
      },
      native: {},
    });

    this.getState(this.namespace + '.' + 'DisplayLine1', function(err, state) {
      lcd.println(state.val, 1);
    });

    this.getState(this.namespace + '.' + 'DisplayLine2', function(err, state) {
      lcd.println(state.val, 2);
    });

    this.getState(this.namespace + '.' + 'DisplayLine3', function(err, state) {
      lcd.println(state.val, 3);
    });

    this.getState(this.namespace + '.' + 'DisplayLine4', function(err, state) {
      lcd.println(state.val, 4);
    });

    

    // in this template all states changes inside the adapters namespace are subscribed
    this.subscribeStates("*");

    /*
    setState examples
    you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
    */
    // the variable testVariable is set to true as command (ack=false)
    //await this.setStateAsync("Address", true);

    // same thing, but the value is flagged "ack"
    // ack should be always set to true if the value is received from or acknowledged from the target system
    //await this.setStateAsync("testVariable", {
    //  val: true,
    //  ack: true
    //});

    // same thing, but the state is deleted after 30s (getState will return null afterwards)
    //await this.setStateAsync("testVariable", {
    //  val: true,
    //  ack: true,
    //  expire: 30
    //});

    // examples for the checkPassword/checkGroup functions
    //		let result = await this.checkPasswordAsync("admin", "iobroker");
    //		this.log.info("check user admin pw ioboker: " + result);

    //		result = await this.checkGroupAsync("admin", "admin");
    //		this.log.info("check group user admin group admin: " + result);
  }

  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   * @param {() => void} callback
   */
  onUnload(callback) {
    try {
      this.log.info("cleaned everything up...");
      callback();
    } catch (e) {
      callback();
    }
  }

  /**
   * Is called if a subscribed object changes
   * @param {string} id
   * @param {ioBroker.Object | null | undefined} obj
   */
  onObjectChange(id, obj) {
    if (obj) {
      // The object was changed
      this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    } else {
      // The object was deleted
      this.log.info(`object ${id} deleted`);
    }
  }

  /**
   * Is called if a subscribed state changes
   * @param {string} id
   * @param {ioBroker.State | null | undefined} state
   */
  onStateChange(id, state) {
    if (id === (this.namespace + '.' + 'DisplayLine1')) {
      var Zeile = state.val;
      while (Zeile.length < 20) Zeile = Zeile + " ";
      lcd.println(Zeile, 1);
    } else if (id === (this.namespace + '.' + 'DisplayLine2')) {
      var Zeile = state.val;
      while (Zeile.length < 20) Zeile = Zeile + " ";
      lcd.println(Zeile, 2);
    } else if (id === (this.namespace + '.' + 'DisplayLine3')) {
      var Zeile = state.val;
      while (Zeile.length < 20) Zeile = Zeile + " ";
      lcd.println(Zeile, 3);
    } else if (id === (this.namespace + '.' + 'DisplayLine4')) {
      var Zeile = state.val;
      while (Zeile.length < 20) Zeile = Zeile + " ";
      lcd.println(Zeile, 4);
    } else if (id === (this.namespace + '.' + 'DisplayLightOn')) {
      if (state.val) {
        lcd.on();
      } else {
        lcd.off();
      };
    } else if (id === (this.namespace + '.' + 'DisplayBlink')) {
      if (state.val) {
        this.getState((this.namespace + '.' + 'DisplayBlinkTime'), function(err, state) {
          blink(state.val);
        });
      } else {
        this.getState((this.namespace + '.' + 'DisplayLightOn'), function(err, state) {
          stopblink(state.val);
        });
      };
    };
    if (lcd.error) {
      this.log.warn('Cannot write to LCD-Display!');
    };
  }


  // /**
  //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
  //  * Using this method requires "common.message" property to be set to true in io-package.json
  //  * @param {ioBroker.Message} obj
  //  */
  // onMessage(obj) {
  // 	if (typeof obj === "object" && obj.message) {
  // 		if (obj.command === "send") {
  // 			// e.g. send email or pushover or whatever
  // 			this.log.info("send command");

  // 			// Send response in callback if required
  // 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
  // 		}
  // 	}
  // }




}

// @ts-ignore parent is a valid property on module
if (module.parent) {
  // Export the constructor in compact mode
  /**
   * @param {Partial<ioBroker.AdapterOptions>} [options={}]
   */
  module.exports = (options) => new Raspilc20x4lcd(options);
} else {
  // otherwise start the instance directly
  new Raspilc20x4lcd();
}


var blink = function(blinktime) {
  var toggle = false;
  blinker = setInterval(function() {
    toggle = !toggle;
    if (toggle) {
      lcd.on();
    } else {
      lcd.off();
    };
  }, blinktime);
};

function stopblink(status) {
  clearInterval(blinker);
  if (status === true) {
    lcd.on();
  } else {
    lcd.off();
  };
};

function displaywrite() {

}
