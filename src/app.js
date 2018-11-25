/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  Dimensions,
  NetInfo,
  Text,
  TouchableOpacity,
  View, ActivityIndicator
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { sessionTitle, spacing, font } from './common/theme';
import Colors from './common/colors';
import Avatar from './components/Avatar';
import SnackBar from './components/SnackBar';
import styles from './styles';
import Axios from 'axios';
import _ from 'lodash';

import { SearchBar } from 'react-native-elements'
import AppListView from './AppListView';
import SearchView from './SearchView';

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

      fetchingError: false,
      searchText: "",
      searchList: [],
      searchResultList: [],
      _isLoading: true,
      _isRefreshing: false,
      _isLoadingMore: false,

      snackVisible: false,
      errorMessage: ""
    }
    this.getListData = this.getListData.bind(this);
    this.getTopGrossing = this.getTopGrossing.bind(this);
    this.loadPagination = this.loadPagination.bind(this);
    this.reload = this.reload.bind(this);

    //render function
    this.renderSearchSection = this.renderSearchSection.bind(this);

    //search function
    this.onChangeText = this.onChangeText.bind(this);

  }
  componentWillMount() {
    NetInfo.isConnected.addEventListener('connectionChange', status => {
      let snackVisible = false;
      let errorMessage = "No internet connection";
      if (!status) {
        snackVisible = true;
      }
      this.setState({ networkStatus: status, errorMessage, snackVisible });
    });

    this.getTopGrossing();
    this.getListData();
  }

  reload() {
    this.setState({_isRefreshing: true});
    this.getTopGrossing();
    this.getListData();
  }

  renameData(array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
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
        fetchingError: false,
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
        searchList: this.state.searchList.concat(data),
        fetchingError: false,
        _isRefreshing: false
      });
    } catch (e) {
      console.log(e);
      this.setState({
        _isLoading: false,
        fetchingError: true,
        _isRefreshing: false
      })
    }
  }

  loadPagination() {
    this.setState({ _isLoadingMore: true });
    if (this.state.data.length > this.state.list.length && this.state._isLoadingMore === false) {
      let timer = setTimeout(() => {
        let newPage = this.state.page;
        let currentList = this.state.list;
        let nextList = this.state.data.slice(newPage * pagination, (newPage + 1) * pagination);
        let pushedList = currentList.concat(nextList);
        this.setState({
          list: pushedList,
          _isLoadingMore: false,
          page: newPage + 1
        })
        clearTimeout(timer);
      }, 200);

    }
  }

  onChangeText(text) {
    if (text) {
      var keys = ["title", 'category', 'author', 'summary'];
      var results = [];
      results = this.state.searchList.filter(function (wine) {
        var lowSearch = text.toLowerCase();
        return keys.some(key =>
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
          _.debounce((e) => { this.onChangeText(e) }, 500)
        }
        placeholder='Search...' />

    );
  }

  render() {
    if (this.state._isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      )
    }
    if (this.state.fetchingError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <View style={styles.container}>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', borderRadius: spacing.tiny, width: 100, height: 50, backgroundColor: Colors.themeColor }} onPress={this.reload}>
              <Text style={[font.regular, { color: "white" }]}>Reload</Text>
            </TouchableOpacity>
          </View>
          <SnackBar visible={this.state.snackVisible} position={"bottom"}
            textMessage={this.state.errorMessage}
            isAvoidingView={true} />
        </SafeAreaView>
      )
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", }}>
        {this.renderSearchSection()}

        {this.state.searchText ?
          <SearchView state={this.state} {...this.props} /> :
          <AppListView state={this.state} reload={this.reload} loadPagination={this.loadPagination} {...this.props} />
        }

        <SnackBar visible={this.state.snackVisible} position={"bottom"}
          textMessage={this.state.errorMessage}
          isAvoidingView={true} />
      </SafeAreaView>

    )
  }


}
