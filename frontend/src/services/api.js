import axios from 'axios';

const api = axios.create ({
   baseURL: 'https://api-ajude-alguem.herokuapp.com' //'http://localhost:3333',
})

export default api;
