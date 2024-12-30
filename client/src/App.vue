<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
#app {
  user-select: none;
  caret-color: transparent;
  min-height: 100vh;
  width: 100%;
  background-image: url("../src/assets/workplace-elements-marble-table-top-view.jpg");
  background-position: center;
  background-size: contain ;
}

h2,
h3 {
  color: #7f73bf;
  font-size: 1.5em;
  font-weight: 600;
  font-family: "Sour Gummy";
  text-align: center;
  margin-bottom: 5px;
}

label {
  color: #a66cd3;
  font-weight: 500;
  font-size: 0.9em;
  font-family: "Sour Gummy";
}

button {
  padding: 10px 15px;
  background-color: #c4e7ff;
  color: rgb(0, 0, 0);
  font-family: 'Sour Gummy';
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  margin-top: 10px;
}

button:hover {
  background-color: #f5c1f8;
  transform: translateY(-2px);
}

input,
select,
textarea {
  width: 90%;
  border: 2px solid #e0e0e036;
  transition: all 0.3s ease;
  font-family: "Sour Gummy";
  text-align: left;
  border-radius: 3px;
}
</style>
