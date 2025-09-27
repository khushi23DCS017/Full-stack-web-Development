// Enhanced Tuition Management System - Main JavaScript
const $ = sel => document.querySelector(sel);
const tbody = document.querySelector('#studentsTableBody');
const alertBox = document.getElementById('alert');
const studentCount = document.getElementById('studentCount');
const tableInfo = document.getElementById('tableInfo');
const noStudentsRow = document.getElementById('noStudentsRow');

// Global variables
let allStudents = [];
let filteredStudents = [];
let studentToDelete = null;

// Utility Functions
function showAlert(msg, type = 'success', timeout = 4000) {
  alertBox.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
    <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
    ${msg}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>`;
  if (timeout) setTimeout(() => alertBox.innerHTML = '', timeout);
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Form Validation
function validateForm() {
  const name = fields.name.value.trim();
  const contact = fields.contact.value.trim();
  const age = fields.age.value;
  
  let isValid = true;
  
  // Clear previous validation
  document.querySelectorAll('.form-control').forEach(input => {
    input.classList.remove('is-invalid', 'is-valid');
  });
  
  // Name validation
  if (!name || name.length < 2) {
    fields.name.classList.add('is-invalid');
    isValid = false;
  } else {
    fields.name.classList.add('is-valid');
  }
  
  // Contact validation
  const contactRegex = /^[6-9]\d{9}$/;
  if (!contact || !contactRegex.test(contact)) {
    fields.contact.classList.add('is-invalid');
    isValid = false;
  } else {
    fields.contact.classList.add('is-valid');
  }
  
  // Age validation
  if (age && (age < 3 || age > 120)) {
    fields.age.classList.add('is-invalid');
    isValid = false;
  } else if (age) {
    fields.age.classList.add('is-valid');
  }
  
  return isValid;
}

// API Functions
async function fetchStudents() {
  try {
    showLoading(true);
    const res = await fetch('/api/students');
    const data = await res.json();
    if (!data.success) {
      showAlert('Could not load students', 'danger');
      return;
    }
    allStudents = data.students;
    filteredStudents = [...allStudents];
    renderStudents(filteredStudents);
    updateStudentCount();
  } catch (err) {
    console.error(err);
    showAlert('Network error while loading students', 'danger');
  } finally {
    showLoading(false);
  }
}

function showLoading(show) {
  if (show) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>';
    tableInfo.textContent = 'Loading students...';
  }
}

function renderStudents(students) {
  tbody.innerHTML = '';
  
  if (students.length === 0) {
    noStudentsRow.style.display = 'table-row';
    tableInfo.textContent = 'No students found';
    return;
  }
  
  noStudentsRow.style.display = 'none';
  
  students.forEach((s, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="d-flex align-items-center">
          <div class="avatar me-3">
            <i class="bi bi-person-circle fs-3 text-primary"></i>
          </div>
          <div>
            <div class="fw-semibold">${escapeHtml(s.name)}</div>
            <small class="text-muted">ID: ${s._id.slice(-6)}</small>
          </div>
        </div>
      </td>
      <td>
        <span class="badge bg-info">${s.age || 'N/A'}</span>
      </td>
      <td>
        <span class="badge bg-secondary">${escapeHtml(s.className || 'Not specified')}</span>
      </td>
      <td>
        <a href="tel:${s.contact}" class="text-decoration-none">
          <i class="bi bi-telephone me-1"></i>${escapeHtml(s.contact)}
        </a>
      </td>
      <td>
        <span class="text-truncate d-inline-block" style="max-width: 150px;" title="${escapeHtml(s.address || 'No address')}">
          ${escapeHtml(s.address || 'No address')}
        </span>
      </td>
      <td>
        <span class="badge ${s.feesPaid ? 'bg-success' : 'bg-warning'}">
          <i class="bi bi-${s.feesPaid ? 'check-circle' : 'clock'} me-1"></i>
          ${s.feesPaid ? 'Paid' : 'Pending'}
        </span>
      </td>
      <td>
        <div class="btn-group" role="group">
          <button class="btn btn-sm btn-outline-primary" data-id="${s._id}" data-action="edit" title="Edit Student">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-id="${s._id}" data-action="delete" title="Delete Student">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  tableInfo.textContent = `Showing ${students.length} of ${allStudents.length} students`;
}

function updateStudentCount() {
  const count = allStudents.length;
  studentCount.textContent = `${count} Student${count !== 1 ? 's' : ''}`;
  studentCount.className = `badge ${count > 0 ? 'bg-success' : 'bg-secondary'} fs-6`;
}

// Search Functionality
function filterStudents(searchTerm) {
  if (!searchTerm.trim()) {
    filteredStudents = [...allStudents];
  } else {
    const term = searchTerm.toLowerCase();
    filteredStudents = allStudents.filter(student => 
      student.name.toLowerCase().includes(term) ||
      student.className?.toLowerCase().includes(term) ||
      student.contact.includes(term) ||
      student.guardian?.toLowerCase().includes(term) ||
      student.address?.toLowerCase().includes(term)
    );
  }
  renderStudents(filteredStudents);
}

// Form Elements
const form = $('#studentForm');
const fields = {
  id: $('#studentId'),
  name: $('#name'),
  age: $('#age'),
  guardian: $('#guardian'),
  contact: $('#contact'),
  className: $('#className'),
  feesPaid: $('#feesPaid'),
  address: $('#address'),
  saveBtn: $('#saveBtn'),
  resetBtn: $('#resetBtn'),
  cancelBtn: $('#cancelBtn'),
  formTitle: $('#formTitle'),
  feesStatus: $('#feesStatus')
};

// Form Event Listeners
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    showAlert('Please fix the validation errors', 'warning');
    return;
  }
  
  const payload = {
    name: fields.name.value.trim(),
    age: fields.age.value ? Number(fields.age.value) : undefined,
    guardian: fields.guardian.value.trim(),
    contact: fields.contact.value.trim(),
    className: fields.className.value.trim(),
    feesPaid: fields.feesPaid.checked,
    address: fields.address.value.trim()
  };
  
  fields.saveBtn.disabled = true;
  fields.saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
  
  try {
    if (fields.id.value) {
      // Update existing student
      const id = fields.id.value;
      const res = await fetch('/api/students/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        showAlert('Student updated successfully!', 'success');
        resetForm();
        fetchStudents();
      } else {
        showAlert(data.error || 'Update failed', 'danger');
      }
    } else {
      // Create new student
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        showAlert('Student added successfully!', 'success');
        resetForm();
        fetchStudents();
      } else {
        showAlert(data.error || 'Failed to add student', 'danger');
      }
    }
  } catch (err) {
    console.error(err);
    showAlert('Network error occurred', 'danger');
  } finally {
    fields.saveBtn.disabled = false;
    fields.saveBtn.innerHTML = fields.id.value ? 
      '<i class="bi bi-check-circle me-2"></i>Update Student' : 
      '<i class="bi bi-check-circle me-2"></i>Save Student';
  }
});

// Reset form
fields.resetBtn.addEventListener('click', resetForm);
fields.cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  fields.id.value = '';
  form.reset();
  fields.formTitle.innerHTML = '<i class="bi bi-person-plus-fill me-2"></i>Add New Student';
  fields.saveBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Save Student';
  fields.cancelBtn.style.display = 'none';
  fields.feesStatus.textContent = 'Unpaid';
  
  // Clear validation
  document.querySelectorAll('.form-control').forEach(input => {
    input.classList.remove('is-invalid', 'is-valid');
  });
}

// Fees status toggle
fields.feesPaid.addEventListener('change', function() {
  fields.feesStatus.textContent = this.checked ? 'Paid' : 'Unpaid';
});

// Search functionality
const searchInput = $('#searchInput');
const clearSearch = $('#clearSearch');

searchInput.addEventListener('input', function() {
  filterStudents(this.value);
  clearSearch.style.display = this.value ? 'block' : 'none';
});

clearSearch.addEventListener('click', function() {
  searchInput.value = '';
  filterStudents('');
  this.style.display = 'none';
});

// Refresh button
$('#refreshBtn').addEventListener('click', fetchStudents);

// Table action handlers
tbody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  
  if (action === 'edit') {
    try {
      const res = await fetch('/api/students/' + id);
      const data = await res.json();
      
      if (!data.success) {
        showAlert('Could not load student data', 'danger');
        return;
      }
      
      const s = data.student;
      fields.id.value = s._id;
      fields.name.value = s.name || '';
      fields.age.value = s.age || '';
      fields.guardian.value = s.guardian || '';
      fields.contact.value = s.contact || '';
      fields.className.value = s.className || '';
      fields.feesPaid.checked = !!s.feesPaid;
      fields.address.value = s.address || '';
      fields.feesStatus.textContent = s.feesPaid ? 'Paid' : 'Unpaid';
      
      fields.formTitle.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Edit Student';
      fields.saveBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Update Student';
      fields.cancelBtn.style.display = 'inline-block';
      
      // Scroll to form
      document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
      
    } catch (err) {
      console.error(err);
      showAlert('Network error while loading student', 'danger');
    }
  } else if (action === 'delete') {
    const student = allStudents.find(s => s._id === id);
    studentToDelete = { id, name: student?.name || 'Unknown' };
    
    document.getElementById('studentToDelete').textContent = 
      `Student: ${student?.name || 'Unknown'}`;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }
});

// Delete confirmation
$('#confirmDelete').addEventListener('click', async () => {
  if (!studentToDelete) return;
  
  try {
    const res = await fetch('/api/students/' + studentToDelete.id, { 
      method: 'DELETE' 
    });
    const data = await res.json();
    
    if (data.success) {
      showAlert('Student deleted successfully!', 'success');
      fetchStudents();
      bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    } else {
      showAlert(data.error || 'Delete failed', 'danger');
    }
  } catch (err) {
    console.error(err);
    showAlert('Network error during deletion', 'danger');
  }
  
  studentToDelete = null;
});

// Real-time validation
fields.name.addEventListener('input', function() {
  if (this.value.trim().length >= 2) {
    this.classList.remove('is-invalid');
    this.classList.add('is-valid');
  } else {
    this.classList.remove('is-valid');
  }
});

fields.contact.addEventListener('input', function() {
  const contactRegex = /^[6-9]\d{9}$/;
  if (contactRegex.test(this.value)) {
    this.classList.remove('is-invalid');
    this.classList.add('is-valid');
  } else {
    this.classList.remove('is-valid');
  }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  fetchStudents();
  
  // Auto-hide alerts after 5 seconds
  setInterval(() => {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
      if (alert.classList.contains('show')) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }
    });
  }, 5000);
});