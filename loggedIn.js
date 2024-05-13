const calendarBody = document.getElementById('calendarBody');
const reservationForm = document.getElementById('reservationForm');
const reservationList = document.getElementById('reservationList');

for (let i = 1; i <= 31; i++) {
  const row = calendarBody.insertRow();
  for (let j = 0; j < 7; j++) {
    const cell = row.insertCell();
    cell.textContent = i;
    cell.addEventListener('click', showReservationForm);
    i++;
  }
}

function showReservationForm(event) {
  const target = event.target;
  if (target.tagName === 'TD') {
    reservationForm.style.display = 'block';
    localStorage.setItem('selectedDate', target.textContent);
  }
}

window.addEventListener('DOMContentLoaded', function() {
  const selectedDate = localStorage.getItem('selectedDate');
  if (selectedDate) {
    const cells = document.querySelectorAll('#calendarBody td');
    cells.forEach(cell => {
      if (cell.textContent === selectedDate) {
        cell.click();
      }
    });
  }

  loadReservations();
});

function loadReservations() {
  reservationList.innerHTML = '';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!isNaN(key)) {
      const reservation = JSON.parse(localStorage.getItem(key));
      const listItem = document.createElement('li');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Smazat';
      deleteButton.addEventListener('click', function() {
        deleteReservation(key);
      });
      listItem.textContent = `Datum: ${key}, Čas: ${reservation.time}, Počet osob: ${reservation.persons}`;
      listItem.appendChild(deleteButton);
      reservationList.appendChild(listItem);
    }
  }
}

function deleteReservation(date) {
  localStorage.removeItem(date);
  loadReservations();
}

reservationForm.addEventListener('submit', function(event) {
  event.preventDefault(); 

  const time = document.getElementById('time').value;
  const persons = document.getElementById('persons').value;
  const selectedDate = localStorage.getItem('selectedDate');

  localStorage.setItem(selectedDate, JSON.stringify({ time: time, persons: persons }));

  reservationForm.style.display = 'none';

  document.getElementById('time').value = '';
  document.getElementById('persons').value = '';

  loadReservations();
});