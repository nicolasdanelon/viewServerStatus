import React, { Component } from 'react';
import { ActivityIndicator, AppRegistry, StyleSheet, Text, TouchableOpacity, ListView, View, RefreshControl } from 'react-native';
import axios from 'axios'

export default class viewServerStatus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            servers: []
        }
    }

    getServerStatus() {
        axios.get('http://52.88.153.114/api-mon/api/monitor/')
            .then(res => this.setState({ servers: [ ...res.data ], loading: false }))
            .catch(err => alert(err.response.data))
    }

    getDataSource() {
        const dataSource = new ListView.DataSource(
            { rowHasChanged: (r1, r2) => true }
        );

        const servers = this.state.servers.length > 0;
        return servers ? dataSource.cloneWithRows(this.state.servers) : dataSource;
    }

    displayList() {
        return <ListView
            refreshControl={
                <RefreshControl
                    refreshing={this.state.loading}
                    onRefresh={this.getServerStatus()} />
            }
            dataSource={ this.getDataSource() }
            stickyHeaderIndices={[]}
            renderRow={(item, sectionId, rowId) =>
                <TouchableOpacity style={ item.uptime_status === 'up' ? styles.ok_colors : styles.error_colors }>
                    <Text>{item.url}</Text>
                    <Text>{item.uptime_status}</Text>
                    <Text>{item.uptime_check_failure_reason}</Text>
                    <Text>{item.updated_at}</Text>
                </TouchableOpacity>
            }
        />
    }

    displayLoading() {
        return <ActivityIndicator style={{ marginTop: 200 }} />
    }

    componentDidMount() {
        this.getServerStatus()
    }

    render() {
        return (
            <View>
                { this.state.loading ? this.displayLoading() : this.displayList() }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    error_colors: {
        backgroundColor: '#990000'
    },
    ok_colors: {
        backgroundColor: '#92B286',
        borderBottomColor: '#999',
        borderBottomWidth: 1
    },
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

AppRegistry.registerComponent('viewServerStatus', () => viewServerStatus);
