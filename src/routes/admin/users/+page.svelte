<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  let isSubmitting = false;

  // This page should only be accessible to admin users
  if (!$page.data.user || $page.data.user.role !== 'admin') {
    $page.data.error = 'Access denied';
  }
</script>

<div class="max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Admin - Add New User</h1>
  
  <div class="bg-white shadow rounded-lg p-6">
    <form 
      method="post" 
      action="/admin/users" 
      class="space-y-6"
      use:enhance={({ formElement, cancel }) => {
        isSubmitting = true;
        return async ({ result, update }) => {
          isSubmitting = false;
          await update();
        };
      }}
    >
      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <div class="mt-1">
            <input
              type="text"
              name="username"
              id="username"
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
          <div class="mt-1">
            <select
              id="role"
              name="role"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="student">Student</option>
              <option value="facadmin">Faculty Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1">
            <input
              type="password"
              name="password"
              id="password"
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div class="mt-1">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            Creating...
          {:else}
            Create User
          {/if}
        </button>
      </div>
    </form>

    {#if $page.form?.error}
      <div class="rounded-md bg-red-50 p-4 mt-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error creating user</h3>
            <p class="mt-2 text-sm text-red-700">{$page.form.error}</p>
          </div>
        </div>
      </div>
    {/if}

    {#if $page.form?.success}
      <div class="rounded-md bg-green-50 p-4 mt-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">User created successfully</h3>
            <p class="mt-2 text-sm text-green-700">The new user has been added to the system.</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>