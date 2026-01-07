<script>
  import { page } from '$app/stores';
  
  let { user } = $page.data;
  
  if (!user || user.role !== 'admin') {
    // This won't actually redirect here since server-side checks happen in +layout.server.ts
    // This is just for the UI in case the server-side check passes
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Admin navigation -->
  <nav class="bg-blue-600 text-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <a href="/" class="text-xl font-bold">UFAS Forms</a>
        <div class="flex items-center space-x-4">
          <span>Admin Panel</span>
          <a href="/admin/establishments" class="hover:bg-blue-700 px-3 py-2 rounded">Establishments</a>
          <a href="/logout" class="hover:bg-blue-700 px-3 py-2 rounded">Logout</a>
        </div>
      </div>
    </div>
  </nav>

  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div>