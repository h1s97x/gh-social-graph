import {
  GitHubUser,
  GitHubRepository,
  GitHubContributor,
  GitHubFollower,
} from './types';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public rateLimit?: {
      limit: number;
      remaining: number;
      reset: Date;
    }
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export class GitHubAPIService {
  private token?: string;
  private baseUrl: string;

  constructor(token?: string) {
    this.token = token;
    this.baseUrl = GITHUB_API_BASE;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Social-Graph',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });

    // Extract rate limit info
    const rateLimit = {
      limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0'),
      remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
      reset: new Date(
        parseInt(response.headers.get('X-RateLimit-Reset') || '0') * 1000
      ),
    };

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new GitHubAPIError(
        error.message || `GitHub API error: ${response.status}`,
        response.status,
        rateLimit
      );
    }

    return response.json();
  }

  /**
   * 获取用户信息
   */
  async getUser(username: string): Promise<GitHubUser> {
    return this.fetch<GitHubUser>(`/users/${username}`);
  }

  /**
   * 获取用户的关注者
   */
  async getFollowers(
    username: string,
    page: number = 1,
    perPage: number = 100
  ): Promise<GitHubFollower[]> {
    return this.fetch<GitHubFollower[]>(
      `/users/${username}/followers?page=${page}&per_page=${perPage}`
    );
  }

  /**
   * 获取用户正在关注的人
   */
  async getFollowing(
    username: string,
    page: number = 1,
    perPage: number = 100
  ): Promise<GitHubFollower[]> {
    return this.fetch<GitHubFollower[]>(
      `/users/${username}/following?page=${page}&per_page=${perPage}`
    );
  }

  /**
   * 获取用户的仓库
   */
  async getRepositories(
    username: string,
    page: number = 1,
    perPage: number = 100,
    type: 'all' | 'owner' | 'member' = 'owner'
  ): Promise<GitHubRepository[]> {
    return this.fetch<GitHubRepository[]>(
      `/users/${username}/repos?page=${page}&per_page=${perPage}&type=${type}&sort=updated`
    );
  }

  /**
   * 获取仓库的贡献者
   */
  async getContributors(
    owner: string,
    repo: string,
    page: number = 1,
    perPage: number = 100
  ): Promise<GitHubContributor[]> {
    return this.fetch<GitHubContributor[]>(
      `/repos/${owner}/${repo}/contributors?page=${page}&per_page=${perPage}`
    );
  }

  /**
   * 获取仓库的 stargazers（需要认证才能看到完整列表）
   */
  async getStargazers(
    owner: string,
    repo: string,
    page: number = 1,
    perPage: number = 100
  ): Promise<Array<{ user: GitHubUser; starred_at: string }>> {
    return this.fetch(
      `/repos/${owner}/${repo}/stargazers?page=${page}&per_page=${perPage}`
    );
  }

  /**
   * 获取所有关注者（自动分页）
   */
  async getAllFollowers(username: string, maxPages: number = 5): Promise<GitHubFollower[]> {
    const allFollowers: GitHubFollower[] = [];
    let page = 1;

    while (page <= maxPages) {
      const followers = await this.getFollowers(username, page);
      if (followers.length === 0) break;
      allFollowers.push(...followers);
      if (followers.length < 100) break; // 最后一页
      page++;
    }

    return allFollowers;
  }

  /**
   * 获取所有正在关注（自动分页）
   */
  async getAllFollowing(username: string, maxPages: number = 5): Promise<GitHubFollower[]> {
    const allFollowing: GitHubFollower[] = [];
    let page = 1;

    while (page <= maxPages) {
      const following = await this.getFollowing(username, page);
      if (following.length === 0) break;
      allFollowing.push(...following);
      if (following.length < 100) break;
      page++;
    }

    return allFollowing;
  }

  /**
   * 获取所有仓库（自动分页）
   */
  async getAllRepositories(
    username: string,
    maxPages: number = 5
  ): Promise<GitHubRepository[]> {
    const allRepos: GitHubRepository[] = [];
    let page = 1;

    while (page <= maxPages) {
      const repos = await this.getRepositories(username, page);
      if (repos.length === 0) break;
      allRepos.push(...repos);
      if (repos.length < 100) break;
      page++;
    }

    return allRepos;
  }
}

/**
 * 从环境变量创建 GitHub API 服务实例
 */
export function createGitHubAPI(): GitHubAPIService {
  // 优先使用服务端环境变量
  const token = process.env.GITHUB_TOKEN;
  return new GitHubAPIService(token);
}
