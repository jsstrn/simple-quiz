const React = require('react')
const ReactDOM = require('react-dom')
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const firebase = require('firebase')
const _ = require('underscore')
const users = require('../data/users')

const app = firebase.initializeApp({
  apiKey: "AIzaSyCS1sJVlcEokhn2xNEiEb185qgG9JZKPys",
  authDomain: "simple-quiz-27de4.firebaseapp.com",
  databaseURL: "https://simple-quiz-27de4.firebaseio.com",
  storageBucket: "simple-quiz-27de4.appspot.com",
})

const LeaderBoardRow = React.createClass({
  render: function () {
    return (
      <div className="card #e0e0e0 grey lighten-2">
        <div className="card-content row valign-wrapper">
          <div className="col s1">
            <span className="card-title grey-text text-darken-4">#{this.props.index}</span>
          </div>
          <div className="col s1">
            <img className="circle responsive-img" src={'assets/img/' + this.props.name.toLowerCase() + '.jpeg'} />
          </div>
          <div className="col s7">
            <span className="card-title grey-text text-darken-4">{this.props.name}</span>
          </div>
          <div className="col s3">
            <span className="card-title">{this.props.score} Points</span>
          </div>
        </div>
      </div>
    )
  }
})

var LeaderBoard = React.createClass({
  render: function() {
    const rows = []
    this.props.users.forEach(function (user, index) {
      rows.push(<LeaderBoardRow index={index + 1} name={user.name} score={user.score} key={index} />)
    })
    return (
      <ReactCSSTransitionGroup className="leaderboard" transitionName="leaderboard" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        {rows}
      </ReactCSSTransitionGroup>
    )
  }
})

function readScoreData () {
  firebase.database().ref('scores/').orderByValue().on('value', function (snapshot) {
    const users = snapshot.val()
    users
      .sort(function (a, b) {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
      .sort(function (a, b) {
        return a.score > b.score
      })
    ReactDOM.render(
      <LeaderBoard users={users} />,
      document.getElementById('leaderboard')
    )
  })
}

function writeScoreData (id, name, score) {
  firebase.database().ref('scores/' + id).set({
    name: name,
    score: score
  })
}

// users.forEach(function (user) {
//   writeScoreData(user.id, user.name, user.score)
// })

const intervalId = window.setInterval(function () {
  const id = Math.floor(Math.random() * (users.length - 0 + 1)) + 0
  const user = users.find(function (user) {
    return user.id === id
  })
  console.log(user, id)
  writeScoreData(user.id, user.name, user.score + 10)
}, 5000);

window.setTimeout(function () {
  window.clearInterval(intervalId)
}, 60000)

readScoreData()
