class Shortcut {

	static bind(key,callback,obj=null) {
		key = key.toLowerCase()
		
		if ( key.includes("+") ) {
			let keyArr = key.split("+")
			let extra = keyArr[0]
			let common = keyArr[1]
			let extraCode = 0
			let commonCode = 0
			if ( extra === "command" || extra === "cmd" ) {
				extraCode = this.codes['command']
			}
			if ( extra === "control" || extra === "ctrl" ) {
				extraCode = this.codes['control']
			}
			if ( extra === "alt") {
				extraCode = this.codes['alt']
			}
			if ( !this.codes[common] ) {
				throw new Error(`ERROR:没有设置${common}键位代码`)
			}
			commonCode = this.codes[common]
			let resCode = (parseInt(extraCode)+parseInt(commonCode)).toString()
			this.binds['compose'][resCode] = {
				callback,
				obj
			}
		} else {
			let common = key
			let commonCode = 0
			if ( !this.codes[common] ) {
				throw new Error(`ERROR:没有设置${common}代码`)
			}
			commonCode = (this.codes[common]).toString()
			this.binds['single'][commonCode] = {
				callback,
				obj
			}
		}

	}

	static mount() {
		let self = this
		self.eventCallback = function(event){
			// event.preventDefault()
			let {metaKey,altKey,ctrlKey,keyCode,key} = event;

			if ( !metaKey && !altKey && !ctrlKey ) {
				keyCode = keyCode.toString()
				if ( self.binds['single'][keyCode+""] ) {
					let content = self.binds['single'][keyCode+""]
					content['callback'].call(content['callback']['obj'],event)
				}
			} else {
				let composeCode = 0

				if ( metaKey ) {
					composeCode = parseInt(keyCode) + parseInt(self.codes['command'])
				}

				if ( ctrlKey ) {
					composeCode = parseInt(keyCode) + parseInt(self.codes['control'])
				}

				if ( altKey ) {
					composeCode = parseInt(keyCode) + parseInt(self.codes['alt'])
				}

				if ( self.binds['compose'][composeCode+""] ) {
					let content = self.binds['compose'][composeCode+""]
					content['callback'].call(content['callback']['obj'])	
				}
			}
		}

		document.addEventListener('keydown',this.eventCallback)
	}

	static unmount() {
		this.binds = {
			"single":{},
			"compose":{}
		}
		if (this.eventCallback !== null) {
			document.removeEventListener('keydown',this.eventCallback);	
		}
	}

}

Shortcut.codes = {
	"q":81,"w":87,"e":69,"r":82,"t":84,"y":89,"u":85,"i":73,"o":79,"p":80,
	"a":65,"s":83,"d":68,"f":70,"g":71,"h":72,"j":74,"k":75,"l":76,
	"z":90,"x":88,"c":67,"v":86,"b":66,"n":78,"m":77,
	"f1":112,"f2":113,"f3":114,"f4":115,"f5":116,"f6":117,"f7":118,"f8":119,"f9":120,"f10":121,"f11":122,"f12":123,
	"command":91,"control":17,"alt":18,"space":32
}
Shortcut.binds = {
	"single":{},
	"compose":{},
}
Shortcut.eventCallback = null

export default Shortcut;