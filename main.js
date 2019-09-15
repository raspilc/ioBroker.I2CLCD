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



class i2clcd extends utils.Adapter {





  /**
   * @param {Partial<ioBroker.AdapterOptions>} [options={}]
   */
  constructor(options) {
    super({
      ...options,
      name: "i2clcd",
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

    await this.setObjectNotExists('DisplayLightOn', {
      type: 'state',
      common: {
        name: 'Beleuchtung',
        type: 'boolean',
        role: 'switch',
        read: true,
        write: true
      },
      native: {
        id: 'DisplayLightOn'
      }
    });

    await this.setObjectNotExists('DisplayBlink', {
      type: 'state',
      common: {
        name: 'Blinken',
        type: 'boolean',
        role: 'switch',
        read: true,
        write: true
      },
      native: {
        id: 'DisplayBlink'
      }
    });

    await this.setObjectNotExists('DisplayBlinkTime', {
      type: 'state',
      common: {
        name: 'Blinkintervall',
        type: 'number',
        role: 'value',
        read: true,
        write: true
      },
      native: {
        id: 'DisplayBlinkTime'
      }
    });

    await this.setObjectNotExists('DisplayLine1', {
      type: 'state',
      common: {
        name: 'Zeile1',
        type: 'string',
        role: 'value',
        read: true,
        write: true
      },
      native: {
        id: 'DisplayLine1'
      }
    });

    await this.setObjectNotExists('DisplayLine2', {
      type: 'state',
      common: {
        name: 'Zeile2',
        type: 'string',
        role: 'value',
        read: true,
        write: true
      },
      native: {
        id: 'DisplayLine2'
      }
    });

    await this.setObjectNotExists('DisplayLine3', {
      type: 'state',
      common: {
        name: 'Zeile3',
        type: 'string',
        role: 'value',
        read: true,
        write: true
      },
      native: {
        id: 'DisplayLine3'
      }
    });

    await this.setObjectNotExists('DisplayLine4', {
      type: 'state',
      common: {
        name: 'Zeile4',
        type: 'string',
        role: 'value',
        read: true,
        write: true
      },
      native: {
        id: 'DisplayLine4'
      }
    });

    /*
    For every state in the system there has to be also an object of type state
    Here a simple template for a boolean variable named "testVariable"
    Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
    */





    // in this template all states changes inside the adapters namespace are subscribed
    this.subscribeStates("*");

    if (this.config.mySelect === "16x2") {
      lcd = new LCD(Number(this.config.Bus), Number(this.config.Address), 16, 2);
      await initializing(this);
    } else if (this.config.mySelect === "20x4") {
      lcd = new LCD(Number(this.config.Bus), Number(this.config.Address), 20, 4);
      await initializing(this);
    };
    lcd.clear();
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
  module.exports = (options) => new i2clcd(options);
} else {
  // otherwise start the instance directly
  new i2clcd();
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


function initializing(self) {
  //let self = this;

  self.log.info("States initialisiert...")
  self.getStateAsync('DisplayLightOn', function(err, state) {
    if (state == null) {
      self.setStateAsync('DisplayLightOn', true);
    } else {
      self.getState('DisplayLightOn', function(err, state) {
        if (self.val === true) {
          lcd.on();
        } else if (self.val === false) {
          lcd.off();
        };
      });
    }
  });

  self.getStateAsync('DisplayBlink', function(err, state) {
    if (state == null) {
      self.setStateAsync('DisplayBlink', false);
    } else {
      if (state.val === true) {
        self.getStateAsync('DisplayBlinkTime', function(err, state) {
          blink(state.val);
        });
      };
    };
  });

  self.getStateAsync('DisplayBlinkTime', function(err, state) {
    if (state == null) {
      self.setStateAsync('DisplayBlinkTime', 500);
    };
  });

  self.getStateAsync('DisplayLine1', function(err, state) {
    if (state == null) {
      self.setStateAsync('DisplayLine1', "Welcome");
    } else {
      lcd.println(state.val, 1);
    };
  });

  self.getStateAsync('DisplayLine2', function(err, state) {
    if (state == null) {
      self.setStateAsync('DisplayLine2', "to");
    } else {
      lcd.println(state.val, 2);
    };
  });

  self.getStateAsync('DisplayLine3', function(err, state) {
    if (state == null) {
      self.setStateAsync('DisplayLine3', "LCD-Adapter");
    } else {
      lcd.println(state.val, 3);
    };
  });

  self.getStateAsync('DisplayLine4', function(err, state) {
    if (state == null) {
      self.setStateAsync('DisplayLine4', "...initialized!");
    } else {
      lcd.println(state.val, 4);
    };
  });
};

function main() {



  this.getState('DisplayLine1', function(err, state) {
    lcd.println(state.val, 1);
  });

  this.getState('DisplayLine2', function(err, state) {
    lcd.println(state.val, 2);
  });

  this.getState('DisplayLine3', function(err, state) {
    lcd.println(state.val, 3);
  });

  this.getState('DisplayLine4', function(err, state) {
    lcd.println(state.val, 4);
  });
};
