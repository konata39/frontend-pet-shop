<template>
  <div class="banner">
    <img src="https://picsum.photos/id/559/1600/300" alt="Banner Image" />
    <div class="title">
      <p>Konata 的寵物店</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.banner img {
  width: 100%;
  height: 300px;
  margin-bottom: 5px;
}
.banner .title p {
  font-family: "Noto Sans TC", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  top: 70px;
  font-size: 50px;
  color: white;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>
