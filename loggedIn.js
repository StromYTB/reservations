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

          
          let reservationInfo = `Datum: ${key}, Čas: ${reservation.time}, Počet osob: ${reservation.persons}`;
          if (reservation.services && reservation.services.length > 0) {
              reservationInfo += `, Služby: ${reservation.services.join(', ')}`;
          }
          if (reservation.repeatFrequency !== 'none') {
              const repeatText = reservation.repeatFrequency === 'weekly' ? 'týdně' : 'měsíčně';
              let repeatInfo = `Opakování: ${repeatText}`;
              if (reservation.repeatDay) {
                  repeatInfo += `, Den: ${reservation.repeatDay}`;
              }
              reservationInfo += `, ${repeatInfo}`;
          }

        
          listItem.textContent = reservationInfo;
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
  const repeatFrequency = document.getElementById('repeatFrequency').value;
  const selectedDate = localStorage.getItem('selectedDate');
  const selectedServices = getSelectedServices(); 

  
  if (localStorage.getItem(selectedDate)) {
      alert('Rezervace pro toto datum již existuje. Zadejte prosím jiné datum.');
      return; 
  }

  // Uložení rezervace do localStorage
  localStorage.setItem(selectedDate, JSON.stringify({
      time: time,
      persons: persons,
      repeatFrequency: repeatFrequency,
      services: selectedServices 
  }));

  reservationForm.style.display = 'none';

  
  document.getElementById('time').value = '';
  document.getElementById('persons').value = '';
  document.getElementById('repeatFrequency').value = 'none';
  document.getElementById('services').selectedIndex = -1; 

  loadReservations();
});

function getSelectedServices() {
  const servicesSelect = document.getElementById('services');
  const selectedServices = [];
  for (let i = 0; i < servicesSelect.options.length; i++) {
      if (servicesSelect.options[i].selected) {
          selectedServices.push(servicesSelect.options[i].text);
      }
  }
  return selectedServices;
}


