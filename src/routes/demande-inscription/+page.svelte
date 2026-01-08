<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { invalidateAll } from '$app/navigation';

  // Form state
  let nom = '';
  let prenom = '';
  let dateNaissance = '';
  let lieuNaissance = '';
  let tel = '';
  let origineFiliere = '';
  let origineSpecialite = '';
  let anneeDiplome = null;
  let anneeBac = null;
  let numBac = '';
  let systemSuivi = 'LMD';
  let moyenne1ereAnnee = null;
  let moyenne2emeAnnee = null;
  let moyenne3emeAnnee = null;
  let moyenne4emeAnnee = null;
  let moyenne5emeAnnee = null;
  let moyenne6emeAnnee = null;
  let nbrRedoublements = 0;
  let nbrAdmissionsAvecDettes = 0;
  let nbrAdmissionsApresRattrapage = 0;
  let piecesJointes = null; // File input
  let niveauDemande = 'Licence';
  let domaineId = '';
  let vouex1Id = '';
  let vouex2Id = '';
  let voeux3Id = '';
  let etabId = '';
  let remarque = '';

  // Loading and error states
  let loading = false;
  let error = null;
  let success = false;

  // Options for dropdowns
  let domaines = [];
  let specialites = [];
  let establishments = [];

  // Fetch domaines, specialites, and establishments on component mount
  onMount(async () => {
    try {
      const [domainesResponse, specialitesResponse, establishmentsResponse] = await Promise.all([
        fetch('/api/public/domaines'),
        fetch('/api/public/specialities'),
        fetch('/api/public/establishments')
      ]);

      if (domainesResponse.ok) {
        domaines = await domainesResponse.json();
      } else {
        const domainesText = await domainesResponse.text();
        console.error('Failed to load domaines:', domainesText);
        error = 'Failed to load domaines';
      }

      if (specialitesResponse.ok) {
        specialites = await specialitesResponse.json();
      } else {
        const specialitesText = await specialitesResponse.text();
        console.error('Failed to load specialites:', specialitesText);
        error = 'Failed to load specialites';
      }

      if (establishmentsResponse.ok) {
        establishments = await establishmentsResponse.json();
      } else {
        const establishmentsText = await establishmentsResponse.text();
        console.error('Failed to load establishments:', establishmentsText);
        error = 'Failed to load establishments';
      }
    } catch (err) {
      error = 'Error loading form data: ' + err.message;
    }
  });

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    loading = true;
    error = null;
    success = false;

    try {
      // Prepare form data
      const formData = new FormData();
      
      // Add all text/number fields
      formData.append('nom', nom);
      formData.append('prenom', prenom);
      formData.append('dateNaissance', dateNaissance);
      formData.append('lieuNaissance', lieuNaissance);
      formData.append('tel', tel);
      formData.append('origineFiliere', origineFiliere);
      formData.append('origineSpecialite', origineSpecialite);
      formData.append('anneeDiplome', anneeDiplome);
      formData.append('anneeBac', anneeBac);
      formData.append('numBac', numBac);
      formData.append('etabId', etabId);
      formData.append('systemSuivi', systemSuivi);
      formData.append('moyenne1ereAnnee', moyenne1ereAnnee || '');
      formData.append('moyenne2emeAnnee', moyenne2emeAnnee || '');
      formData.append('moyenne3emeAnnee', moyenne3emeAnnee || '');
      formData.append('moyenne4emeAnnee', moyenne4emeAnnee || '');
      formData.append('moyenne5emeAnnee', moyenne5emeAnnee || '');
      formData.append('moyenne6emeAnnee', moyenne6emeAnnee || '');
      formData.append('nbrRedoublements', nbrRedoublements);
      formData.append('nbrAdmissionsAvecDettes', nbrAdmissionsAvecDettes);
      formData.append('nbrAdmissionsApresRattrapage', nbrAdmissionsApresRattrapage);
      formData.append('niveauDemande', niveauDemande);
      formData.append('domaineId', domaineId);
      formData.append('vouex1Id', vouex1Id);
      formData.append('vouex2Id', vouex2Id);
      formData.append('voeux3Id', voeux3Id);
      formData.append('remarque', remarque);

      // Add file if provided
      if (piecesJointes && piecesJointes[0]) {
        formData.append('piecesJointes', piecesJointes[0]);
      }

      // Submit the form
      const response = await fetch('/api/demande-inscription', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        success = true;
        // Reset form
        nom = '';
        prenom = '';
        dateNaissance = '';
        lieuNaissance = '';
        tel = '';
        origineFiliere = '';
        origineSpecialite = '';
        anneeDiplome = null;
        anneeBac = null;
        numBac = '';
        systemSuivi = 'LMD';
        moyenne1ereAnnee = null;
        moyenne2emeAnnee = null;
        moyenne3emeAnnee = null;
        moyenne4emeAnnee = null;
        moyenne5emeAnnee = null;
        moyenne6emeAnnee = null;
        nbrRedoublements = 0;
        nbrAdmissionsAvecDettes = 0;
        nbrAdmissionsApresRattrapage = 0;
        piecesJointes = null;
        niveauDemande = 'Licence';
        domaineId = '';
        vouex1Id = '';
        vouex2Id = '';
        voeux3Id = '';
        remarque = '';
      } else {
        error = result.error || 'Failed to submit demande d\'inscription';
      }
    } catch (err) {
      error = 'Error submitting demande d\'inscription: ' + err.message;
    } finally {
      loading = false;
    }
  }

  // Handle file input change
  function handleFileChange(event) {
    piecesJointes = event.currentTarget.files;
  }
