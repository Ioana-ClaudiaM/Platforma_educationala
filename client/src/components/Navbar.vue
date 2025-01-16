<template>
    <nav class="navbar-wrapper">
        <div class="navbar">
            <router-link to="/" class="nav-item">
                <div class="container-img">
                    <img src="../assets/house.png" alt="Home">
                    <span class="nav-label">Acasă</span>
                </div>
            </router-link>
            <router-link to="/education" class="nav-item">
                <div class="container-img">
                    <img src="../assets/education.png" alt="Education">
                    <span class="nav-label">Pagina de studiu</span>
                </div>
            </router-link>
            <router-link to="/profile" class="nav-item">
                <div class="container-img">
                    <img src="../assets/user.png" alt="Profile">
                    <span class="nav-label">Profil</span>
                </div>
            </router-link>
            <div class="nav-item" style="cursor: pointer" @click="handleLogout">
                <div class="container-img">
                    <img src="../assets/logout.png" alt="Logout">
                    <span class="nav-label">LogOut</span>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
    name: 'NavbarApp',
    setup() {
        const store = useStore();
        const toast = useToast();
        const router = useRouter();

        const handleLogout = async () => {
            try {
                await store.dispatch('user/logout');
                toast.success('Ai fost deconectat cu succes!');
                await router.push('/login');
            } catch (error) {
                toast.error('A apărut o eroare la deconectare');
            }
        };

        return {
            handleLogout
        };
    }
};
</script>

<style scoped>
.navbar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.568));
    backdrop-filter: blur(10px);
    z-index: 1000;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.navbar {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    gap: 6rem;
}

.nav-item {
    text-decoration: none;
    color: #333;
}

.container-img {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.container-img:hover {
    transform: scale(1.05);
    background-color: rgba(219, 200, 230, 0.8);
}

.navbar img {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.5rem;
    margin-bottom: 0.25rem;
    transition: transform 0.3s ease;
}

.nav-label {
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.container-img:hover .nav-label {
    opacity: 1;
}

.container-img:hover img {
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .navbar {
        gap: 1.5rem;
        padding: 0.25rem 1rem;
    }

    .nav-label {
        font-size: 0.75rem;
    }

    .navbar img {
        width: 2rem;
        height: 2rem;
    }
}
</style>