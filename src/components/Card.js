import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card ({card, onCardClick, onCardLike, onCardDelete}) {

  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = (
    `cards__heart ${isLiked && 'cards__heart_active'}`
  );;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="cards__item">
      {isOwn && <div className="cards__delete" onClick={handleDeleteClick}/>}
      <img
        onClick={handleClick}
        src={card.link}
        alt={card.name}
        className="cards__image"/>
      <div className="cards__wrap">
        <p className="cards__title">{card.name}</p>
        <div className="cards__wrap-like">
          <button type="button" className={cardLikeButtonClassName} aria-label="Лайк" onClick={handleLikeClick}></button>
          <p className="cards__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </li>
  )
}

export default Card;
