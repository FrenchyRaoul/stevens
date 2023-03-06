import './App.css';

function PropsExample(props) {
    let h1 = null;

    if (props.greeting) {
        h1 = <h1>{props.greeting}</h1>
    } else {
        h1 = <h1>Hello there, mysterious stranger.</h1>
    }


    return (
        <div className="App">
            {h1}
            <h2>{props.user.name}</h2>
            <button onClick={props.handleClick}>{props.user.username}</button>
        </div>
    );
}

export default PropsExample;
