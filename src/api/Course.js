
import Http from "@/utils/Http";

class Course {

	static getCourseById(courseId) {
		let url = "/course/by/id";
		return new Promise((response,reject)=>{
			Http.request({
				url,
				params:{
					"id":courseId
				},
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

	static getSeriesApi() {
		let url = "/course/series/ls";
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

	static getQuestionTypeApi() {
		let url = "/course/question_type/ls";
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

	static getCourseCountBySeries(seriesId) {
		let url = "/course/count/by/series"
		return new Promise((response,reject)=>{
			Http.request({
				url,
				params:{
					"series_id":seriesId
				},
				succ:datas=>{
					response(datas);
				},
				error:msg=>{
					reject("获得课程数量失败");
				},
				exception:e=>{
					reject("获得课程数量失败");
				}
			})
		})
	}

	static getCourseTitleBySeries(seriesId) {
		let url = "/course/titles/by/series/id"
		return new Promise((response,reject)=>{
			Http.request({
				url,
				params:{
					"series_id":seriesId
				},
				succ:datas=>{
					response(datas);
				},
				error:msg=>{
					reject("获得课程失败");
				},
				exception:e=>{
					reject("获得课程失败");
				}
			})
		})
	}
	
} 

let {
	getCourseById,
	getSeriesApi,
	getQuestionTypeApi,
	getCourseCountBySeries,
	getCourseTitleBySeries,
} = Course

export {
	getCourseById,
	getSeriesApi,
	getQuestionTypeApi,
	getCourseCountBySeries,
	getCourseTitleBySeries,
}








