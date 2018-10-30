import Http from "@/utils/Http"
import Emitter from '@/utils/Emitter'
import {str,json} from "utils";
import router from "@/router";
import localStorage from "localStorage";

export default {

	"$http":Http,

	"$event":Emitter,

	"$router":router,

	"$str":str,

	"$json":json,

	"$localStorage":localStorage,

	"$uri":window.location.pathname


}