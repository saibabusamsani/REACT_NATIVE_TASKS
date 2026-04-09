import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale } from '../theme/Scale';
import { colors, GradientKey, gradients } from '../theme/Colors';
import { spacing } from '../theme/Spacing';
import { fontSize } from '../theme/Typography';
import { radius } from '../theme/Radius';


interface Props {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  gradient?: GradientKey;
  disabled?: boolean;
}

export default function Button({ title, onPress, gradient = 'primary', disabled }: Props) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.85}>
      <LinearGradient
        colors={gradients[gradient] as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.btn, disabled && styles.disabled]}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: moderateScale(spacing.sm + 4),
    paddingHorizontal: moderateScale(spacing.lg),
    borderRadius: moderateScale(radius.md),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontSize: moderateScale(fontSize.lg),
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});