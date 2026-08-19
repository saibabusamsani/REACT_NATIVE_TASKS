import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ProductRepository from '../database/repositories/productRepository';

type Props = NativeStackScreenProps<RootStackParamList, 'AddProduct'>;

interface FormErrors {
  name?: string;
  price?: string;
}

export default function AddProductScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const validate = useCallback((): boolean => {
    const next: FormErrors = {};
    const trimmedName = name.trim();
    const parsedPrice = Number(price);

    if (!trimmedName) {
      next.name = 'Product name is required';
    }

    if (!price.trim()) {
      next.price = 'Price is required';
    } else if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      next.price = 'Enter a valid price greater than 0';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [name, price]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      await ProductRepository.add({
        name: name.trim(),
        price: Number(price),
      });
      navigation.goBack();
    } catch (err) {
      console.error('[AddProductScreen] save error:', err);
      Alert.alert('Error', 'Could not save the product. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [name, price, validate, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>New product</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Product name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
            }}
            placeholder="e.g. Wireless mouse"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="sentences"
            returnKeyType="next"
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              if (errors.price) setErrors((e) => ({ ...e, price: undefined }));
            }}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
          {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save product</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: '600', color: '#111827', marginBottom: 24 },
  field: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  inputError: { borderColor: '#DC2626' },
  errorText: { color: '#DC2626', fontSize: 12, marginTop: 4 },
  saveButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});