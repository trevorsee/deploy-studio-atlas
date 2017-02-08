var React = require('react');
import Searchbar from '../components/Searchbar'

//probably wants to be refactored
function Navigation (props){
  return (
    <nav className="fixed z-1 w-100 flex items-center bg-white justify-between pv3">
      <h1 className="f5 fw1 pl4 mt0">Studio Atlas</h1>
      <div className="pr4">
        <label>search keywords:</label>
        <Searchbar />
      </div>
    </nav>
  )
};

function Footer (props){
  return (
    <footer className="fixed bottom-1 right-1">
      <a href="#" className="black dim">about</a>
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
