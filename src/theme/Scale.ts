import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');


const guidelineBaseWidth = 375;

export const scale = (size: number): number => (width / guidelineBaseWidth) * size;

export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;