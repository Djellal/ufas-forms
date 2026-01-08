<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Welcome to UFAS Forms</h1>

  {#if $page.data.user}
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Hello, {$page.data.user.username}!</h2>
      <p class="text-gray-600">You are logged in as <span class="font-medium">{$page.data.user.role}</span>.</p>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Next Steps</h3>
      <ul class="space-y-2">
        <li>
          <a href="/forms" class="text-indigo-600 hover:text-indigo-800">View available forms</a>
        </li>
        <li>
          <a href="/demande-inscription" class="text-indigo-600 hover:text-indigo-800">Submit inscription request</a>
        </li>
        <li>
          <a href="/dashboard" class="text-indigo-600 hover:text-indigo-800">Access your dashboard</a>
        </li>
      </ul>
    </div>
  {:else}
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <p class="text-gray-600 mb-4">UFAS Forms is a platform for managing and submitting forms.</p>
      <p class="text-gray-600">Please <a href="/login" class="text-indigo-600 hover:text-indigo-800">log in</a> or <a href="/register" class="text-indigo-600 hover:text-indigo-800">register</a> to get started.</p>
    </div>
  {/if}

  <div class="bg-white shadow rounded-lg p-6 mt-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">About this platform</h3>
    <p class="text-gray-600">UFAS Forms provides a secure way to create, manage, and submit forms with different user roles and permissions.</p>
  </div>
</div>
