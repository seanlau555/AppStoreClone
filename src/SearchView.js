import React, { Component } from 'react';
import {
  Text, View, FlatList
} from 'react-native';
import { spacing, font } from './common/theme';
import Colors from './common/colors';
import Avatar from './components/Avatar';
import styles from './styles';
import _ from 'lodash';


export default class SearchView extends Component {
  constructor(props){
    super();
  }

  // App Listing
  renderItemRow({ item, index }) {
    return (
      <View style={[styles.row, {paddingHorizontal: spacing.small}]}>
        <Avatar source={item.coverImage} style={{ borderRadius: 27, width: 54, height: 54, marginRight: spacing.tiny }} />
        <View style={{ marginRight: spacing.small, flex: 1 }}>
          <Text numberOfLines={1} style={font.regular}>{item.title}</Text>
          <Text numberOfLines={1} style={{ ...font.small, marginTop: 4, color: Colors.grey, }}>{item.category}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <FlatList
          style={{ flex: 1, backgroundColor: "white" }}
          data={this.props.state.searchResultList}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItemRow}
        />
    )
  }
}
