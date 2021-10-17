/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  token: string;

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public get() {
    this.storage.get('jwtToken').then(res => {
      this.token = res;
    });

    return this.token;
  }
}
