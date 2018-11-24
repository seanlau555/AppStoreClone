var Colors = require('../common/colors');
import { Platform } from 'react-native';
const iOS = Platform.OS === "ios";

// 	font-family:"Hiragino Sans GB","华文细黑","STHeiti","微软雅黑","Microsoft YaHei",SimHei,"Helvetica Neue",Helvetica,Arial,sans-serif !important;

const spacing = {
  tiny: 8,
  small: 16,
  base: 24,
  large: 48,
  xLarge: 64

};

const color = {
  darkText: '#484848',
  image: '#484848',
  lightGray: '#f7f7f7',
};

const font = {
  title: {
    color: Colors.textColor,
    fontSize: 44,
    lineHeight: 56,
    fontWeight: 'bold',
  },
  title2: {
    color: Colors.textColor,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: 'bold',
  },
  title3: {
    color: Colors.textColor,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: 'bold',
  },
  large: {
    color: Colors.textColor,
    fontSize: 19,
    lineHeight: 24,
  },
  regular: {
    color: Colors.textColor,
    fontSize: 17,
    lineHeight: 22,
  },
  small: {
    color: Colors.textColor,
    fontSize: 14,
    lineHeight: 18,
  },
};


const pageTitle = {
  ...font.title2,
  marginTop: spacing.base,
  marginRight: spacing.large,
  marginLeft:spacing.base
}

const pageSubTitle = {
  ...font.large,
  marginTop: spacing.tiny,
  marginHorizontal: spacing.base,
}

const sessionTitle = {
  ...font.title2,
  marginTop: spacing.base,
  marginBottom: spacing.small,
  marginHorizontal: spacing.base
  // marginBottom: spacing.tiny
}

const textTitle = {
  color:Colors.textColor,
  fontSize:16, 
  marginBottom: iOS ? 10 : 0
}


module.exports = {
  font,
  color,
  spacing,
  aspectRatio: 1 / 1.6,

  //format
  textTitle,
  sessionTitle,
  pageTitle,
  pageSubTitle
};