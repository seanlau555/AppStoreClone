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
  NetInfo,
  Text,
  TouchableOpacity,
  View, ActivityIndicator
} from 'react-native';
import { spacing, font } from './common/theme';
import Colors from './common/colors';
import SnackBar from './components/SnackBar';
import styles from './styles';
import Axios from 'axios';
import _ from 'lodash';

import { SearchBar } from 'react-native-elements'
import AppListView from './AppListView';
import SearchView from './SearchView';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { 
  getAppList
} from './actions';

const topFreeAppsAPI = "https://itunes.apple.com/hk/rss/topfreeapplications/limit=100/json";
const topGrossingAPI = "https://itunes.apple.com/hk/rss/topgrossingapplications/limit=10/json";
const pagination = 10;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      page: 0,
      searchText: "",
      _isLoadingMore: false,

      snackVisible: false,
      errorMessage: ""
    }
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

    this.props.actions.GetAppList();
  }


componentWillReceiveProps(nextProps) {
  if (nextProps.apps.freeApps.length > 0 && !nextProps.apps.isLoading && !nextProps.apps.isFreshing) {
    this.setState({
      list: nextProps.apps.freeApps.slice(0, pagination),
      page: 1,
      searchList: nextProps.apps.freeApps.concat(nextProps.apps.grossingApps)
    }); 
  }
  }

  reload() {
    this.props.actions.GetAppList(true);
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

  loadPagination() {
    this.setState({ _isLoadingMore: true });
    if (this.props.apps.freeApps.length > this.state.list.length && this.state._isLoadingMore === false) {
      let timer = setTimeout(() => {
        let newPage = this.state.page;
        let currentList = this.state.list;
        let nextList = this.props.apps.freeApps.slice(newPage * pagination, (newPage + 1) * pagination);
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

    if (this.props.apps.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      )
    }
    if (this.props.apps.fetchError) {
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



function mapStateToProps(state, props) {
  return {
      apps: state.apps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators({
        GetAppList:getAppList
      }, dispatch)
  };
}


module.exports =  connect(mapStateToProps, mapDispatchToProps)(App);
