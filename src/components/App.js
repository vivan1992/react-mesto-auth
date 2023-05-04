import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate} from "react-router-dom";

import ProtectedRouteElement from './ProtectedRoute';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeletePlacePopup from './DeletePlacePopup';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';

import request from '../utils/Api';
import apiAuth from '../utils/ApiAuth';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePlacePopupOpen, setIsDeletePlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [deleteCard, setDeleteCard] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isTooltipPopupOpen, setIsTooltipPopupOpen] = useState(false);
  const [isOk, setIsOk] = useState(true);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    request.getUserInfo()
      .then(data => {
        setCurrentUser(data)})
      .catch(err => console.log(err));

    request.getInitialCards()
    .then(data => {
      setCards(data);
    })
    .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      apiAuth.checkJWT(jwt)
        .then(res => {
          if (res){
            setEmail(res.data.email);
            setLoggedIn(true);
            navigate("/", {replace: true})
          }
        })
        .catch(err => {
          setIsOk(false);
          handleOpenTooltip()
          console.log(err);
        })
    };
  }, [token]);

  function handleOpenTooltip() {
    setIsTooltipPopupOpen(true);
  }

  function handleEditAvatarClick () {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick () {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick () {
    setIsAddPlacePopupOpen(true);
  }

  function handleDeletePlaceClick (card) {
    setIsDeletePlacePopupOpen(true);
    setDeleteCard(card);
  }

  function closeAllPopups () {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePlacePopupOpen(false);
    setIsTooltipPopupOpen(false);
    setSelectedCard({});
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {

    const isLiked = card.likes.some(i => i._id === currentUser._id);

    request.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    });
  }

  function handleUpdateUser(data) {
    setIsLoaded(true);
    request.setUserInfo(data)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .finally(() => setIsLoaded(false))
      .catch(err => console.log(err));
  }

  function handleUpdateAvatar(data) {
    setIsLoaded(true);
    request.updateUserAvatar(data)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .finally(() => setIsLoaded(false))
      .catch(err => console.log(err));
  }

  function handleAddPlaceSubmit(data) {
    setIsLoaded(true);
    request.addCard(data)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .finally(() => setIsLoaded(false))
      .catch(err => console.log(err));
    }

  function handleDeletePlaceSubmit() {
    setIsLoaded(true);
    request.deleteCard(deleteCard._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id === deleteCard._id ? null : c));
        closeAllPopups();
      })
      .finally(() => setIsLoaded(false))
      .catch(err => console.log(err));
  }

  function handleRegisterSubmit(data) {
    apiAuth.register(data)
      .then((res) => {
        setIsOk(true);
        navigate('/sign-in', {replace: true});
      })
      .finally(() => handleOpenTooltip())
      .catch(err => {
        setIsOk(false);
        console.log(err);
      })
  }

  function handleLoginSubmit(data) {
    apiAuth.authorization(data)
      .then((res) => {
        if (res.token){
          localStorage.setItem('jwt', res.token);
          setToken(res.token);
          setLoggedIn(true);
          navigate('/', {replace: true});
        }
      })
      .catch(err => {
        setIsOk(false);
        handleOpenTooltip()
        console.log(err);
      })
  }

  function handleSignOut() {
    localStorage.removeItem('jwt');
    setToken('');
    setLoggedIn(false);
    navigate('/sign-in', {replace: true});
    setEmail('');
  }

  return (

    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header loggedIn={loggedIn} onSignOut={handleSignOut} email={email}/>
        <Routes>
          <Route path="/" element={
            <ProtectedRouteElement
              loggedIn = {loggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleDeletePlaceClick}
              cards={cards}
              element={Main}
            />}
            />
            <Route path="/sign-up" element={<Register onRegister={handleRegisterSubmit}/>}/>
            <Route path="/sign-in" element={<Login onLogin={handleLoginSubmit}/>}/>
        </Routes>
        {loggedIn ? <Footer/> : null}

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} isLoaded={isLoaded} onUpdateUser={handleUpdateUser}/>

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} isLoaded={isLoaded} onAddPlace={handleAddPlaceSubmit}/>

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} isLoaded={isLoaded} onUpdateAvatar={handleUpdateAvatar}/>

        <DeletePlacePopup isOpen={isDeletePlacePopupOpen} onClose={closeAllPopups} isLoaded={isLoaded} onDeletePlace={handleDeletePlaceSubmit}/>

        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

        <InfoTooltip isOpen={isTooltipPopupOpen} isOk={isOk} onClose={closeAllPopups}/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
