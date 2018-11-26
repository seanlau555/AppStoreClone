import React, { Component } from 'react';
import {
    Text, View, FlatList
} from 'react-native';
import { sessionTitle, spacing, font } from './common/theme';
import Colors from './common/colors';
import Avatar from './components/Avatar';
import styles from './styles';
import _ from 'lodash';


export default class AppListView extends Component {
    constructor(props) {
        super();
        //render function
        this.renderHeader = this.renderHeader.bind(this);
        this.renderItemRow = this.renderItemRow.bind(this);
        this.renderItemCard = this.renderItemCard.bind(this);
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
                    data={this.props.apps.grossingApps}
                    extraData={this.props.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItemCard}
                    showsHorizontalScrollIndicator={false}
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
        return (

            <FlatList
                style={{ flex: 1, backgroundColor: "white" }}
                data={this.props.state.list}
                extraData={this.props.state}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={this.renderHeader}
                renderItem={this.renderItemRow}
                onEndReached={this.props.loadPagination}
                onEndReachedThreshold={0.1}
                refreshing={this.props.apps.isRefreshing}
                onRefresh={this.props.reload}

            />


        )
    }
}
