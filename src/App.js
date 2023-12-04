import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Login from './components/Login';
import Register from './components/Register';
import MovieGrid from './components/MovieGrid';
import { UserProvider } from './config/UserContext';
import Movie from './components/Movie';
import './styles.css';
import ActorGrid from './components/ActorGrid';
import Actor from './components/Actor';
import DirectorGrid from './components/DirectorGrid';
import Director from './components/Director';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Watchlist from './components/Watchlist';
import WatchedMovies from './components/WatchedMovies';
import ContentPanel from './components/ContentPanel';
import ContentPanelActors from './components/ContentPanelActors';
import ContentPanelDirectors from './components/ContentPanelDirectors';
import ContentPanelMovies from './components/ContentPanelMovies';
import ContentPanelUsers from './components/ContentPanelUsers';
import HomePage from './components/HomePage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './utils/Theme';


const App = () => {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <div>
        <NavigationBar />
        <div style={{ padding: '20px', textAlign: 'center' }}>
        <UserProvider>
          <Routes>
            <Route path="/" Component={HomePage}/>
            <Route path="/actors" Component={ActorGrid}/>
            <Route path="/directors" Component={DirectorGrid}/>
            <Route path="/movies" Component={MovieGrid}/>
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />
            <Route path="/directors/:directorId/movies/:movieId" Component={Movie}/>
            <Route path="/actors/:actorId" Component={Actor}/>
            <Route path="/directors/:directorId" Component={Director}/>
            <Route path="/profile/:userId" Component={Profile}/>
            <Route path="/profile/edit" Component={EditProfile}/>
            <Route path="/watchlist" Component={Watchlist}/>
            <Route path="/watched-movies" Component={WatchedMovies}/>
            <Route path="/content-panel" Component={ContentPanel}/>
            <Route path="/content-panel/actors" Component={ContentPanelActors}/>
            <Route path="/content-panel/directors" Component={ContentPanelDirectors}/>
            <Route path="/content-panel/movies" Component={ContentPanelMovies}/>
            <Route path="/content-panel/users" Component={ContentPanelUsers}/>
          </Routes>
          </UserProvider>
        </div>
      </div>
    </Router>
    </ThemeProvider>
  );
};

export default App;