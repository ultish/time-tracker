import PouchDB from 'pouchdb';
import { Adapter } from 'ember-pouch';

let remote = new PouchDB('http://localhost:5984/crypto');
let db = new PouchDB('local_pouch');

PouchDB.debug.disable();

db.sync(remote, {
  live: true,
  retry: true
});

export default class Application extends Adapter.extend({
  // anything which *must* be merged on the prototype
  init() {
    this.set('db', db);
  },
  unloadedDocumentChanged: function(obj: any) {
    let store = this.get('store');
    let recordTypeName = this.getRecordTypeName(store.modelFor(obj.type));
    this.get('db')
      .rel.find(recordTypeName, obj.id)
      .then(function(doc: any) {
        store.pushPayload(recordTypeName, doc);
      });
  }
}) {
  // normal class body
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data' {
  interface AdapterRegistry {
    application: Application;
  }
}
