
import Http from "@/utils/Http";
import localStorage from "localStorage";
class English {

	static getSeriesApi() {
		let url = "/english/series/ls";
		return new Promise((response,reject)=>{
			Http.request({
				url,
				cache:true,
				succ:datas=>{
					response(datas)
				},
				error:msg=>{
					reject("获得类型失败")
				},
				exception:e=>{
					reject("获得类型失败");
				}
			})	
		})
	}

	static getMarmmarSeriesApi() {
		let url = "/english/grammar_series/ls";
		return new Promise((response,reject)=>{
			Http.request({
				url,
				cache:true,
				succ:datas=>{
					response(datas);
				},
				error:msg=>{
					reject("获得类型失败");
				},
				exception:e=>{
					reject("获得类型失败");
				}
			})
		})
	}

	static searchWordApi(conditions,method="get") {
		let url = "/english/word/search";
		let params = {conditions};
		return new Promise((response,reject)=>{
			Http.request({
				url,
				method,
				params,
				succ:datas=>{
					response(datas);
				},
				error:msg=>{
					reject("获得单词失败");
				},
				exception:e=>{
					reject("获得单词失败");
				}
			})
		})
	}	



	static buildQuestionApi(datas=[]) {
		datas = JSON.parse( localStorage.getItem("test") );
		// let res = [];
		let questions = [];
		for(let key in datas) {
			let data = datas[key]
			let englishSign = "";
			let englishAnswers = {};
			let build = {}; 
			if( data['english'] ) {
				englishSign = data['english'];
			}

			if( data['content'] ) {
				englishSign = data['content'];
			}
			// build['id'] = data['id']s
			// build['sign'] = englishSign
			build['questions'] = []
			let answer = englishSign
			if(data['n'] && data['n'] !== "") {
				englishAnswers['n'] = data['n'];
				let question = `请输入“${data['n']}”的英文释义(n):`;
				build['questions'].push({question,answer});
			}

			if(data['v'] && data['v'] !== "") {
				englishAnswers['v'] = data['v'];
				let question = `请输入“${data['v']}”的英文释义(v):`;
				build['questions'].push({question,answer});
			}

			if(data['adj'] && data['adj'] !== "") {
				englishAnswers['adj'] = data['adj'];
				let question = `请输入“${data['adj']}”的英文释义(adj):`;
				build['questions'].push({question,answer});
			}

			if(data['adv'] && data['adv'] !== "") {
				englishAnswers['adv'] = data['adv'];
				let question = `请输入“${data['adv']}”的英文释义(adv):`;
				build['questions'].push({question,answer});
			}


			if(data['prep'] && data['prep'] !== "") {
				englishAnswers['prep'] = data['prep'];
				let question = `请输入“${data['prep']}”的英文释义(prep):`;
				build['questions'].push({question,answer});
			}


			if(data['pron'] && data['pron'] !== "") {
				englishAnswers['pron'] = data['pron'];
				let question = `请输入“${data['pron']}”的英文释义(pron):`;
				build['questions'].push({question,answer});
			}


			if(data['conj'] && data['conj'] !== "") {
				englishAnswers['conj'] = data['conj'];
				let question = `请输入“${data['conj']}”的英文释义(conj):`;
				build['questions'].push({question,answer});
			}

			if(data['interpretation'] && data['interpretation'] !== "") {
				englishAnswers['interpretation'] = data['interpretation'];
				let question = `请输入“${data['interpretation']}”的中文释义:`;
				build['questions'].push({question,answer});
			}

			build['questions'].push({
				"question":`请输入“${englishSign}”中文释义:`,
				"answer":englishAnswers
			})

			// res.push(build);
			questions.push(...build['questions']);
		}
		console.log(questions);
		questions.random("&");
		return questions;
	}

} 

let {
	getSeriesApi,
	getMarmmarSeriesApi,
	searchWordApi,
	buildQuestionApi,
} = English

export {
	getSeriesApi,
	getMarmmarSeriesApi,
	searchWordApi,
	buildQuestionApi,
}