</script>

<svelte:head>
  <title>Demande d'Inscription - UFAS Forms</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Demande d'Inscription</h1>

  {#if $page.data.user}
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    {#if success}
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        Demande d'inscription soumise avec succès!
      </div>
    {/if}

    <form onsubmit={handleSubmit} class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Personal Information -->
        <div class="col-span-2">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Informations Personnelles</h2>
        </div>
        
        <div>
          <label for="nom" class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            id="nom"
            type="text"
            bind:value={nom}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez votre nom"
          />
        </div>

        <div>
          <label for="prenom" class="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
          <input
            id="prenom"
            type="text"
            bind:value={prenom}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez votre prénom"
          />
        </div>

        <div>
          <label for="dateNaissance" class="block text-sm font-medium text-gray-700 mb-1">Date de Naissance *</label>
          <input
            id="dateNaissance"
            type="date"
            bind:value={dateNaissance}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="lieuNaissance" class="block text-sm font-medium text-gray-700 mb-1">Lieu de Naissance *</label>
          <input
            id="lieuNaissance"
            type="text"
            bind:value={lieuNaissance}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez votre lieu de naissance"
          />
        </div>

        <div>
          <label for="tel" class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
          <input
            id="tel"
            type="tel"
            bind:value={tel}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez votre numéro de téléphone"
          />
        </div>

        <!-- Academic Information -->
        <div class="col-span-2 mt-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Informations Académiques</h2>
        </div>

        <div>
          <label for="origineFiliere" class="block text-sm font-medium text-gray-700 mb-1">Filière d'Origine *</label>
          <input
            id="origineFiliere"
            type="text"
            bind:value={origineFiliere}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez votre filière d'origine"
          />
        </div>

        <div>
          <label for="origineSpecialite" class="block text-sm font-medium text-gray-700 mb-1">Spécialité d'Origine *</label>
          <input
            id="origineSpecialite"
            type="text"
            bind:value={origineSpecialite}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez votre spécialité d'origine"
          />
        </div>

        <div>
          <label for="anneeDiplome" class="block text-sm font-medium text-gray-700 mb-1">Année d'Obtention du Diplôme *</label>
          <input
            id="anneeDiplome"
            type="number"
            min="1900"
            max="2030"
            bind:value={anneeDiplome}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 2023"
          />
        </div>

        <div>
          <label for="anneeBac" class="block text-sm font-medium text-gray-700 mb-1">Année d'Obtention du Bac *</label>
          <input
            id="anneeBac"
            type="number"
            min="1900"
            max="2030"
            bind:value={anneeBac}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 2020"
          />
        </div>

        <div>
          <label for="numBac" class="block text-sm font-medium text-gray-700 mb-1">Numéro du Bac *</label>
          <input
            id="numBac"
            type="text"
            bind:value={numBac}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le numéro de votre bac"
          />
        </div>

        <div>
          <label for="etabId" class="block text-sm font-medium text-gray-700 mb-1">Établissement *</label>
          <select
            id="etabId"
            bind:value={etabId}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un établissement</option>
            {#each establishments as etab}
              <option value={etab.establishment.id}>{etab.establishment.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="systemSuivi" class="block text-sm font-medium text-gray-700 mb-1">Système Suivi *</label>
          <select
            id="systemSuivi"
            bind:value={systemSuivi}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="LMD">LMD</option>
            <option value="Classique4">Classique 4</option>
            <option value="Classique5">Classique 5</option>
            <option value="SciencesMedicales">Sciences Médicales</option>
          </select>
        </div>

        <!-- Grade Information -->
        <div class="col-span-2 mt-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Moyennes Académiques</h2>
        </div>

        <div>
          <label for="moyenne1ereAnnee" class="block text-sm font-medium text-gray-700 mb-1">Moyenne 1ère Année</label>
          <input
            id="moyenne1ereAnnee"
            type="number"
            step="0.01"
            min="0"
            max="20"
            bind:value={moyenne1ereAnnee}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 15.5"
          />
        </div>

        <div>
          <label for="moyenne2emeAnnee" class="block text-sm font-medium text-gray-700 mb-1">Moyenne 2ème Année</label>
          <input
            id="moyenne2emeAnnee"
            type="number"
            step="0.01"
            min="0"
            max="20"
            bind:value={moyenne2emeAnnee}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 16.2"
          />
        </div>

        <div>
          <label for="moyenne3emeAnnee" class="block text-sm font-medium text-gray-700 mb-1">Moyenne 3ème Année</label>
          <input
            id="moyenne3emeAnnee"
            type="number"
            step="0.01"
            min="0"
            max="20"
            bind:value={moyenne3emeAnnee}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 17.8"
          />
        </div>

        <div>
          <label for="moyenne4emeAnnee" class="block text-sm font-medium text-gray-700 mb-1">Moyenne 4ème Année</label>
          <input
            id="moyenne4emeAnnee"
            type="number"
            step="0.01"
            min="0"
            max="20"
            bind:value={moyenne4emeAnnee}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 18.1"
          />
        </div>

        <div>
          <label for="moyenne5emeAnnee" class="block text-sm font-medium text-gray-700 mb-1">Moyenne 5ème Année</label>
          <input
            id="moyenne5emeAnnee"
            type="number"
            step="0.01"
            min="0"
            max="20"
            bind:value={moyenne5emeAnnee}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 19.0"
          />
        </div>

        <div>
          <label for="moyenne6emeAnnee" class="block text-sm font-medium text-gray-700 mb-1">Moyenne 6ème Année</label>
          <input
            id="moyenne6emeAnnee"
            type="number"
            step="0.01"
            min="0"
            max="20"
            bind:value={moyenne6emeAnnee}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 19.5"
          />
        </div>

        <!-- Academic History -->
        <div class="col-span-2 mt-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Historique Académique</h2>
        </div>

        <div>
          <label for="nbrRedoublements" class="block text-sm font-medium text-gray-700 mb-1">Nombre de Redoublements</label>
          <input
            id="nbrRedoublements"
            type="number"
            min="0"
            bind:value={nbrRedoublements}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="nbrAdmissionsAvecDettes" class="block text-sm font-medium text-gray-700 mb-1">Admissions avec Dettes</label>
          <input
            id="nbrAdmissionsAvecDettes"
            type="number"
            min="0"
            bind:value={nbrAdmissionsAvecDettes}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="nbrAdmissionsApresRattrapage" class="block text-sm font-medium text-gray-700 mb-1">Admissions après Rattrapage</label>
          <input
            id="nbrAdmissionsApresRattrapage"
            type="number"
            min="0"
            bind:value={nbrAdmissionsApresRattrapage}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- File Upload -->
        <div class="col-span-2 mt-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Pièces Jointes</h2>
        </div>

        <div class="col-span-2">
          <label for="piecesJointes" class="block text-sm font-medium text-gray-700 mb-1">Télécharger les Pièces Jointes</label>
          <input
            id="piecesJointes"
            type="file"
            multiple
            onchange={handleFileChange}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="mt-1 text-sm text-gray-500">Sélectionnez les fichiers à joindre à votre demande</p>
        </div>

        <!-- Request Information -->
        <div class="col-span-2 mt-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Informations de la Demande</h2>
        </div>

        <div>
          <label for="niveauDemande" class="block text-sm font-medium text-gray-700 mb-1">Niveau Demandé *</label>
          <select
            id="niveauDemande"
            bind:value={niveauDemande}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Licence">Licence</option>
            <option value="M1">Master 1</option>
            <option value="M2">Master 2</option>
          </select>
        </div>

        <div>
          <label for="domaineId" class="block text-sm font-medium text-gray-700 mb-1">Domaine *</label>
          <select
            id="domaineId"
            bind:value={domaineId}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un domaine</option>
            {#each domaines as dom}
              <option value={dom.domaine.id}>{dom.domaine.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="vouex1Id" class="block text-sm font-medium text-gray-700 mb-1">1er Voeu *</label>
          <select
            id="vouex1Id"
            bind:value={vouex1Id}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez une spécialité</option>
            {#each specialites as spec}
              <option value={spec.speciality.id}>{spec.speciality.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="vouex2Id" class="block text-sm font-medium text-gray-700 mb-1">2ème Voeu *</label>
          <select
            id="vouex2Id"
            bind:value={vouex2Id}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez une spécialité</option>
            {#each specialites as spec}
              <option value={spec.speciality.id}>{spec.speciality.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="voeux3Id" class="block text-sm font-medium text-gray-700 mb-1">3ème Voeu *</label>
          <select
            id="voeux3Id"
            bind:value={voeux3Id}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez une spécialité</option>
            {#each specialites as spec}
              <option value={spec.speciality.id}>{spec.speciality.name}</option>
            {/each}
          </select>
        </div>

        <div class="col-span-2">
          <label for="remarque" class="block text-sm font-medium text-gray-700 mb-1">Remarque</label>
          <textarea
            id="remarque"
            bind:value={remarque}
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ajoutez des remarques supplémentaires..."
          ></textarea>
        </div>
      </div>

      <div class="flex items-center justify-between mt-6">
        <a
          href="/"
          class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Annuler
        </a>
        <button
          type="submit"
          disabled={loading}
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {#if loading}
            Envoi en cours...
          {:else}
            Soumettre la Demande
          {/if}
        </button>
      </div>
    </form>
  {:else}
    <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      Veuillez vous connecter pour accéder à ce formulaire.
      <p class="mt-2">
        <a href="/login" class="text-blue-600 hover:text-blue-800 underline">Se connecter</a>
      </p>
    </div>
  {/if}
</div>