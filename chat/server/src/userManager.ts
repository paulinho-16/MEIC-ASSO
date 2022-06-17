// temporary file that handles connected users

export default class UserManager {
  private users;
  constructor() {
    this.users = new Map<string, string>();
  }

  getUserBySocketId = (socketId: string): string | undefined => {
    return this.users.get(socketId);
  };

  getUserByUsername = (username: string) => {
    return Object.keys(this.users).find(
      (socketId) => this.users.get(socketId) === username
    );
  };

  removeUserBySocketId = (socketId: string) => {
    this.users.delete(socketId);
  };

  addUser = (username: string, socketId: string): string | undefined => {
    const pre = this.users.get(socketId);
    this.users.set(socketId, username);

    return pre;
  };
}
