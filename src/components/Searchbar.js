import Search from 'react-search'
import ReactDOM from 'react-dom'
import React, { Component, PropTypes } from 'react'
var FontAwesome = require('react-fontawesome');
var json = require('../data/data_meta.json');


class Searchbar extends Component {

  HiItems(items) {
    this.props.search(items[0].value);
    console.log('called');
  }

  render () {
    let items = json

    return (
      <div>
        <Search items={items}
                placeholder=''
                maxSelected={1}
                multiple={true}
                onItemsChanged={this.HiItems.bind(this)} />
      </div>
    )
  }
}

module.exports = Searchbar;
