import axios from 'axios';
import logger from './logService';


axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");

const instance = axios.create({
   baseURL: process.env.REACT_APP_API_URL,
   timeout: 10000
});

instance.interceptors.response.use(null, 
   ex => {
      if(ex.response){
         logger.error(ex.response.data);
      }else{
         logger.error(ex.message);
      }
      return Promise.reject(ex);
   }
);

function setJWT(jwt){
   instance.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
   setJWT,
   get: instance.get,
   post: instance.post,
   put: instance.put,
   delete: instance.delete
};