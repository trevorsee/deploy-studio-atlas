var React = require('react');
var json = require('../data/data_studios_new.json');
var FontAwesome = require('react-fontawesome');


var Website = React.createClass({
  render: function(){
    var hoverStyle = { width: '200px', height: '143px', boxShadow: '0px 5px 12px rgba(0,0,0,.3)'  };
    var imageStyle = { marginTop: '10px'};
    var activeStyle = { };
    if (!this.props.active) {
      imageStyle = { marginTop: '10px', opacity: 0.1 };
      activeStyle = { opacity: 0.1 };
    }
    if (this.props.hover) {
      hoverStyle = { width: '200px', height: '143px', boxShadow: '0px 5px 12px rgba(0,0,0,.3), 0px 0px 64px rgba(0, 255, 76, .2)' };
    }
    if (this.props.clicked) {
      hoverStyle = { width: '200px', height: '143px', boxShadow: '0px 5px 12px rgba(0,0,0,.3), 0px 0px 64px rgba(0, 255, 76, 1)' };
    }
    return(
      <div style={hoverStyle} className="relative ma3 bg-mid-gray">
        <img className="absolute w-100 h-100" style={activeStyle} src={process.env.PUBLIC_URL+"/studios/window.png"} />
        <img className="absolute w-100 border-box" style={imageStyle} src={this.props.imageUrl} />
      </div>
    )
  }
})

var StudioName = React.createClass({
  render: function(){
    return (
      <div className="bg-dark-gray mh3 pa2 border-box lh-copy">
        <div className="f7">{this.props.name}</div>
        <div className="f8">{this.props.location}</div>
      </div>
    )
  }
})

function convertToRange(value, srcRange, dstRange){
  // value is outside source range return
  if (value < srcRange[0] || value > srcRange[1]){
    return NaN;
  }

  var srcMax = srcRange[1] - srcRange[0],
      dstMax = dstRange[1] - dstRange[0],
      adjValue = value - srcRange[0];

  return (adjValue * dstMax / srcMax) + dstRange[0];

}

var StudioNode = React.createClass({
  getInitialState: function (){
    return {
      hover: false,
      click: false,
      active: true
    };
  },
  toggleHover: function(){
    this.setState({hover: !this.state.hover});
  },
  openFocus: function(){
    this.setState({click: true});
  },
  closeFocus: function(){
    //delay to allow link-clicking
    var that = this;
    setTimeout(function () {
      that.setState({click: false});
    }, 200);
  },
  componentWillReceiveProps: function(nextProps) {
    if (this.props.studio.tags.indexOf(nextProps.searchText) != -1 || nextProps.searchText == ''){
      this.setState({active: true});
    } else {
      this.setState({active: false});
    };
  },
  render: function(){
    var margin = 40;
    var x = convertToRange(this.props.studio.x,[0,1],[0+margin,this.props.cw-margin-200]);
    var y = convertToRange(this.props.studio.y,[0,1],[0+margin,this.props.ch-margin-143]);
    var boxPos = { top: y+'px', left: x+'px'}
    var locationsFix = this.props.studio.location.split("/").map(function(item){

      return (
        <span>
          {item}
          <br />
        </span>
      )
    });

    if (this.state.active){
      if(this.state.click){
        return (
          <div style={boxPos} tabIndex="0" className="flex absolute z-2" onClick={this.openFocus} onBlur={this.closeFocus} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
            <div className="flex flex-column">
              <Website hover={this.state.hover} clicked={this.state.click} active={this.state.active} imageUrl={process.env.PUBLIC_URL+"/studios/"+this.props.studio.fname} />
            </div>
            <InfoBox show={this.state.click} studio={this.props.studio} location={locationsFix} />
          </div>
        )} else if(this.state.hover){
          return(
            <div style={boxPos} tabIndex="0" className="flex absolute z-1" onClick={this.openFocus} onBlur={this.closeFocus} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
              <div className="flex flex-column">
                <Website hover={this.state.hover} clicked={this.state.click} active={this.state.active} imageUrl={process.env.PUBLIC_URL+"/studios/"+this.props.studio.fname} />
                <StudioName name={this.props.studio.name} location={locationsFix} />
              </div>
            </div>
          )
        } else {
          return (
            <div style={boxPos} tabIndex="0" className="flex absolute" onClick={this.openFocus} onBlur={this.closeFocus} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
              <div className="flex flex-column">
                <Website hover={this.state.hover} clicked={this.state.click} active={this.state.active} imageUrl={process.env.PUBLIC_URL+"/studios/"+this.props.studio.fname} />
              </div>
            </div>
          )
        }
  } else {
    return (
      <div style={boxPos} tabIndex="0" className="flex absolute neg-z">
        <div className="flex flex-column ">
          <Website hover={this.state.hover} clicked={this.state.click} active={this.state.active} imageUrl={process.env.PUBLIC_URL+"/studios/"+this.props.studio.fname} />
        </div>
      </div>
  )}
}

});

var InfoBox = React.createClass({
  render: function(){
    console.log(this.props.show)
    if(this.props.show){
      return (
        <div className="bg-green border-box w5 ba pa3 mt3 self-start dark-gray">
          <h1 className="f5 ma0 flex justify-between">
            {this.props.studio.name}
            <a href={this.props.studio.url} className="dim link dark-gray f8">
              <FontAwesome name='external-link' />
            </a>
          </h1>
          <p className="f7 mt1">{this.props.location}</p>
          <h3 className="mt3 mb1 f6 fw1">keywords:</h3>
          <ul className="list f7 flex flex-wrap ">
            {this.props.studio.tags.map(function(item){
              return <li><a className="dim dark-gray ma1" href="#">{item}</a></li>;
            })}
        </ul>
        </div>
      )} else {
        return (
          <div>
          </div>
        )
      }
  }
});

var Home = React.createClass({

  getInitialState: function(){
    return {
      studios: []
    }
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function () {
    console.log('this: ' + this.props.searchText);
    var cw = 6000;
    var ch = 3000;
    var containerStyles = { width: cw+'px', height: ch+'px'};
    return (
      <main style={containerStyles} className="flex flex-wrap relative">
        {json.map(function(studio, i){
          return <StudioNode studio={studio} cw={cw} ch={ch} searchText={this.props.searchText} />
        }, this)}
      </main>
    )
  }
});

module.exports = Home;
