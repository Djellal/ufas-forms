<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  
  let establishments = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/admin/establishments');
      if (response.ok) {
        establishments = await response.json();
      } else {
        error = 'Failed to load establishments';
      }
    } catch (err) {
      error = 'Error loading establishments: ' + err.message;
    } finally {
      loading = false;
    }
  });

  async function deleteEstablishment(id) {
    if (confirm('Are you sure you want to delete this establishment?')) {
      const response = await fetch(`/api/admin/establishments/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        establishments = establishments.filter(est => est.id !== id);
      } else {
        alert('Failed to delete establishment');
      }
    }
  }
</script>

<svelte:head>
  <title>Establishments - Admin Panel</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Establishments</h1>
    <a 
      href="/admin/establishments/create" 
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
    >
      Add New Establishment
    </a>
  </div>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  {#if loading}
    <div class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p class="mt-4 text-gray-600">Loading establishments...</p>
    </div>
  {:else}
    {#if establishments.length === 0}
      <div class="bg-white rounded-lg shadow-md p-8 text-center">
        <p class="text-gray-600 mb-4">No establishments found.</p>
        <a 
          href="/admin/establishments/create" 
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Create your first establishment
        </a>
      </div>
    {:else}
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (Arabic)</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each establishments as est (est.id)}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{est.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{est.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{est.name_ar}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a 
                    href={`/admin/establishments/edit/${est.id}`} 
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </a>
                  <button 
                    on:click={() => deleteEstablishment(est.id)}
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/if}
</div>