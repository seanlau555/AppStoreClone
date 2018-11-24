import PropTypes from 'prop-types'
import React, {Component} from 'react'
import { Animated, View } from 'react-native';
import Colors from '../common/colors';

export default class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = { imageOpacity: new Animated.Value(0) };
    this.onLoad = this.onLoad.bind(this);
  }

  onLoad() {
    Animated.timing(this.state.imageOpacity, {
      toValue: 1,
      duration: 250
    }).start()
  }

  render() {
    const {
      source,
      resizeMode,
      style
    } = this.props;
    var avatarStyle = {
      borderColor: Colors.separator,
      borderWidth: 0.5
    };
    return (
      <View
        style={[avatarStyle, {
          backgroundColor: '#CCC',
        }, style]}
      >
        <Animated.Image
          style={[avatarStyle,
            {
              opacity: this.state.imageOpacity,
              position: 'absolute'
            }, style]}
          source={{ uri: source }}
          resizeMode={resizeMode}
          onLoad={this.onLoad} />
      </View>
    );
  }
}



Avatar.defaultProps = {
    source: "",
    resizeMode: "cover"
}

Avatar.propTypes = {
    source: PropTypes.string,
    resizeMode: PropTypes.string
}

// export default Avatar
