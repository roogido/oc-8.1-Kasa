import Link from 'next/link';
import styles from './page.module.css';

const equipmentItemsLeft = [
	'Micro-Ondes',
	'Douche italienne',
	'Frigo',
	'WiFi',
	'Parking',
	'Sèche Cheveux',
	'Machine à laver',
	'Cuisine équipée',
	'Télévision',
	'Chambre séparée',
	'Climatisation',
	'Frigo Américain',
];

const equipmentItemsRight = [
	'Clic-clac',
	'Four',
	'Rangements',
	'Lit',
	'Bouilloire',
	'SDB',
	'Toilettes sèches',
	'Cintres',
	'Baie vitrée',
	'Hotte',
	'Baignoire',
	'Vue parc',
];

const categoryTags = [
	'Parc',
	'Night Life',
	'Culture',
	'Nature',
	'Touristique',
	'Parc',
	'Night Life',
	'Culture',
	'Nature',
	'Touristique',
	'Parc',
	'Night Life',
	'Culture',
	'Nature',
	'Touristique',
	'Vue sur mer',
	'Pour les couples',
	'Famille',
	'Forêt',
];

export const metadata = {
	title: 'Ajouter une propriété',
};

export default function AddPropertyPage() {
	return (
		<section
			className={styles.pageSection}
			aria-labelledby="add-property-title"
		>
			<div className={styles.container}>
				<header className={styles.headerBlock}>
					<Link href="/" className={styles.backButton}>
						← Retour
					</Link>

					<div className={styles.titleRow}>
						<h1
							id="add-property-title"
							className={styles.pageTitle}
						>
							Ajouter une propriété
						</h1>

						<button type="button" className={styles.primaryAction}>
							Ajouter
						</button>
					</div>
				</header>

				<div className={styles.topGrid}>
					<section
						className={styles.panel}
						aria-labelledby="property-main-info-title"
					>
						<div className={styles.panelInner}>
							<h2
								id="property-main-info-title"
								className={styles.srOnly}
							>
								Informations principales
							</h2>

							<div className={styles.fieldGroup}>
								<label
									htmlFor="property-title"
									className={styles.label}
								>
									Titre de la propriété
								</label>
								<input
									id="property-title"
									name="propertyTitle"
									type="text"
									className={styles.input}
									placeholder="Ex : Appartement cosy au cœur de Paris"
								/>
							</div>

							<div className={styles.fieldGroup}>
								<label
									htmlFor="property-description"
									className={styles.label}
								>
									Description
								</label>
								<textarea
									id="property-description"
									name="propertyDescription"
									className={styles.textarea}
									placeholder="Décrivez votre propriété en détail..."
								/>
							</div>

							<div className={styles.fieldGroup}>
								<label
									htmlFor="property-postal-code"
									className={styles.label}
								>
									Code postal
								</label>
								<input
									id="property-postal-code"
									name="postalCode"
									type="text"
									className={styles.input}
								/>
							</div>

							<div className={styles.fieldGroup}>
								<label
									htmlFor="property-location"
									className={styles.label}
								>
									Localisation
								</label>
								<input
									id="property-location"
									name="location"
									type="text"
									className={styles.input}
								/>
							</div>
						</div>
					</section>

					<div className={styles.rightStack}>
						<section
							className={styles.panel}
							aria-labelledby="property-media-title"
						>
							<div className={styles.panelInner}>
								<h2
									id="property-media-title"
									className={styles.srOnly}
								>
									Médias du logement
								</h2>

								<div className={styles.fieldGroup}>
									<label
										htmlFor="cover-image"
										className={styles.label}
									>
										Image de couverture
									</label>

									<div className={styles.uploadRow}>
										<input
											id="cover-image"
											name="coverImage"
											type="text"
											className={styles.input}
										/>
										<button
											type="button"
											className={styles.iconAction}
											aria-label="Ajouter une image de couverture"
										>
											+
										</button>
									</div>
								</div>

								<div className={styles.fieldGroup}>
									<label
										htmlFor="property-image"
										className={styles.label}
									>
										Image du logement
									</label>

									<div className={styles.uploadRow}>
										<input
											id="property-image"
											name="propertyImage"
											type="text"
											className={styles.input}
										/>
										<button
											type="button"
											className={styles.iconAction}
											aria-label="Ajouter une image du logement"
										>
											+
										</button>
									</div>

									<button
										type="button"
										className={styles.inlineTextAction}
									>
										+Ajouter une image
									</button>
								</div>
							</div>
						</section>

						<section
							className={styles.panel}
							aria-labelledby="property-host-title"
						>
							<div className={styles.panelInner}>
								<h2
									id="property-host-title"
									className={styles.srOnly}
								>
									Informations de l’hôte
								</h2>

								<div className={styles.fieldGroup}>
									<label
										htmlFor="host-name"
										className={styles.label}
									>
										Nom de l’hôte
									</label>
									<input
										id="host-name"
										name="hostName"
										type="text"
										className={styles.input}
									/>
								</div>

								<div className={styles.fieldGroup}>
									<label
										htmlFor="host-photo"
										className={styles.label}
									>
										Photo de profil
									</label>

									<div className={styles.uploadRow}>
										<input
											id="host-photo"
											name="hostPhoto"
											type="text"
											className={styles.input}
										/>
										<button
											type="button"
											className={styles.iconAction}
											aria-label="Ajouter une photo de profil"
										>
											+
										</button>
									</div>

									<button
										type="button"
										className={styles.inlineTextAction}
									>
										+Ajouter une image
									</button>
								</div>
							</div>
						</section>
					</div>
				</div>

				<div className={styles.bottomGrid}>
					<section
						className={styles.panel}
						aria-labelledby="equipments-title"
					>
						<div className={styles.panelInner}>
							<h2
								id="equipments-title"
								className={styles.sectionTitle}
							>
								Équipements
							</h2>

							<div className={styles.checkboxColumns}>
								<div className={styles.checkboxColumn}>
									{equipmentItemsLeft.map((item) => (
										<label
											key={item}
											className={styles.checkboxItem}
										>
											<input
												type="checkbox"
												className={styles.checkbox}
											/>
											<span>{item}</span>
										</label>
									))}
								</div>

								<div className={styles.checkboxColumn}>
									{equipmentItemsRight.map((item) => (
										<label
											key={item}
											className={styles.checkboxItem}
										>
											<input
												type="checkbox"
												className={styles.checkbox}
											/>
											<span>{item}</span>
										</label>
									))}
								</div>
							</div>
						</div>
					</section>

					<section
						className={styles.panel}
						aria-labelledby="categories-title"
					>
						<div className={styles.panelInner}>
							<h2
								id="categories-title"
								className={styles.sectionTitle}
							>
								Catégories
							</h2>

							<div className={styles.tagsBlock}>
								{categoryTags.map((tag, index) => (
									<span
										key={`${tag}-${index}`}
										className={styles.tag}
									>
										{tag}
									</span>
								))}
							</div>

							<div className={styles.fieldGroup}>
								<label
									htmlFor="new-tag"
									className={styles.label}
								>
									Ajouter une catégorie personnalisée
								</label>

								<div className={styles.uploadRow}>
									<input
										id="new-tag"
										name="newTag"
										type="text"
										className={styles.input}
										placeholder="Nouveau tag"
									/>
									<button
										type="button"
										className={styles.iconAction}
										aria-label="Ajouter un tag"
									>
										+
									</button>
								</div>

								<button
									type="button"
									className={styles.inlineTextAction}
								>
									+Ajouter un tag
								</button>
							</div>
						</div>
					</section>
				</div>
			</div>
		</section>
	);
}
