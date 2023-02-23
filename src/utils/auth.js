import store from "../store";

export function setToken(token){
    store.commit('setToken',token);
}

export function getToken(){
    if(localStorage.getItem('token')){
        store.commit('setToken',localStorage.getItem('token'));
    }
    return store.getters.getToken;
}

export function delToken(){
    return store.commit('delToken');

}

export function getMenu(){
    return store.getters.getMenu;
}

export function delData(){
    store.commit('delToken');
    store.commit('delMenu');
    store.commit('delPageShow');
    store.commit('delName');
    store.commit('delAvatar');
}
export function getRole(){
    return store.getters.getRole;
}