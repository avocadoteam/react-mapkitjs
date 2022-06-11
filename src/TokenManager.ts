export class TokenManager {
  public static instance?: TokenManager;
  static getInstance() {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  token: string | null = null;
  lastMapId: number = 0;

  constructor() {
    this.token = null;
    this.lastMapId = 0;
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
  }

  getNewMapId() {
    this.lastMapId++;
    return this.lastMapId;
  }
}
