'use client';

import React, { useState, useCallback } from 'react';
import { StarfieldBackground } from '@/components/starfield-background';
import { SocialGraphVisualization } from '@/components/social-graph';
import { EasterEggs } from '@/components/easter-eggs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Github,
  Star,
  GitFork,
  Users,
  Search,
  Sparkles,
  ExternalLink,
  Code2,
  TrendingUp,
} from 'lucide-react';
import { SocialGraph, GraphNode, AnalysisResult } from '@/lib/github/types';

export default function Home() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          token: token.trim() || undefined,
          options: {
            maxFollowers: 50,
            maxRepos: 15,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, [username, token]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.type === 'user') {
      window.open((node.data as any).html_url, '_blank');
    } else if (node.type === 'repo') {
      window.open((node.data as any).html_url, '_blank');
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 星空背景 */}
      <StarfieldBackground />
      
      {/* 彩蛋 */}
      <EasterEggs />

      {/* 主内容 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部导航 */}
        <header className="border-b border-border/50 backdrop-blur-md bg-background/20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Github className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  GitHub Social Graph
                </h1>
                <p className="text-sm text-muted-foreground">
                  探索你的开发者社交宇宙
                </p>
              </div>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </header>

        {/* 主要内容区 */}
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* 搜索区域 */}
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="backdrop-blur-md bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="输入 GitHub 用户名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        className="bg-background/50"
                      />
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={loading || !username.trim()}
                      className="gap-2"
                    >
                      {loading ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin" />
                          分析中...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          探索宇宙
                        </>
                      )}
                    </Button>
                  </div>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      高级选项（可选）
                    </summary>
                    <div className="mt-3">
                      <Input
                        type="password"
                        placeholder="GitHub Personal Access Token（可选，提高速率限制）"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="bg-background/50 text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        提供token可以分析更多数据（
                        <a
                          href="https://github.com/settings/tokens/new"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          创建token
                        </a>
                        ）
                      </p>
                    </div>
                  </details>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="pt-4">
                  <p className="text-destructive text-sm">{error}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 加载状态 */}
          {loading && (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="backdrop-blur-md bg-card/50">
                    <CardContent className="pt-6">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="backdrop-blur-md bg-card/50">
                <CardContent className="pt-6 flex items-center justify-center min-h-[500px]">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
                    <p className="text-muted-foreground">
                      正在扫描宇宙中的星辰...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 分析结果 */}
          {result && !loading && (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="backdrop-blur-md bg-card/50 border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">总节点数</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {result.graph.stats.totalNodes}
                    </p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-md bg-card/50 border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <GitFork className="w-4 h-4" />
                      <span className="text-sm">连接数</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {result.graph.stats.totalLinks}
                    </p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-md bg-card/50 border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Github className="w-4 h-4" />
                      <span className="text-sm">开发者</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {result.graph.stats.userNodes}
                    </p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-md bg-card/50 border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Code2 className="w-4 h-4" />
                      <span className="text-sm">仓库</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {result.graph.stats.repoNodes}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 可视化区域 */}
              <Card className="backdrop-blur-md bg-card/30 border-border/50 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    社交图谱
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    点击节点查看详情，滚轮缩放，拖拽平移
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  {result.graph && result.graph.nodes ? (
                    <SocialGraphVisualization
                      data={result.graph}
                      onNodeClick={handleNodeClick}
                      height={600}
                    />
                  ) : (
                    <div className="flex items-center justify-center min-h-[600px]">
                      <p className="text-muted-foreground">暂无数据</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 推荐开发者 */}
              {result.recommendations && result.recommendations.length > 0 && (
                <Card className="backdrop-blur-md bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      你可能感兴趣的开发者
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      基于协作关系的推荐
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.recommendations.map((rec, i) => (
                        <Card
                          key={rec.user.login}
                          className="bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                          onClick={() =>
                            window.open(rec.user.html_url, '_blank')
                          }
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <Avatar>
                                  <AvatarImage src={rec.user.avatar_url} />
                                  <AvatarFallback>
                                    {rec.user.login[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold truncate">
                                    {rec.user.login}
                                  </p>
                                  <Badge variant="secondary" className="text-xs">
                                    #{i + 1}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {rec.reasons[0]}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 语言分布 */}
              {result.insights && result.insights.languageDistribution && Object.keys(result.insights.languageDistribution).length > 0 && (
                <Card className="backdrop-blur-md bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      编程语言分布
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(result.insights.languageDistribution)
                        .sort((a, b) => b[1] - a[1])
                        .map(([lang, count]) => (
                          <Badge key={lang} variant="secondary">
                            {lang}: {count}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* 空状态 */}
          {!result && !loading && !error && (
            <div className="max-w-2xl mx-auto text-center mt-16">
              <div className="mb-8">
                <Github className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                <h2 className="text-2xl font-bold mb-2">
                  发现你的开发者社交网络
                </h2>
                <p className="text-muted-foreground">
                  输入 GitHub 用户名，探索协作关系、共同关注者和推荐开发者
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <Card className="backdrop-blur-md bg-card/30 border-border/50">
                  <CardContent className="pt-6">
                    <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">社交关系</p>
                    <p className="text-muted-foreground">
                      分析关注者和协作者
                    </p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-md bg-card/30 border-border/50">
                  <CardContent className="pt-6">
                    <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">共同 Star</p>
                    <p className="text-muted-foreground">发现共同兴趣项目</p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-md bg-card/30 border-border/50">
                  <CardContent className="pt-6">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">智能推荐</p>
                    <p className="text-muted-foreground">发现潜在合作者</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>

        {/* 页脚 */}
        <footer className="border-t border-border/50 backdrop-blur-md bg-background/20">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
            <p>
              Built with ❤️ using Next.js |{' '}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
