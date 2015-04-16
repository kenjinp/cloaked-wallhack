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
    return (
      <div className="background">
        <img></img>
        <h3>{title}</h3>
        <h4>{author}</h4>
      </div>
    );
  }
});

var Quote = React.createClass({
  render: function() {
    var author = this.props.quote.author;
    var quote = this.props.quote.quote;
    return (
      <div className="quote-card">
        <h1>{quote}</h1>
        <p>{author}</p>
      </div>
    );
  }
});

var QuoteViewer = React.createClass({
  getInitialState: function() {
    //returns initial state
    return {
      back: BACKGROUND,
      quote: QUOTE
    }
  },
  handleUserInput: function() {
    //change state data based on input
  },
  getBackgroundFromReddit: function() {
    //get data from reddit
  },
  getQuoteFromTESQuotes: function() {
    //get data from api
  },
  render: function() {
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
