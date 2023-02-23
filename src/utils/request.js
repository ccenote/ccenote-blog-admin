import axios from "axios";
import {showMessage} from "./status";
import {ElMessage} from "element-plus";
import router from "../router"
import {setToken, delData, getToken} from "./auth";
axios.defaults.timeout=10000;
//baseURL配置文件再public/config.json 再main.js同步请求
// axios.defaults.baseURL=config[config.env];

axios.interceptors.request.use(
    config=>{
        config.headers={
            // 'Content-Type': 'application/json; charset=utf-8',
            'authorization':'Bearer '+getToken()
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)
axios.interceptors.
response.use(
    response=>{
        if((!response.data.status&&response.data.error==="token失效或无效")||(!response.data.status&&response.data.error==="没有此用户")){
            delData()
            if(response.data.error==="token失效或无效"){
                ElMessage({
                    message:"用户未登录",
                    type:'warning'
                })
            }else{
                ElMessage({
                    message:response.data.error,
                    type:'warning'
                })
            }
            router.replace({path:'/login'})
        }else{
            if(response.headers.authorization){
                setToken(response.headers.authorization.substring(7,response.headers.authorization.length))
            }
        }
        return response;
    },
    error=>{
        const {response}=error;
        if(response){
            ElMessage({
                message:showMessage(response.status),
                type:'warning'
            })
            delData()
            router.replace({path:'/login'})
        }else{
            ElMessage({
                message:'网络连接异常，请稍后再试',
                type:'warning'
            })
            delData()
            router.replace({path:'/login'})
        }
    }
)
export function request(url='',params={},type='POST'){
    // @ts-ignore
    return new Promise((resolve,reject)=>{
        let promise;
        if(type.toUpperCase()==='GET'){
            promise=axios({
                url,
                params
            })
        }else if(type.toUpperCase()==='POST'){
            promise=axios({
                method:'POST',
                url,
                data:params
            })
        }
        promise.then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        })
    })
}