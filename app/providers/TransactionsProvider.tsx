import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseToDate } from '@/app/(lib)/date';

export type Transaction = {
  id: string;
  amount: number;
  category: string;
  date: string; 
  note?: string;
  type?: 'income' | 'expense';
};

type TransactionsContextValue = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  editTransaction: (t: Transaction) => Promise<void>;
  getTotal: () => number;
  getIncomeTotal: () => number;
  getExpenseTotal: () => number;
};

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

const STORAGE_KEY = 'transactions_v1';

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Transaction[];
            const normalized = parsed.map((t) => ({ ...t, date: parseToDate(t.date).toISOString() }));
            setTransactions(normalized);
          } catch (e) {
            console.warn('Failed to parse transactions, clearing storage fallback', e);
            setTransactions([]);
          }
        }
      } catch (e) {
        console.warn('Failed to load transactions', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      } catch (e) {
        console.warn('Failed to save transactions', e);
      }
    })();
  }, [transactions]);

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    const newT: Transaction = { ...t, id: Date.now().toString(), type: t.type ?? 'expense' };
    let next: Transaction[] = [];
    setTransactions((prev) => {
      next = [newT, ...prev];
      return next;
    });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist transactions after add', e);
    }
  };

  const deleteTransaction = async (id: string) => {
    let next: Transaction[] = [];
    setTransactions((prev) => {
      next = prev.filter((x) => x.id !== id);
      return next;
    });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist transactions after delete', e);
    }
  };

  const editTransaction = async (t: Transaction) => {
    let next: Transaction[] = [];
    setTransactions((prev) => {
      next = prev.map((x) => (x.id === t.id ? t : x));
      return next;
    });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist transactions after edit', e);
    }
  };

    const getTotal = () => {
        return transactions.reduce((total, t) => {
            const amount = Number(t.amount) || 0;
            if (t.type === 'income')
                return total + amount;
            if (t.type === 'expense')
                return total - amount;
            return total;
        }, 0);
    };

  const getIncomeTotal = () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
  const getExpenseTotal = () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, editTransaction, getTotal, getIncomeTotal, getExpenseTotal }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionsProvider');
  return ctx;
};

export default TransactionsProvider;
