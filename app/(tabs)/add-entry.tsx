import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, Switch, Modal, Platform } from 'react-native';
import showToast from '@/app/utils/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '@/app/providers/TransactionsProvider';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/app/providers/ThemeProvider';
import useAppStyles from '@/app/hooks/useAppStyles';
import { router } from 'expo-router';
import { CATEGORIES } from '@/constants/categories';
import { parseToDate } from '@/app/(lib)/date';
import { IOSCategoryPicker } from '../components/CategoryPicker';

export default function AddEntry() {
    const { addTransaction } = useTransactions();

    interface FormState {
        amount: string;
        category: string;
        date: string;
        note: string;
        isIncome: boolean;
    }

    const [form, setForm] = useState<FormState>({ amount: '', category: '', date: new Date().toISOString(), note: '', isIncome: false });
    const [showPicker, setShowPicker] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const noteRef = useRef<TextInput | null>(null);
    const { mode } = useTheme();
    const styles = useAppStyles();
    const isDark = mode === "dark";

    const isValidDate = (s?: string) => {
        if (!s || typeof s !== "string") return false;

        const value = s.trim();

        if (value.length < 10) return false;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return false;

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        return d.getTime() <= today.getTime();
    };


    const onSave = async () => {
        if (!form.category.trim()) return Alert.alert('Error', 'Category is required');
        const n = Number(form.amount);
        if (!form.amount || isNaN(n) || n <= 0) return Alert.alert('Error', 'Amount must be a positive number');
        const isoDate = form.date.slice(0, 10);
        if (!isValidDate(isoDate)) return Alert.alert('Error', 'Date is invalid or in the future (use YYYY-MM-DD)');

        const [yy, mm, dd] = isoDate.split('-').map((v) => Number(v));
        const safeDate = new Date(yy, mm - 1, dd).toISOString();

        try {
            await addTransaction({ amount: n, category: form.category.trim(), date: safeDate, note: form.note.trim(), type: form.isIncome ? 'income' : 'expense' });
            setForm({ amount: '', category: '', date: new Date().toISOString(), note: '', isIncome: false });
            Keyboard.dismiss();
            showToast('Transaction saved');
            router.push('/');


        } catch (err) {
            console.error('Failed to add transaction', err);
            Alert.alert('Error', 'Failed to save transaction. Please try again.');
        }
    };

    const onClear = () => {
        setForm({
            ...form,
            amount: '',
            category: '',
            note: '',
            isIncome: false,
        });
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.header}>Add Transaction</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={{ color: '#2563eb' }}>Home</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Amount</Text>
                <TextInput keyboardType="numeric" value={form.amount} onChangeText={(v) => setForm((s) => ({ ...s, amount: v }))} style={styles.input} placeholder="e.g. 250.00" placeholderTextColor={mode === 'dark' ? '#94a3b8' : '#9ca3af'} maxLength={7} />



                <Text style={styles.label}>Category</Text>

                {Platform.OS === "ios" ? (
                    <>
                        <TouchableOpacity
                            onPress={() => setCategoryModalVisible(true)}
                            style={styles.inputTouchable}
                        >
                            <Text
                                style={[
                                    styles.inputText,
                                    { color: form.category ? (mode === 'dark' ? '#fff' : '#000') : styles.inputPlaceholder.color }
                                ]}
                            >
                                {form.category || "Select category..."}
                            </Text>
                        </TouchableOpacity>

                        <IOSCategoryPicker
                            visible={categoryModalVisible}
                            value={form?.category ?? ""}
                            onChange={(v) => setForm(s => s ? { ...s, category: v } : s)}
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
                            selectedValue={form.category}
                            onValueChange={(v) => setForm(s => ({ ...s, category: v }))}
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

                )}






                <Text style={styles.label}>Date</Text>
                <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.inputTouchable}>
                    <Text style={[styles.inputText, { color: mode === 'dark' ? '#fff' : '#000' }]}>{parseToDate(form.date).toISOString().slice(0, 10)}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={showPicker}
                    mode="date"
                    display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
                    date={parseToDate(form.date)}
                    maximumDate={new Date()}
                    onConfirm={(d) => {
                        setForm((s) => ({ ...s, date: d.toISOString() }));
                        setShowPicker(false);
                        setTimeout(() => noteRef.current?.focus(), 100);
                    }}
                    onCancel={() => setShowPicker(false)}
                />


                <Text style={styles.label}>Note</Text>
                <TextInput
                    ref={noteRef}
                    multiline
                    numberOfLines={4}
                    maxLength={200}
                    returnKeyType="default"
                    value={form.note}
                    onChangeText={(v) => setForm((s) => ({ ...s, note: v }))}
                    style={[
                        styles.input,
                        {
                            textAlignVertical: "top",
                            height: 80,
                        },
                    ]}
                    placeholder="Optional note"
                    placeholderTextColor={mode === "dark" ? "#94a3b8" : "#9ca3af"}
                />


                <View
                    style={
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 8,
                            marginBottom: 10
                        }
                    }>
                    <Text style={styles.label}>Income</Text>
                    <Switch
                        value={form.isIncome}
                        onValueChange={(v) =>
                            setForm((s) => ({ ...s, isIncome: v }))
                        }
                        trackColor={{
                            false: isDark ? "#4B5563" : "#D1D5DB",
                            true: isDark ? "#22C55E" : "#4ADE80",
                        }}

                        thumbColor={
                            form.isIncome
                                ? (isDark ? "#BBF7D0" : "#FFFFFF")
                                : (isDark ? "#E5E7EB" : "#FFFFFF")
                        }
                        ios_backgroundColor={isDark ? "#4B5563" : "#D1D5DB"}
                    />

                </View>

                <View style={styles.actionRow}>

                    <TouchableOpacity style={[styles.btn, styles.clearBtn]} onPress={onClear}>
                        <Text style={styles.btnText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={onSave}>
                        <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}
