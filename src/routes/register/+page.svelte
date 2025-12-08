<script>
  import { enhance } from '$app/forms';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import '../layout.css';

  let isSubmitting = false;

  // Auto-navigate if already logged in
  if (browser) {
    const user = $page.data.user;
    if (user) {
      window.location.href = '/';
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create a new account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">sign in to your account</a>
      </p>
    </div>

    <form
      method="post"
      action="/register"
      class="mt-8 space-y-6"
      use:enhance={({ formElement, cancel }) => {
        isSubmitting = true;
        // Update isSubmitting when form submission is complete
        return async ({ result, update }) => {
          isSubmitting = false;
          if (result.type === 'success') {
            // For successful registration, redirect to home page
            window.location.href = '/';
          }
          await update();
        };
      }}
    >
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="username" class="sr-only">Username</label>
          <input 
            id="username" 
            name="username" 
            type="text" 
            required 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
            placeholder="Username"
          >
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
            placeholder="Password"
          >
        </div>
        <div>
          <label for="confirmPassword" class="sr-only">Confirm Password</label>
          <input 
            id="confirmPassword" 
            name="confirmPassword" 
            type="password" 
            required 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
            placeholder="Confirm Password"
          >
        </div>
      </div>

      {#if isSubmitting}
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      {:else}
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          >
            Register
          </button>
        </div>
      {/if}

      {#if $page.form?.error}
        <div class="rounded-md bg-red-50 p-4 text-red-700 text-center">
          <span>{$page.form.error}</span>
        </div>
      {/if}
    </form>
  </div>
</div>