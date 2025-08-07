<template>
  <div class="card"
  :class="cardClasses"
  @click="handleClick"
  >
    <div class="card-name">{{ name }}</div>
    <img class="card-image" :src="image" :alt="name" />
    <div class="card-detail">{{ detail }}</div>
    <div class="card-stats">健康值：{{ health }} / 100</div>
    <div class="card-stats">快樂值：{{ happiness }} / 100</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  id: { type: [String, Number], required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  detail: { type: String, required: true },
  health: { type: Number, required: true },
  happiness: { type: Number, required: true },
});

const emit = defineEmits(["select"]);

function handleClick() {
  emit("select", props.id);
}

const cardClasses = computed(() => ({
  warning: props.health < 60 || props.happiness < 60,
  healthy: props.health >= 60 && props.happiness >= 60,
}));
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

.card-stats {
  font-size: 12px;
  font-family: "Noto Sans TC", sans-serif;
  color: #333;
  margin-top: 4px;
}

.card:hover {
  transform: scale(1.3);
}

@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(255,0,0,0.7); }
  50%  { box-shadow: 0 0 10px 5px rgba(255,0,0,0.5); }
  100% { box-shadow: 0 0 0 0 rgba(255,0,0,0); }
}
.warning {
  border: 2px solid rgba(255,0,0,0.7);
  animation: pulse 2s infinite;
}

.healthy {
  border: 2px solid rgba(0,128,0,0.7);
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
  width: 120px;
  height: 120px;
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
  .card-detail {
    width: 80px;
    height: 80px;
    font-size: 10px;
  }
}
</style>
