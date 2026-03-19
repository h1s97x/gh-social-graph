import { GitHubAPIService, createGitHubAPI } from './api';
import {
  GitHubUser,
  GitHubRepository,
  SocialGraph,
  GraphNode,
  GraphLink,
  AnalysisResult,
  DeveloperRecommendation,
} from './types';

// 节点颜色配置
const NODE_COLORS = {
  mainUser: '#00d4ff', // 青色 - 主用户
  collaborator: '#9f7aea', // 紫色 - 协作者
  follower: '#4299e1', // 蓝色 - 关注者
  repo: '#48bb78', // 绿色 - 仓库
  starredRepo: '#ed8936', // 橙色 - star的仓库
};

export class SocialGraphAnalyzer {
  private api: GitHubAPIService;
  private cache: Map<string, unknown> = new Map();

  constructor(api?: GitHubAPIService) {
    this.api = api || createGitHubAPI();
  }

  /**
   * 分析用户的社交图谱
   */
  async analyzeUser(
    username: string,
    options: {
      maxFollowers?: number;
      maxRepos?: number;
      depth?: number;
    } = {}
  ): Promise<AnalysisResult> {
    const { maxFollowers = 100, maxRepos = 20 } = options;

    // 1. 获取主用户信息
    const mainUser = await this.api.getUser(username);
    console.log(`Analyzing social graph for ${username}...`);

    // 2. 获取关注者和正在关注
    const [followers, following] = await Promise.all([
      this.api.getAllFollowers(username, Math.ceil(maxFollowers / 100)),
      this.api.getAllFollowing(username, Math.ceil(maxFollowers / 100)),
    ]);

    console.log(`Found ${followers.length} followers, ${following.length} following`);

    // 3. 获取用户仓库
    const repos = await this.api.getAllRepositories(
      username,
      Math.ceil(maxRepos / 100)
    );
    console.log(`Found ${repos.length} repositories`);

    // 4. 分析共同关注者
    const mutualFollowers = this.findMutualFollowers(followers, following);

    // 5. 获取仓库贡献者和 stargazers
    const repoData = await this.analyzeRepositories(repos, maxRepos);

    // 6. 构建图谱
    const graph = this.buildGraph(
      mainUser,
      followers,
      following,
      mutualFollowers,
      repos,
      repoData
    );

    // 7. 生成推荐
    const recommendations = this.generateRecommendations(
      mainUser,
      followers,
      following,
      repoData
    );

    // 8. 生成洞察
    const insights = this.generateInsights(repos, repoData);

    return {
      graph,
      recommendations,
      insights,
    };
  }

  /**
   * 找出共同关注者
   */
  private findMutualFollowers(
    followers: Array<{ login: string }>,
    following: Array<{ login: string }>
  ): Set<string> {
    const followerSet = new Set(followers.map((f) => f.login));
    const mutual = new Set<string>();

    for (const f of following) {
      if (followerSet.has(f.login)) {
        mutual.add(f.login);
      }
    }

    return mutual;
  }

