<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  let domaines = [];
  let filteredDomaines = $state([]);
  let loading = true;
  let error = null;
  let searchTerm = $state('');
  let selectedLevel = $state('all'); // 'all', 'licence', 'master1', 'master2'
  let isInitialLoad = $state(true);

  // Function to fetch domaines from the API with filters
  async function fetchDomaines(search = '', level = 'all') {
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (level && level !== 'all') queryParams.append('level', level);

      const queryString = queryParams.toString();
      const apiUrl = queryString ? `/api/admin/domaines?${queryString}` : '/api/admin/domaines';

      const response = await fetch(apiUrl);
      if (response.ok) {
        domaines = await response.json();
        filteredDomaines = [...domaines]; // Initialize filtered list
      } else {
        const result = await response.json();
        error = result.error || 'Failed to load domaines';
      }
    } catch (err) {
      error = 'Error loading domaines: ' + err.message;
    } finally {
      loading = false;
      isInitialLoad = false;
    }
  }

  onMount(async () => {
    await fetchDomaines();
  });

  // Function to filter domaines based on search term and selected level
  $effect(() => {
    // Only fetch from API when searchTerm or selectedLevel changes after initial load
    if (!isInitialLoad) {
      loading = true;
      fetchDomaines(searchTerm, selectedLevel);
    }
  });

  async function deleteDomaine(id) {
    if (confirm('Are you sure you want to delete this domaine?')) {
      const response = await fetch(`/api/admin/domaines/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        domaines = domaines.filter(dom => dom.id !== id);
        // filteredDomaines will be updated automatically due to the effect
      } else {
        alert('Failed to delete domaine');
      }
    }
  }
</script>

<svelte:head>
  <title>Domaines - Admin Panel</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <h1 class="text-3xl font-bold text-gray-800">Domaines</h1>
    <a
      href="/admin/domaines/create"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
    >
      Add New Domaine
    </a>
  </div>

  <!-- Search and Filter Controls -->
  <div class="bg-white rounded-lg shadow-md p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          id="search"
          type="text"
          bind:value={searchTerm}
          placeholder="Search by name or level..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="levelFilter" class="block text-sm font-medium text-gray-700 mb-1">Filter by Level</label>
        <select
          id="levelFilter"
          bind:value={selectedLevel}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Levels</option>
          <option value="licence">Licence</option>
          <option value="master1">Master 1</option>
          <option value="master2">Master 2</option>
        </select>
      </div>
    </div>
  </div>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  {#if loading}
    <div class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p class="mt-4 text-gray-600">Loading domaines...</p>
    </div>
  {:else}
    {#if filteredDomaines.length === 0}
      <div class="bg-white rounded-lg shadow-md p-8 text-center">
        <p class="text-gray-600 mb-4">
          {#if searchTerm || selectedLevel !== 'all'}
            No domaines match your filters.
          {:else}
            No domaines found.
          {/if}
        </p>
        <a
          href="/admin/domaines/create"
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Create your first domaine
        </a>
      </div>
    {:else}
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="text-sm text-gray-700 px-6 py-3 bg-gray-50">
          Showing {filteredDomaines.length} of {domaines.length} domaines
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredDomaines as dom (dom.id)}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dom.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dom.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dom.level}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={`/admin/domaines/edit/${dom.id}`}
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </a>
                  <button
                    on:click={() => deleteDomaine(dom.id)}
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