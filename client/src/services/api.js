const API_BASE = '/api';

export const api = {
  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Employees
  async getEmployees() {
    const res = await fetch(`${API_BASE}/employees`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  async getEmployee(id) {
    const res = await fetch(`${API_BASE}/employees/${id}`);
    if (!res.ok) throw new Error('Failed to fetch employee');
    return res.json();
  },

  async createEmployee(data) {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create employee');
    }
    return res.json();
  },

  async updateEmployee(id, data) {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update employee');
    return res.json();
  },

  async deleteEmployee(id) {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete employee');
    return res.json();
  },

  // Tasks
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/tasks${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(data) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id, data) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async submitTaskProof(id, proofData) {
    const res = await fetch(`${API_BASE}/tasks/${id}/submit-proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proofData)
    });
    if (!res.ok) throw new Error('Failed to submit proof');
    return res.json();
  },

  async validateTask(id, validationData) {
    const res = await fetch(`${API_BASE}/tasks/${id}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validationData)
    });
    if (!res.ok) throw new Error('Failed to validate task');
    return res.json();
  },

  // Email Requests
  async getEmailRequests() {
    const res = await fetch(`${API_BASE}/email-requests`);
    if (!res.ok) throw new Error('Failed to fetch email requests');
    return res.json();
  },

  async createEmailRequest(data) {
    const res = await fetch(`${API_BASE}/email-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit email request');
    return res.json();
  },

  async updateEmailStatus(id, data) {
    const res = await fetch(`${API_BASE}/email-requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update email status');
    return res.json();
  },

  // Software & Permissions
  async getSoftwareCatalog() {
    const res = await fetch(`${API_BASE}/software/catalog`);
    if (!res.ok) throw new Error('Failed to fetch software catalog');
    return res.json();
  },

  async getPermissions(employeeId) {
    const url = employeeId ? `${API_BASE}/permissions?employeeId=${employeeId}` : `${API_BASE}/permissions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch permissions');
    return res.json();
  },

  async assignPermission(data) {
    const res = await fetch(`${API_BASE}/permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to assign permission');
    return res.json();
  },

  async updatePermissionStatus(id, data) {
    const res = await fetch(`${API_BASE}/permissions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update permission status');
    return res.json();
  },

  async revokePermission(id) {
    const res = await fetch(`${API_BASE}/permissions/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to revoke permission');
    return res.json();
  },

  // Activity Logs
  async getActivityLogs() {
    const res = await fetch(`${API_BASE}/activity-logs`);
    if (!res.ok) throw new Error('Failed to fetch activity logs');
    return res.json();
  }
};
