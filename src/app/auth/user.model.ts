export class User {
  constructor(
    public email: string, //
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token(): string {
    if (this._token && this._tokenExpirationDate > new Date()) {
      return this._token;
    } else {
      return '';
    }
  }
}
