import Image from "next/image";
import styles from "./page.module.css";
import UserList from "./components/UserTable";

export default function Home() {
    return (
        <div>
            <main className={styles.main}>
                <UserList />
            </main>
            <footer className={styles.footer}>
                <div>Developed by Dayeeta</div>
            </footer>
        </div>
    );
}
