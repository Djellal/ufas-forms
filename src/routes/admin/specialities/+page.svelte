<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  let specialities = $state([]);
  let loading = $state(true);
  let error = $state(null);
  let searchTerm = $state('');
  let selectedDomaine = $state('all');
  let domaines = $state([]);
  let debounceTimer = null;

  // Function to fetch specialities from the API with filters
  async function fetchSpecialities(search = '', domaineFilter = 'all') {
    try {
      // Clear previous timer to debounce requests
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Debounce the API call to avoid too many requests while typing
      debounceTimer = setTimeout(async () => {
        loading = true;

        // Construct query parameters
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (domaineFilter && domaineFilter !== 'all') queryParams.append('domaine', domaineFilter);

        const queryString = queryParams.toString();
        const apiUrl = queryString ? `/api/admin/specialities?${queryString}` : '/api/admin/specialities';

        const response = await fetch(apiUrl);
        if (response.ok) {
          specialities = await response.json();
        } else {
          const result = await response.json();
          error = result.error || 'Failed to load specialities';
        }

        loading = false;
      }, 300); // 300ms delay
    } catch (err) {
      error = 'Error loading specialities: ' + err.message;
      loading = false;
    }
  }

  // Function to fetch domaines for the filter dropdown
  async function fetchDomaines() {
    try {
      const response = await fetch('/api/admin/domaines');
      if (response.ok) {
        domaines = await response.json();
      } else {
        console.error('Failed to load domaines for specialities filter');
      }
    } catch (err) {
      console.error('Error loading domaines for specialities filter:', err);
    }
  }

  onMount(async () => {
    await fetchSpecialities();
    await fetchDomaines();
  });

  // Handle search term changes
  function handleSearchTermChange(event) {
    searchTerm = event.target.value;
    fetchSpecialities(searchTerm, selectedDomaine);
  }

  // Handle domaine filter changes
  function handleDomaineChange(event) {
    selectedDomaine = event.target.value;
    fetchSpecialities(searchTerm, selectedDomaine);
  }

  async function deleteSpeciality(id) {
    if (confirm('Are you sure you want to delete this speciality?')) {
      const response = await fetch(`/api/admin/specialities/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Refresh the list after deletion
        await fetchSpecialities(searchTerm, selectedDomaine);
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to delete speciality');
      }
    }
  }
</script>

<svelte:head>
  <title>Specialities - Admin Panel</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <h1 class="text-3xl font-bold text-gray-800">Specialities</h1>
    <a
      href="/admin/specialities/create"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
    >
      Add New Speciality
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
          value={searchTerm}
          oninput={handleSearchTermChange}
          placeholder="Search by name..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="domaineFilter" class="block text-sm font-medium text-gray-700 mb-1">Filter by Domaine</label>
        <select
          id="domaineFilter"
          value={selectedDomaine}
          onchange={handleDomaineChange}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Domaines</option>
          {#each domaines as dom}
            <option value={dom.id}>{dom.name}</option>
          {/each}
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
      <p class="mt-4 text-gray-600">Loading specialities...</p>
    </div>
  {:else}
    {#if specialities.length === 0}
      <div class="bg-white rounded-lg shadow-md p-8 text-center">
        <p class="text-gray-600 mb-4">
          {#if searchTerm || selectedDomaine !== 'all'}
            No specialities match your filters.
          {:else}
            No specialities found.
          {/if}
        </p>
        <a
          href="/admin/specialities/create"
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Create your first speciality
        </a>
      </div>
    {:else}
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="text-sm text-gray-700 px-6 py-3 bg-gray-50">
          Showing {specialities.length} of {specialities.length} specialities
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each specialities as spec (spec.speciality.id)}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{spec.speciality.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{spec.speciality.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{spec.domaine.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={`/admin/specialities/edit/${spec.speciality.id}`}
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </a>
                  <button
                    onclick={() => deleteSpeciality(spec.speciality.id)}
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