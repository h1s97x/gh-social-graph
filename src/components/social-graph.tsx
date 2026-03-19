'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

// ForceGraph2D 类型定义
interface ForceGraphMethods {
  // 基础方法
  [key: string]: unknown;
}

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading graph...</p>
      </div>
    </div>
  ),
});

import { SocialGraph, GraphNode, GraphLink } from '@/lib/github/types';

interface SocialGraphVisualizationProps {
  data: SocialGraph;
  onNodeClick?: (node: GraphNode) => void;
  width?: number;
  height?: number;
}

export function SocialGraphVisualization({
  data,
  onNodeClick,
  width,
  height,
}: SocialGraphVisualizationProps) {
  const graphRef = useRef<ForceGraphMethods | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 自动调整尺寸
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: width || window.innerWidth,
        height: height || window.innerHeight - 200,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  // 绘制节点
  const paintNode = useCallback(
    (node: GraphNode & { x: number; y: number; color: string }, ctx: CanvasRenderingContext2D, globalScale: number) => {
      // 检查坐标是否有效
      if (!isFinite(node.x) || !isFinite(node.y)) return;

      const size = Math.max(12 / globalScale, 4);

      // 发光效果
      ctx.shadowBlur = 15;
      ctx.shadowColor = node.color;

      // 绘制节点圆
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();

      // 如果有头像，绘制头像
      if (node.avatar && node.type === 'user') {
        const img = new (globalThis.Image as any)();
        img.src = node.avatar;
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(
          img,
          node.x - size,
          node.y - size,
          size * 2,
          size * 2
        );
        ctx.restore();
      }

      // 绘制标签（缩放时显示）
      if (globalScale > 1.2) {
        ctx.shadowBlur = 0;
        ctx.font = `${Math.max(10 / globalScale, 6)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(node.label, node.x, node.y + size + 2);
      }
    },
    []
  );

  // 绘制链接
  const paintLink = useCallback(
    (link: GraphLink & { source: { x: number; y: number }; target: { x: number; y: number } }, ctx: CanvasRenderingContext2D, globalScale: number) => {
      // 检查坐标是否有效
      if (
        !isFinite(link.source.x) ||
        !isFinite(link.source.y) ||
        !isFinite(link.target.x) ||
        !isFinite(link.target.y)
      ) {
        return;
      }

      const gradient = ctx.createLinearGradient(
        link.source.x,
        link.source.y,
        link.target.x,
        link.target.y
      );

      // 根据链接类型设置颜色
      const alpha = Math.min(Math.max(link.weight / 5, 0.1), 0.5);
      if (link.type === 'follows') {
        gradient.addColorStop(0, `rgba(99, 179, 237, ${alpha})`);
        gradient.addColorStop(1, `rgba(99, 179, 237, ${alpha})`);
      } else if (link.type === 'collaborates') {
        gradient.addColorStop(0, `rgba(159, 122, 234, ${alpha})`);
        gradient.addColorStop(1, `rgba(159, 122, 234, ${alpha})`);
      } else {
        gradient.addColorStop(0, `rgba(72, 187, 120, ${alpha})`);
        gradient.addColorStop(1, `rgba(72, 187, 120, ${alpha})`);
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = Math.max(1 / globalScale, 0.5);
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.stroke();
    },
    []
  );

  // 处理节点点击
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (onNodeClick) {
        onNodeClick(node);
      }
    },
    [onNodeClick]
  );

  // 处理鼠标移动
  const handleMouseMove = useCallback(
    (node: GraphNode | null) => {
      setHoverNode(node);
      // 更新鼠标位置用于悬停卡片定位
      if (node) {
        setMousePos({ x: 0, y: 0 });
      }
    },
    []
  );

  return (
    <div className="relative w-full h-full">
      {data && data.nodes && data.nodes.length > 0 ? (
        <ForceGraph2D
          ref={graphRef as any}
          graphData={data as any}
          width={dimensions.width}
          height={dimensions.height}
          nodeRelSize={6}
          nodeVal={(node: any) => node.connections || 1}
          nodeColor={(node: any) => node.color}
          nodeCanvasObject={paintNode as any}
          linkCanvasObject={paintLink as any}
          onNodeClick={handleNodeClick as any}
          onNodeHover={handleMouseMove as any}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          enableNodeDrag={true}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          backgroundColor="transparent"
        />
      ) : (
        <div className="flex items-center justify-center h-full min-h-[600px]">
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary opacity-50" />
            <p className="text-muted-foreground">输入用户名开始探索</p>
          </div>
        </div>
      )}

      {/* 悬停信息卡 */}
      {hoverNode && (
        <div
          className="absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-10"
          style={{
            left: Math.min(mousePos.x + 20, dimensions.width - 200),
            top: Math.min(mousePos.y, dimensions.height - 100),
          }}
        >
          <div className="flex items-center gap-2">
            {hoverNode.avatar && (
              <Image
                src={hoverNode.avatar}
                alt={hoverNode.label}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-semibold text-sm">{hoverNode.label}</p>
              <p className="text-xs text-muted-foreground">
                {hoverNode.type === 'user' ? 'Developer' : 'Repository'}
              </p>
            </div>
          </div>
          {hoverNode.type === 'user' && (hoverNode.data as { bio?: string }).bio && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {(hoverNode.data as { bio?: string }).bio}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
