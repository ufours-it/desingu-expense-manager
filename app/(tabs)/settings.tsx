import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrency } from '../providers/CurrencyProvider';
import { router } from 'expo-router';
import useAppStyles from '@/app/hooks/useAppStyles';
import { CURRENCIES } from '@/constants/categories';


export default function Settings() {
  const { currency, setCurrency } = useCurrency();
  const styles = useAppStyles();

  const onSelectCurrency = (c: { code: string; symbol: string }) => {
    setCurrency(c);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={styles.header}>Settings</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={{ color: '#2563eb' }}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>

        {CURRENCIES.map(c => {
          const isActive = currency.code === c.code;

          return (
            <TouchableOpacity
              key={c.code}
              onPress={() => onSelectCurrency(c)}
              style={{
                padding: 14,
                backgroundColor: isActive ? '#628adfff' : '#e5e7eb',
                marginBottom: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: isActive ? '#fff' : '#000',
                  fontSize: 16,
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                {c.symbol} ({c.code})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
