import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { demandeInscription } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();

    // Extract values from form data
    const nom = formData.get('nom') as string;
    const prenom = formData.get('prenom') as string;
    const dateNaissance = formData.get('dateNaissance') as string;
    const lieuNaissance = formData.get('lieuNaissance') as string;
    const tel = formData.get('tel') as string;
    const origineFiliere = formData.get('origineFiliere') as string;
    const origineSpecialite = formData.get('origineSpecialite') as string;
    const anneeDiplome = parseInt(formData.get('anneeDiplome') as string);
    const anneeBac = parseInt(formData.get('anneeBac') as string);
    const numBac = formData.get('numBac') as string;
    const etabId = parseInt(formData.get('etabId') as string);
    const systemSuivi = formData.get('systemSuivi') as 'LMD' | 'Classique4' | 'Classique5' | 'SciencesMedicales';
    const moyenne1ereAnnee = parseFloat(formData.get('moyenne1ereAnnee') as string) || null;
    const moyenne2emeAnnee = parseFloat(formData.get('moyenne2emeAnnee') as string) || null;
    const moyenne3emeAnnee = parseFloat(formData.get('moyenne3emeAnnee') as string) || null;
    const moyenne4emeAnnee = parseFloat(formData.get('moyenne4emeAnnee') as string) || null;
    const moyenne5emeAnnee = parseFloat(formData.get('moyenne5emeAnnee') as string) || null;
    const moyenne6emeAnnee = parseFloat(formData.get('moyenne6emeAnnee') as string) || null;
    const nbrRedoublements = parseInt(formData.get('nbrRedoublements') as string) || 0;
    const nbrAdmissionsAvecDettes = parseInt(formData.get('nbrAdmissionsAvecDettes') as string) || 0;
    const nbrAdmissionsApresRattrapage = parseInt(formData.get('nbrAdmissionsApresRattrapage') as string) || 0;
    const niveauDemande = formData.get('niveauDemande') as 'Licence' | 'M1' | 'M2';
    const domaineId = parseInt(formData.get('domaineId') as string);
    const vouex1Id = parseInt(formData.get('vouex1Id') as string);
    const vouex2Id = parseInt(formData.get('vouex2Id') as string);
    const voeux3Id = parseInt(formData.get('voeux3Id') as string);
    const remarque = formData.get('remarque') as string;
    
    // Handle file upload if present
    let filePath = null;
    const piecesJointes = formData.getAll('piecesJointes') as File[];
    if (piecesJointes && piecesJointes.length > 0) {
      // In a real application, you would save the file to a storage service
      // For now, we'll just store the filename
      const file = piecesJointes[0];
      if (file.size > 0) {
        // In a real implementation, you would save the file to disk or cloud storage
        // and return the path to store in the database
        filePath = `/uploads/${file.name}`;
      }
    }

    // Insert the new demande inscription record
    const [newDemande] = await db.insert(demandeInscription).values({
      userId: locals.user.id, // Use the current user's ID
      etabId,
      nom,
      prenom,
      dateNaissance,
      lieuNaissance,
      tel,
      origineFiliere,
      origineSpecialite,
      anneeDiplome,
      anneeBac,
      numBac,
      systemSuivi,
      moyenne1ereAnnee,
      moyenne2emeAnnee,
      moyenne3emeAnnee,
      moyenne4emeAnnee,
      moyenne5emeAnnee,
      moyenne6emeAnnee,
      nbrRedoublements,
      nbrAdmissionsAvecDettes,
      nbrAdmissionsApresRattrapage,
      piecesJointes: filePath,
      niveauDemande,
      domaineId,
      vouex1Id,
      vouex2Id,
      voeux3Id,
      remarque
    }).returning();

    return json({ success: true, id: newDemande.id });
  } catch (error) {
    console.error('Error creating demande inscription:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};