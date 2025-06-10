<template>
  <div class="card" @click="handleClick">
    <div class="card-name">{{ name }}</div>
    <img class="card-image" :src="image" :alt="name" />
    <div class="card-detail">{{ detail }}</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  image: { type: String, required: true },
  detail: { type: String, required: true },
});

const emit = defineEmits(["select"]);

function handleClick() {
  emit("select", props.name);
}
</script>

<style scoped>
.card {
  width: 200px;
  height: 300px;
  background-color: #fff;
  transition: transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2),
    0 6px 20px rgba(0, 0, 0, 0.19);
  margin: 50px;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card:hover {
  transform: scale(1.3);
}

.card-name {
  font-family: "Noto Sans TC", sans-serif;
  text-align: center;
  line-height: 25px;
  width: 150px;
  height: 30px;
  background-color: #bbb;
  margin-top: 10px;
  border-radius: 5px;
  font-size: 18pt;
}

.card-image {
  margin-top: 10px;
  width: 150px;
  height: 150px;
  object-fit: contain;
}

.card-detail {
  margin-top: 5px;
  font-family: "Noto Sans TC", sans-serif;
  font-size: 12px;
  width: 150px;
  height: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
@media screen and (max-width: 640px) {
  .card {
    width: 110px;
    height: 180px;
    background-color: #ff0;
    margin: 6px;
  }
  .card-name {
    width: 110px;
    font-size: 12pt;
  }
  .card-image {
    width: 80px;
    height: 80px;
  }
  .cardD-detail {
    width: 80px;
    height: 80px;
    font-size: 10px;
  }
}
</style>
