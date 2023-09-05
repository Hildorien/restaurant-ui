import ElectronApi from "services/api/ElectronApi";

function focusWindow() {
    const baseUrl = '/window/focus';
    return ElectronApi.getInstance().get(`${baseUrl}`, {});
}

export { focusWindow }