import axios, { AxiosInstance } from "axios";

export class GitLabAPI {
  private client: AxiosInstance;
  constructor(token: string, baseUrl = "https://gitlab.com/api/v4") {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: { "PRIVATE-TOKEN": token },
    });
  }

  async listOpenMRs(projectId: string) {
    const { data } = await this.client.get(
      `/projects/${encodeURIComponent(projectId)}/merge_requests?state=opened`
    );
    return data;
  }

  async getMRDiff(projectId: string, mrIid: number) {
    const { data } = await this.client.get(
      `/projects/${encodeURIComponent(
        projectId
      )}/merge_requests/${mrIid}/changes`
    );
    return data.changes.map((c: any) => c.diff).join("\n");
  }

  async postComment(projectId: string, mrIid: number, body: string) {
    await this.client.post(
      `/projects/${encodeURIComponent(
        projectId
      )}/merge_requests/${mrIid}/notes`,
      { body }
    );
  }
}
