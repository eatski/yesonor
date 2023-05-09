import styles from "./styles.module.scss";
export const H2: React.FC<{label: string}> = ({label}) => {
    return <h2 className={styles.container}>
        {label}
    </h2>
}