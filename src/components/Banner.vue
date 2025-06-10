
<template>
  <div class="banner">
    <img
      src="https://picsum.photos/id/559/1600/300"
      alt="Banner Image"
    />
    <div class="title">
      <h1>Konata 的寵物店</h1>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>

.banner {
  position: relative;
  width: 100%;
}

.banner img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.banner .title {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.banner .title h1 {
  margin: 0;
  font-family: "Noto Sans TC", sans-serif;
  font-size: 50px;
  color: white;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
  z-index: 1;
}
</style>
