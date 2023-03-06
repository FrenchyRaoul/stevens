import React, {Component} from "react";

class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date,
            counter: 0
        };
    }


    // Runs when the component first instantiates?
    componentDidMount() {
        this.timerId = setInterval(() => this.tick(), 1000);
    }

    // General cleanup for when the clock/timer is destroyed. No need to keep a running counter in the abyss
    componentWillUnmount() {
      clearInterval(this.timerId)
    }

    tick () {
        this.setState((state, props) => (
            {date: new Date(), counter: state.counter + 1}
        ))
    };

    render() {
        return (
            <div>
                <h2> Time: {this.state.date.toLocaleTimeString()}</h2>
                <h2>You have been here for {this.state.counter} seconds.</h2>
            </div>
        )
    }
}

export default Clock;