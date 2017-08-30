import React, { Component } from 'react';
import { ActivityIndicator, AppRegistry, StyleSheet, Text, TouchableOpacity, ListView, View, Modal, RefreshControl } from 'react-native';
import axios from 'axios'

class viewServerStatus extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      modalVisible: false,
      item: [],
      servers: [],
    }

    this.getServerStatus();
  }

  getServerStatus() {
    axios.get('http://52.88.153.114/api-mon/api/monitor/')
      .then(res => this.setState({ servers: [ ...res.data ], loading: false }))
      .catch(err => alert(err))
  }

  showModal(itemId) {
    axios.get(`http://52.88.153.114/api-mon/api/monitor/${itemId}`)
      .then(
        red => {
          this.setState({ item: red.data, modalVisible: true})
        }
      )
      .catch(err => alert(err));
  }

  getDataSource() {
    const dataSource = new ListView.DataSource(
      { rowHasChanged: () => {}}
    );

    const servers = this.state.servers.length > 0;
    return servers ? dataSource.cloneWithRows(this.state.servers) : dataSource;
  }

  _onRefresh() {
    this.setState({loading: true});
    this.getServerStatus();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        { this.state.loading ? <ActivityIndicator style={{ marginTop: 200 }} /> : <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this._onRefresh.bind(this)} />
          }
          dataSource={ this.getDataSource() }
          stickyHeaderIndices={[]}
          renderRow={(item, sectionId, rowId) =>
            <TouchableOpacity
              style={[ item.uptime_status === 'up' ? styles.ok_colors : styles.error_colors ]}
              onPress={() => this.showModal(item.id)}
            >
              <Text>{item.url} - {item.uptime_status}</Text>
              <Text>{item.uptime_check_failure_reason}</Text>
              <Text>{item.updated_at}</Text>
            </TouchableOpacity>
          }
        /> }
        {this.state.modalVisible ? <Modal
          animationType={"fade"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false}) }
        >
            {this.state.item.map((item)=> <View key="0asd">
              <Text>URL: {item.url}</Text>
              {item.uptime_check_enabled ? <Text>Enabled: {item.uptime_check_enabled}</Text> : null}
              {item.look_for_string ? <Text>Looking for string: {item.look_for_string}</Text> : null}
              {item.uptime_check_interval_in_minutes ? <Text>Interval: {item.uptime_check_interval_in_minutes}</Text> : null}
              {item.uptime_status ? <Text>Status: {item.uptime_status}</Text> : null }
              {item.uptime_check_failure_reason ? <Text>Failure: {item.uptime_check_failure_reason}</Text> : null}
              {item.uptime_check_times_failed_in_a_row ? <Text>Times failed: {item.uptime_check_times_failed_in_a_row}</Text> : null}
              {item.uptime_status_last_change_date ? <Text>Status last change date: {item.uptime_status_last_change_date}</Text> : null}
              {item.uptime_last_check_date ? <Text>Last check date: {item.uptime_last_check_date}</Text> : null}
              {item.uptime_check_failed_event_fired_on_date ? <Text>Event fired date: {item.uptime_check_failed_event_fired_on_date}</Text> : null}
              {item.uptime_check_method ? <Text>Uptime check method: {item.uptime_check_method}</Text> : null}
              {item.certificate_check_enabled ? <Text>SSL?{item.certificate_check_enabled}</Text> : null}

              {item.certificate_check_enabled ? <Text>{item.certificate_check_enabled}</Text> : null}
              {item.certificate_status ? <Text>{item.certificate_status}</Text> : null}
              {item.certificate_expiration_date ? <Text>{item.certificate_expiration_date}</Text> : null}
              {item.certificate_issuer ? <Text>{item.certificate_issuer}</Text> : null}
              {item.certificate_check_failure_reason ? <Text>{item.certificate_check_failure_reason}</Text> : null}
              {item.created_at ? <Text>{item.created_at}</Text> : null}
              {item.updated_at ? <Text>{item.updated_at}</Text> : null}
            </View>)}
        </Modal> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  error_colors: {
    backgroundColor: '#900',
    borderBottomColor: '#fff',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    borderRadius: 5,
    borderBottomWidth: 1
  },
  ok_colors: {
    backgroundColor: '#92B286',
    borderBottomColor: '#999',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    borderRadius: 5,
    borderBottomWidth: 1
  },
});

AppRegistry.registerComponent('viewServerStatus', () => viewServerStatus);
