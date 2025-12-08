<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Admin Navigation -->
  <nav class="bg-gray-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold">UFAS Forms Admin</a>
        </div>
        
        <div class="flex items-center space-x-4">
          <span class="mr-4">Welcome, {$page.data.user?.username} (Admin)</span>
          <form action="/logout" method="post">
            <button 
              type="submit" 
              class="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  </nav>
  
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row">
      <!-- Sidebar navigation -->
      <div class="md:w-1/4 mb-6 md:mb-0 md:mr-6">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li>
              <a 
                href="/admin" 
                class="block hover:bg-gray-50 px-4 py-4 sm:px-6"
              >
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-indigo-600 truncate">Dashboard</p>
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/users" 
                class="block hover:bg-gray-50 px-4 py-4 sm:px-6"
              >
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-indigo-600 truncate">Manage Users</p>
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/forms" 
                class="block hover:bg-gray-50 px-4 py-4 sm:px-6"
              >
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-indigo-600 truncate">Manage Forms</p>
                </div>
              </a>
            </li>
            <li>
              <a 
                href="/admin/reports" 
                class="block hover:bg-gray-50 px-4 py-4 sm:px-6"
              >
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-indigo-600 truncate">Reports</p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Main content -->
      <div class="md:w-3/4 flex-1">
        <div class="bg-white shadow overflow-hidden sm:rounded-md p-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
</div>