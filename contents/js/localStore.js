/* 
Inspired by junesiphone's jstorage.js
Script by Paras Khanchandani https://twitter.com/ParasKCD
*/

var localstore = {
    storageName: "",
    storageData: [],
    load: function() {
        let storage = JSON.parse(localStorage.getItem(this.storageName));
        if(storage) {
            for(let i = 0; i < this.storageData.length; i++) {
                localstore[localstore.storageData[i]] = storage[localstore.storageData[i]];
            }
        }
    },
    save: function() {
        let storage = {};
        for(let i = 0; i < this.storageData.length; i++) {
            storage[localstore.storageData[i]] = localstore[localstore.storageData[i]];
        }
        localStorage.setItem(this.storageName, JSON.stringify(storage));
    },
    addApp: function(arrayName, app) {
        if(localstore[arrayName]) {
            if(localstore[arrayName].indexOf(app) > -1) {
                alert('Repo already added');
                return;
            } else {
                localstore[arrayName].push(app);
            }
        } else {
            localstore[arrayName] = [app];
        }
        localstore.storageData.push(arrayName);
        this.save();
    },
    replaceApp: function(arrayName, older, newer) {
        if(localstore[arrayName].indexOf(newer) > -1) {
            this.changeAppOrder(arrayName, older, newer);
        } else {
            let index = this[arrayName].indexOf(older);
            if(index !== -1) {
                this[arrayName][index] = newer;
            }
            this.save();
        }
    },
    removeApp: function(arrayName, app) {
        let index = localstore[arrayName].indexOf(app);
        localstore[arrayName].splice(index, 1);
        this.save();
        if(localstore[arrayName].length == 0) {
            localstore.removeValue(arrayName);
        }
    },
    resetStorage: function() {
        localStorage.removeItem(localstore.storageName);
        location.href = location.href;
    },
    init: function(params) {
        this.storageName = params.storageName;
        let extraStorage = [];
        Object.keys(params.extraStorage).forEach((storageItem) => {
            extraStorage.push(storageItem);
        });
        if(extraStorage.length > 0) {
            localstore.storageData = localstore.storageData.concat(extraStorage);
        }
        if(localStorage.getItem(this.storageName)) {
            localstore.storageData = Object.keys(JSON.parse(localStorage.getItem(localstore.storageName)));
            this.load();
            return
        } else {
            for(let i = 0; i < localstore.storageData.length; i++) {
                localstore[localstore.storageData[i]] = params.extraStorage[localstore.storageData[i]];
            }
        }
    }
}