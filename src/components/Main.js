var React = require('react');
import Searchbar from '../components/Searchbar'

//probably wants to be refactored
function Navigation (props){
  return (
    <nav className="fixed z-1 w-100 flex items-center bg-dark-gray justify-between pv3">
      <h1 className="f5 fw1 pl4 ma0">Studio Atlas</h1>
      <div className="pr4 flex items-center">
        <label className="mr2">search keywords:</label>
        <Searchbar search={props.search} />
      </div>
    </nav>
  )
};

function Footer (props){
  return (
    <footer className="fixed bottom-1 pa2 right-1 bg-white">
      <a href="https://github.com/trevorsee/deploy-studio-atlas" className="black dim">about</a>
    </footer>
  )
}

var Main = React.createClass({

  getInitialState: function (){
    return {
      searchText: 'default'
    };
  },

  search: function(text){
    this.setState({
      searchText: text
    })
  },

  render: function () {
    return (
      <div className='main-container'>
        <Navigation search={this.search} />
        {React.cloneElement(this.props.children,this.state)}
        <Footer />
      </div>
    )
  }
});

module.exports = Main;
