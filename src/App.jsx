import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Generos from './pages/Generos';
import Directores from './pages/Directores';
import Productoras from './pages/Productoras';
import Tipos from './pages/Tipos';
import Medias from './pages/Medias';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container my-4">
        <Switch>
          <Route exact path="/" component={Inicio} />
          <Route path="/generos" component={Generos} />
          <Route path="/directores" component={Directores} />
          <Route path="/productoras" component={Productoras} />
          <Route path="/tipos" component={Tipos} />
          <Route path="/medias" component={Medias} />
        </Switch>
      </div>
    </Router>
  );
}