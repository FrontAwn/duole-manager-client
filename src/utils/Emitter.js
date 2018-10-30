class Emitter {

	constructor() {
		this.messageMap = {}
	}

	emit(eventName,params=null) {
		if( !this.messageMap[''+eventName] ) {
			console.log('没有找到eventName:'+eventName)
			return
		}
		this.handle(eventName,this.messageMap[''+eventName],params)
		return this;
	}

	on(params={}) {
		if(!params.obj) throw new Error('not fount property "obj" of params'); 
		if(!params.event) throw new Error('not fount property "event" of params');
		let {obj,event} = params
		let eventNames = []
		if( Array.isArray(event) ) {
			eventNames = event;
		}else if( typeof event === 'string' ) {
			eventNames.push(event);
		} else {
			throw new Error('property "event" type should of "Array" ');
		}

		for(let v of eventNames) {
			if( this.messageMap[v] ) {
				if( !this.messageMap[v].includes(obj) ) {
					this.messageMap[v].push(obj)	
				}
			}else{
				this.messageMap[v] = []
				this.messageMap[v].push(obj)
			}
		}
		return this
	}

	handle(eventName,objectMap,params) {
		for (let obj of objectMap) {
			if( obj[eventName] && typeof obj[eventName] === 'function' ) {
				obj[eventName].call(obj,params)
			}else{
				console.log(`"${eventName}" emit failed`);
			}
		}
	}

	off(object) {
		for(let k of Object.keys(this.messageMap)) {
			let objectMap = this.messageMap[k]
			let offset = objectMap.indexOf(object)
			if( offset>=0 ) {
				objectMap.splice(offset,1)
				if(objectMap.length == 0) {
					delete this.messageMap[k]
				}
			}
		}
		return this
	}

	empty() {
		this.messageMap = {}
		return this
	}

}

export default new Emitter;

export let EmitterClass = Emitter;