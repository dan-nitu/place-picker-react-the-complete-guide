import { useRef, useState, useEffect, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id),
);

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude,
      );

      setAvailablePlaces(sortedPlaces);
    });
  }, []);
  // ^ 1st argument is a function that will be executed after the component is rendered for the first time
  // ^ 2nd argument is an array of dependencies, if it's empty, the function will be executed only once after the first render

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        'selectedPlaces',
        JSON.stringify([id, ...storedIds]),
      );
    }
    // ^ it's a side effect but it's not related to the component's state, so we don't need to use useEffect for it
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current),
    );
    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem(
      'selectedPlaces',
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current)),
    );
  }, []);
  // useCallback receives a function and an array of dependencies, it returns a memoized version of the function that only changes if one of the dependencies has changed, in this case, the function will be recreated only if the component is re-rendered and the dependencies change, but since there are no dependencies, the function will be created only once and will be reused on every render, this is useful to prevent unnecessary re-renders of child components that receive this function as a prop. it is used here to prevent the function from being recreated on every render, which would cause the Modal component to re-render every time the App component re-renders, even if the Modal component doesn't need to re-render, basically to prevent an infinite loop of re-renders between the App and Modal components, because the Modal component receives the handleRemovePlace function as a prop, if the function is recreated on every render, the Modal component will re-render on every render, which will cause the App component to re-render again, and so on.
  // the dependencies array is the same as the one in useEffect, if the dependencies change, the function will be recreated, but since there are no dependencies, the function will be created only once and will be reused on every render

  return (
    <>
      <Modal open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt='Stylized globe' />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title='Available Places'
          places={availablePlaces}
          fallbackText='SOrting places by distance...'
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
