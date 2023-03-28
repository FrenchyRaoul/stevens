import './App.css';
import Clock from "./clock";
import PropsExample from "./props_example";

function App() {
    const greeting = "Hello!";
    const handle_func = () => {
        console.log("hello from within handle func in app.js")
    };
    return (
        <div className="App" >
            <Clock date={new Date()}/>
            <PropsExample greeting={greeting} user={{name: "Nicholai", username: "FrenchyRaoul"}} handleClick={handle_func}/>
        </div>
    );
}

export default App;
