import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Lobby from './Lobby';

test('it has a role select dropdown', () => {
  const { getByRole } = render(
    <MemoryRouter>
      <Lobby />
    </MemoryRouter>
  );

  const roleSelect = getByRole('combobox');
  expect(roleSelect.id).toBe('role-select');
  expect(roleSelect).toBeInTheDocument();
});

test('role: it has a student and instructor select option', () => {
  const { getAllByRole } = render(
    <MemoryRouter>
      <Lobby />
    </MemoryRouter>
  );

  const options = getAllByRole('option');
  let studentExists = false;
  let instructorExists = false;
  options.forEach(function each(option) {
    if (option.value === 'student') {
      studentExists = true;
    }
    if (option.value === 'instructor') {
      instructorExists = true;
    }
  });
  expect(studentExists).toBeTruthy();
  expect(instructorExists).toBeTruthy();
});

test('it has a room id text field', () => {
  const { getByRole } = render(
    <MemoryRouter>
      <Lobby />
    </MemoryRouter>
  );

  const roomIdInput = getByRole('textbox');
  expect(roomIdInput.id).toBe('room-id');
  expect(roomIdInput).toBeInTheDocument();
});

test('room id: it accepts an alphanumeric id eight characters long', () => {
  const { getByRole } = render(
    <MemoryRouter>
      <Lobby />
    </MemoryRouter>
  );

  const roomIdInput = getByRole('textbox');
  expect(roomIdInput.id).toBe('room-id');
  roomIdInput.value = 'abcd1234';
  expect(roomIdInput.checkValidity()).toBeTruthy();
});

test('room id: it does not accept an id less than eight characters', () => {
  const { getByRole } = render(
    <MemoryRouter>
      <Lobby />
    </MemoryRouter>
  );

  const roomIdInput = getByRole('textbox');
  expect(roomIdInput.id).toBe('room-id');
  roomIdInput.value = 'short';
  expect(roomIdInput.checkValidity()).toBeFalsy();
});

test('room id: it does not accept an id more than eight characters', () => {
  const { getByRole } = render(
    <MemoryRouter>
      <Lobby />
    </MemoryRouter>
  );

  const roomIdInput = getByRole('textbox');
  expect(roomIdInput.id).toBe('room-id');
  roomIdInput.value = 'muchtoolong';
  expect(roomIdInput.checkValidity()).toBeFalsy();
});

test('room id: it does not accept an id with non alphanumeric characters', () => {
  const { getByRole } = render(
    <MemoryRouter>
      <Lobby />
    </MemoryRouter>
  );

  const roomIdInput = getByRole('textbox');
  expect(roomIdInput.id).toBe('room-id');
  roomIdInput.value = `Iain'tok!`;
  expect(roomIdInput.checkValidity()).toBeFalsy();
  roomIdInput.value = `        `;
  expect(roomIdInput.checkValidity()).toBeFalsy();
  roomIdInput.value = `!!!!!!!!!`;
  expect(roomIdInput.checkValidity()).toBeFalsy();
  roomIdInput.value = `;this123`;
  expect(roomIdInput.checkValidity()).toBeFalsy();
});

test('it has a button to enter a classroom', () => {
  const { getByRole } = render(
    <MemoryRouter>
      <Lobby />
    </MemoryRouter>
  );

  const roomButton = getByRole('button');
  const buttonTitle = roomButton.previousElementSibling.textContent;
  expect(buttonTitle).toMatch(/room/);
});

test('Form: it is valid when a valid room id is entered and the role is available', () => {
  const { container } = render(
    <MemoryRouter>
      <Lobby />
    </MemoryRouter>
  );

  // populate a valid form
  const roleSelectEl = container.getElementsByTagName('select')[0];
  expect(roleSelectEl.id).toBe('role-select');
  roleSelectEl.value = 'student';
  const roomIdEl = container.getElementsByTagName('input')[0];
  expect(roomIdEl.id).toBe('room-id');
  roomIdEl.value = 11111111;
  // get the form on the page
  const form = container.getElementsByTagName('form')[0];
  expect(form.checkValidity()).toBeTruthy();
});
