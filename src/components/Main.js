var React = require('react');
import Searchbar from '../components/Searchbar'

//probably wants to be refactored
function Navigation (props){
  return (
    <nav className="fixed z-1 w-100 flex items-center bg-white justify-between pv3">
      <h1 className="f5 fw1 pl4 ma0">Studio Atlas</h1>
      <div className="pr4 flex items-center">
        <label className="mr2">search keywords:</label>
        <Searchbar />
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
  render: function () {
    return (
      <div className='main-container'>
        <Navigation />
        {this.props.children}
        <Footer />
      </div>
    )
  }
});

module.exports = Main;
