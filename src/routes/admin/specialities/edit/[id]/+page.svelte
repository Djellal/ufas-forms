<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let speciality = $state(null);
  let name = $state('');
  let domaineId = $state('');
  let error = $state(null);
  let submitting = $state(false);
  let domaines = $state([]);

  // Function to fetch domaines for the dropdown
  async function fetchDomaines() {
    try {
      const response = await fetch('/api/admin/domaines');
      if (response.ok) {
        domaines = await response.json();
      } else {
        error = 'Failed to load domaines';
      }
    } catch (err) {
      error = 'Error loading domaines: ' + err.message;
    }
  }

  // Function to fetch the speciality to edit
  async function fetchSpeciality() {
    const id = page.url.split('/')[4]; // Extract ID from URL: /admin/specialities/edit/[id]

    try {
      const response = await fetch(`/api/admin/specialities/${id}`);
      if (response.ok) {
        const data = await response.json();
        speciality = data;
        name = data.speciality.name;
        domaineId = data.speciality.domaineId.toString();
      } else {
        const result = await response.json();
        error = result.error || 'Failed to load speciality';
      }
    } catch (err) {
      error = 'Error loading speciality: ' + err.message;
    }
  }

  onMount(async () => {
    await fetchDomaines();
    await fetchSpeciality();
  });

  async function handleSubmit(event) {
    event.preventDefault();
    submitting = true;
    error = null;

    const id = page.url.split('/')[4]; // Extract ID from URL: /admin/specialities/edit/[id]

    try {
      const response = await fetch(`/api/admin/specialities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, domaineId: parseInt(domaineId) })
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to the specialities list after successful update
        goto('/admin/specialities');
      } else {
        error = result.error || 'Failed to update speciality';
      }
    } catch (err) {
      error = 'Error updating speciality: ' + err.message;
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Edit Speciality - Admin Panel</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Edit Speciality</h1>

  <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    {#if speciality}
      <form onsubmit={handleSubmit}>
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="name"
            type="text"
            bind:value={name}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter speciality name"
          />
        </div>

        <div class="mb-4">
          <label for="domaineId" class="block text-sm font-medium text-gray-700 mb-1">Domaine</label>
          <select
            id="domaineId"
            bind:value={domaineId}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a domaine</option>
            {#each domaines as dom}
              <option value={dom.id}>{dom.name} ({dom.level})</option>
            {/each}
          </select>
        </div>

        <div class="flex items-center justify-between">
          <a
            href="/admin/specialities"
            class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={submitting}
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {#if submitting}
              Updating...
            {:else}
              Update Speciality
            {/if}
          </button>
        </div>
      </form>
    {:else}
      <div class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-4 text-gray-600">Loading speciality...</p>
      </div>
    {/if}
  </div>
</div>