<script>
  import { page } from '$app/stores';
  
  let { user } = $page.data;
  
  if (!user || user.role !== 'admin') {
    // This won't actually redirect here since server-side checks happen in +layout.server.ts
    // This is just for the UI in case the server-side check passes
  }
</script>

<style>
  .dropdown:hover .dropdown-menu {
    display: block;
  }
</style>

<div class="min-h-screen bg-gray-50">
  <!-- Admin navigation -->
  <nav class="bg-blue-600 text-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <a href="/" class="text-xl font-bold">UFAS Forms</a>
        <div class="flex items-center space-x-4">
          <span>Admin Panel</span>
          <a href="/admin/establishments" class="hover:bg-blue-700 px-3 py-2 rounded">Establishments</a>
          <a href="/admin/domaines" class="hover:bg-blue-700 px-3 py-2 rounded">Domaines</a>

          <!-- Specialities dropdown -->
          <div class="relative dropdown">
            <a href="/admin/specialities" class="hover:bg-blue-700 px-3 py-2 rounded inline-flex items-center">
              Specialities
              <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </a>
            <div class="dropdown-menu absolute hidden bg-blue-700 text-white rounded-md shadow-lg min-w-max z-10 mt-2">
              <a href="/admin/specialities" class="block px-4 py-2 hover:bg-blue-800 rounded-md">View Specialities</a>
              <a href="/admin/specialities/create" class="block px-4 py-2 hover:bg-blue-800 rounded-md">Create Speciality</a>
            </div>
          </div>

          <a href="/logout" class="hover:bg-blue-700 px-3 py-2 rounded">Logout</a>
        </div>
      </div>
    </div>
  </nav>

  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div>