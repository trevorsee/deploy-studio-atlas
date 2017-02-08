import Search from 'react-search'
import ReactDOM from 'react-dom'
import React, { Component, PropTypes } from 'react'
var FontAwesome = require('react-fontawesome');


class Searchbar extends Component {

  HiItems(items) {
    console.log(items)
  }

  render () {
    let items = [
      { id: 0, value: '...' },
      { id: 1, value: '...' }
    ]

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
