<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  
  let { data } = $page;
  let { domaine } = data;
  let name = domaine?.name || '';
  let level = domaine?.level || 'licence';
  let error = null;
  let submitting = false;
  let domaineId = domaine?.id;

  async function handleSubmit() {
    submitting = true;
    error = null;
    
    try {
      const response = await fetch(`/api/admin/domaines/${domaineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, level })
      });
      
      if (response.ok) {
        goto('/admin/domaines');
      } else {
        const result = await response.json();
        error = result.error || 'Failed to update domaine';
      }
    } catch (err) {
      error = 'Error updating domaine: ' + err.message;
    } finally {
      submitting = false;
    }
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this domaine?')) {
      const response = await fetch(`/api/admin/domaines/${domaineId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        goto('/admin/domaines');
      } else {
        error = 'Failed to delete domaine';
      }
    }
  }
</script>

<svelte:head>
  <title>Edit Domaine - Admin Panel</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Edit Domaine</h1>

  <form 
    on:submit|preventDefault={handleSubmit}
    class="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6"
  >
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <div class="mb-4">
      <label for="name" class="block text-gray-700 font-medium mb-2">Name</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div class="mb-6">
      <label for="level" class="block text-gray-700 font-medium mb-2">Level</label>
      <select
        id="level"
        bind:value={level}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="licence">Licence</option>
        <option value="master1">Master 1</option>
        <option value="master2">Master 2</option>
      </select>
    </div>

    <div class="flex items-center justify-between">
      <button
        type="button"
        on:click={handleDelete}
        class="text-red-600 hover:text-red-800 font-medium"
      >
        Delete Domaine
      </button>
      <div class="space-x-2">
        <a 
          href="/admin/domaines" 
          class="text-gray-600 hover:text-gray-800 font-medium"
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
            Update Domaine
          {/if}
        </button>
      </div>
    </div>
  </form>
</div>