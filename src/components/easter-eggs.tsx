'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Sparkles, Quote } from 'lucide-react';

// Konami 代码序列
const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

// 开发者名言
const DEV_QUOTES = [
  {
    text: "代码是写给人看的，顺便能在机器上运行。",
    author: "Donald Knuth",
  },
  {
    text: "简单是可靠的先决条件。",
    author: "Edsger W. Dijkstra",
  },
  {
    text: "首先，解决问题。然后，写代码。",
    author: "John Johnson",
  },
  {
    text: "经验是每个人给自己所犯错误取的名字。",
    author: "Oscar Wilde",
  },
  {
    text: "好的代码本身就是最好的文档。",
    author: "Steve McConnell",
  },
  {
    text: "程序必须是为了给人看而写，给机器执行只是附带的。",
    author: "Donald Knuth",
  },
  {
    text: "调试代码比编写代码难两倍。所以如果你写代码时尽可能聪明，那么你就没有足够的智慧去调试它。",
    author: "Brian Kernighan",
  },
  {
    text: "任何傻瓜都能写出计算机能理解的代码。优秀的程序员写人能理解的代码。",
    author: "Martin Fowler",
  },
  {
    text: "首先让它工作，然后让它正确，最后让它快。",
    author: "Kent Beck",
  },
  {
    text: "代码永远不会撒谎，注释有时会。",
    author: "Ron Jeffries",
  },
  {
    text: "最好的代码是没有代码。",
    author: "Jeff Atwood",
  },
  {
    text: "在编程中，没有什么比修复 bug 更有成就感了。",
    author: "Linus Torvalds",
  },
];

export function EasterEggs() {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(DEV_QUOTES[0]);
  const [matrixMode, setMatrixMode] = useState(false);

  // 随机选择名言
  const getRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * DEV_QUOTES.length);
    return DEV_QUOTES[randomIndex];
  }, []);

  // 处理键盘事件（Konami 代码检测）
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 检测 Konami 代码
      if (event.code === KONAMI_CODE[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        setKonamiIndex(nextIndex);

        if (nextIndex === KONAMI_CODE.length) {
          // Konami 代码完成！
          setMatrixMode(true);
          setCurrentQuote(getRandomQuote());
          setShowQuote(true);

          // 3秒后关闭
          setTimeout(() => {
            setShowQuote(false);
            setMatrixMode(false);
          }, 5000);

          setKonamiIndex(0);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, getRandomQuote]);

  // 定时显示随机名言（每 30 秒）
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% 概率显示
        setCurrentQuote(getRandomQuote());
        setShowQuote(true);
        setTimeout(() => setShowQuote(false), 4000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [getRandomQuote]);

  return (
    <>
      {/* Matrix 模式背景 */}
      {matrixMode && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-black/90 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
              <p className="text-2xl font-bold text-primary">
                🎉 KONAMI CODE ACTIVATED! 🎉
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You found the secret!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 名言卡片 */}
      {showQuote && !matrixMode && (
        <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg p-4 shadow-2xl max-w-sm">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-foreground italic">
                  &quot;{currentQuote.text}&quot;
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  — {currentQuote.author}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Konami 代码提示（隐藏在页面中） */}
      <div className="sr-only" aria-hidden="true">
        Try the Konami code: ↑↑↓↓←→←→BA
      </div>
    </>
  );
}
