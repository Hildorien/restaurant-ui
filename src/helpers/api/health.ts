import DarwinApi from "services/api/DarwinApi";

function getHealthStatus(){
    const baseUrl = '/health';
    return DarwinApi.getInstance().get(`${baseUrl}`, {});
}
/**
 * Checks token expiration. Returns 403 when token expires or 200 otherwise
 */
function getHeartbeatStatus(){
    const baseUrl = '/alive';
    return DarwinApi.getInstance().create(`${baseUrl}`, {});
}

export { getHealthStatus, getHeartbeatStatus }