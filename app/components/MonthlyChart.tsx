import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/app/providers/ThemeProvider';
import { parseToDate } from '@/app/(lib)/date';
import { useTransactions } from '@/app/providers/TransactionsProvider';

export default function MonthlyChart({ width = 320, height = 140 }: { width?: number; height?: number }) {
  const { mode } = useTheme();
  const { transactions } = useTransactions();

  const months = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      map[key] = { income: 0, expense: 0 };
    }
    transactions.forEach((t) => {
      const d = parseToDate(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      if (!map[key]) 
        return;
      if (t.type === 'income') 
        map[key].income += Number(t.amount || 0);
      else 
        map[key].expense += Number(t.amount || 0);
    });
    return Object.keys(map).map((k) => ({ month: k, ...map[k] }));
  }, [transactions]);

  const max = Math.max(...months.map((m) => Math.max(m.income, m.expense)), 1);
  const padding = 12;
  const innerW = width - padding * 2;
  const innerH = height - 30; 
  const barGroupW = innerW / months.length;
  const barW = Math.max(6, Math.floor(barGroupW / 3));

  const textColor = mode === 'dark' ? '#fff' : '#000';
  const incomeColor = '#16a34a';
  const expenseColor = '#ef4444';
  const background = mode === 'dark' ? '#071827' : '#fff';

  return (
    <View style={{ backgroundColor: background, padding: 8, borderRadius: 8, marginBottom: 16 }}>
      <Text style={{ color: textColor, fontWeight: '700', marginBottom: 6 }}>Last 6 months</Text>
      <Svg width={width} height={height}>
        <G x={padding} y={6}>
          {months.map((m, i) => {
            const gx = i * barGroupW + barGroupW / 2;
            const incomeH = (m.income / max) * innerH;
            const expenseH = (m.expense / max) * innerH;
            return (
              <G key={m.month}>
                <Rect
                  x={gx - barW - 2}
                  y={innerH - incomeH}
                  width={barW}
                  height={incomeH}
                  fill={incomeColor}
                  rx={2}
                />
                <Rect
                  x={gx + 2}
                  y={innerH - expenseH}
                  width={barW}
                  height={expenseH}
                  fill={expenseColor}
                  rx={2}
                />
                <SvgText x={gx} y={innerH + 14} fontSize={10} fill={textColor} textAnchor="middle">
                  {m.month.slice(5)}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}
