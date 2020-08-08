
import axios from 'axios';

// Aqui se coloca o IP do celular que tá no expo dev no formato: http://[IP_DA_TELA]:[PORTA DA API]
const api = axios.create({
    baseURL: 'http://192.16.0.102:3333'
});

export default api;