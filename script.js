const launchDate = new Date('2026-12-31T23:59:59').getTime();

function updateCountdown(){
  const distance = Math.max(0, launchDate - Date.now());
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor(distance / 3600000) % 24;
  const minutes = Math.floor(distance / 60000) % 60;
  const seconds = Math.floor(distance / 1000) % 60;
  document.getElementById('days').textContent = String(days).padStart(2,'0');
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}

function subscribe(event){
  event.preventDefault();
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  message.textContent = `Thanks! ${email.value} will be notified.`;
  email.value = '';
  return false;
}

updateCountdown();
setInterval(updateCountdown, 1000);
