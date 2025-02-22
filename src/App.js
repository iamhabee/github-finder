import React, { Fragment, Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import axios from "axios";
import Navbar from "./components/layout/Navbar";
import Alert from "./components/layout/Alert";
import Users from "./components/users/Users";
import User from "./components/users/User";
import Search from "./components/users/Search";
import About from "./components/pages/About";

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/users?client_id=
                                      ${process.env.REACT_APP_GITHUB_CLIENT_ID}
                                      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    console.log(res.data);
    this.setState({ users: res.data, loading: false });
    // axios.get("https://api.github.com/users")
    // .then(res => console.log(res.data));
  }
  searchUsers = async text => {
    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=
                                      ${process.env.REACT_APP_GITHUB_CLIENT_ID}
                                      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    console.log(res.data.items);
    this.setState({ users: res.data.items, loading: false });
  };

  getUser = async (username) => {
    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=
                                      ${process.env.REACT_APP_GITHUB_CLIENT_ID}
                                      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    console.log(res.data.items);
    this.setState({ user: res.data, loading: false });
  }

  getUserRepos = async (username) => {
    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/users/${username}repo?per_page=5&sort=created:asc&client_id=
                                      ${process.env.REACT_APP_GITHUB_CLIENT_ID}
                                      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    console.log(res.data.items);
    this.setState({ repos: res.data, loading: false });
  }
  showAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => this.setState({ alert: null }), 3000);
  };

  clearUsers = () => this.setState({ users: [], loading: false });

  render() {
    const { users, loading, user, repos } = this.state;
    return (
      <Router>
        <div className='App'>
          <Navbar icon='fab fa-github' />

          <div className='container'>
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path='/'
                render={props => (
                  <Fragment>
                    <Search
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0 ? true : false}
                      showAlert={this.showAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path='/About' component={About} />
              <Route exact path='/user/:login' render={props =>(
                <User {...props} getUser={this.getUser} getUserRepos={this.getUserRepos} repos={repos} user={user} loading={loading}/>
              )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
