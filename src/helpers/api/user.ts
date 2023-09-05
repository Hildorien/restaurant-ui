import DarwinApi from 'services/api/DarwinApi';

function fetchUserData(){
    const baseUrl = '/user';
    return DarwinApi.getInstance().get(`${baseUrl}`, {})
}


export { fetchUserData }