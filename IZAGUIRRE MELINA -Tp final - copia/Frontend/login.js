document.getElementById('login').addEventListener('submit', (e) => {
  e.preventDefault();
  const nombreUsuario = document.getElementById('nombreUsuario').value;
  localStorage.setItem('usuario', nombreUsuario);
  window.location.href = 'compraVenta.html';
});
