<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  
  let name = '';
  let level = 'licence'; // Default value
  let error = null;
  let submitting = false;

  async function handleSubmit() {
    submitting = true;
    error = null;
    
    try {
      const response = await fetch('/api/admin/domaines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, level })
      });
      
      if (response.ok) {
        goto('/admin/domaines');
      } else {
        const result = await response.json();
        error = result.error || 'Failed to create domaine';
      }
    } catch (err) {
      error = 'Error creating domaine: ' + err.message;
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Create Domaine - Admin Panel</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Create New Domaine</h1>

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
          Creating...
        {:else}
          Create Domaine
        {/if}
      </button>
    </div>
  </form>
</div>