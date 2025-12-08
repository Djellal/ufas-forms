<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let { users } = data;

  // Available roles
  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'facadmin', label: 'Faculty Admin' },
    { value: 'admin', label: 'Admin' }
  ];

  function handleChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    selectElement.form?.requestSubmit();
  }
</script>

<div class="max-w-6xl mx-auto">
  <div class="bg-white shadow rounded-lg p-6 mb-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Users Management</h1>
    <p class="text-gray-600">View and manage all users in the system</p>
  </div>

  <div class="bg-white shadow overflow-hidden rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Username
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Role
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            User ID
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each users as user}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {user.username}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                {user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'facadmin' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'}">
                {user.role}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
              {user.id}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <form method="POST" action="?/updateRole"
                    use:enhance={() => {
                      console.log('Updating role...');
                    }}>
                <input type="hidden" name="userId" value={user.id} />
                <select name="role" class="border rounded px-2 py-1 mr-2 text-sm"
                        onchange={handleChange}>
                  {#each roles as role}
                    <option value={role.value} selected={user.role === role.value}>
                      {role.label}
                    </option>
                  {/each}
                </select>
              </form>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
              No users found
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>