  /**
   * 分析仓库数据
   */
  private async analyzeRepositories(
    repos: GitHubRepository[],
    maxRepos: number
  ): Promise<{
    contributors: Map<string, Array<{ login: string; contributions: number }>>;
    stargazers: Map<string, string[]>;
  }> {
    const contributors = new Map<
      string,
      Array<{ login: string; contributions: number }>
    >();
    const stargazers = new Map<string, string[]>();

    // 只分析前 N 个仓库（按 star 数排序）
    const sortedRepos = repos
      .filter((r) => !r.fork && r.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, maxRepos);

    console.log(`Analyzing ${sortedRepos.length} repositories...`);

    for (const repo of sortedRepos) {
      try {
        // 获取贡献者
        const repoContributors = await this.api.getContributors(
          repo.owner.login,
          repo.name
        );
        contributors.set(
          repo.full_name,
          repoContributors.slice(0, 20).map((c) => ({
            login: c.login,
            contributions: c.contributions,
          }))
        );

        // 获取 stargazers（只取前 50 个）
        try {
          const stargazerList = await this.api.getStargazers(
            repo.owner.login,
            repo.name,
            1,
            50
          );
          stargazers.set(
            repo.full_name,
            stargazerList.map((s) => s.user.login)
          );
        } catch {
          // Stargazers API 可能需要认证
          console.log(`Could not fetch stargazers for ${repo.full_name}`);
        }

        // 添加延迟避免速率限制
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error analyzing repo ${repo.full_name}:`, error);
      }
    }

    return { contributors, stargazers };
  }

  /**
   * 构建图谱数据
   */
  private buildGraph(
    mainUser: GitHubUser,
    followers: Array<{ login: string; avatar_url: string; html_url: string }>,
    following: Array<{ login: string; avatar_url: string; html_url: string }>,
    mutualFollowers: Set<string>,
    repos: GitHubRepository[],
    repoData: {
      contributors: Map<
        string,
        Array<{ login: string; contributions: number }>
      >;
      stargazers: Map<string, string[]>;
    }
  ): SocialGraph {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeMap = new Map<string, GraphNode>();

    // 添加主用户节点
    const mainNode: GraphNode = {
      id: mainUser.login,
      label: mainUser.name || mainUser.login,
      type: 'user',
      avatar: mainUser.avatar_url,
      data: mainUser,
      connections: 0,
      color: NODE_COLORS.mainUser,
    };
    nodes.push(mainNode);
    nodeMap.set(mainUser.login, mainNode);

    // 添加关注者节点
    for (const follower of followers.slice(0, 50)) {
      // 限制节点数量
      if (!nodeMap.has(follower.login)) {
        const node: GraphNode = {
          id: follower.login,
          label: follower.login,
          type: 'user',
          avatar: follower.avatar_url,
          data: {
            login: follower.login,
            avatar_url: follower.avatar_url,
            html_url: follower.html_url,
          } as GitHubUser,
          connections: 1,
          color: mutualFollowers.has(follower.login)
            ? '#f687b3' // 粉色 - 互相关注
            : NODE_COLORS.follower,
        };
        nodes.push(node);
        nodeMap.set(follower.login, node);
      }

      // 添加关注链接
      links.push({
        source: follower.login,
        target: mainUser.login,
        type: 'follows',
        weight: 1,
      });
      mainNode.connections++;
    }

    // 添加正在关注的节点
    for (const followee of following.slice(0, 50)) {
      if (!nodeMap.has(followee.login)) {
        const node: GraphNode = {
          id: followee.login,
          label: followee.login,
          type: 'user',
          avatar: followee.avatar_url,
          data: {
            login: followee.login,
            avatar_url: followee.avatar_url,
            html_url: followee.html_url,
          } as GitHubUser,
          connections: 1,
          color: mutualFollowers.has(followee.login)
            ? '#f687b3' // 粉色 - 互相关注
            : NODE_COLORS.collaborator,
        };
        nodes.push(node);
        nodeMap.set(followee.login, node);
      }

      // 添加关注链接
      links.push({
        source: mainUser.login,
        target: followee.login,
        type: 'follows',
        weight: 1,
      });
    }

    // 添加仓库节点
    for (const repo of repos.slice(0, 10)) {
      const repoNodeId = `repo:${repo.full_name}`;
      const repoNode: GraphNode = {
        id: repoNodeId,
        label: repo.name,
        type: 'repo',
        data: repo,
        connections: 1,
        color: NODE_COLORS.repo,
      };
      nodes.push(repoNode);
      nodeMap.set(repoNodeId, repoNode);

      // 添加用户到仓库的链接
      links.push({
        source: mainUser.login,
        target: repoNodeId,
        type: 'stars',
        weight: repo.stargazers_count / 100 || 1,
      });

      // 添加贡献者节点和链接
      const repoContributors = repoData.contributors.get(repo.full_name) || [];
      for (const contributor of repoContributors.slice(0, 5)) {
        if (contributor.login === mainUser.login) continue;

        if (!nodeMap.has(contributor.login)) {
          const node: GraphNode = {
            id: contributor.login,
            label: contributor.login,
            type: 'user',
            data: { login: contributor.login } as GitHubUser,
            connections: 1,
            color: NODE_COLORS.collaborator,
          };
          nodes.push(node);
          nodeMap.set(contributor.login, node);
        }

        links.push({
          source: contributor.login,
          target: repoNodeId,
          type: 'collaborates',
          weight: contributor.contributions / 10 || 1,
        });
      }
    }

    return {
      nodes,
      links,
      stats: {
        totalNodes: nodes.length,
        totalLinks: links.length,
        userNodes: nodes.filter((n) => n.type === 'user').length,
        repoNodes: nodes.filter((n) => n.type === 'repo').length,
      },
    };
  }

  /**
   * 生成开发者推荐
   */
  private generateRecommendations(
    mainUser: GitHubUser,
    followers: Array<{ login: string }>,
    following: Array<{ login: string }>,
    repoData: {
      contributors: Map<
        string,
        Array<{ login: string; contributions: number }>
      >;
      stargazers: Map<string, string[]>;
    }
  ): DeveloperRecommendation[] {
    const recommendations: DeveloperRecommendation[] = [];
    const followingSet = new Set(following.map((f) => f.login));
    const scoreMap = new Map<string, { score: number; reasons: string[] }>();

    // 分析贡献者
    for (const [repo, contributors] of repoData.contributors) {
      for (const contributor of contributors) {
        if (
          contributor.login === mainUser.login ||
          followingSet.has(contributor.login)
        )
          continue;

        const existing = scoreMap.get(contributor.login) || {
          score: 0,
          reasons: [],
        };
        existing.score += contributor.contributions;
        existing.reasons.push(`在 ${repo} 中有 ${contributor.contributions} 次贡献`);
        scoreMap.set(contributor.login, existing);
      }
    }

    // 排序并返回前 10 个推荐
    const sorted = Array.from(scoreMap.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 10);

    for (const [login, data] of sorted) {
      recommendations.push({
        user: {
          login,
          html_url: `https://github.com/${login}`,
          avatar_url: `https://avatars.githubusercontent.com/${login}`,
        } as GitHubUser,
        score: data.score,
        reasons: data.reasons.slice(0, 3),
      });
    }

    return recommendations;
  }

  /**
   * 生成洞察数据
   */
  private generateInsights(
    repos: GitHubRepository[],
    repoData: {
      contributors: Map<
        string,
        Array<{ login: string; contributions: number }>
      >;
      stargazers: Map<string, string[]>;
    }
  ): AnalysisResult['insights'] {
    // 分析顶级协作者
    const collaboratorMap = new Map<string, number>();
    for (const contributors of repoData.contributors.values()) {
      for (const c of contributors) {
        collaboratorMap.set(
          c.login,
          (collaboratorMap.get(c.login) || 0) + c.contributions
        );
      }
    }

    const topCollaborators = Array.from(collaboratorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([login, collaborations]) => ({
        user: {
          login,
          avatar_url: `https://avatars.githubusercontent.com/${login}`,
          html_url: `https://github.com/${login}`,
        } as GitHubUser,
        collaborations,
      }));

    // 分析顶级 star 的仓库
    const topStarredRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((repo) => ({
        repo,
        stargazers: repo.stargazers_count,
      }));

    // 分析语言分布
    const languageDistribution: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        languageDistribution[repo.language] =
          (languageDistribution[repo.language] || 0) + 1;
      }
    }

    return {
      topCollaborators,
      topStarredRepos,
      languageDistribution,
    };
  }
}

/**
 * 创建社交图谱分析器实例
 */
export function createSocialGraphAnalyzer(): SocialGraphAnalyzer {
  return new SocialGraphAnalyzer();
}
