/**
 * @file src/app/template.js
 * @description
 * Template global pour animer l'entrée des pages.
 */

import styles from './template.module.css';

export default function Template({ children }) {
	return <div className={styles.pageTransition}>{children}</div>;
}
