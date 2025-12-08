<script lang="ts">
  import { page } from '$app/stores';
  
  // This will only be accessible to admin users based on server-side protection
  if (!$page.data.user || $page.data.user.role !== 'admin') {
    // The server will redirect non-admins, but this is a fallback
    $page.data.error = 'Access denied';
  }
</script>

<div class="max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Manage Users</h2>
      <p class="text-gray-600 mb-4">Add, edit, or delete user accounts.</p>
      <a href="/admin/users" class="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        Manage Users
      </a>
    </div>
    
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
      <p class="text-gray-600">Monitor system health and statistics.</p>
    </div>
    
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Forms Management</h2>
      <p class="text-gray-600">Create and manage form templates.</p>
    </div>
    
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Reports</h2>
      <p class="text-gray-600">View and generate system reports.</p>
    </div>
  </div>
</div>