//Quote Viewer, shows quotes with a background.

//QuoteViewer
  // * Background
        //--title author
  // * Quote
        //-- quote author load

// dependencies
global.jQuery = global.$ = require('jquery');

var React = require('react'),
    imagesLoaded = require('imagesloaded');

//React Components

var Background = React.createClass({
  render: function() {
    var title = this.props.back.title;
    var author = this.props.back.author;
    var url = this.props.back.url;
    var post = 'http://reddit.com' + this.props.back.permalink;
    return (
      <div className="background">
        <a href={post}><h3>{title}</h3></a>
        <h4>{author}</h4>
      </div>
    );
  }
});

var Quote = React.createClass({
  render: function() {
    var author = this.props.quote.author;
    var authorUrl = 'http://uesp.net/w/index.php?search=' + author;
    var quote = this.props.quote.quote;
    return (
      <div className="quote-card">
        <h1>{quote}</h1>
        <a href={authorUrl}>
          <p>{author}</p>
        </a>
        <p className="center" >press space for more quotes</p>
      </div>
    );
  }
});

var QuoteViewer = React.createClass({
  getInitialState: function() {
    //returns initial state
    return {
      back: {},
      quote: {}
    };
  },
  handleUserInput: function() {
    //change state data based on input
  },
  getBackgroundFromReddit: function() {
    //get data from reddit /r/skyrimPorn
    $('.background').removeClass('shown');
    //$('.background').css('background-image', 'none');
    reddit.hot('skyrimporn').limit(100).fetch(function (res) {
      function grabRandom (res) {
        var randomInt = Math.floor(Math.random() * res.data.children.length);
        var postData = res.data.children[randomInt].data;
        var extList = postData.url.split('.');
        var ext = extList[extList.length - 1];
        if (ext !== 'jpg') {
          return grabRandom(res);
        } else {
          return postData;
        }
      }
      redditData = grabRandom(res);
      this.setState({back: redditData});
      $('.background').css('background-image', 'url('+ redditData.url +')');
      $('.background').imagesLoaded(function() {
        $('.background').addClass('shown');
      });
      //$('.background').css('background-image', this.state.back.url);
    }.bind(this));
  },
  getQuoteFromTESQuotes: function() {
    //get data from api
    $('.quote-card').removeClass('shown');
    var apiUrl = 'http://tesquotes.kenjin.me/api/random_quote'
    $.get(apiUrl, function(res) {
      if (this.isMounted()) {
        this.setState({quote: res});
        $('.quote-card').addClass('shown');
      }
    }.bind(this));
  },
  componentDidMount: function() {
    this.getBackgroundFromReddit();
    this.getQuoteFromTESQuotes();
    $(window).keypress(function(e) {
      if (e.keyCode == 0 || e.keyCode == 32) {
        this.getBackgroundFromReddit();
        this.getQuoteFromTESQuotes();
      }
    }.bind(this));
  },
  responseHandler: function() {
    this.setState({something: data});
  },
  render: function() {
    var apiUrl = 'http://tesquotes.kenjin.me/api/random_quote'
    return (
      <div>
        <Background back={this.state.back}/>
        <Quote quote={this.state.quote}/>
      </div>
    );
  }
});

//Mock Up Data
var QUOTE = {
  quote: 'I used to be an adventurer, but then I took an arrow to the knee',
  author: 'Guard'
},
BACKGROUND = {
  title:'The Ritual Stone',
  author:'ESloman',
  url:'http://i.imgur.com/8AZQPfI.jpg'
};

//Render
React.render(
  <QuoteViewer/>,
  document.getElementById('content')
);
