import { StyleSheet } from 'react-native';

export const TYPO = { header: 22, subheader: 18, body: 16, small: 13,};

export const getCommonStyles = (mode: 'light' | 'dark') => 
    StyleSheet.create({
        container: { flex: 1, padding: 16, backgroundColor: mode === 'dark' ? '#0b1220' : '#f6f7fb' },
        header: { fontSize: TYPO.header, fontWeight: '700', marginBottom: 12, color: mode === 'dark' ? '#fff' : '#222731' },
        card: { backgroundColor: mode === 'dark' ? '#071827' : '#fff', padding: 16, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, },
        label: { color: mode === 'dark' ? '#9ca3af' : '#666', fontSize: TYPO.small },
        value: { fontSize: TYPO.body, marginTop: 6, color: mode === 'dark' ? '#fff' : '#000' },
        input: { borderWidth: 1, borderColor: mode === 'dark' ? '#163835' : '#e6e6e6', padding: 10, borderRadius: 8, marginTop: 6, color: mode === 'dark' ? '#fff' : '#000' },
        btn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', minWidth: 80 },
        btnText: { color: '#fff', fontWeight: '700' },
        badgeIncome: { backgroundColor: '#16a34a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
        badgeExpense: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
        summaryCard: { backgroundColor: mode === 'dark' ? '#071827' : '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
        summaryLabel: { color: mode === 'dark' ? '#9ca3af' : '#666' },
        summaryAmount: { fontSize: TYPO.subheader, fontWeight: '700', marginTop: 6, color: mode === 'dark' ? '#fff' : '#000' },
        summaryBlock: { flex: 1, minWidth: 120, marginRight: 8 },
        addBtn: { marginTop: 0, backgroundColor: '#628adfff', padding: 10, borderRadius: 8 },
        addBtnText: { color: '#fff', fontWeight: '700' },
        item: { backgroundColor: mode === 'dark' ? '#071827' : '#fff', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', elevation: 1 },
        itemCat: { fontWeight: '600', color: mode === 'dark' ? '#fff' : '#000' },
        itemNote: { color: mode === 'dark' ? '#94a3b8' : '#666', marginTop: 4 },
        itemRight: { alignItems: 'flex-end' },
        amount: { fontWeight: '700', color: mode === 'dark' ? '#fff' : '#000' },
        delete: { color: '#fb7185', marginTop: 6 },
        modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
        modalContent: { width: '90%', padding: 16, borderRadius: 12, backgroundColor: mode === 'dark' ? '#071827' : '#fff' },
        inputTouchable: { borderWidth: 1, borderColor: mode === 'dark' ? '#163835' : '#e6e6e6', padding: 10, borderRadius: 8, marginTop: 6 },
        inputText: { color: mode === 'dark' ? '#fff' : '#000' },
        inputPlaceholder: { color: mode === 'dark' ? '#94a3b8' : '#9ca3af' },
        row: { flexDirection: 'row', alignItems: 'center', marginTop: 12, },
        inlineInput: { flex: 1, paddingVertical: 4, },
        icon: { width: 48, height: 48, marginBottom: 8, resizeMode: "contain", },
        actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16, },
        saveBtn: { backgroundColor: '#84e623ff', padding: 12, borderRadius: 8, alignItems: 'center', minWidth: 80, },
        clearBtn: { backgroundColor: '#628adfff', padding: 12, borderRadius: 8, alignItems: 'center', minWidth: 80, },
        saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 14, },
        inputBox: { height: 48, borderWidth: 1,  borderColor: "#ccc",  borderRadius: 8,  paddingHorizontal: 12,  justifyContent: "center",}

    });
    
export default getCommonStyles;
