import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Switch, Dimensions, Image } from 'react-native';
import showToast from '@/app/utils/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/app/providers/ThemeProvider';
import useAppStyles from '@/app/hooks/useAppStyles';
import { useRouter } from 'expo-router';
import { Transaction } from '@/app/providers/TransactionsProvider';
import { useTransactions } from '@/app/providers/TransactionsProvider';
import { TYPO } from '@/constants/typography';
import MonthlyChart from '@/app/components/MonthlyChart';
import { Ionicons } from '@expo/vector-icons';
import { useCurrency } from '../providers/CurrencyProvider';
import { parseToDate } from '@/app/(lib)/date';

export default function Dashboard() {
  const router = useRouter();
  const { transactions, deleteTransaction, getIncomeTotal, getExpenseTotal } = useTransactions();
  const { mode, toggle } = useTheme();
  const styles = useAppStyles();
  const { currency } = useCurrency();

  const formatAmount = (amt: number) => `${currency.symbol}${Number(amt).toFixed(2)}`;

  const amountFontSize = (amt: number) => {
    const len = String(Math.floor(Math.abs(Number(amt) || 0))).length;
    if (len <= 6) return TYPO.body.fontSize;
    if (len === 7) return Number(TYPO.body.fontSize) - 2;
    if (len <= 9) return Number(TYPO.body.fontSize) - 4;
    return TYPO.small.fontSize;
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete",
      "Remove this transaction?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(id);
              showToast('Transaction deleted');
            } catch (err) {
              console.error('Failed to delete transaction from list', err);
              Alert.alert('Error', 'Failed to delete transaction.');
            }
          },
        },
      ]
    );
  };


  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => [...transactions].sort((a, b) => +parseToDate(b.date) - +parseToDate(a.date)), [transactions]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const filtered = useMemo(() => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [sorted, page]);

  const windowW = Dimensions.get('window').width;
  const chartWidth = Math.max(280, windowW - 32);

  const renderItem = useCallback(({ item }: { item: Transaction }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/transaction/transaction-details",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.item}>
        <View style={{ maxWidth: "70%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={
                  item.type === "income"
                    ? styles.badgeIncome
                    : styles.badgeExpense
                }
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  {item.type === "income" ? "Income" : "Expense"}
                </Text>
              </View>

              <Text style={[styles.itemCat, { marginLeft: 8 }]}>
                {item.category}
              </Text>
            </View>
          </View>

          <Text style={styles.itemNote}>
            {parseToDate(item.date).toLocaleDateString()} · {item.note ?? ""}
          </Text>
        </View>

        <View style={styles.itemRight}>
          <Text
            style={[
              styles.value,
              { fontSize: amountFontSize(item.amount), fontWeight: "700" },
            ]}
          >
            {formatAmount(item.amount)}
          </Text>
        </View>

      </View>
    </TouchableOpacity>
  ), [router, styles, formatAmount, amountFontSize, confirmDelete]);



  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.header}>Expenses</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name={mode === 'dark' ? 'moon' : 'sunny'}
            size={22}
            color={mode === 'dark' ? '#facc15' : '#f59e0b'}
            style={{ marginRight: 8 }}
          />

          <Switch
            value={mode === 'dark'}
            onValueChange={toggle}
            thumbColor={mode === 'dark' ? '#0ea5e9' : '#fbbf24'}
            trackColor={{ false: '#ccc', true: '#38bdf8' }}
            ios_backgroundColor={mode === 'dark' ? '#0b0c0c' : '#e5e7eb'}
          />
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Image
            source={require("../../assets/images/salary.png")}
            style={styles.icon}
          />
          <Text style={[styles.summaryAmount, { color: '#16a34a' }]} numberOfLines={1} adjustsFontSizeToFit>
            {currency.symbol}{getIncomeTotal().toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Image
            source={require("../../assets/images/expense.png")}
            style={styles.icon}
          />
          <Text style={[styles.summaryAmount, { color: '#ef4444' }]} numberOfLines={1} adjustsFontSizeToFit>
            {currency.symbol}{getExpenseTotal().toFixed(2)}
          </Text>
        </View>       
      </View>

      <MonthlyChart width={chartWidth} height={140} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={renderItem}
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, gap: 12 }}>
        <TouchableOpacity disabled={page <= 1} onPress={() => setPage((p) => Math.max(1, p - 1))} style={{ padding: 10, backgroundColor: page <= 1 ? '#e5e7eb' : '#2563eb', borderRadius: 8 }}>
          <Text style={{ color: page <= 1 ? '#9ca3af' : '#fff' }}>Prev</Text>
        </TouchableOpacity>
        <Text style={{ color: mode === 'dark' ? '#fff' : '#000' }}>{page} / {totalPages}</Text>
        <TouchableOpacity disabled={page >= totalPages} onPress={() => setPage((p) => Math.min(totalPages, p + 1))} style={{ padding: 10, backgroundColor: page >= totalPages ? '#e5e7eb' : '#2563eb', borderRadius: 8 }}>
          <Text style={{ color: page >= totalPages ? '#9ca3af' : '#fff' }}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
