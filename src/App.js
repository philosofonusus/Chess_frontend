import './App.scss';
import {Route, Switch, Redirect} from 'react-router-dom'
import Join from "./Components/Join";
import Room from "./Components/Room";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/join" component={Join} />
        <Route path="/room/:room" component={Room}/>
        <Redirect to="/join"/>
      </Switch>
    </div>
  );
}

export default App;
