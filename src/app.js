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
const { width, height } = Dimensions.get('window');
import { sessionTitle, spacing, font } from './common/theme';
import Colors from './common/colors';
import Avatar from './components/Avatar';
import styles from './styles';
import Axios from 'axios';
import _ from 'lodash';

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
      page: 0,

      searchText: "",
      searchList:[],
      searchResultList:[],
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
    this.renderSearchSection = this.renderSearchSection.bind(this);

    //search function
    this.onChangeText = this.onChangeText.bind(this);

  }
  componentWillMount() {
    this.getTopGrossing();
    this.getListData();
  }

  renameData(array) {
    var result = [];
    for (var i=0; i < array.length; i++){
      var item = array[i];
      result[i] = {
        "title": item['im:name'].label,
        "category": item['category'].attributes.label,
        "author": item['im:artist'].label,
        "summary": item['summary'].label,
        "coverImage": item['im:image'][1].label
      }
    }
    return result;
  }

  async getTopGrossing() {
    try {
      const request = await Axios.get(topGrossingAPI);
      this.setState({
        top: this.renameData(request.data.feed.entry),//request.data.feed.entry,
        searchList: this.renameData(request.data.feed.entry),//request.data.feed.entry
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
      let data = this.renameData(request.data.feed.entry);
      this.setState({
        _isLoading: false,
        data: data,
        list: data.slice(0, pagination),
        page: 1,
        searchList: this.state.searchList.concat(data)
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
      let timer = setTimeout(() => {
        let newPage = this.state.page;
        let currentList = this.state.list;
        let nextList = this.state.data.slice(newPage * pagination, (newPage + 1) * pagination);
        let pushedList = currentList.concat(nextList);
        this.setState({
          list: pushedList,
          page: newPage + 1
        })
        clearTimeout(timer);
      }, 200);

    }
  }

  onClear() {

  }
  onChangeText(text) {
    if (text){
      var keys = ["title", 'category', 'author', 'summary'];
      var results = [];
      results = this.state.searchList.filter(function(wine){
        var lowSearch = text.toLowerCase();
        return keys.some( key => 
            String(wine[key]).toLowerCase().includes(lowSearch) 
        );
      });
    }
    this.setState({
      searchText: text,
      searchResultList: results
    })
  }

  // // App Search
  renderSearchSection() {
    return (
      <SearchBar
        showLoading
        cancelButtonTitle="Cancel"
        lightTheme
        ref={search => this.search = search}
        onChangeText={
          _.debounce((e) => {this.onChangeText(e)}, 500 )
        }
        placeholder='Search...' />

    );
  }

  // App Recommendation
  renderItemCard({ item, index }) {
    return (
      <View style={{ width: 80, marginHorizontal: spacing.tiny, marginBottom: spacing.small }}>
        <Avatar source={item.coverImage} style={{ width: 80, height: 80, borderRadius: spacing.tiny }} />
        <Text numberOfLines={2} style={font.small}>{item.title}</Text>
        <Text numberOfLines={1} style={{ ...font.small, marginTop: 4, color: Colors.grey, }}>{item.category}</Text>
      </View>
    )
  }
  renderHeader() {
    return (
      <View style={{ flex: 1, borderBottomColor: Colors.separator, borderBottomWidth: 1 }}>
        <Text style={[sessionTitle]}>{"推介"}</Text>
        <FlatList
          style={{ flex: 1, paddingHorizontal: spacing.tiny }}
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
        <Avatar source={item.coverImage} style={{ ...avatarExtraStyle, width: 54, height: 54, marginRight: spacing.tiny }} />
        <View style={{ marginRight: spacing.small, flex: 1 }}>
          <Text numberOfLines={1} style={font.regular}>{item.title}</Text>
          <Text numberOfLines={1} style={{ ...font.small, marginTop: 4, color: Colors.grey, }}>{item.category}</Text>
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

        {this.state.searchText ? <FlatList
            style={{ flex: 1, backgroundColor: "white" }}
            data={this.state.searchResultList}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItemRow}
          /> :
          <FlatList
            style={{ flex: 1, backgroundColor: "white" }}
            data={this.state.list}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={this.renderHeader}
            renderItem={this.renderItemRow}
            onEndReached={this.loadPagination}
            onEndReachedThreshold={0.1}
          />
        }

      </SafeAreaView>

    )
  }
}
