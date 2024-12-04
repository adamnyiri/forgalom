async function loadData() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
  
      const tableBody = document.getElementById('data-table');
      tableBody.innerHTML = ''; // Tábla törlése, ha már van tartalom
  
      data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.aru_kod}</td>
          <td>${item.kat_kod}</td>
          <td>${item.nev}</td>
          <td>${item.egyseg}</td>
          <td>${item.ar}</td>
          <td>${item.kat_nev}</td>
          <td>${item.mennyiseg ?? 0}</td> 
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Hiba az adatok betöltésekor:', error);
    }
  }
  
  // Az adatok betöltése az oldal betöltésekor
  document.addEventListener('DOMContentLoaded', loadData);
  