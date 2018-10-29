import React, { Component } from 'react';
import {
  Redirect
} from "react-router-dom";
// import { withRouter } from 'react-router-dom'

// import { browserHistory } from 'react-router'

const navigateTo = (history, url) => {
  // const { from } = { from: { pathname: url } }

  // window.history.pushState(null, null, url)
  // window.postMessage({
  //   "event": "navigation",
  //   "url": url
  // }, window.location.origin)
  // window.history.go()

  history.push(url)

  // return <Redirect to={from} push />
}

// const navigateTo = withRouter(({ context }) => {
//   console.log("context", context)  
//   const { history } = context.router
//   console.log("history", history)
//   history.push('/helloworld')
// })

// function navigateTo(url) {
//   browserHistory.push(url)
// }

module.exports = {
    to: navigateTo,
}