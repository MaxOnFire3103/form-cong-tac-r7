function updateCompanyInfo(value) {
  const logoMap = {
    swensens: 'logo-swensens.png',
    pizza: 'logo-pizza.png',
    dq: 'logo-dq.png',
    aka: 'logo-aka.png',
    chang: 'logo-chang.png'
  };
  document.getElementById('company-logo').src = logoMap[value];
}

// Calculate working days
function calculateDays() {
  const routes = document.querySelectorAll('.route');
  let totalDays = 0;

  routes.forEach(route => {
    const start = route.querySelector('input[name*="depart"]');
    const end = route.querySelector('input[name*="return"]');
    const dayBox = route.querySelector('.day-count');

    if (start?.value && end?.value) {
      const startDate = new Date(start.value);
      const endDate = new Date(end.value);
      const ms = endDate - startDate;
      const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;

      if (days > 0 && dayBox) {
        dayBox.value = days;
        totalDays += days;
      }
    }
  });

  document.getElementById('total-days').innerText = totalDays;
}

// Calculate costs
function calculateCosts() {
  let total = 0;
  const rows = document.querySelectorAll('.cost-section');
  rows.forEach(row => {
    const qty = row.querySelector('[data-role="qty"]');
    const price = row.querySelector('[data-role="price"]');
    const subtotal = row.querySelector('[data-role="subtotal"]');

    const quantity = parseFloat(qty?.value || '0');
    const unitPrice = parseFloat(price?.value || '0');
    const sub = quantity * unitPrice;
    if (subtotal) subtotal.value = sub;
    total += sub;
  });

  document.getElementById('total-cost').innerText = total.toLocaleString('vi-VN');
}

// Add route
document.addEventListener('DOMContentLoaded', () => {
  calculateDays();
  calculateCosts();

  // add event for "add route" button
  const addBtn = document.getElementById('add-route');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const container = document.getElementById('routes');
      const count = container.querySelectorAll('.route').length + 1;
      const route = document.createElement('div');
      route.className = 'route';
      route.style = 'background-color: #e6f4ea; border: 1.5px dashed #4caf50; border-radius: 8px; padding: 12px; margin-bottom: 16px;';
      route.innerHTML = `
        <h4 style="margin-bottom: 10px; color:#2e7d32;">Lộ trình ${count} 
          <button type="button" onclick="deleteRoute(this)" style="float:right;background:#f44336;color:#fff;border:none;border-radius:4px;padding:2px 8px;font-size:12px;">Xoá</button>
        </h4>
        <div class="route-grid" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; align-items: center;">
          <label>Lộ trình:</label>
          <select name="route-name-${count}" required style="grid-column: span 2;">
            <option value="Bac Ninh - HAN">Bac Ninh - HAN</option>
            <option value="Da Nang - SGN">Da Nang - SGN</option>
            <option value="HCM - Ha Long">HCM - Ha Long</option>
          </select>
          <label>Phương tiện:</label>
          <select name="transport-${count}" required style="grid-column: span 2;">
            <option value="Xe khách">Xe khách</option>
            <option value="Máy bay">Máy bay</option>
            <option value="Tàu hỏa">Tàu hỏa</option>
            <option value="Xe công ty">Xe công ty</option>
          </select>
          <label>Giờ đi:</label>
          <input type="time" name="depart-time-${count}" required>
          <label>Ngày đi:</label>
          <input type="date" name="depart-${count}" required>
          <label>Giờ về:</label>
          <input type="time" name="return-time-${count}" required>
          <label>Ngày về:</label>
          <input type="date" name="return-${count}" required>
          <label>Số ngày công tác:</label>
          <input type="number" class="day-count" name="days-${count}" readonly>
        </div>
      `;
      container.appendChild(route);
      calculateDays();
    });
  }

  // rebind change events to calculate days
  document.body.addEventListener('change', () => {
    calculateDays();
    calculateCosts();
  });
});

// delete route
function deleteRoute(button) {
  const container = document.getElementById('routes');
  const allRoutes = container.querySelectorAll('.route');
  if (allRoutes.length > 1) {
    button.closest('.route').remove();
    const updatedRoutes = container.querySelectorAll('.route');
    updatedRoutes.forEach((el, idx) => {
      const h4 = el.querySelector('h4');
      if (h4) {
        h4.innerHTML = `Lộ trình ${idx + 1} <button type="button" onclick="deleteRoute(this)" style="float:right;background:#f44336;color:#fff;border:none;border-radius:4px;padding:2px 8px;font-size:12px;">Xoá</button>`;
      }
    });
    calculateDays();
  } else {
    alert('Phải có ít nhất một lộ trình.');
  }
}