export interface PageFetcher {
  fetchDashboard(Cookie: string): Promise<string>;
  fetchProfile(Cookie: string): Promise<string>;
}
