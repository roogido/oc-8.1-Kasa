/**
 * @file src/components/property-add/AddPropertyHostCard/AddPropertyHostCard.js
 * @description
 * Carte hote pour la page "Ajout propriete".
 */

import Link from 'next/link';
import Image from 'next/image';

import PropertyAddField from '@/components/property-add/PropertyAddField/PropertyAddField';
import PropertyAddSectionCard from '@/components/property-add/PropertyAddSectionCard/PropertyAddSectionCard';
import { normalizeBackendImageUrl } from '@/lib/imageUrl';

import styles from './AddPropertyHostCard.module.css';

/**
 * Carte de l'hote.
 *
 * @param {Object} props
 * @param {string} props.hostName
 * @param {string} [props.hostPicture='']
 * @param {string} [props.role='']
 * @returns {JSX.Element}
 */
export default function AddPropertyHostCard({
	hostName,
	hostPicture = '',
	role = '',
}) {
	const helperMessage =
		role === 'admin'
			? "Cette propriete sera rattachee a votre compte admin. L'attribution a un autre hote sera geree plus tard via une selection controlee."
			: "Cette propriete sera rattachee a votre compte proprietaire.";

	const normalizedHostPicture =
		typeof hostPicture === 'string' && hostPicture.trim() !== ''
			? normalizeBackendImageUrl(hostPicture, '')
			: '';

	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<PropertyAddField
					id="host-name"
					label="Nom de l'hote"
					value={hostName}
					readOnly
				/>

				{normalizedHostPicture !== '' ? (
					<div className={styles.profilePreview}>
						<Image
							src={normalizedHostPicture}
							alt={`Photo de profil de ${hostName}`}
							width={56}
							height={56}
							className={styles.avatar}
						/>

						<div className={styles.profileTextBlock}>
							<p className={styles.profileLabel}>Photo de profil actuelle</p>
							<p className={styles.profileValue}>{hostName}</p>
						</div>
					</div>
				) : null}

				<p className={styles.helperText}>{helperMessage}</p>

				<Link href="/profile" className={styles.profileLink}>
					Modifier mon profil
				</Link>
			</div>
		</PropertyAddSectionCard>
	);
}
