/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform, SafeAreaView,
  // ListView,
  Dimensions,
  StyleSheet,
  Text, View, FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
const {width, height} = Dimensions.get('window');
import { sessionTitle, spacing, font } from './common/theme';
import Colors from './common/colors';
import Avatar from './components/Avatar';
import styles from './styles';
import Axios from 'axios';

import { SearchBar } from 'react-native-elements'


const topFreeAppsAPI = "https://itunes.apple.com/hk/rss/topfreeapplications/limit=100/json";
const topGrossingAPI = "https://itunes.apple.com/hk/rss/topgrossingapplications/limit=10/json";
const pagination = 10;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      list: [],
      top: [],
      // headerList: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      page: 0,
      _isLoading: true,
      _isLoadingMore: false,
    }
    this.getListData = this.getListData.bind(this);
    this.getTopGrossing = this.getTopGrossing.bind(this);
    this.loadPagination = this.loadPagination.bind(this);

    //render function
    this.renderHeader = this.renderHeader.bind(this);
    this.renderItemRow = this.renderItemRow.bind(this);
    this.renderItemCard = this.renderItemCard.bind(this);
  }
  componentWillMount() {
    this.getTopGrossing();
    this.getListData();
  }

  async getTopGrossing() {
    try {
      const request = await Axios.get(topGrossingAPI);
      this.setState({
        top: request.data.feed.entry
      });
    } catch (e) {
      console.log(e);
      this.setState({
        fetchingError: true,
      })
    }
  }

  async getListData() {
    try {
      const request = await Axios.get(topFreeAppsAPI);
      // console.log(request.data.feed.entry);
      let data = request.data.feed.entry;
      this.setState({
        _isLoading: false,
        data: data,
        list: data.slice(0, pagination),
        page: 1
      });
    } catch (e) {
      console.log(e);
      this.setState({
        _isLoading: false,
        fetchingError: true,
      })
    }
  }

  loadPagination() {
    if (this.state.data.length > this.state.list.length) {
      setTimeout(() => {
        let newPage = this.state.page;
        let currentList = this.state.list;
        let nextList = this.state.data.slice(newPage * pagination, (newPage + 1) * pagination);
        let pushedList = currentList.concat(nextList);
        this.setState({
          list: pushedList,
          page: newPage + 1
        })
      }, 200);

    }
  }

  // // App Search
  renderSearchSection() {
    return (
      <View style={{height:30, width: width}}>

      </View>
    );
  }

  // App Recommendation
  renderItemCard({ item, index }) {
    return (
      <View style={{ width: 80,  marginHorizontal: spacing.tiny, marginBottom: spacing.small  }}>
        <Avatar source={item['im:image'][1].label} style={{ width: 80, height: 80, borderRadius: spacing.tiny }} />
        <Text numberOfLines={2} style={font.small}>{item['im:name'].label}</Text>
        <Text numberOfLines={1} style={{ ...font.small, marginTop: 4, color: Colors.grey, }}>{item['category'].attributes.label}</Text>
      </View>
    )
  }
  renderHeader() {
    return (
      <View style={{flex:1, borderBottomColor: Colors.separator, borderBottomWidth: 1}}>
        <Text style={[sessionTitle]}>{"推介"}</Text>
        <FlatList
          style={{ flex: 1,  paddingHorizontal: spacing.tiny}}
          data={this.state.top}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItemCard}
          horizontal={true}
        />
      </View>
    )
  }

  // App Listing
  isOdd(num) { return num % 2; }
  renderItemRow({ item, index }) {
    let rowNumber = index + 1;
    let avatarExtraStyle = { borderRadius: 27 };
    if (this.isOdd(rowNumber)) avatarExtraStyle = { borderRadius: spacing.tiny };
    return (
      <View style={styles.row}>
        <Text style={{ ...font.large, color: Colors.grey, marginHorizontal: spacing.small }}>{rowNumber}</Text>
        <Avatar source={item['im:image'][1].label} style={{ ...avatarExtraStyle, width: 54, height: 54, marginRight: spacing.tiny }} />
        <View style={{ marginRight: spacing.small, flex: 1 }}>
          <Text numberOfLines={1} style={font.regular}>{item['im:name'].label}</Text>
          <Text numberOfLines={1} style={{ ...font.small, marginTop: 4, color: Colors.grey, }}>{item['category'].attributes.label}</Text>
        </View>
      </View>
    )
  }

  render() {
    if (this.state._isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      )
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", }}>
        {this.renderSearchSection()}
        <FlatList
          style={{ flex: 1, backgroundColor: "white" }}
          data={this.state.list}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => this.renderHeader()}
          renderItem={this.renderItemRow}
          onEndReached={this.loadPagination}
          onEndReachedThreshold={0.1}
        />
      </SafeAreaView>

    )
  }
}

// networkStatus for refreshing
// refreshing=


// onRefresh={
//   <RefreshControl
//       onRefresh={this.onRefresh}
//       tintColor={Colors.themeColor}
//       refreshing={this.state.isRefreshing}
//       colors={[Colors.themeColor]}
//       progressBackgroundColor={'#FFF'}
//   />
// }

// onRefresh={()=>this.getListData()}
// onEndReachedThreshold={0.5}