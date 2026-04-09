import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Reference width your design was made for (standard iPhone frame).
// Change this if your source design/mockup used a different width.
const guidelineBaseWidth = 375;

export const scale = (size: number): number => (width / guidelineBaseWidth) * size;

export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;