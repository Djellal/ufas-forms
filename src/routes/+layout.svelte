<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="bg-slate-800 text-white py-4 px-6 shadow-md">
		<nav class="container mx-auto flex justify-between items-center">
			<a href="/" class="text-xl font-bold flex items-center space-x-2">
				<img src={favicon} alt="UFAS Forms Logo" class="h-8 w-8" />
				<span>UFAS Forms</span>
			</a>
			<div class="flex items-center space-x-6">
				{#if $page.data.user}
					<span class="mr-4">Welcome, {$page.data.user.username}</span>
					{#if $page.data.user.role === 'admin'}
						<a href="/admin" class="px-3 py-1 rounded-md text-sm font-medium bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Admin</a>
					{/if}
					<form action="/logout" method="post" class="inline">
						<button
							type="submit"
							class="px-3 py-1 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
						>
							Logout
						</button>
					</form>
				{:else}
					<a href="/login" class="hover:text-slate-300 transition-colors">Login</a>
					<a href="/register" class="px-3 py-1 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Register</a>
				{/if}
			</div>
		</nav>
	</header>

	<main class="flex-grow container mx-auto py-8 px-4">
		{@render children()}
	</main>

	<footer class="bg-slate-800 text-white py-6 px-6 border-t border-slate-700">
		<div class="container mx-auto">
			<div class="flex flex-col md:flex-row justify-between items-center">
				<div class="mb-4 md:mb-0">
					<p>&copy; 2025 UFAS Forms. All rights reserved.</p>
				</div>
				<div class="flex space-x-4">
					<a href="/terms" class="hover:text-slate-300 transition-colors">Terms</a>
					<a href="/privacy" class="hover:text-slate-300 transition-colors">Privacy</a>
					<a href="/contact" class="hover:text-slate-300 transition-colors">Contact</a>
				</div>
			</div>
		</div>
	</footer>
</div>
