var React = require('react');
var name = 'Quotes From Tamriel';

var Content = React.createClass({
  render: function() {
    return (
      <div>
        {name}, brought to you by React!
      </div>
    );
  }
});

React.render(<Content />,
   document.getElementById('content')
);
