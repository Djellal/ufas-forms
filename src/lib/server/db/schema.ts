import { pgTable, serial, integer, text, timestamp, boolean, decimal } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(), // Add password field for authentication
	role: text('role').notNull().default('student'), // Role field with default value 'student'
	age: integer('age')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const establishment = pgTable('establishment', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	name_ar: text('name_ar').notNull()
});

export const domaine = pgTable('domaine', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	level: text('level').notNull() // licence, master1, master2
});

export const speciality = pgTable('speciality', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	domaineId: integer('domaine_id')
		.notNull()
		.references(() => domaine.id)
});

export const demandeInscription = pgTable('demande_inscription', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	etabId: integer('etab_id')
		.notNull()
		.references(() => establishment.id),
	nom: text('nom').notNull(),
	prenom: text('prenom').notNull(),
	dateNaissance: text('date_naissance').notNull(), // Using text to store date in YYYY-MM-DD format
	lieuNaissance: text('lieu_naissance').notNull(),
	tel: text('tel').notNull(),
	origineFiliere: text('origine_filiere').notNull(),
	origineSpecialite: text('origine_specialite').notNull(),
	anneeDiplome: integer('annee_diplome').notNull(),
	anneeBac: integer('annee_bac').notNull(),
	numBac: text('num_bac').notNull(),
	systemSuivi: text('system_suivi').notNull().$type<'LMD' | 'Classique4' | 'Classique5' | 'SciencesMedicales'>(),
	moyenne1ereAnnee: decimal('moyenne_1ere_annee', { precision: 5, scale: 2 }),
	moyenne2emeAnnee: decimal('moyenne_2eme_annee', { precision: 5, scale: 2 }),
	moyenne3emeAnnee: decimal('moyenne_3eme_annee', { precision: 5, scale: 2 }),
	moyenne4emeAnnee: decimal('moyenne_4eme_annee', { precision: 5, scale: 2 }),
	moyenne5emeAnnee: decimal('moyenne_5eme_annee', { precision: 5, scale: 2 }),
	moyenne6emeAnnee: decimal('moyenne_6eme_annee', { precision: 5, scale: 2 }),
	nbrRedoublements: integer('nbr_redoublements').notNull().default(0),
	nbrAdmissionsAvecDettes: integer('nbr_admissions_avec_dettes').notNull().default(0),
	nbrAdmissionsApresRattrapage: integer('nbr_admissions_apres_rattrapage').notNull().default(0),
	piecesJointes: text('pieces_jointes'), // Store file paths as text
	niveauDemande: text('niveau_demande').notNull().$type<'Licence' | 'M1' | 'M2'>(),
	domaineId: integer('domaine_id')
		.notNull()
		.references(() => domaine.id),
	vouex1Id: integer('vouex1_id')
		.notNull()
		.references(() => speciality.id),
	vouex2Id: integer('vouex2_id')
		.notNull()
		.references(() => speciality.id),
	voeux3Id: integer('voeux3_id')
		.notNull()
		.references(() => speciality.id),
	traité: boolean('traite').notNull().default(false),
	accepté: boolean('accepte').notNull().default(false),
	remarque: text('remarque')
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Establishment = typeof establishment.$inferSelect;

export type Domaine = typeof domaine.$inferSelect;

export type Speciality = typeof speciality.$inferSelect;

export type DemandeInscription = typeof demandeInscription.$inferSelect;

// Define role types for TypeScript
export type UserRole = 'admin' | 'facadmin' | 'student';
