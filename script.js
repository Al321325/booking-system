document.addEventListener('DOMContentLoaded', function() {
    initApp();
});
function initApp() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
    loadBookings();
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmit);
    }
}
function handleFormSubmit(e) {
    e.preventDefault();
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    if (!service || !date || !time || !name || !phone) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    
    const booking = {
        id: Date.now(), 
        service: service,
        date: date,
        time: time,
        name: name,
        phone: phone,
        email: email,
        bookingDate: new Date().toLocaleDateString('ar-EG')
    };
    saveBooking(booking);
    
    showConfirmation(booking);

    displayBookings();
}
function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
}
function loadBookings() {
    displayBookings();
}
function showConfirmation(booking) {
    document.querySelector('.booking-form').style.display = 'none';
    document.getElementById('confirmationSection').style.display = 'block';
    
    const detailsDiv = document.getElementById('bookingDetails');
    detailsDiv.innerHTML = `
        <p><strong>الخدمة:</strong> ${booking.service}</p>
        <p><strong>التاريخ:</strong> ${formatDate(booking.date)}</p>
        <p><strong>الوقت:</strong> ${booking.time}</p>
        <p><strong>الاسم:</strong> ${booking.name}</p>
        <p><strong>رقم الهاتف:</strong> ${booking.phone}</p>
        ${booking.email ? `<p><strong>البريد الإلكتروني:</strong> ${booking.email}</p>` : ''}
        <p><strong>رقم الحجز:</strong> ${booking.id}</p>
    `;
}

function resetForm() {
    document.getElementById('bookingForm').reset();
    document.getElementById('confirmationSection').style.display = 'none';
    document.querySelector('.booking-form').style.display = 'block';
}
function displayBookings() {
    const container = document.getElementById('bookingsContainer');
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    if (bookings.length === 0) {
        container.innerHTML = '<p>لا توجد حجوزات حتى الآن.</p>';
        return;
    }
    
    bookings.sort((a, b) => b.id - a.id);
    
    container.innerHTML = bookings.map(booking => `
        <div class="booking-item">
            <button class="cancel-btn" onclick="cancelBooking(${booking.id})">إلغاء</button>
            <p><strong>${booking.service}</strong></p>
            <p>التاريخ: ${formatDate(booking.date)} الساعة ${booking.time}</p>
            <p>الاسم: ${booking.name}</p>
            <p>رقم الحجز: ${booking.id}</p>
            <small>تم الحجز في: ${booking.bookingDate}</small>
        </div>
    `).join('');
}

function cancelBooking(id) {
    if (confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings = bookings.filter(booking => booking.id !== id);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        displayBookings();
        if (bookings.length === 0) {
            document.getElementById('bookingsContainer').innerHTML = '<p>لا توجد حجوزات حتى الآن.</p>';
        }
    }
}
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}
function clearAllBookings() {
    if (confirm('هل تريد مسح جميع الحجوزات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        localStorage.removeItem('bookings');
        displayBookings();
    }
}