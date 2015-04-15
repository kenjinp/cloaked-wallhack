global.jQuery = global.$ = require('jquery');
var React = require('react'),
    imagesLoaded = require('imagesloaded');
var name = 'Quotes From Tamriel';
var quote = {};
var redditData = {
  title:'',
  author:'',
  url:''
};

var Quote = React.createClass({
  loadQuoteFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      sucess: function(data) {
        //after returned data
        this.setState({data: data});
        console.log('ajaxing');
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    //initial data
    return {data: quote};
  },
  componentDidMount: function(){
    this.loadQuoteFromServer();
  },
  render: function() {
    return (
      <div>
        {this.state.data}
      </div>
    );
  }
});

var Content = React.createClass({
  loadBackgroundFromReddit: function() {
    var that = this;
    reddit.hot('skyrimporn').limit(100).fetch(function (res) {
      function grabRandom (res) {
        var randomInt = Math.floor(Math.random() * res.data.children.length);
        var postData = res.data.children[randomInt].data;
        var extList = postData.url.split('.');
        var ext = extList[extList.length - 1];
        if ( ext !== 'jpg') {
          return grabRandom(res);
        } else {
          return postData;
        }
      }
      redditData = grabRandom(res);
      $('img').prop('src', redditData.url);
      $('img').imagesLoaded(function() {
        $('img').show();
        that.setState({data: redditData});
      });
    });
  },
  onEnter: function() {
    var that = this;
    $(window).keypress(function(e) {
      if (e.keyCode == 0 || e.keyCode == 32) {
        that.loadBackgroundFromReddit();
      }
    });
  },
  getInitialState: function() {
    return {data: redditData};
  },
  componentDidMount: function() {
    $('img').hide();
    this.onEnter();
    this.loadBackgroundFromReddit();
  },
  render: function() {
    return (
      <div>
        <img></img>
        <h1>{ this.state.data.title }</h1>
        <h2>{ this.state.data.author }</h2>
        <h3>{ this.state.data.url }</h3>
        <Quote url='http://tesquotes.kenjin.me/api/random_quote'/>
      </div>
    );
  }
});

React.render(
  <Content />,
   document.getElementById('content')
);
