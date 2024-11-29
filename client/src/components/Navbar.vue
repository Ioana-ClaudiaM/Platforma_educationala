<template>
    <div class="navbar">
        <router-link to="/">
            <img src="../assets/house.png" alt="Home">
        </router-link>
        <router-link to="/education">
        <img src="../assets/education.png" alt="None">
    </router-link>
        <img src="../assets/diet.png" alt="None">
        <img src="../assets/budget.png" alt="None">
        <img src="../assets/shopping-cart.png" alt="None">
    </div>
</template>


<script>
export default {
  name: "Navbar-App"
};
</script>

<style scoped>


.navbar {
    position: fixed; 
    top: 50%;        
    left: 30px;   
    transform: translateY(-50%); 
    display: flex;
    flex-direction: column;
    gap: 40px;
    background-color: rgb(207, 195, 161);
    border-radius: 20px;
    padding: 10px;
    width: fit-content;
}

.navbar img{
    width: 50px;
    height: 50px;
}
</style>
