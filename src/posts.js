/** @jsx React.DOM */
// The above declaration must remain intact at the top of the script.

var ExampleData = [
  {name: "Neil Armstrong", title: "On the way to the moon", createdAt: "July 16, 1969", message: "That's one small step for a man, one giant leap for mankind." },
  {name: "T-Rex", message: "I'm hungry."}
];

// Structure
// - PostBox
//  - PostList
//    - Post
// - PostForm


var Post = React.createClass({
  render: function() {
    return (
      <div className="post">
        <h2 className="postName">
          {this.props.title} <span className="date">{this.props.date}</span> <br/>
          <p>By {this.props.name}</p>
        </h2>
        {this.props.children}
      </div>
    );
  }
});

var PostBox = React.createClass({
  loadPostsFromLocalStorage: function() {
    if(localStorage.getItem('posts')) {
      return {data: localStorage.getItem('posts')};
    }
  },
  loadPostsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        localStorage.setItem('posts', data);      // Include new data into localStorage for offline loading
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.loadPostsFromLocalStorage();         // If server not responding, load existing data on localStorage
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadPostsFromServer();
    setInterval(this.loadPostsFromServer, this.props.pollInterval);
  },
  handlePostSubmit: function(post) {
    var posts = this.state.data;
    posts.push(post);
    this.setState({data: posts}, function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: post,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  render: function() {
    return (
      <div className="postBox">
        <h1>Messages</h1>
        <PostList data={this.state.data} />
        <br/><h2>Write your own post</h2>
        <p className="alert">All fields are required.</p>
        <PostForm onPostSubmit={this.handlePostSubmit} />
      </div>
    );
  }
});

var PostList = React.createClass({
  render: function() {
    var postNodes = this.props.data.map(function (post) {
      return (
        <Post name={post.name} title={post.title} date={post.createdAt}>
          {post.message}
        </Post>
      );
    });

    return (
      <div className="postList">
        {postNodes}
      </div>
    );
  }
});

var PostForm = React.createClass({
  handleSubmit: function() {
    // Get values submitted from form
    var name = this.refs.name.getDOMNode().value.trim();
    var title = this.refs.title.getDOMNode().value.trim();
    var message = this.refs.message.getDOMNode().value.trim();
    // Validation before sending to server
    if (!name || !title || !message) {
      $('.alert').css('color', 'red');
        return false;
    }
    this.props.onPostSubmit({name: name, title: title, message: message});
    // Clear form
    this.refs.name.getDOMNode().value ='';
    this.refs.title.getDOMNode().value ='';
    this.refs.message.getDOMNode().value ='';
    // Don't refresh the page with default browser action
    return false;
  },

  render: function() {
    return (
      <form className="postForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Give your post a title" ref="title" /><br/>
        <input type="text" placeholder="Your name" ref="name" /><br/>
        <textarea rows="12" name="message" placeholder="Feeling ambitious? Write a blog post." ref="message" /><br/>
        <input type="submit" value="post" />
      </form>
    );
  }
});

React.renderComponent(<PostBox url="posts.json" pollInterval={5000} />,
  document.getElementById('content')
);

