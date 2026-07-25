import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/types';

const { height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'SplashScreen'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    RNBootSplash.hide({ fade: false });

    const finish = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    };

    const timer = setTimeout(() => {
      Animated.parallel([
        // Logo: centre -> bottom
        Animated.timing(logoTranslateY, {
          toValue: height / 2 - 120,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.5,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        //Text
        Animated.sequence([
          Animated.delay(250),
          Animated.parallel([
            Animated.timing(textOpacity, {
              toValue: 1,
              duration: 400,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.spring(textScale, {
              toValue: 1,
              friction: 3,
              tension: 50,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => {
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 500,
          delay: 400,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) finish();
        });
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: textOpacity,
            transform: [{ scale: textScale }],
          },
        ]}
      >
        HRMS Attendance
      </Animated.Text>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[
          styles.logo,
          {
            transform: [
              { translateY: logoTranslateY },
              { scale: logoScale },
            ],
          },
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111E38',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    position: 'absolute',
  },
  text: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default SplashScreen;