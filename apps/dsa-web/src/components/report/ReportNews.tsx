import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { ParsedApiError } from '../../api/error';
import { getParsedApiError } from '../../api/error';
import { Card } from '../common';
import { ApiErrorAlert } from '../common';
import { historyApi } from '../../api/history';
import type { NewsIntelItem } from '../../types/analysis';

interface ReportNewsProps {
  recordId?: number;  // 分析历史记录主键 ID
  limit?: number;
}

/**
 * 资讯区组件 - 终端风格
 */
export const ReportNews: React.FC<ReportNewsProps> = ({ recordId, limit = 8 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<NewsIntelItem[]>([]);
  const [error, setError] = useState<ParsedApiError | null>(null);

  const fetchNews = useCallback(async () => {
    if (!recordId) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await historyApi.getNews(recordId, limit);
      setItems(response.items || []);
    } catch (err) {
      setError(getParsedApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [recordId, limit]);

  useEffect(() => {
    setItems([]);
    setError(null);

    if (recordId) {
      fetchNews();
    }
  }, [recordId, fetchNews]);

  if (!recordId) {
    return null;
  }

  return (
    <Card variant="bordered" padding="md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="label-uppercase">NEWS FEED</span>
          <h3 className="text-base font-semibold text-white">相关资讯</h3>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="w-3.5 h-3.5 border-2 border-cyan/20 border-t-cyan rounded-full animate-spin" />
          )}
          <button
            type="button"
            onClick={fetchNews}
            className="text-xs text-cyan hover:text-white transition-colors"
          >
            刷新
          </button>
        </div>
      </div>

      {error && !isLoading && (
        <ApiErrorAlert
          error={error}
          actionLabel="重试"
          onAction={() => void fetchNews()}
        />
      )}

      {isLoading && !error && (
        <div className="flex items-center gap-2 text-xs text-secondary-text">
          <div className="w-4 h-4 border-2 border-cyan/20 border-t-cyan rounded-full animate-spin" />
          加载资讯中...
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="text-xs text-muted-text">暂无相关资讯</div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="space-y-3 text-left">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="group rounded-xl border border-white/6 bg-elevated/75 p-4 transition-colors hover:border-cyan/25 hover:bg-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium leading-6 text-white text-left">
                    {item.title}
                  </p>
                  {item.snippet && (
                    <p className="mt-2 text-sm leading-6 text-secondary-text text-left overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                      {item.snippet}
                    </p>
                  )}
                </div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-cyan/18 bg-cyan/10 px-2.5 py-1 text-xs text-cyan transition-colors hover:border-cyan/30 hover:text-white"
                  >
                    跳转
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 3h7m0 0v7m0-7L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}

        </div>
      )}
    </Card>
  );
};
