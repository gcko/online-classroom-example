import React from 'react';
import { render } from '@testing-library/react';
import Lobby from './Lobby';

test('it has a lobby page header', () => {
  const { getByText } = render(<Lobby />);
  // in order to test page title you have to request an animation frame.
  //  the title is not updated synchronously, rather asynchronously.
  const pageHeader = getByText(/lobby/i);
  // const pageTitle = getByText(/Learn/);
  expect(pageHeader).toBeInTheDocument();
});

test('it has a role select dropdown', () => {});
test('role: it has a student selection', () => {});
test('role: it has an instructor selection', () => {});
test('it has a room id text field', () => {});
test('room id: it accepts an alphanumeric id nine characters long', () => {});
test('room id: it does not accept an id less than nine characters', () => {});
test('room id: it does not accept an id more than nine characters', () => {});
test('room id: it does not accept an id with non alphanumeric characters', () => {});
test('it has a button to enter a classroom', () => {});
test('button: it enables when a valid room id is entered and the role is available', () => {});
test('button: it enables if the room is not full and the role is available', () => {});
test('it displays a message if the room id and role selected are in use', () => {});
test('it displays a message if the room id chosen is full', () => {});
