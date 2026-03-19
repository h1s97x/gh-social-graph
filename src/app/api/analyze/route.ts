import { NextRequest, NextResponse } from 'next/server';
import { createSocialGraphAnalyzer } from '@/lib/github/analyzer';
import { GitHubAPIError } from '@/lib/github/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, token, options } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // 如果用户提供了 token，使用用户的 token
    // 否则使用环境变量中的 token
    if (token) {
      process.env.GITHUB_TOKEN = token;
    }

    const analyzer = createSocialGraphAnalyzer();

    // 开始分析
    const result = await analyzer.analyzeUser(username, {
      maxFollowers: options?.maxFollowers || 100,
      maxRepos: options?.maxRepos || 20,
      depth: options?.depth || 1,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);

    if (error instanceof GitHubAPIError) {
      return NextResponse.json(
        {
          error: error.message,
          rateLimit: error.rateLimit,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze user' },
      { status: 500 }
    );
  }
}
