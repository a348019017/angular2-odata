"use strict";
const http_1 = require('@angular/http');
const rx_1 = require('rxjs/rx');
class ODataOperation {
    constructor(_typeName, config, http) {
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
    }
    Expand(expand) {
        this._expand = expand;
        return this;
    }
    Select(select) {
        this._select = select;
        return this;
    }
    getParams() {
        let params = new http_1.URLSearchParams();
        this._select && params.set("$select", this._select);
        this._expand && params.set("$expand", this._expand);
        return params;
    }
    extractData(res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        let entity = body;
        return entity || {};
    }
    handleResponse(entity) {
        return entity.map(this.extractData)
            .catch((err, caught) => {
            this.config.handleError && this.config.handleError(err, caught);
            return rx_1.Observable.throw(err);
        });
    }
    getEntityUri(entityKey) {
        return this.config.getEntityUri(entityKey, this._typeName);
    }
    getRequestOptions() {
        let options = this.config.requestOptions;
        options.search = this.getParams();
        return options;
    }
}
exports.ODataOperation = ODataOperation;
class OperationWithKey extends ODataOperation {
    constructor(_typeName, config, http, key) {
        super(_typeName, config, http);
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
        this.key = key;
    }
}
exports.OperationWithKey = OperationWithKey;
class OperationWithEntity extends ODataOperation {
    constructor(_typeName, config, http, entity) {
        super(_typeName, config, http);
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
        this.entity = entity;
    }
}
exports.OperationWithEntity = OperationWithEntity;
class OperationWithKeyAndEntity extends ODataOperation {
    constructor(_typeName, config, http, key, entity) {
        super(_typeName, config, http);
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
        this.key = key;
        this.entity = entity;
    }
}
exports.OperationWithKeyAndEntity = OperationWithKeyAndEntity;
class GetOperation extends OperationWithKey {
    Exec() {
        return super.handleResponse(this.http.get(this.getEntityUri(this.key), this.getRequestOptions()));
    }
}
exports.GetOperation = GetOperation;
// export class PostOperation<T> extends OperationWithEntity<T>{
//     public Exec():Observable<T>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.post(this.config.baseUrl + "/"+this._typeName, body, this.getRequestOptions()));
//     }
// }
// export class PatchOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec():Observable<Response>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.http.patch(this.getEntityUri(this.key),body,this.getRequestOptions());
//     }
// }
// export class PutOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec(){
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.put(this.getEntityUri(this.key),body,this.getRequestOptions()));
//     }
// }
//# sourceMappingURL=operation.js.map