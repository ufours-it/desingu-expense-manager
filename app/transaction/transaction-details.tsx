import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Switch, Modal } from 'react-native';
import showToast from '@/app/utils/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Platform } from 'react-native';
import { parseToDate } from '@/app/(lib)/date';
import { useTransactions } from '@/app/providers/TransactionsProvider';
import { useTheme } from '@/app/providers/ThemeProvider';
import useAppStyles from '@/app/hooks/useAppStyles';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { TYPO } from '@/constants/typography';
import { Picker } from '@react-native-picker/picker';
import { useCurrency } from '../providers/CurrencyProvider';
import { CATEGORIES } from '@/constants/categories';
import { IOSCategoryPicker } from '../components/CategoryPicker';

export default function TransactionDetail() {
  const { id } = useLocalSearchParams() as { id: string };
  const router = useRouter();
  const { transactions, editTransaction, deleteTransaction } = useTransactions();
  const { mode } = useTheme();
  const styles = useAppStyles();
  const navigation = useNavigation();
  const { currency } = useCurrency();
  const isDark = mode === 'dark';
  useLayoutEffect(() => {
    try {
      navigation.setOptions && navigation.setOptions({ headerShown: false });
    } catch (e) {
      console.warn('Failed to set navigation options:', e);
    }
  }, [navigation]);

  const [tx, setTx] = useState(() => transactions.find((t) => t.id === id));
  const [isEditing, setIsEditing] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [category, setCategory] = useState(tx?.category ?? "");


  useEffect(() => {
    if (isEditing) {
      setCategory(tx?.category ?? '');
    }
  }, [isEditing, tx]);

  const amountFontSize = (amt: number) => {
    const len = String(Math.floor(Math.abs(Number(amt) || 0))).length;
    if (len <= 6) return TYPO.subheader.fontSize;
    if (len === 7) return Number(TYPO.subheader.fontSize) - 2;
    if (len <= 9) return TYPO.body.fontSize;
    return TYPO.small.fontSize;
  };

  useEffect(() => {
    setTx(transactions.find((t) => t.id === id));
  }, [transactions, id]);

  if (!tx) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Transaction not found</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/')}>
          <Text style={styles.btnText}>Back Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const onSave = async () => {
    const n = Number(tx.amount);
    if (!tx.category?.trim()) return Alert.alert('Validation', 'Category required');
    if (!tx.amount || isNaN(n) || n <= 0) return Alert.alert('Validation', 'Amount must be positive');
    try {
      await editTransaction(tx);
      setIsEditing(false);
      try {
        await Promise.resolve();
      } catch { }
      showToast('Transaction updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update transaction. Please try again.');
      console.error('Failed to update transaction:', error);
    }
  };

  const onDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this transaction? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(tx.id);
              showToast('Transaction deleted');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete transaction. Please try again.');
              console.error('Failed to delete transaction:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.header}>Transaction</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={{ color: '#2563eb' }}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>


        {isEditing ? (
          <TextInput
            maxLength={7}
            style={styles.input}
            value={String(tx.amount)}
            keyboardType="numeric"
            onChangeText={(v) => {
              const parsed = parseFloat(v);
              setTx({ ...tx, amount: isNaN(parsed) ? 0 : parsed });
            }}
          />
        ) : (
          <Text style={[styles.value, { fontSize: amountFontSize(tx.amount) }]}>
            {currency.symbol}{Number(tx.amount).toFixed(2)}
          </Text>
        )}



        <Text style={[styles.label, { marginTop: 12 }]}>Category</Text>

        {isEditing ? (
          Platform.OS === "ios" ? (
            <>
              <TouchableOpacity
                onPress={() => setCategoryModalVisible(true)}
                style={styles.inputTouchable}
              >
                <Text
                  style={[
                    styles.inputText,
                    { color: tx.category ? (mode === 'dark' ? '#fff' : '#000') : styles.inputPlaceholder.color }
                  ]}
                >
                  {tx.category || "Select category..."}
                </Text>
              </TouchableOpacity>

              <IOSCategoryPicker
                visible={categoryModalVisible}
                value={tx?.category ?? ""}
                onChange={(v) => setTx(s => s ? { ...s, category: v } : s)}
                onClose={() => setCategoryModalVisible(false)}
                options={CATEGORIES}
              />
            </>
          ) : (
            <View
              style={[
                styles.inputBox,
                { backgroundColor: mode === "dark" ? "#222731" : "#FFFFFF", marginTop: 6 },
              ]}
            >
              <Picker
                selectedValue={tx.category}
                onValueChange={(v) =>
                  setTx(s => s ? { ...s, category: v } : s)
                }
                mode="dropdown"
                dropdownIconColor={mode === "dark" ? "#FFFFFF" : "#000000"}
                style={{
                  color: mode === "dark" ? "#FFFFFF" : "#000000",
                  backgroundColor: "transparent",
                  width: "100%",
                }}
              >
                <Picker.Item label="Select category..." value="" />
                {CATEGORIES.map(c => (
                  <Picker.Item key={c.value} label={c.label} value={c.value} />
                ))}
              </Picker>
            </View>
          )
        ) : (
          <Text style={styles.value}>{tx.category}</Text>
        )}


        <Text style={[styles.label, { marginTop: 12 }]}>Date</Text>
        {isEditing ? (
          <TouchableOpacity onPress={() => setShowDate(true)} style={styles.inputTouchable}>
            <Text style={styles.inputText}>{parseToDate(tx.date).toISOString().slice(0, 10)}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.value}>{parseToDate(tx.date).toLocaleDateString()}</Text>
        )}

        <Text style={[styles.label, { marginTop: 12 }]}>Note</Text>
        {isEditing ? (
          <TextInput
            multiline
            numberOfLines={4}
            maxLength={200}
            style={[
              styles.input,
              {
                textAlignVertical: "top",
                height: 80,
              },
            ]}
            value={tx.note ?? ""}
            onChangeText={(v) => setTx({ ...tx, note: v } as any)}
            placeholder="Optional note"
            placeholderTextColor={mode === "dark" ? "#94a3b8" : "#9ca3af"}
          />
        ) : (
          <Text style={styles.value}>{tx.note || "—"}</Text>
        )}


        {isEditing && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Text style={styles.label}>Income</Text>

            <Switch
              value={tx.type === "income"}
              onValueChange={(v) =>
                setTx({ ...tx, type: v ? "income" : "expense" } as any)
              }
              trackColor={{
                false: mode === "dark" ? "#4B5563" : "#D1D5DB",
                true: mode === "dark" ? "#22C55E" : "#4ADE80",
              }}
              thumbColor={
                tx.type === "income"
                  ? mode === "dark" ? "#BBF7D0" : "#FFFFFF"
                  : mode === "dark" ? "#E5E7EB" : "#FFFFFF"
              }
              ios_backgroundColor={mode === "dark" ? "#4B5563" : "#D1D5DB"}
            />
          </View>
        )}

        <DateTimePickerModal
          isVisible={showDate}
          mode="date"
          display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
          date={parseToDate(tx.date)}
          maximumDate={new Date()}
          onConfirm={(d) => { setTx({ ...tx, date: d.toISOString() } as any); setShowDate(false); }}
          onCancel={() => setShowDate(false)} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          {isEditing ? (
            <>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#6b7280' }]} onPress={() => setIsEditing(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={onSave}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#ef4444' }]} onPress={onDelete}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => setIsEditing(true)}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

