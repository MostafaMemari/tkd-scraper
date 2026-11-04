export interface GuestGateway {
  createGuestSession(): Promise<string>;
}
