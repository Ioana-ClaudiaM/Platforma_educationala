<template>
    <div class="navbar">
        <router-link to="/">
            <div class="container-img">
                <img src="../assets/house.png" alt="Home">
            </div>
        </router-link>
        <router-link to="/education">
            <div class="container-img">
                <img src="../assets/education.png" alt="None">
            </div>
        </router-link>
        <div class="container-img">
            <img src="../assets/diet.png" alt="None">
        </div>
        <div class="container-img">
            <img src="../assets/budget.png" alt="None">
        </div>
        <div class="container-img">
            <img src="../assets/shopping-cart.png" alt="None">
        </div>
        <router-link to="/login">
        <div class="container-img">
            <img src="../assets/login.png" alt="None">
        </div>
        </router-link>
        <router-link to="/signup">
        <div class="container-img">
            <img src="../assets/signup.png" alt="None">
        </div>
        </router-link>
        <router-link to="/profile">
            <div class="container-img">
                <img src="../assets/user.png" alt="None">
            </div>
        </router-link>
    </div>
</template>


<script>
export default {
    name: "Navbar-App"
};
</script>

<style scoped>
.navbar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 20px;
    padding: 20px;
    top: 50%;
    position: fixed;
    transform: translateY(-50%);
    left: 30px;
}

.navbar img {
    width: 40px;
    height: 40px;
    padding: 15px;
}

.container-img {
    background-color: rgb(230, 207, 241);
    border-radius: 40px;
    border: 3px solid rgb(189, 154, 202);
}

.navbar img:hover {
    transform: scale(1.1);
}
</style>
