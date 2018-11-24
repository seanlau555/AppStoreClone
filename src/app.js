/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';
import { sessionTitle } from './common/theme';

import Axios from 'axios';

const topFreeAppsAPI = "https://itunes.apple.com/hk/rss/topfreeapplications/limit=100/json";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      _isLoading: true
    }
    this.getListData = this.getListData.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }
  componentWillMount() {
    this.getListData();
  }
  async getListData() {
    // this.setState({ _isLoading: true });
    // let axiosInstance = Axios.create({
    //   // baseURL: API.BOOK_LIST,
    //   headers: {
    //     'Authorization': `Bearer ${this.props.auth.accessToken}`
    //   }
    // })
    try {
      const request = await Axios.get(topFreeAppsAPI);
      console.log(request);
      this.setState({ _isLoading: false, data: request.data.feed.entry });
    } catch (e) {
      console.log(e);
      this.setState({
        _isLoading: false,
        fetchingError: true,
      })
    }
  }

  renderHeader() {
    return (
      <Text style={[sessionTitle]}>
        {"Text"}
      </Text>
    )
  }

  renderItemCard(){
    return (
      <View />
    )
  }


  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", }}>
        <FlatList
          style={{ flex: 1, backgroundColor: "white" }}
          data={this.props.data}
          ListHeaderComponent={() => this.renderHeader()}
          renderItem={(item, index) => this.renderItemCard(item, index)} />
      </SafeAreaView>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
