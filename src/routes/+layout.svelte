<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

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
			<ul class="flex space-x-6">
				<li><a href="/" class="hover:text-slate-300 transition-colors">Home</a></li>
				<li><a href="/forms" class="hover:text-slate-300 transition-colors">Forms</a></li>
				<li><a href="/dashboard" class="hover:text-slate-300 transition-colors">Dashboard</a></li>
			</ul>
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
					<a href="#" class="hover:text-slate-300 transition-colors">Terms</a>
					<a href="#" class="hover:text-slate-300 transition-colors">Privacy</a>
					<a href="#" class="hover:text-slate-300 transition-colors">Contact</a>
				</div>
			</div>
		</div>
	</footer>
</div>
