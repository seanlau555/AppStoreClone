import React, { Component } from 'react';
import {
    Platform, SafeAreaView,
    Dimensions,
    NetInfo,
    Text, View, FlatList, ActivityIndicator
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { sessionTitle, spacing, font } from './common/theme';
import Colors from './common/colors';
import Avatar from './components/Avatar';
import SnackBar from './components/SnackBar';
import styles from './styles';
import _ from 'lodash';

import { SearchBar } from 'react-native-elements'

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
                    data={this.props.state.top}
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
                refreshing={this.props.state._isRefreshing}
                onRefresh={this.props.reload}

            />


        )
    }
}

// function ConfirmBattle(props){


//     return props.isLoading === true
//         ? <p> LOADING! </p>
//         : <div className="jumbotron col-sm-12 text-center" style={styles.transparentBg}>
//                 <h1>Confirm Players</h1>
//                 <div className='col-sm-8 col-sm-offset-2'>
//                     <UserDetailsWrapper header="Player 1">
//                         <UserDetails info={props.playersInfo[0]}/>
//                     </UserDetailsWrapper>
//                     <UserDetailsWrapper header="Player 2">
//                         <UserDetails info={props.playersInfo[1]}/>
//                     </UserDetailsWrapper>
//                 </div>
//                 <div classNam="col-sm-8 col-sm-offset-2">
//                     <div className="col-sm-12" style={styles.space}>
//                         <button type='button' className='btn btn-lg btn-success' onClick={props.onInitiateBattle}>
//                             Initiate Battle!
//                         </button>
//                         </div>
//                     <div className="col-sm-12" style={styles.space}>
//                         <Link to='/playerOne'>
//                             <button type='button' className='btn btn-lg btn-danger'>
//                                 Reselect Players
//                             </button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>

// }

// ConfirmBattle.propTypes = {
//     isLoading:PropTypes.bool.isRequired,
//     onInitiateBattle:PropTypes.func.isRequired,
//     playersInfo:PropTypes.array.isRequired
// }

// module.exports = ConfirmBattle;