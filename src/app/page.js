import Image from "next/image";
import styles from "./page.module.css";
import UserList from "./components/UserTable";

export default function Home() {
    return (
        <div>
            <main>
                <UserList />
            </main>
            <footer>
                Developed by Dayeeta
            </footer>
        </div>
    );
}
