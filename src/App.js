import React from 'react' ;
import './App.css' ;
import $ from 'jquery';

class App extends React.Component {

  constructor() {
    super() ;

    this.state = {
      isStartPressed: false,
      showCountdown: false,
      intervalId: null,
      showRestTime: false,
      settingWindow: true,
      sets: 2,
      minutes: 25,
      seconds: 0
    } ;

    this.showNotification = this.showNotification.bind(this) ;
  }

  componentDidMount() {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification") ;
    } else {
      Notification.requestPermission() ;
    }
  }


  // For notification on desktop 
  showNotification(message) {
    new Notification(message) ;
  }

  restTimer = () => {
    var x = setInterval(() => {
      const {minutes, seconds, intervalId, sets} = this.state ;

      if(minutes === 0 && seconds === 1)  {
        clearInterval(intervalId) ;
        this.setState({
          isStartPressed: false,
          showCountdown: false,
          showRestTime: false,
          settingWindow: true,
          sets: sets-1,
          minutes: 25,
          seconds: 1
        }) ;

        if(sets > 1) {
          this.handlingStart() ;
          this.showNotification('Work time has started!!') ;
        }
        else {
          this.setState({
            sets: 2
          }) ;
        }
      }

      if(minutes === 0 && seconds === 11) {
        this.lessTimeIndicator() ;
        this.showNotification('10 seconds are remaining!!') ;
      }

      this.setState((prevState) => {
        if(prevState.seconds !== 0) {
          return { 
            seconds: prevState.seconds-1 
          }
        }
        else if(prevState.seconds === 0 && prevState.minutes !== 0) {
          return { 
            minutes: prevState.minutes-1,
            seconds: 59
          } 
        } 
      }) ;
    }, 1000) ;

    this.setState({
      intervalId: x
    }) ;
  }

  Timer = () => {
    const {minutes, seconds, intervalId} = this.state ;

    if(minutes === 0 && seconds === 1)  {
      clearInterval(intervalId) ;
      this.setState({
        showCountdown: false,
        showRestTime: true,
        minutes: 5,
        seconds: 1
      }) ;
      this.restTimer() ;
      this.showNotification('Rest time has started!!') ;
    }

    if(minutes === 5 && seconds === 1) {
      this.lessTimeIndicator() ;
      this.showNotification('5 minutes are remaining!!') ;
    }
        
    this.setState((prevState) => {
      if(prevState.seconds !== 0) {
        return { 
          seconds: prevState.seconds-1 
        }
      }
      else if(prevState.seconds === 0 && prevState.minutes !== 0) {
        return { 
          minutes: prevState.minutes-1,
          seconds: 59
        } 
      } 
    }) ;
        
  }

  handlingCountdown = () => {
    var x = setInterval(this.Timer, 1000) ;
    this.setState({
      intervalId: x
    }) ;
  }
  
  handlingStart = () => {
    this.setState({
        isStartPressed: true,
        showCountdown: true,
        settingWindow: false
    }) ;
    this.handlingCountdown() ;
  }

  handlingStop = () => {
    console.log("stopCountdown")
    clearInterval(this.state.intervalId) ;
    this.setState({
      isStartPressed: false,
      showCountdown: false,
      showRestTime: false,
      settingWindow: true,
      minutes: 25,
      seconds: 0
    }) ;
  }

  lessTimeIndicator = () => {
    $('.countdown').toggleClass('less-time-indicator');
  }

  handleChange = (event) => {
    if(event.target.value <= 6 && event.target.value >= 1) {
      this.setState({
        sets: event.target.value
      }) ;
    }
  }


  changeTypeToNumber = (event) => {
    event.target.type = 'number' ;
  }

  changeTypeToText = (event) => {
    event.target.type = 'text' ;
  }


  render () {
    const {
        minutes,
        seconds, 
        showCountdown, 
        showRestTime, 
        isStartPressed, 
        settingWindow,
      } = this.state ;

    return (
      <div className="App">
        <div className="App-header">

          {
            settingWindow
            && <form>
                <label>
                  Number of sets: &nbsp;
                  <input 
                    onMouseOver={this.changeTypeToNumber}
                    onMouseLeave={this.changeTypeToText}
                    className="sets-input" 
                    type="text" 
                    value={this.state.sets} 
                    onChange={this.handleChange} 
                  />
                </label>
              </form>
          }

          {
            showCountdown
            && <p className="countdown"> <div style={{fontSize: 40, color: 'yellow' }}> <b>Work Time</b> </div> <br/>
                  <span className="countdown-style"> {minutes} </span> minutes 
                  <span className="countdown-style"> {seconds} </span> seconds 
                </p>
          }

          {
            showRestTime
            && <p className="countdown"> <div style={{fontSize: 40, color: 'cyan' }}> <b>Rest Time</b> </div> <br/>
                  <span className="countdown-style"> {minutes} </span> minutes 
                  <span className="countdown-style"> {seconds} </span> seconds 
               </p>
          }

          <p>
            Pomodoro Countdown
          </p>

          {
            isStartPressed 
            ? <button className="btn-stop" onClick={this.handlingStop}> <b>Stop</b> </button>
            : <button className="btn-start" onClick={this.handlingStart}> <b>Start</b> </button>
          }

        </div>
      </div>
    );
  }
}

export default App;
