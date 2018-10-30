import Vue from 'vue'
import Emitter from '@/utils/Emitter'
import {mapGetters,mapState,mapMutations,mapActions} from 'vuex'

class Utils {

	static init() {

		Array.prototype.random = function(state="") {
			let random = () => Math.random() > 0.5 ? -1 : 1
			if(state == "&") {
				this.sort(random)
				return this
			}
			let arr = [...this]
			arr.sort(random)
			return arr
		}

		window.onload = () => {
			Emitter.emit('PAGE_LOADED')
		}

		window.onpageshow = ()=>{
			Emitter.emit('PAGE_OPEN')
		}

		window.onscroll = ()=>{
			Emitter.emit('PAGE_SCROLL')	
		}

		window.onunload = ()=>{
			Emitter.emit('PAGE_CLOSE')	
		}

		window.onresize = ()=>{
			Emitter.emit('PAGE_RESIZE',window.innerWidth);
		}
		

	}

	static str(json) {
		return JSON.stringify(json)
	}

	static json(str) {
		return JSON.parse(str)
	}

	static copy(obj) {
		return JSON.parse(JSON.stringify(obj))
	}

	static width() {
		return window.innerWidth
	}

	static isEmptyObj(obj) {
		if(typeof obj !== 'object') return false;
		let keys = Object.keys(obj)
		if(keys.length == 0 && keys == ""){
			return true
		}else{
			return false
		}
	}

	static parseDate(date,strtime) {
		Date.prototype.format =function(format){
	      var o = {
	        "M+" : this.getMonth()+1, //month
	        "d+" : this.getDate(), //day
	        "h+" : this.getHours(), //hour
	        "m+" : this.getMinutes(), //minute
	        "s+" : this.getSeconds(), //second
	        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
	        "S" : this.getMilliseconds() //millisecond
	      }
	      if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	      (this.getFullYear()+"").substr(4- RegExp.$1.length));
	      for(var k in o)if(new RegExp("("+ k +")").test(format))
	      format = format.replace(RegExp.$1,
	      RegExp.$1.length==1? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	      return format;
	    }
	    return date.format(strtime)
	}

	static preloadImage(srcUrl,callback){
		let imageObject = null
		let imageArray = []
		if(typeof srcUrl === 'string'){
			imageArray.push(srcUrl)
		}else if(Array.isArray(srcUrl)){
			imageArray = srcUrl
		}else {
			throw new Error("srcUrl type error");
		}

		for(let url of imageArray) {
			imageObject = new Image;
			imageObject.src = url
		}

		imageObject.onload = function() {
			callback()
		}

		imageObject.error = function() {
			throw new Error("loaded image failed");
		}
	}

}

Utils.localDatas = (function(){
	let datas = {}
	datas.data = {}
	datas.localhost = "http://localhost:3000"

	function get(key) {
		if(datas[key]) {
			return datas[key];
		}
		return null
	}

	function set(key,val=null,force=false) {
		if(!datas[key] || force) {
			datas[key] = val
			return
		}
		console.log("key is exists")
	}

	function show() {
		console.log(datas)
	}

	function claer() {
		datas = {}
	}

	function del(key) {
		if(datas[key]) {
			delete datas[key];
			return
		}
		console.log("delete key failed")
	}

	return {
		get,
		set,
		del,
		show,
		claer,
	}
})()

var {
	str,
	json,
	copy,
	init,
	isEmptyObj,
	parseDate,
	preloadImage,
} = Utils

export default Utils.localDatas

export {
	str,
	json,
	copy,
	init,
	isEmptyObj,
	parseDate,
	preloadImage,
}



