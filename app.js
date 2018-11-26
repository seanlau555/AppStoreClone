
'use strict';

import App from './src/app';
import configureStore from "./src/store/configureStore";
import { Provider } from "react-redux";
import React, {Component} from "react";
import { AppRegistry } from "react-native";
import {name as appName} from './app.json';



class Root extends Component {
  state:{
      isLoading: boolean,
      store: any
      };

  constructor() {
      super();
      this.state = {
          isLoading: true,
          store: configureStore(() => {
              this.setState({isLoading: false});
          }),
      };
  }

  render() {
      if (this.state.isLoading) {
          return null;
      }
      return (
          <Provider store={this.state.store}>
              <App />
          </Provider>
      );
  }
}
global.___DEV___ = true;

AppRegistry.registerComponent(appName, () => Root);
